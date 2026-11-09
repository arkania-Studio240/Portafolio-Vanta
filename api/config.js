const L = require('./_lib');
const CATS = ['gaming', 'minecraft', 'concepts'], LANGS = ['en', 'es', 'pt'];
const num = function (v, d) { v = Number(v); return isFinite(v) && v >= 0 && v <= 100000 ? v : d; };
const str = function (v, n) { return String(v == null ? '' : v).trim().slice(0, n || 200); };
const url = function (v) { v = str(v, 500); return /^https:\/\//i.test(v) ? v : ''; };
function clean(c) {
  c = c || {}; const o = c.offer || {}, p = c.prices || {}, y = c.pay || {};
  const out = {
    prices: { starter: num(p.starter, 5), channel: num(p.channel, 25) },
    pay: { starter: url(y.starter), channel: url(y.channel) },
    offer: { enabled: !!o.enabled, regular: num(o.regular, 17), price: num(o.price, 12), until: /^\d{4}-\d{2}-\d{2}$/.test(o.until) ? o.until : '2026-11-30', payOffer: url(o.payOffer), payRegular: url(o.payRegular) },
    subLink: url(c.subLink), projects: []
  };
  (Array.isArray(c.projects) ? c.projects : []).slice(0, 100).forEach(function (q, i) {
    const imgs = {}, title = {};
    LANGS.forEach(function (l) {
      const f = str(q.images && q.images[l], 120); if (/^[\w.\-]+\.(jpe?g|png|webp)$/i.test(f)) imgs[l] = f;
      title[l] = str(q.title && q.title[l], 100);
    });
    if (!Object.keys(imgs).length) return;
    out.projects.push({ id: str(q.id, 60).toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'p' + i, category: CATS.indexOf(q.category) > -1 ? q.category : 'concepts', title: title, images: imgs });
  });
  return out;
}
module.exports = async function (req, res) {
  try {
    if (req.method === 'POST') {
      res.setHeader('Cache-Control', 'no-store');
      if (!L.isAdmin(req)) return res.status(401).json({ error: 'auth' });
      const c = clean(L.body(req)); await L.redis([['SET', 'vanta:config', JSON.stringify(c)]]);
      return res.status(200).json(c);
    }
    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
    const raw = (await L.redis([['GET', 'vanta:config']]))[0];
    res.status(200).json(raw ? JSON.parse(raw) : {});
  } catch (e) { res.setHeader('Cache-Control', 'no-store'); res.status(200).json({}); }
};
