const crypto = require('crypto');
const DB_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const DB_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

/* Redis REST (Upstash / Vercel KV). cmds = [['SET','k','v'], ...] -> results[] */
async function redis(cmds) {
  if (!DB_URL || !DB_TOKEN) throw new Error('NO_DB');
  const r = await fetch(DB_URL + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + DB_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds) });
  if (!r.ok) throw new Error('DB_' + r.status);
  return (await r.json()).map(function (x) { if (x.error) throw new Error(x.error); return x.result; });
}
const key = function () { return crypto.createHash('sha256').update('vanta:' + (process.env.ADMIN_SECRET || '') + ':' + (process.env.ADMIN_PASSWORD || '')).digest(); };
const mac = function (p) { return crypto.createHmac('sha256', key()).update(p).digest('base64url'); };
const same = function (a, b) { const x = crypto.createHash('sha256').update(String(a)).digest(), y = crypto.createHash('sha256').update(String(b)).digest(); return crypto.timingSafeEqual(x, y); };
const token = function (days) { const p = String(Date.now() + days * 864e5); return p + '.' + mac(p); };
function cookie(req, n) { const m = String(req.headers.cookie || '').match(new RegExp('(?:^|; )' + n + '=([^;]*)')); return m ? m[1] : ''; }
function isAdmin(req) {
  if (!process.env.ADMIN_PASSWORD) return false;
  const t = cookie(req, 'vanta_admin').split('.');
  return t.length === 2 && same(t[1], mac(t[0])) && Number(t[0]) > Date.now();
}
function body(req) {
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  return b && typeof b === 'object' ? b : {};
}
const ipHash = function (req) { return crypto.createHash('sha256').update(String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() + ':vanta').digest('hex').slice(0, 16); };
module.exports = { redis, token, same, isAdmin, body, ipHash, cookie };
