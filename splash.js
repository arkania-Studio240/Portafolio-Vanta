/* VANTA — intro splash. Writes "Vanta Portafolio" letter by letter in the visitor's device language, then reveals the site.
   Edit WORDS to add or change languages. */
(function () {
  'use strict';
  var root = document.documentElement;
  var splash = document.getElementById('splash');
  if (!splash) return;
  if (root.className.indexOf('no-splash') !== -1) { splash.parentNode.removeChild(splash); return; }

  /* Only the visitor's device language is shown. Unlisted languages fall back to Spanish.
     (Arabic and Indic scripts are left out on purpose: per-letter animation breaks their joined letters.) */
  var WORDS = {
    es: ['Vanta Portafolio', 'Saltar'],
    en: ['Vanta Portfolio', 'Skip'],
    pt: ['Vanta Portfólio', 'Pular'],
    fr: ['Vanta Portfolio', 'Passer'],
    de: ['Vanta Portfolio', 'Überspringen'],
    it: ['Vanta Portfolio', 'Salta'],
    nl: ['Vanta Portfolio', 'Overslaan'],
    tr: ['Vanta Portföy', 'Geç'],
    id: ['Vanta Portofolio', 'Lewati'],
    ru: ['Vanta Портфолио', 'Пропустить'],
    ja: ['Vanta ポートフォリオ', 'スキップ'],
    zh: ['Vanta 作品集', '跳过'],
    ko: ['Vanta 포트폴리오', '건너뛰기']
  };
  var TYPE_MS = 70, HOLD_MS = 650;

  var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
  var lang = 'es';
  for (var k = 0; k < list.length; k++) {
    var code = String(list[k] || '').toLowerCase().split('-')[0];
    if (WORDS[code]) { lang = code; break; }
  }
  var order = [lang];

  var wordEl = document.getElementById('splashWord');
  var orb = document.getElementById('splashOrb');
  var skipBtn = document.getElementById('splashSkip');
  skipBtn.textContent = WORDS[lang][1];

  var timers = [], done = false;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function finish() {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem('vantaSplash', '1'); } catch (e) {}
    document.body.style.overflow = '';
    splash.classList.add('out');
    setTimeout(function () { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 800);
  }

  function build(text) {
    Array.prototype.slice.call(wordEl.children).forEach(function (n) { if (n !== orb) wordEl.removeChild(n); });
    var chars = Array.from(text), n = chars.length, out = [], wrap = null;
    chars.forEach(function (c, i) {
      var s = document.createElement('span');
      s.className = 'sp__l';
      s.textContent = c;
      var v = Math.round(255 * (0.5 + 0.5 * Math.sin(Math.PI * (i / Math.max(1, n - 1)))));  /* metallic: bright centre, soft ends */
      s.style.color = 'rgb(' + v + ',' + v + ',' + Math.min(255, v + 10) + ')';
      if (c === ' ') { wrap = null; wordEl.appendChild(s); }
      else {
        if (!wrap) { wrap = document.createElement('span'); wrap.className = 'sp__w'; wordEl.appendChild(wrap); }
        wrap.appendChild(s);
      }
      out.push(s);
    });
    return out;
  }

  function moveOrb(el) {
    orb.style.transform = 'translate(' + (el.offsetLeft + el.offsetWidth * 0.75) + 'px,' + (el.offsetTop + el.offsetHeight * 0.58) + 'px)';
  }

  function play(idx) {
    if (done) return;
    if (idx >= order.length) { finish(); return; }
    var letters = build(WORDS[order[idx]][0]);
    wordEl.classList.remove('fade');
    orb.classList.remove('show');
    void wordEl.offsetWidth;                                   /* layout is final before the orb is placed */
    letters.forEach(function (el, i) {
      later(function () {
        el.classList.add('on');
        if (el.textContent.trim()) { orb.classList.add('show'); moveOrb(el); }
      }, 120 + i * TYPE_MS);
    });
    var typed = 120 + letters.length * TYPE_MS;
    var last = idx === order.length - 1;
    later(function () { orb.classList.remove('show'); }, typed + 100);
    if (last) { later(finish, typed + HOLD_MS); return; }
    later(function () { wordEl.classList.add('fade'); }, typed + HOLD_MS);
    later(function () { play(idx + 1); }, typed + HOLD_MS + OUT_MS);
  }

  document.body.style.overflow = 'hidden';
  skipBtn.addEventListener('click', finish);
  splash.addEventListener('click', finish);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });
  play(0);
})();
