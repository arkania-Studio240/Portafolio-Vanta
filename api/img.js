const L = require('./_lib'), crypto = require('crypto');
/* Only WebP / JPEG / PNG (checked by file signature). SVG is refused on purpose: it can carry scripts. */
const kind = function (b) { return b[0] === 0xFF && b[1] === 0xD8 ? 'image/jpeg' : (b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') ? 'image/webp' : b.slice(1, 4).toString() === 'PNG' ? 'image/png' : ''; };
const valid = function (s, max) { return /^[A-Za-z0-9+/=]+$/.test(s) && s.length <= max && !!kind(Buffer.from(s, 'base64')); };
module.exports = async function (req, res) {
  try {
    if (req.method === 'POST') { /* admin upload: full size + thumbnail, already resized by the browser */
      res.setHeader('Cache-Control', 'no-store');
      if (!L.isAdmin(req)) return res.status(401).json({ error: 'auth' });
      const b = L.body(req), f = String(b.full || ''), t = String(b.thumb || '');
      if (!valid(f, 700000) || !valid(t, 170000)) return res.status(400).json({ error: 'bad_image' });
      const id = crypto.randomBytes(5).toString('hex');
      await L.redis([['SET', 'vanta:img:' + id + ':f', f], ['SET', 'vanta:img:' + id + ':t', t]]);
      return res.status(200).json({ id: id, name: 'up-' + id + '.webp' });
    }
    const id = String(req.query.id || ''); if (!/^[a-f0-9]{10}$/.test(id)) return res.status(404).end();
    const raw = (await L.redis([['GET', 'vanta:img:' + id + (req.query.s === 'thumb' ? ':t' : ':f')]]))[0];
    if (!raw) return res.status(404).end();
    const buf = Buffer.from(raw, 'base64');
    res.setHeader('Content-Type', kind(buf) || 'application/octet-stream'); res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); res.setHeader('Content-Length', buf.length);
    return res.status(200).end(buf);
  } catch (e) { res.setHeader('Cache-Control', 'no-store'); res.status(500).json({ error: 'err' }); }
};
