#!/usr/bin/env node
/* Servidor LOCAL de VANTA: para ver y probar la web y /admin en tu propio equipo. Sin dependencias.
   Uso:  node local/server.js          (solo este equipo)     node local/server.js --lan   (también otros dispositivos de tu red)
   NO se despliega en Vercel (ver .vercelignore). No subas la carpeta local/ a GitHub ni a ningún hosting. */
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto'), os = require('os');
const ROOT = path.join(__dirname, '..'), DATA = path.join(__dirname, 'data.json');
const PORT = +process.env.PORT || 3000, LAN = process.argv.includes('--lan'), HOST = LAN ? '0.0.0.0' : '127.0.0.1';
/* Entorno ANTES de cargar la API. La contraseña local por defecto es la que pediste; ADMIN_PASSWORD=... la cambia sin tocar el código. */
const KV_TOKEN = crypto.randomBytes(16).toString('hex');
process.env.LOCAL_DEV = '1'; /* cookie sin "Secure" para poder usar http:// */
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin2027Go';
process.env.ADMIN_SECRET = process.env.ADMIN_SECRET || crypto.randomBytes(24).toString('hex');
process.env.KV_REST_API_URL = 'http://127.0.0.1:' + PORT + '/__kv'; process.env.KV_REST_API_TOKEN = KV_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN;

/* ---- Redis de mentira (en memoria, guardado en local/data.json): solo los comandos que usa la API ---- */
const S = new Map(), Z = new Map(), H = new Map(), X = new Map();
const num = function (v) { v = String(v); return v === '-inf' ? -Infinity : v === '+inf' ? Infinity : Number(v); };
const alive = function (k) { const t = X.get(k); if (t && t < Date.now()) { S.delete(k); Z.delete(k); H.delete(k); X.delete(k); } };
const asc = function (k) { return [...(Z.get(k) || new Map())].sort(function (a, b) { return a[1] - b[1] || (a[0] < b[0] ? -1 : 1); }); };
const WRITE = /^(SET|DEL|INCR|EXPIRE|ZADD|ZREM|ZREMRANGEBYSCORE|ZREMRANGEBYRANK|PFADD)$/;
function cmd(c) {
  const op = String(c[0]).toUpperCase(), k = String(c[1]); alive(k);
  switch (op) {
    case 'GET': return S.has(k) ? S.get(k) : null;
    case 'SET': S.set(k, String(c[2])); X.delete(k); for (let i = 3; i < c.length; i++) if (String(c[i]).toUpperCase() === 'EX') X.set(k, Date.now() + c[i + 1] * 1000); return 'OK';
    case 'DEL': { const n = (S.delete(k) ? 1 : 0) + (Z.delete(k) ? 1 : 0) + (H.delete(k) ? 1 : 0); X.delete(k); return n ? 1 : 0; }
    case 'INCR': { const n = (+S.get(k) || 0) + 1; S.set(k, String(n)); return n; }
    case 'EXPIRE': if (!(S.has(k) || Z.has(k) || H.has(k))) return 0; if (String(c[3]).toUpperCase() === 'NX' && X.has(k)) return 0; X.set(k, Date.now() + c[2] * 1000); return 1;
    case 'MGET': return c.slice(1).map(function (x) { alive(String(x)); return S.has(String(x)) ? S.get(String(x)) : null; });
    case 'ZADD': { const z = Z.get(k) || new Map(); z.set(String(c[3]), +c[2]); Z.set(k, z); return 1; }
    case 'ZREM': { const z = Z.get(k); return z && z.delete(String(c[2])) ? 1 : 0; }
    case 'ZCARD': return (Z.get(k) || new Map()).size;
    case 'ZREVRANGE': { const a = asc(k).reverse(), stop = +c[3]; return a.slice(+c[2], stop < 0 ? undefined : stop + 1).map(function (x) { return x[0]; }); }
    case 'ZRANGEBYSCORE': return asc(k).filter(function (x) { return x[1] >= num(c[2]) && x[1] <= num(c[3]); }).map(function (x) { return x[0]; });
    case 'ZREMRANGEBYSCORE': { const z = Z.get(k); let n = 0; if (z) asc(k).forEach(function (x) { if (x[1] >= num(c[2]) && x[1] <= num(c[3])) { z.delete(x[0]); n++; } }); return n; }
    case 'ZREMRANGEBYRANK': { const z = Z.get(k), a = asc(k); let stop = +c[3], n = 0; if (stop < 0) stop = a.length + stop; if (z) a.slice(+c[2], stop + 1).forEach(function (x) { z.delete(x[0]); n++; }); return n; }
    case 'PFADD': { const h = H.get(k) || new Set(), n = h.has(String(c[2])) ? 0 : 1; h.add(String(c[2])); H.set(k, h); return n; }
    case 'PFCOUNT': return (H.get(k) || new Set()).size;
  }
  throw new Error('comando no soportado en local: ' + op);
}
let timer;
function save() { clearTimeout(timer); timer = setTimeout(function () { fs.writeFile(DATA, JSON.stringify({ S: [...S], X: [...X], Z: [...Z].map(function (e) { return [e[0], [...e[1]]]; }), H: [...H].map(function (e) { return [e[0], [...e[1]]]; }) }), function () {}); }, 300); }
try { const d = JSON.parse(fs.readFileSync(DATA, 'utf8')); d.S.forEach(function (e) { S.set(e[0], e[1]); }); d.X.forEach(function (e) { X.set(e[0], e[1]); }); d.Z.forEach(function (e) { Z.set(e[0], new Map(e[1])); }); d.H.forEach(function (e) { H.set(e[0], new Set(e[1])); }); } catch (e) { /* primera vez */ }

/* ---- Servidor ---- */
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
const send = function (res, code, obj) { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
const body = function (req) { return new Promise(function (ok, no) { const ch = []; let n = 0; req.on('data', function (c) { n += c.length; if (n > 4.5e6) { no(new Error('big')); req.destroy(); } else ch.push(c); }); req.on('end', function () { ok(Buffer.concat(ch).toString()); }); req.on('error', no); }); };

async function kv(req, res) { /* /__kv/pipeline: solo con el token de esta sesión */
  if (req.headers.authorization !== 'Bearer ' + KV_TOKEN) return send(res, 401, { error: 'auth' });
  const cmds = JSON.parse(await body(req)); let w = false;
  const out = cmds.map(function (c) { try { if (WRITE.test(String(c[0]).toUpperCase())) w = true; return { result: cmd(c) }; } catch (e) { return { error: e.message }; } });
  if (w) save(); send(res, 200, out);
}
async function api(req, res, url) {
  const name = url.pathname.slice(5); let fn = null;
  if (/^[a-z]+$/.test(name)) { try { fn = require(path.join(ROOT, 'api', name + '.js')); } catch (e) { fn = null; } }
  if (!fn) return send(res, 404, { error: 'nf' });
  let raw = ''; try { raw = req.method === 'GET' || req.method === 'HEAD' ? '' : await body(req); } catch (e) { return send(res, 413, { error: 'big' }); }
  try { req.body = raw ? JSON.parse(raw) : {}; } catch (e) { req.body = raw; } /* como Vercel */
  req.query = Object.fromEntries(url.searchParams); req.headers['x-forwarded-for'] = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const sh = res.setHeader.bind(res); res.setHeader = function (k, v) { return sh(k, /^cache-control$/i.test(k) ? 'no-store' : v); }; /* en local los cambios se ven al instante */
  res.status = function (c) { res.statusCode = c; return res; };
  res.json = function (o) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); return res; };
  try { await fn(req, res); } catch (e) { console.error('[api/' + name + ']', e); if (!res.headersSent) send(res, 500, { error: 'err' }); }
}
function files(req, res, url) { /* mismas reglas que vercel.json: cleanUrls, sin barra final, /en -> / */
  let p; try { p = decodeURIComponent(url.pathname); } catch (e) { return send(res, 400, { error: 'bad' }); }
  if (p === '/en') { res.writeHead(301, { Location: '/' }); return res.end(); }
  if (p.length > 1 && p.endsWith('/')) { res.writeHead(308, { Location: p.slice(0, -1) + url.search }); return res.end(); }
  const f = path.join(ROOT, path.normalize(p));
  if (f !== ROOT && !f.startsWith(ROOT + path.sep)) return send(res, 403, { error: 'no' });
  if (/^\/(local|\.env|\.git|node_modules)(\/|$)/.test(p) || /data\.json$/.test(p) || p.startsWith('/api/')) { res.writeHead(404); return res.end('Not found'); }
  const tryf = [f, path.join(f, 'index.html'), f + '.html'];
  (function next(i) {
    if (i >= tryf.length) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404 - No encontrado'); }
    fs.stat(tryf[i], function (e, st) {
      if (e || !st.isFile()) return next(i + 1);
      const h = { 'Content-Type': MIME[path.extname(tryf[i]).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
      if (/^\/admin(\/|$)/.test(p)) h['X-Robots-Tag'] = 'noindex, nofollow';
      res.writeHead(200, h); if (req.method === 'HEAD') return res.end(); fs.createReadStream(tryf[i]).pipe(res);
    });
  })(0);
}
http.createServer(function (req, res) {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/__kv/pipeline' && req.method === 'POST') return kv(req, res).catch(function () { send(res, 500, { error: 'kv' }); });
  if (url.pathname.startsWith('/api/')) return api(req, res, url);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'method' });
  files(req, res, url);
}).on('error', function (e) { console.error(e.code === 'EADDRINUSE' ? 'El puerto ' + PORT + ' está ocupado. Prueba:  PORT=3001 node local/server.js' : e); process.exit(1); })
  .listen(PORT, HOST, function () {
    console.log('\n  VANTA en local\n  Web:    http://localhost:' + PORT + '\n  Admin:  http://localhost:' + PORT + '/admin   (contraseña: la local de local/server.js, o ADMIN_PASSWORD si la defines)');
    if (LAN) { const ips = [].concat.apply([], Object.values(os.networkInterfaces())).filter(function (i) { return i.family === 'IPv4' && !i.internal; }); ips.forEach(function (i) { console.log('  Red:    http://' + i.address + ':' + PORT + '   (⚠ modo --lan: cualquiera en tu red puede abrir /admin si sabe la contraseña)'); }); }
    console.log('  Datos locales: local/data.json (mensajes, imágenes y estadísticas de PRUEBA, no los de Vercel)\n  Para parar: Ctrl+C\n');
  });
