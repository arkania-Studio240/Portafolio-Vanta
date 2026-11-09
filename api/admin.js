const L = require('./_lib');
module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const a = String(req.query.action || '');
  try {
    if (a === 'me') return res.json({ auth: L.isAdmin(req), setup: !!process.env.ADMIN_PASSWORD });
    if (a === 'login' && req.method === 'POST') {
      if (!process.env.ADMIN_PASSWORD) return res.status(500).json({ error: 'no_password' });
      const rk = 'vanta:rl:' + L.ipHash(req);
      let n = 0; try { n = (await L.redis([['INCR', rk], ['EXPIRE', rk, 900, 'NX']]))[0]; } catch (e) {}
      if (n > 8) return res.status(429).json({ error: 'locked' });
      if (!L.same(String(L.body(req).password || ''), process.env.ADMIN_PASSWORD)) return res.status(401).json({ error: 'bad' });
      res.setHeader('Set-Cookie', 'vanta_admin=' + L.token(7) + '; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800');
      return res.json({ ok: true });
    }
    if (a === 'logout') { res.setHeader('Set-Cookie', 'vanta_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'); return res.json({ ok: true }); }
    if (!L.isAdmin(req)) return res.status(401).json({ error: 'auth' });
    if (a === 'stats') {
      const now = Date.now(), days = [];
      for (let i = 13; i >= 0; i--) days.push(new Date(now - i * 864e5).toISOString().slice(0, 10));
      const ids = await L.redis([['ZREVRANGE', 'vanta:sessions', 0, 299], ['ZRANGEBYSCORE', 'vanta:sessions', now - 75000, '+inf']]);
      const all = Array.from(new Set(ids[0].concat(ids[1])));
      const cmds = days.map(function (d) { return ['GET', 'vanta:views:' + d]; }).concat(days.map(function (d) { return ['PFCOUNT', 'vanta:uv:' + d]; }), [['PFCOUNT', 'vanta:uv:all'], ['GET', 'vanta:views:all']]);
      if (all.length) cmds.push(['MGET'].concat(all.map(function (s) { return 'vanta:s:' + s; })));
      const r = await L.redis(cmds), sess = all.length ? (r[r.length - 1] || []).filter(Boolean).map(JSON.parse) : [];
      sess.sort(function (x, y) { return y.last - x.last; });
      return res.json({
        now: now, online: ids[1].length,
        days: days.map(function (d, i) { return { d: d, views: +r[i] || 0, uv: +r[14 + i] || 0 }; }),
        totalUv: r[28] || 0, totalViews: +r[29] || 0, sessions: sess
      });
    }
    res.status(404).json({ error: 'nf' });
  } catch (e) { res.status(500).json({ error: String(e.message) === 'NO_DB' ? 'no_db' : 'err' }); }
};
