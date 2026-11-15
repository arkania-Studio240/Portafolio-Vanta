const L = require('./_lib'), crypto = require('crypto');
const str = function (v, n) { return String(v == null ? '' : v).trim().slice(0, n); };
const MAX = 1000; /* inbox limit: when full, new messages are refused (never deleted silently) */
module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const a = String(req.query.action || '');
  try {
    if (req.method === 'POST' && !a) { /* public: hiring brief or quick message */
      const b = L.body(req);
      if (str(b._gotcha, 200)) return res.status(200).json({ ok: true }); /* honeypot: bots */
      const m = { name: str(b.name, 100), email: str(b.email, 200), message: str(b.message, 4000) };
      if (!m.name || !m.message) return res.status(400).json({ error: 'fields' });
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m.email)) return res.status(400).json({ error: 'email' });
      ['channel', 'video', 'contentType', 'pack', 'languages', 'deadline', 'references'].forEach(function (k) { m[k] = str(b[k], k === 'references' ? 1000 : 300); });
      m.kind = b.kind === 'quick' ? 'quick' : 'brief'; m.lang = str(b.lang, 2).replace(/[^a-z]/g, '');
      const rk = 'vanta:rm:' + L.ipHash(req);
      const r = await L.redis([['INCR', rk], ['EXPIRE', rk, 3600, 'NX'], ['ZCARD', 'vanta:inbox']]);
      if (r[0] > 5) return res.status(429).json({ error: 'rate' });
      if (r[2] >= MAX) return res.status(503).json({ error: 'full' });
      m.id = Date.now().toString(36) + crypto.randomBytes(3).toString('hex'); m.t = Date.now(); m.read = false; m.star = false; m.arch = false;
      await L.redis([['SET', 'vanta:msg:' + m.id, JSON.stringify(m)], ['ZADD', 'vanta:inbox', m.t, m.id]]);
      return res.status(200).json({ ok: true });
    }
    if (!L.isAdmin(req)) return res.status(401).json({ error: 'auth' });
    if (a === 'list') {
      const ids = (await L.redis([['ZREVRANGE', 'vanta:inbox', 0, 199]]))[0];
      const raw = ids.length ? (await L.redis([['MGET'].concat(ids.map(function (i) { return 'vanta:msg:' + i; }))]))[0] : [];
      return res.json({ msgs: raw.filter(Boolean).map(JSON.parse) });
    }
    const b = L.body(req), id = str(b.id, 30).replace(/[^a-z0-9]/g, '');
    if (req.method === 'POST' && a === 'delete' && id) { await L.redis([['DEL', 'vanta:msg:' + id], ['ZREM', 'vanta:inbox', id]]); return res.json({ ok: true }); }
    if (req.method === 'POST' && a === 'update' && id) {
      const cur = (await L.redis([['GET', 'vanta:msg:' + id]]))[0];
      if (!cur) return res.status(404).json({ error: 'nf' });
      const m = JSON.parse(cur); ['read', 'star', 'arch'].forEach(function (k) { if (typeof b[k] === 'boolean') m[k] = b[k]; });
      await L.redis([['SET', 'vanta:msg:' + id, JSON.stringify(m)]]); return res.json({ ok: true });
    }
    res.status(404).json({ error: 'nf' });
  } catch (e) { res.status(500).json({ error: String(e.message) === 'NO_DB' ? 'no_db' : 'err' }); }
};
