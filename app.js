import { TOTAL, CIRCUIT_DAYS, WAIST_DAYS, HABITS, habitsFor, dayOf, daysUntil, stepTarget, hueOf, CIRCUIT_REPS } from './challenge.js';
import { STR, LANGS, detectLang } from './i18n.js';
import { figure } from './figures.js';

// ── Dati: solo localStorage di questo telefono ─────────────
const KEY = 'boring14';
const blank = () => ({ start: null, height: null, lang: detectLang(), done: {}, steps: {}, waist: {} });
let S;
try { S = { ...blank(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { S = blank(); }
navigator.storage?.persist?.(); // chiede al browser di non cancellare i dati

const L = () => STR[S.lang] || STR.en;
const t = (k, v = {}) => String(L()[k]).replace(/\{(\w+)\}/g, (_, x) => v[x]);
const fmt = (n) => Number(n).toLocaleString(L().locale);
const num = (n) => Number(n).toLocaleString(L().locale, { maximumFractionDigits: 1 });
const startDate = () => new Date(S.start);
const today = () => dayOf(startDate(), new Date());
const waiting = () => daysUntil(startDate(), new Date());
const dateOf = (n) => { const d = startDate(); d.setDate(d.getDate() + n - 1); return d; };
const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dstr = (d, o) => d.toLocaleDateString(L().locale, o);
const isDone = (d, id) => {
  if (id === 'steps') { const s = S.steps[d], g = stepTarget(d, S.steps); return s != null && (g == null || s >= g); }
  if (id === 'waist') return S.waist[d] != null;
  return (S.done[d] || []).includes(id);
};
const progress = (d) => { const h = habitsFor(d); return h.filter((x) => isDone(d, x.id)).length / h.length; };
const streak = () => { let n = 0; for (let d = today(); d >= 1; d--) { if (progress(d) >= 1) n++; else if (d !== today()) break; } return n; };

// ── Piattaforma ────────────────────────────────────────────
const ua = navigator.userAgent;
const isIOS = /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
const isAndroid = /android/i.test(ua);
const isIOSSafari = isIOS && !/crios|fxios|edgios/i.test(ua);
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
let installPrompt = null;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installPrompt = e; if (!S.start || tab === 'install') render(); });

// ── Stato UI ───────────────────────────────────────────────
let tab = 'today', viewDay = null, ticks = new Set(), round = 1, rest = 0, timer = null, lastTab = null, popId = null, openEx = 0;
let slide = 0, startChoice = 'today', pickDate = '', heightVal = S.height ?? '';
const anim = {};
const $ = (id) => document.getElementById(id);

// ── Icone e colori ─────────────────────────────────────────
const I = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  food: '<path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M7 3v4M17 21V3c-2 1.5-3 4-3 7v3h3"/>',
  dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
  ruler: '<rect x="2.5" y="8" width="19" height="8" rx="2"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>',
  chart: '<path d="M5 20v-7M10 20V5M15 20v-10M20 20v-4"/>',
  watch: '<rect x="6.5" y="6" width="11" height="12" rx="3.5"/><path d="M9 6l.8-3h4.4L15 6M9 18l.8 3h4.4l.8-3M12 10v2.5l1.5 1"/>',
  chev: '<path d="m9 6 6 6-6 6"/>', back: '<path d="m15 6-6 6 6 6"/>',
  sync: '<path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3M4 4v4h4M20 20v-4h-4"/>',
  share: '<path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
  drop: '<path d="M12 3s6.5 6.6 6.5 11.2a6.5 6.5 0 0 1-13 0C5.5 9.6 12 3 12 3z"/>',
  plate: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
  walk: '<circle cx="13.5" cy="4" r="1.8"/><path d="m9 21 2.6-6 2.4 2.2V21M11.6 15 10.5 9.5l3-2 2.4 3 3 1M10.5 9.5 7 12"/>',
  shoe: '<path d="M3 16.5V9l4 1 3-3 3 4 6 2a2.5 2.5 0 0 1 2 2.5v1z"/><path d="M3 19.5h18"/>',
  alarm: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 1.8M5 3.5 2.5 6M19 3.5 21.5 6"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 6.8 6.8 0 0 0 20 14.5z"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
  flame: '<path d="M12 21.5c4 0 7-2.6 7-6.6 0-3-2-5-3.6-7-.4 2-1.5 3-3 3 .6-3-.9-6-3.4-8.4 0 4.2-4 6.2-4 11.2 0 4.6 3 7.8 7 7.8z"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  bag: '<path d="M5 8h14l-1 12.5H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
  warn: '<path d="M12 4 2.5 20h19zM12 10v4.5M12 17.5v.5"/>',
};
const icon = (n) => `<svg class="i" viewBox="0 0 24 24">${I[n]}</svg>`;
const C = { blue: 'oklch(0.62 0.17 250)', green: 'oklch(0.64 0.17 145)', orange: 'oklch(0.69 0.19 50)', red: 'oklch(0.62 0.21 25)', purple: 'oklch(0.57 0.22 300)', amber: 'oklch(0.74 0.16 75)', indigo: 'oklch(0.55 0.19 275)', pink: 'oklch(0.64 0.21 355)' };
const HAB = { drinks: ['drop', C.blue], plate: ['plate', C.green], walk: ['walk', C.orange], steps: ['shoe', C.red], circuit: ['dumbbell', C.purple], wake: ['alarm', C.amber], kitchen: ['moon', C.indigo], waist: ['ruler', C.pink] };
const PAL = [C.orange, C.blue, C.green, C.purple, C.pink];
const tile = (ic, c, extra = '') => `<span class="tile ${extra}" style="--c:${c}"><svg viewBox="0 0 24 24">${I[ic]}</svg></span>`;
const check = '<span class="ck"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>';
const setHue = (d) => document.documentElement.style.setProperty('--h', hueOf(d));

// Mini-grafico a onda con riempimento sfumato e puntino finale.
let sparkId = 0;
function spark(vals, c) {
  const v = vals.length > 1 ? vals : [vals[0] ?? 0, vals[0] ?? 0];
  const lo = Math.min(...v), hi = Math.max(...v), W = 112, H = 58;
  const pts = v.map((y, i) => [4 + (i * (W - 10)) / (v.length - 1), hi === lo ? H * .55 : 50 - ((y - lo) / (hi - lo)) * 40]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], m = (x1 - x0) / 2;
    d += ` C${x0 + m},${y0} ${x1 - m},${y1} ${x1},${y1}`;
  }
  const [lx, ly] = pts[pts.length - 1], id = `sg${++sparkId}`;
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".22"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs>
    <path class="ar" d="${d} L${lx},${H} L${pts[0][0]},${H} Z" fill="url(#${id})"/>
    <path class="ln" d="${d}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="ar" cx="${lx}" cy="${ly}" r="3.5" fill="${c}" stroke="oklch(0.995 0.002 270)" stroke-width="2.5"/></svg>`;
}
const metric = (ic, c, lbl, val, unit, sp, extra = '') => `<div class="metric">${tile(ic, c)}
  <div class="grow"><div class="lbl">${lbl}</div><div class="num val">${val}${unit ? `<small>${unit}</small>` : ''}</div>${extra}</div>${sp || ''}</div>`;

function commit(d, fn) {
  const before = S.start ? progress(d) : 0;
  fn();
  localStorage.setItem(KEY, JSON.stringify(S));
  render();
  if (S.start && before < 1 && progress(d) >= 1) { confetti(); toast(t('dayDone')); }
}

function toast(msg) {
  const el = $('toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove('show'), 2400);
}

function confetti() {
  const c = $('confetti'), x = c.getContext('2d'), dpr = devicePixelRatio || 1;
  c.width = innerWidth * dpr; c.height = innerHeight * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = Object.values(C);
  const P = Array.from({ length: 150 }, (_, i) => ({
    x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 14, vy: Math.random() * -14 - 4,
    r: Math.random() * 7 + 5, a: Math.random() * 6, va: (Math.random() - .5) * .4, c: cols[i % cols.length],
  }));
  let f = 0;
  (function tick() {
    x.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of P) {
      p.x += p.vx; p.y += p.vy; p.vy += .45; p.vx *= .99; p.a += p.va;
      x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore();
    }
    if (++f < 160) requestAnimationFrame(tick); else x.clearRect(0, 0, innerWidth, innerHeight);
  })();
}

function ask(title, initial, unit) {
  const d = $('ask'), i = $('askInput');
  $('askTitle').textContent = `${title} (${unit})`; $('askOk').textContent = t('save'); $('askNo').textContent = t('cancel');
  i.value = initial ?? '';
  d.showModal(); i.focus();
  return new Promise((res) => d.addEventListener('close', () => {
    const v = parseFloat(i.value.replace(',', '.'));
    res(d.returnValue === 'ok' && v > 0 ? v : null);
  }, { once: true }));
}

const ring = (key, v, size, stroke, inner) => {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, from = anim[key] ?? 0; anim[key] = v;
  return `<div style="position:relative;width:${size}px;height:${size}px;display:grid;place-items:center;flex:none">
    <svg viewBox="0 0 ${size} ${size}" style="position:absolute;inset:0;transform:rotate(-90deg)">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:var(--line)" stroke-width="${stroke}"/>
    <circle data-to="${c * (1 - v)}" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:var(--accent);transition:stroke-dashoffset 1s var(--ease)" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - from)}"/></svg>
    <div style="position:relative;text-align:center">${inner}</div></div>`;
};
const counter = (key, n, suffix = '') => { const from = anim[key] ?? 0; anim[key] = n; return `<span data-count="${n}" data-from="${from}" data-suffix="${suffix}">${fmt(from)}${suffix}</span>`; };

function afterRender() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('[data-to]').forEach((el) => { el.style.strokeDashoffset = el.dataset.to; });
    document.querySelectorAll('[data-h]').forEach((el) => { el.style.height = el.dataset.h; });
    document.querySelectorAll('[data-b]').forEach((el) => { el.style.bottom = el.dataset.b; });
    document.querySelectorAll('[data-w]').forEach((el) => { el.style.width = el.dataset.w; });
    document.querySelectorAll('[data-p]').forEach((el) => { el.style.setProperty('--p', el.dataset.p); });
    document.querySelectorAll('[data-count]').forEach((el) => {
      const to = +el.dataset.count, from = +el.dataset.from, s = el.dataset.suffix, t0 = performance.now();
      if (to === from) return;
      (function step(now) {
        const k = Math.min((now - t0) / 900, 1), e = 1 - Math.pow(1 - k, 4);
        el.textContent = fmt(Math.round(from + (to - from) * e)) + s;
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }));
}

// ── Tour iniziale ──────────────────────────────────────────
function installBlock() {
  if (standalone()) return `<p class="lead">${t('installed')}</p>`;
  if (isIOS) return `<ol class="steps-list">${L().iosSteps.map((s) => `<li><span>${s}</span></li>`).join('')}</ol>
    ${isIOSSafari ? '' : `<p class="small muted">${t('iosSafari')}</p>`}`;
  return `${installPrompt ? `<button class="btn" data-act="install" style="margin-top:16px">${t('installBtn')}</button>` : ''}
    <ol class="steps-list">${L().andSteps.map((s) => `<li><span>${s}</span></li>`).join('')}</ol>`;
}
const phoneArt = () => `<div class="art"><div class="phone">${tile('check', 'var(--accent)')}<div class="bar"><span></span><span class="share">${icon('share')}</span><span></span></div></div></div>`;

const tourSlides = () => {
  const s = [
    `<div class="art"><div class="orbit">${Array.from({ length: TOTAL }, (_, i) => `<i style="--i:${i};--a:${i * (360 / TOTAL)}deg;--dh:${hueOf(i + 1)}"></i>`).join('')}<span class="num">14</span></div></div>
     <h1>${L().t1[0]}</h1><p class="lead">${L().t1[1]}</p>`,
    `<div class="art"><div class="stack">${HABITS.filter((h) => h.id !== 'waist').map((h, i) => `<div style="--i:${i}">${tile(HAB[h.id][0], HAB[h.id][1])}${L().habits[h.id][0]}</div>`).join('')}</div></div>
     <h1>${L().t2[0]}</h1><p class="lead">${L().t2[1]}</p>`,
    `<div class="art"><svg class="lock" width="150" height="170" viewBox="0 0 150 170"><path d="M40 75V52a35 35 0 0 1 70 0v23"/><rect x="18" y="75" width="114" height="84" rx="22"/><path d="M75 108v20"/></svg></div>
     <h1>${L().t3[0]}</h1><p class="lead">${L().t3[1]}</p>`,
  ];
  if (!standalone()) s.push(`${phoneArt()}<h1>${L().t4[0]}</h1><p class="lead">${L().t4[1]}</p>${installBlock()}`);
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  s.push(`<h1>${L().t5[0]}</h1>
    <p class="lead" style="margin-bottom:18px">${L().t5[1]}</p>
    <div class="eyebrow">${t('whenStart')}</div>
    <div class="opts">${['today', 'tomorrow', 'pick'].map((o) => `<button class="opt ${startChoice === o ? 'on' : ''}" data-act="choose" data-id="${o}">${t('start' + o[0].toUpperCase() + o.slice(1))}</button>`).join('')}</div>
    ${startChoice === 'pick' ? `<input type="date" id="pick" value="${pickDate}" min="${ymd(tomorrow)}">` : ''}
    <div style="height:10px"></div>
    <input id="h" inputmode="decimal" placeholder="${t('heightPh')}" value="${heightVal}">
    <button class="btn" id="go" data-act="begin" style="margin-top:14px">${startChoice === 'today' ? t('begin') : t('ready')}</button>
    <p class="small muted" style="margin-top:14px">${t('medical')}</p>`);
  return s;
};

function renderTour() {
  const slides = tourSlides();
  slide = Math.min(slide, slides.length - 1);
  setHue(1 + slide * 3);
  $('nav').hidden = true;
  $('app').innerHTML = `<div class="tour">
    <div class="tour-top"><span class="num" style="font-size:17px">Boring 14</span>
      <div class="lang">${Object.keys(LANGS).map((l) => `<button class="${l === S.lang ? 'on' : ''}" data-act="lang" data-id="${l}">${l.toUpperCase()}</button>`).join('')}</div></div>
    <div class="slides" id="slides" style="transform:translateX(${-slide * 100}%)">${slides.map((h, i) => `<section class="slide ${i === slide ? 'play' : ''}">${h}</section>`).join('')}</div>
    <div class="dots">${slides.map((_, i) => `<i class="${i === slide ? 'on' : ''}"></i>`).join('')}</div>
    ${slide < slides.length - 1 ? `<button class="btn" data-act="next">${t('next')}</button>` : ''}
  </div>`;
  validateTour();
}

function validateTour() {
  const go = $('go'); if (!go) return;
  const h = parseFloat(String(heightVal).replace(',', '.'));
  go.disabled = !(h >= 100 && h <= 250) || (startChoice === 'pick' && !pickDate);
}

function goSlide(i) {
  const n = $('slides').children.length;
  if (i < 0 || i >= n) return;
  if ((slide === n - 1) !== (i === n - 1)) { slide = i; return renderTour(); }
  slide = i;
  setHue(1 + slide * 3);
  $('slides').style.transform = `translateX(${-slide * 100}%)`;
  [...$('slides').children].forEach((el, j) => el.classList.toggle('play', j === slide));
  document.querySelectorAll('.dots i').forEach((el, j) => el.classList.toggle('on', j === slide));
}

// ── Pagine ─────────────────────────────────────────────────
function countdownPage() {
  const n = waiting();
  setHue(1);
  return `<div class="countdown">
    <div class="eyebrow">${t('startsIn')}</div>
    <div class="num big">${n}</div>
    <div style="font-size:20px;font-weight:800">${n === 1 ? t('dayWord') : t('daysWord')}</div>
    <p class="muted">${t('startsOn', { d: dstr(startDate(), { weekday: 'long', day: 'numeric', month: 'long' }) })}</p></div>
  <div class="section"><h2>${t('getReady')}</h2></div>
  <div class="card list">${L().readyList.map((r, i) => `<div class="row">${tile(['ruler', 'drop', 'plate', 'alarm'][i], PAL[i])}<span class="grow">${r}</span></div>`).join('')}</div>
  <button class="btn ghost" data-act="startnow">${t('startNow')}</button>
  ${standalone() ? '' : `<div class="section"><h2>${t('install')}</h2></div><div class="card" style="padding:16px">${installBlock()}</div>`}`;
}

function todayPage() {
  const td = today(), d = viewDay ?? td, p = progress(d), hs = habitsFor(d);
  const goal = stepTarget(d, S.steps), st = S.steps[d] ?? 0, doneN = hs.filter((h) => isDone(d, h.id)).length;
  setHue(d);
  const hr = new Date().getHours();
  const cheer = L().cheer[p >= 1 ? 3 : p >= .6 ? 2 : p > 0 ? 1 : 0];
  const days = Array.from({ length: d }, (_, i) => i + 1);
  const strip = Array.from({ length: TOTAL }, (_, i) => {
    const n = i + 1, full = n <= td && progress(n) >= 1;
    return `<button class="${n === d ? 'sel' : ''} ${full ? 'full' : ''}" data-act="day" data-id="${n}" ${n > td ? 'disabled' : ''} aria-label="${t('day')} ${n}">
      <small>${dstr(dateOf(n), { weekday: 'narrow' })}</small>${dateOf(n).getDate()}<i></i></button>`;
  }).join('');
  const sub = (h) => h.id === 'waist' && S.waist[d] != null ? `${num(S.waist[d])} cm` : L().habits[h.id][1];
  const from = anim.orb ?? 0; anim.orb = p;
  return `<div class="bar-top"><span class="brand">Boring 14</span><span class="grow"></span>
      ${isIOS ? `<button class="icon-btn" data-act="sync" aria-label="${t('sync')}">${icon('watch')}</button>` : ''}</div>
    <div class="greet"><span class="muted">${L().hello[hr < 12 ? 0 : hr < 18 ? 1 : 2]}</span><br><b>${t('day')} ${d}</b> <span class="muted">${t('of')} ${TOTAL}</span></div>
    <div class="orb-wrap"><div class="orb ${p >= 1 ? 'full' : ''}" style="--p:${from}" data-p="${p}"></div>
      <div class="orb-txt"><div class="num">${counter('pct', Math.round(p * 100), '%')}</div><div class="small">${t('doneOf', { a: doneN, b: hs.length })}</div></div></div>
    <p class="cheer">${cheer}</p>
    <div class="days">${strip}</div>
    <button class="card" data-act="steps">${metric('shoe', C.red, `${t('steps')} · ${goal == null ? t('observe') : isDone(d, 'steps') ? t('goalHit') + ' ✓' : t('goal', { n: fmt(goal) })}`,
      counter('st', st), t('stepsUnit'), spark(days.map((n) => S.steps[n] ?? 0), C.red))}
      <div class="track"><i data-w="${goal ? Math.min(st / goal, 1) * 100 : st ? 100 : 0}%"></i></div></button>
    ${isAndroid ? `<p class="small muted" style="margin:-2px 6px 12px">${t('androidNote')}</p>` : ''}
    <div class="section"><h2>${t('plan')}</h2><span class="small muted">${doneN}/${hs.length}</span></div>
    <div class="card list">${hs.filter((h) => h.id !== 'steps').map((h) => `
      <button class="row ${isDone(d, h.id) ? 'done' : ''} ${popId === h.id ? 'pop' : ''}" data-act="habit" data-id="${h.id}">
        ${tile(HAB[h.id][0], HAB[h.id][1])}<span class="grow"><div class="t">${L().habits[h.id][0]}</div><div class="s">${sub(h)}</div></span>${check}
      </button>`).join('')}</div>
    <p class="note">“${L().tips[d - 1]}”</p>`;
}

function circuitPage() {
  const td = today(), isDay = CIRCUIT_DAYS.includes(td), next = CIRCUIT_DAYS.find((x) => x >= td);
  const all = ticks.size === CIRCUIT_REPS.length * 3, logged = isDone(td, 'circuit');
  const inRound = (r) => CIRCUIT_REPS.filter((_, i) => ticks.has(`${r}:${i}`)).length;
  const p = ticks.size / (CIRCUIT_REPS.length * 3);
  setHue(td);
  return `<div class="bar-top"><div class="grow"><h1>${t('circuitT')}</h1><div class="muted">${isDay ? t('circuitToday') : next ? t('circuitNext', { n: next }) : t('circuitOver')}</div></div></div>
  <div class="card" style="display:flex;align-items:center;gap:16px;padding:18px">
    <div class="grow">${rest > 0
      ? `<h1>${t('rest')}</h1><p class="muted" style="margin:6px 0 12px">${t('restSub')}</p><button class="chip solid" data-act="stoprest">${t('skip')}</button>`
      : `<h1>${t('rounds')}</h1><p class="muted" style="margin:6px 0 0">${t('roundsSub')}</p>`}</div>
    ${rest > 0 ? ring('rest', rest / 90, 96, 10, `<div class="num" style="font-size:28px">${rest}</div>`)
      : ring('circ', p, 96, 10, `<div class="num" style="font-size:22px">${counter('cp', Math.round(p * 100), '%')}</div>`)}
  </div>
  <div class="seg">${[1, 2, 3].map((r) => `<button class="${r === round ? 'on' : ''}" data-act="round" data-id="${r}">${t('round')} ${r} · ${inRound(r)}/5</button>`).join('')}</div>
  ${L().circuit.map(([name, tip, how], i) => {
    const id = `${round}:${i}`, q = encodeURIComponent(`${name} ${S.lang === 'it' ? 'esercizio corpo libero' : 'bodyweight exercise form'}`);
    return `<div class="card ex ${openEx === i ? 'open' : ''}" style="--c:${PAL[i]}">
      <div class="ex-head">
        <button class="ex-open" data-act="openex" data-id="${i}" aria-expanded="${openEx === i}">
          <span class="tile num">${i + 1}</span><span class="grow"><div class="t">${name}</div><div class="small muted">${CIRCUIT_REPS[i]}</div></span>${icon('chev').replace('class="i"', 'class="i chev"')}
        </button>
        <button class="${ticks.has(id) ? 'done' : ''} ${popId === id ? 'pop' : ''}" data-act="tick" data-id="${id}" aria-label="${name}">${check}</button>
      </div>
      <div class="ex-body"><div><div class="ex-inner">
        <div class="fig-wrap">${figure(i)}</div>
        <ol>${how.map((s) => `<li>${s}</li>`).join('')}</ol>
        <div class="links"><span class="small muted">${tip}</span><a href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener noreferrer">${t('video')} ↗</a></div>
      </div></div></div>
    </div>`;
  }).join('')}
  ${round < 3 && inRound(round) === 5 && rest === 0 ? `<button class="btn" style="margin-top:4px" data-act="rest">${t('restBtn', { n: round + 1 })}</button>` : ''}
  ${isDay && round === 3 ? `<button class="btn" style="margin-top:4px" data-act="logcircuit" ${all && !logged ? '' : 'disabled'}>${logged ? t('circuitDone') : t('logCircuit')}</button>` : ''}`;
}

function foodPage() {
  setHue(today());
  const slice = (d, c, cls) => `<path d="${d}" class="sl ${cls}" style="fill:${c}"/>`;
  const label = (x, y, txt) => `<text x="${x}" y="${y}" text-anchor="middle">${txt}</text>`;
  const soft = (c) => c.replace(')', ' / .45)');
  const portionCol = [C.red, C.green, C.amber, C.orange];
  return `<div class="bar-top"><div class="grow"><h1>${t('food')}</h1><div class="muted">${t('foodSub')}</div></div></div>
  <div class="card" style="padding:16px 8px 8px">
    <svg class="plate" viewBox="0 0 220 210" role="img" aria-label="${t('plateT')}">
      <circle cx="100" cy="105" r="96" class="rim"/>
      ${slice('M100,105 L100,19 A86,86 0 0 1 100,191 Z', soft(C.green), 's1')}
      ${slice('M100,105 L14,105 A86,86 0 0 1 100,19 Z', soft(C.red), 's2')}
      ${slice('M100,105 L100,191 A86,86 0 0 1 14,105 Z', soft(C.amber), 's3')}
      <circle cx="190" cy="34" r="17" class="sl s4" style="fill:${soft(C.orange)}"/>
      ${label(146, 110, t('veg'))}${label(62, 76, t('protein'))}${label(62, 146, t('carbs'))}${label(190, 66, t('fat'))}
    </svg>
  </div>
  <div class="section"><h2>${t('plateT')}</h2></div>
  ${L().portions.map(([h, name, size, ex], i) => `<div class="card habit-card"><span class="habit">
      <span class="tile" style="font-size:22px;box-shadow:inset 0 0 0 3px ${soft(portionCol[i])}">${h}</span>
      <span class="grow"><div class="t">${name} <span class="muted" style="font-weight:600">· ${size}</span></div><div class="s">${ex}</div></span></span></div>`).join('')}
  <div class="card note" style="padding:12px">${tile('bulb', C.amber)}<div><div class="eyebrow">${t('orderT')}</div><div style="margin-top:2px">${t('orderB')}</div></div></div>
  <div class="section"><h2>${t('menuT')}</h2></div>
  <p class="muted" style="margin:-4px 4px 12px">${t('menuB')}</p>
  <div class="card list">${L().meals.map(([meal, opts], i) => `<div class="row" style="align-items:flex-start">
      ${tile(['alarm', 'plate', 'moon'][i], [C.amber, C.green, C.indigo][i])}
      <span class="grow"><div class="eyebrow" style="margin-bottom:4px">${meal}</div>${opts.map((o) => `<div class="t" style="margin-bottom:3px">${o}</div>`).join('')}</span></div>`).join('')}</div>
  ${L().extras.map(([, h, b], i) => `<div class="card note" style="padding:12px">${tile(['drop', 'moon', 'bag', 'warn'][i], [C.blue, C.indigo, C.green, C.red][i])}
      <div><div class="t" style="font-weight:800">${h}</div><div class="small muted" style="margin-top:2px">${b}</div></div></div>`).join('')}`;
}

function measurePage() {
  const td = today(), h = S.height || 170;
  const entries = WAIST_DAYS.filter((x) => S.waist[x] != null).map((x) => S.waist[x]);
  const last = entries[entries.length - 1], first = S.waist[1], ratio = last != null ? last / h : null;
  setHue(td);
  return `<div class="bar-top"><div class="grow"><h1>${t('measure')}</h1><div class="muted">${t('measureSub')}</div></div></div>
  <div class="card">${metric('ruler', C.pink, t('now'), last != null ? num(last) : '–', 'cm', entries.length ? spark(entries, C.pink) : '',
    `<div class="small" style="color:${ratio == null ? 'var(--muted)' : ratio < .5 ? 'var(--good)' : 'var(--warn)'}">${ratio == null ? t('ratioNone') : ratio < .5 ? t('ratioGood') : t('ratioHigh', { n: Math.round(h / 2) })}</div>`)}</div>
  <div class="pair">
    <div class="card mini">${metric('flame', C.orange, t('start'), first != null ? num(first) : '–', 'cm')}</div>
    <div class="card mini">${metric('check', C.green, t('target'), Math.round(h / 2), 'cm')}</div>
  </div>
  ${first != null && last != null && last !== first ? `<p style="margin:12px 6px 0;font-weight:800;color:${last < first ? 'var(--good)' : 'var(--warn)'}">${t('fromDay1', { s: last < first ? '−' : '+', n: num(Math.abs(last - first)) })}</p>` : ''}
  <div class="section"><h2>${t('entries')}</h2></div>
  <div class="card list">${WAIST_DAYS.map((x, i) => `<button class="row" data-act="waist" data-id="${x}" ${x <= td ? '' : 'disabled'}>
      <span class="tile num" style="width:44px;height:44px;border-radius:15px;color:${PAL[i]}">${x}</span>
      <span class="grow"><div class="t">${t('day')} ${x}</div><div class="s">${S.waist[x] != null ? num(S.waist[x]) + ' cm' : x <= td ? t('tapToAdd') : dstr(dateOf(x), { day: 'numeric', month: 'short' })}</div></span>${icon('chev')}</button>`).join('')}</div>
  <p class="small muted" style="margin:-2px 6px 0">${t('howTo')}</p>
  <div class="section"><h2>${t('settings')}</h2></div>
  <div class="card list">
    <button class="row" data-act="height"><span class="grow"><div class="t">${t('height')}</div><div class="s">${Math.round(h)} cm</div></span>${icon('chev')}</button>
    <label class="row"><span class="grow"><div class="t">${t('language')}</div></span>
      <select id="langSel">${Object.entries(LANGS).map(([k, v]) => `<option value="${k}" ${k === S.lang ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
    <button class="row" data-act="tab" data-id="install"><span class="grow"><div class="t">${t('install')}</div><div class="s">${standalone() ? t('installed') : t('installSub')}</div></span>${icon('chev')}</button>
    ${isIOS ? `<button class="row" data-act="guide"><span class="grow"><div class="t">${t('watch')}</div><div class="s">${t('watchSub')}</div></span>${icon('chev')}</button>` : ''}
    <button class="row" data-act="reset"><span class="grow"><div class="t" style="color:var(--warn)">${t('reset')}</div><div class="s">${t('resetSub')}</div></span>${icon('chev')}</button>
  </div>`;
}

function progressPage() {
  const td = today();
  const days = Array.from({ length: td }, (_, i) => i + 1);
  const vals = Array.from({ length: TOTAL }, (_, i) => (i + 1 <= td ? progress(i + 1) : 0));
  const avg = vals.slice(0, td).reduce((a, b) => a + b, 0) / td;
  const full = vals.filter((v) => v >= 1).length;
  const totSteps = Object.values(S.steps).reduce((a, b) => a + b, 0);
  setHue(td);
  return `<div class="bar-top"><div class="grow"><h1>${t('progress')}</h1><div class="muted">${t('progressT').replace('<br>', ' ')}</div></div></div>
  <div class="card" style="padding:16px 14px 12px">
    <div class="eyebrow">${t('spectrum')}</div>
    <div class="bars">${vals.map((v, i) => `<div class="b ${i + 1 > td ? 'future' : ''} ${i + 1 === td ? 'sel' : ''}" style="--dh:${hueOf(i + 1)}" data-h="${Math.max(v * 100, 3)}%"></div>`).join('')}
      <div class="avg" data-b="${avg * 100}%"><b>⌀ ${Math.round(avg * 100)}%</b></div></div>
    <div class="xl">${vals.map((_, i) => `<span class="${i + 1 === td ? 'on' : ''}">${i + 1}</span>`).join('')}</div>
  </div>
  <div class="card">${metric('shoe', C.red, t('totalSteps'), counter('ts', totSteps), t('stepsUnit'), spark(days.map((n) => S.steps[n] ?? 0), C.red))}</div>
  <div class="card">${metric('check', C.purple, t('complete'), `${full}<span class="muted" style="font-size:20px">/${TOTAL}</span>`, '', spark(days.map(progress), C.purple))}</div>
  <div class="card">${metric('flame', C.orange, t('streak'), counter('sk', streak()), streak() === 1 ? t('dayWord') : t('daysWord'), spark(days.map((n) => (progress(n) >= 1 ? 1 : 0)), C.orange))}</div>
  <p class="muted" style="text-align:center;font-style:italic;margin-top:22px;font-family:ui-serif,Georgia,serif;font-size:17px">${t('quote')}</p>`;
}

const sub = (title, body) => `<div class="bar-top"><button class="icon-btn" data-act="tab" data-id="measure" aria-label="${t('back')}">${icon('back')}</button><h1 class="grow" style="font-size:22px">${title}</h1></div>${body}`;
const PAGES = {
  today: todayPage, food: foodPage, circuit: circuitPage, measure: measurePage, progress: progressPage,
  guide: () => sub(t('guideT'), `<div class="card guide" style="padding:16px">${t('guide')}</div>`),
  install: () => sub(t('install'), `<div class="card slide play" style="padding:18px">${phoneArt()}<h1 style="font-size:26px">${L().t4[0]}</h1><p class="lead muted">${L().t4[1]}</p>${installBlock()}</div>`),
};
const NAV = [['today', 'home'], ['food', 'food'], ['circuit', 'dumbbell'], ['measure', 'ruler'], ['progress', 'chart']];

function render() {
  document.documentElement.lang = S.lang;
  if (!S.start) return renderTour();
  const app = $('app'), nav = $('nav');
  if (waiting() > 0) { nav.hidden = true; app.className = 'enter'; app.innerHTML = countdownPage(); return; }
  nav.hidden = false;
  app.className = lastTab !== tab ? 'enter' : '';
  lastTab = tab;
  app.innerHTML = PAGES[tab]();
  const navOn = ['guide', 'install'].includes(tab) ? 'measure' : tab;
  nav.innerHTML = NAV.map(([id, ic]) => `<button class="${id === navOn ? 'on' : ''}" data-tab="${id}" aria-label="${id}">${icon(ic)}</button>`).join('');
  popId = null;
  afterRender();
  const sel = document.querySelector('.days .sel');
  if (sel) sel.parentElement.scrollLeft = sel.offsetLeft - innerWidth / 2 + sel.offsetWidth / 2;
}

// ── Azioni ─────────────────────────────────────────────────
document.addEventListener('input', (e) => {
  if (e.target.id === 'h') { heightVal = e.target.value; validateTour(); }
  if (e.target.id === 'pick') { pickDate = e.target.value; validateTour(); }
});
document.addEventListener('change', (e) => {
  if (e.target.id === 'langSel') commit(today(), () => { S.lang = e.target.value; });
});

let touchX = null;
document.addEventListener('touchstart', (e) => { if (e.target.closest('.slides')) touchX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', (e) => {
  if (touchX == null) return;
  const dx = e.changedTouches[0].clientX - touchX; touchX = null;
  if (Math.abs(dx) > 50) goSlide(slide + (dx < 0 ? 1 : -1));
});

document.addEventListener('click', async (ev) => {
  const navBtn = ev.target.closest('[data-tab]');
  if (navBtn) { tab = navBtn.dataset.tab; viewDay = null; scrollTo(0, 0); return render(); }
  const b = ev.target.closest('[data-act]');
  if (!b || b.disabled) return;
  const id = b.dataset.id, td = S.start ? today() : 1, d = viewDay ?? td;
  switch (b.dataset.act) {
    case 'lang': S.lang = id; localStorage.setItem(KEY, JSON.stringify(S)); return render();
    case 'next': return goSlide(slide + 1);
    case 'choose': startChoice = id; return renderTour();
    case 'install':
      if (installPrompt) { installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; render(); }
      return;
    case 'begin': {
      const s = midnight(new Date());
      if (startChoice === 'tomorrow') s.setDate(s.getDate() + 1);
      if (startChoice === 'pick') { const [y, m, dd] = pickDate.split('-').map(Number); s.setFullYear(y, m - 1, dd); }
      scrollTo(0, 0); tab = 'today';
      return commit(1, () => { S.start = s.toISOString(); S.height = parseFloat(String(heightVal).replace(',', '.')); });
    }
    case 'startnow': return commit(1, () => { S.start = midnight(new Date()).toISOString(); });
    case 'tab': tab = id; scrollTo(0, 0); return render();
    case 'day': viewDay = +id === td ? null : +id; return render();
    case 'guide': tab = 'guide'; scrollTo(0, 0); return render();
    case 'habit':
      if (id === 'circuit' && d === td) { tab = 'circuit'; scrollTo(0, 0); return render(); }
      if (id === 'waist') { const v = await ask(L().habits.waist[0], S.waist[d], 'cm'); if (v) commit(d, () => { S.waist[d] = v; }); return; }
      popId = isDone(d, id) ? null : id;
      return commit(d, () => { const a = S.done[d] ||= []; a.includes(id) ? a.splice(a.indexOf(id), 1) : a.push(id); });
    case 'steps': { const v = await ask(t('steps'), S.steps[d], t('stepsUnit')); if (v) commit(d, () => { S.steps[d] = Math.round(v); }); return; }
    case 'sync':
      try {
        const n = parseInt((await navigator.clipboard.readText()).replace(/[^\d]/g, ''), 10);
        if (!(n > 0 && n < 200000)) throw 0;
        commit(d, () => { S.steps[d] = n; });
        toast(t('synced', { n: fmt(n) }));
      } catch { toast(t('noClip')); }
      return;
    case 'openex': openEx = openEx === +id ? -1 : +id; document.querySelectorAll('.ex').forEach((el, i) => { el.classList.toggle('open', i === openEx); }); return;
    case 'round': round = +id; return render();
    case 'tick': popId = ticks.has(id) ? null : id; ticks.has(id) ? ticks.delete(id) : ticks.add(id); return render();
    case 'rest':
      clearInterval(timer); rest = 90; anim.rest = 1; round++; scrollTo(0, 0); render();
      timer = setInterval(() => { rest--; if (rest <= 0) { clearInterval(timer); toast(t('go', { n: round })); } render(); }, 1000);
      return;
    case 'stoprest': clearInterval(timer); rest = 0; return render();
    case 'logcircuit': return commit(td, () => { (S.done[td] ||= []).push('circuit'); });
    case 'waist': { const v = await ask(`${t('day')} ${id}`, S.waist[id], 'cm'); if (v) commit(+id, () => { S.waist[id] = v; }); return; }
    case 'height': { const v = await ask(t('height'), S.height, 'cm'); if (v >= 100 && v <= 250) commit(td, () => { S.height = v; }); return; }
    case 'reset': {
      const c = $('confirm');
      $('cfT').textContent = t('resetQ'); $('cfB').textContent = t('resetBody'); $('cfOk').textContent = t('del'); $('cfNo').textContent = t('cancel');
      c.showModal();
      c.addEventListener('close', () => {
        if (c.returnValue !== 'ok') return;
        const keep = { height: S.height, lang: S.lang };
        S = { ...blank(), ...keep }; heightVal = S.height ?? ''; slide = 0; ticks.clear(); round = 1; tab = 'today';
        localStorage.setItem(KEY, JSON.stringify(S)); render();
      }, { once: true });
    }
  }
});

// Al ritorno sull'app (anche dopo mezzanotte) ricalcola il giorno.
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.start) render(); });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
history.scrollRestoration = 'manual';
render();
