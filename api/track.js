const L = require('./_lib');
const clean = function (s, n) { return String(s || '').replace(/[^\w\-./]/g, '').slice(0, n || 40); };
function parseUA(ua) {
  const b = /Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Otro';
  const o = /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Otro';
  return { browser: b, os: o, device: /Mobi|Android|iPhone/.test(ua) ? 'Móvil' : /iPad|Tablet/.test(ua) ? 'Tablet' : 'PC' };
}
module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).end();
  const ua = String(req.headers['user-agent'] || '');
  if (L.isAdmin(req) || /bot|crawl|spider|preview|slurp|headless|lighthouse/i.test(ua)) return res.status(204).end();
  const b = L.body(req), vid = clean(b.vid), sid = clean(b.sid);
  if (!vid || !sid) return res.status(400).end();
  try {
    const now = Date.now(), day = new Date(now).toISOString().slice(0, 10), k = 'vanta:s:' + sid;
    const cur = (await L.redis([['GET', k]]))[0];
    let s = cur ? JSON.parse(cur) : null; const fresh = !s;
    if (!s) {
      let city = ''; try { city = decodeURIComponent(req.headers['x-vercel-ip-city'] || ''); } catch (e) {}
      let ref = ''; try { ref = new URL(String(b.ref || '')).hostname; } catch (e) {}
      if (ref === String(req.headers.host || '').split(':')[0]) ref = '';
      s = Object.assign({ sid: sid, vid: vid, first: now, pages: 0, hist: [], ret: !!b.ret, country: String(req.headers['x-vercel-ip-country'] || '').slice(0, 2), city: city.slice(0, 60), ref: ref.slice(0, 60) }, parseUA(ua));
    }
    s.last = now; s.lang = clean(b.lang, 5);
    const cmds = [];
    if (b.type === 'view') {
      s.pages++; s.hist.push(String(b.path || '/').slice(0, 80)); s.hist = s.hist.slice(-20);
      cmds.push(['INCR', 'vanta:views:' + day], ['INCR', 'vanta:views:all'], ['EXPIRE', 'vanta:views:' + day, 8e6]);
    }
    cmds.push(['SET', k, JSON.stringify(s), 'EX', 5184000], ['ZADD', 'vanta:sessions', now, sid], ['PFADD', 'vanta:uv:' + day, vid], ['EXPIRE', 'vanta:uv:' + day, 8e6], ['PFADD', 'vanta:uv:all', vid]);
    if (fresh) cmds.push(['ZREMRANGEBYSCORE', 'vanta:sessions', '-inf', now - 5184e6], ['ZREMRANGEBYRANK', 'vanta:sessions', 0, -3001]);
    await L.redis(cmds);
    res.status(204).end();
  } catch (e) { res.status(204).end(); }
};
