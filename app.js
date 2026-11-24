import { TOTAL, CIRCUIT_DAYS, WAIST_DAYS, HABITS, habitsFor, dayOf, daysUntil, stepTarget, hueOf, dayColor, DAY_COLORS, CIRCUIT_REPS } from './challenge.js?v=14';
import { STR, LANGS, detectLang } from './i18n.js?v=14';
import { figure } from './figures.js?v=14';

// ── Dati: solo localStorage di questo telefono ─────────────
const KEY = 'boring14';
const blank = () => ({ start: null, height: null, lang: detectLang(), done: {}, steps: {}, waist: {} });
let S;
try { S = { ...blank(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { S = blank(); }
// Demo (#demo, #demo&tab=food&lang=it&tour): dati di esempio solo in memoria, mai salvati.
const DEMO = new URLSearchParams(location.hash.slice(1));
const isDemo = DEMO.has('demo');
if (isDemo) {
  const st = new Date(); st.setHours(0, 0, 0, 0); st.setDate(st.getDate() - 6);
  S = { ...blank(), lang: DEMO.get('lang') || detectLang(), height: 178, start: DEMO.has('tour') ? null : st.toISOString(),
    done: { 1: ['drinks', 'walk', 'wake', 'kitchen'], 2: ['drinks', 'walk', 'wake', 'kitchen'], 3: ['drinks', 'plate', 'walk', 'circuit', 'wake', 'kitchen'],
      4: ['drinks', 'plate', 'walk', 'wake', 'kitchen'], 5: ['drinks', 'plate', 'walk', 'circuit', 'wake', 'kitchen'], 6: ['drinks', 'plate', 'walk', 'wake', 'kitchen'], 7: ['drinks', 'walk', 'wake'] },
    steps: { 1: 5200, 2: 6100, 3: 7900, 4: 8300, 5: 7650, 6: 8800, 7: 6420 }, waist: { 1: 96, 7: 94.5 } };
}
// Per gli screenshot del README (#demo&shot=3): niente animazioni, pagina ingrandita.
const still = isDemo && DEMO.has('shot');
if (still) { document.documentElement.classList.add('still'); document.documentElement.style.zoom = DEMO.get('shot') || 3; }
const save = () => { if (!isDemo) localStorage.setItem(KEY, JSON.stringify(S)); };
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
let tab = (isDemo && DEMO.get('tab')) || 'today', viewDay = null, ticks = new Set(), round = 1, rest = 0, timer = null, lastTab = null, popId = null, openEx = 0;
let slide = 0, startChoice = 'today', pickDate = '', heightVal = S.height ?? '';
const anim = {};
const $ = (id) => document.getElementById(id);
const I = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
  ruler: '<rect x="2.5" y="8" width="19" height="8" rx="2"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>',
  chart: '<path d="M5 20v-7M10 20V5M15 20v-10M20 20v-4"/>',
  watch: '<rect x="6.5" y="6" width="11" height="12" rx="3.5"/><path d="M9 6l.8-3h4.4L15 6M9 18l.8 3h4.4l.8-3M12 10v2.5l1.5 1"/>',
  food: '<path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M7 3v4M17 21V3c-2 1.5-3 4-3 7v3h3"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  chev: '<path d="m9 6 6 6-6 6"/>', back: '<path d="m15 6-6 6 6 6"/>',
  sync: '<path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3M4 4v4h4M20 20v-4h-4"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
  share: '<path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
};
const icon = (n) => `<svg class="i" viewBox="0 0 24 24">${I[n]}</svg>`;
const check = '<span class="ck"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>';
const setHue = (d) => { const [l, c, h] = DAY_COLORS[d - 1], s = document.documentElement.style; s.setProperty('--h', h); s.setProperty('--dl', l); s.setProperty('--dc', c); };

function commit(d, fn) {
  const before = S.start ? progress(d) : 0;
  fn();
  save();
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
  const P = Array.from({ length: 150 }, (_, i) => ({
    x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 14, vy: Math.random() * -14 - 4,
    r: Math.random() * 7 + 5, a: Math.random() * 6, va: (Math.random() - .5) * .4, c: dayColor(1 + (i % TOTAL), -0.1, 0.06),
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
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:oklch(1 0 0 / .45)" stroke-width="${stroke}"/>
    <circle data-to="${c * (1 - v)}" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:var(--on-day);transition:stroke-dashoffset 1s var(--ease)" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - from)}"/></svg>
    <div style="position:relative;text-align:center">${inner}</div></div>`;
};
const counter = (key, n, suffix = '') => { const from = still ? n : anim[key] ?? 0; anim[key] = n; return `<span data-count="${n}" data-from="${from}" data-suffix="${suffix}">${fmt(from)}${suffix}</span>`; };

function afterRender() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('[data-to]').forEach((el) => { el.style.strokeDashoffset = el.dataset.to; });
    document.querySelectorAll('[data-h]').forEach((el) => { el.style.height = el.dataset.h; });
    document.querySelectorAll('[data-w]').forEach((el) => { el.style.width = el.dataset.w; });
    document.querySelectorAll('[data-b]').forEach((el) => { el.style.bottom = el.dataset.b; });
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
function installBlock(onDay) {
  if (standalone()) return `<p class="lead">${t('installed')}</p>`;
  if (isIOS) return `<ol class="steps-list">${L().iosSteps.map((s) => `<li><span>${s}</span></li>`).join('')}</ol>
    ${isIOSSafari ? '' : `<p class="small" style="opacity:.8">${t('iosSafari')}</p>`}`;
  return `${installPrompt ? `<button class="btn" data-act="install" style="margin-top:16px;${onDay ? '' : 'background:var(--ink);color:var(--paper)'}">${t('installBtn')}</button>` : ''}
    <ol class="steps-list">${L().andSteps.map((s) => `<li><span>${s}</span></li>`).join('')}</ol>`;
}

const tourSlides = () => {
  const s = [
    `<div class="art"><div class="orbit">${Array.from({ length: TOTAL }, (_, i) => `<i style="--i:${i};--a:${i * (360 / TOTAL)}deg;--dcol:${dayColor(i + 1, -0.25, 0.06)}"></i>`).join('')}<span class="num">14</span></div></div>
     <h1>${L().t1[0]}</h1><p class="lead">${L().t1[1]}</p>`,
    `<div class="art"><div class="stack">${HABITS.filter((h) => h.id !== 'waist').map((h, i) => `<div style="--i:${i}"><span>${h.emoji}</span>${L().habits[h.id][0]}</div>`).join('')}</div></div>
     <h1>${L().t2[0]}</h1><p class="lead">${L().t2[1]}</p>`,
    `<div class="art"><svg class="lock" width="150" height="170" viewBox="0 0 150 170"><path d="M40 75V52a35 35 0 0 1 70 0v23"/><rect x="18" y="75" width="114" height="84" rx="22"/><path d="M75 108v20"/></svg></div>
     <h1>${L().t3[0]}</h1><p class="lead">${L().t3[1]}</p>`,
  ];
  if (!standalone()) s.push(`<div class="art" style="height:240px"><div class="phone"><span class="tile"></span><div class="bar"><span></span><span class="share">${icon('share')}</span><span></span></div></div></div>
     <h1>${L().t4[0]}</h1><p class="lead">${L().t4[1]}</p>${installBlock(true)}`);
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  s.push(`<h1>${L().t5[0]}</h1>
    <p class="lead" style="margin-bottom:18px">${L().t5[1]}</p>
    <div class="eyebrow" style="color:inherit;opacity:.7">${t('whenStart')}</div>
    <div class="opts">${['today', 'tomorrow', 'pick'].map((o) => `<button class="opt ${startChoice === o ? 'on' : ''}" data-act="choose" data-id="${o}">${t('start' + o[0].toUpperCase() + o.slice(1))}</button>`).join('')}</div>
    ${startChoice === 'pick' ? `<input type="date" id="pick" value="${pickDate}" min="${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}">` : ''}
    <div style="height:10px"></div>
    <input id="h" inputmode="decimal" placeholder="${t('heightPh')}" value="${heightVal}">
    <button class="btn" id="go" data-act="begin" style="margin-top:14px">${startChoice === 'today' ? t('begin') : t('ready')}</button>
    <p class="small" style="opacity:.7;margin-top:14px">${t('medical')}</p>`);
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
  if ((slide === n - 1) !== (i === n - 1)) { slide = i; return renderTour(); } // il pulsante Avanti appare/sparisce
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
    <div style="font-size:20px;font-weight:700">${n === 1 ? t('dayWord') : t('daysWord')}</div>
    <p class="muted">${t('startsOn', { d: dstr(startDate(), { weekday: 'long', day: 'numeric', month: 'long' }) })}</p></div>
  <div class="section"><h2>${t('getReady')}</h2></div>
  <div class="panel">${L().readyList.map((r, i) => `<div class="row"><span class="num" style="color:var(--strong)">${i + 1}</span><span class="grow">${r}</span></div>`).join('')}</div>
  <div style="height:16px"></div>
  <button class="btn ghost" data-act="startnow">${t('startNow')}</button>
  ${standalone() ? '' : `<div class="section"><h2>${t('install')}</h2></div>${installBlock(false)}`}`;
}

function todayPage() {
  const td = today(), d = viewDay ?? td, p = progress(d), hs = habitsFor(d);
  const goal = stepTarget(d, S.steps), st = S.steps[d] ?? 0, doneN = hs.filter((h) => isDone(d, h.id)).length;
  setHue(d);
  const cheer = L().cheer[p >= 1 ? 3 : p >= .6 ? 2 : p > 0 ? 1 : 0];
  const journey = Array.from({ length: TOTAL }, (_, i) => {
    const n = i + 1, pp = n <= td ? progress(n) : 0;
    return `<button class="${n === d ? 'sel' : ''} ${n > td ? 'future' : ''}" data-act="day" data-id="${n}" ${n > td ? 'disabled' : ''} style="--dcol:${dayColor(n, -0.3, 0.05)}" aria-label="${t('day')} ${n}"><i data-h="${pp * 100}%" style="height:0"></i></button>`;
  }).join('');
  const sub = (h) => h.id === 'waist' && S.waist[d] != null ? `${num(S.waist[d])} cm` : L().habits[h.id][1];
  return `<div class="bar-top">
      <div class="grow"><div class="eyebrow">${d === td ? t('today') : t('past')}</div><div style="font-weight:650">${dstr(dateOf(d), { weekday: 'long', day: 'numeric', month: 'long' })}</div></div>
      ${isIOS ? `<button class="icon-btn" data-act="sync" aria-label="${t('sync')}">${icon('watch')}</button>` : ''}
      <button class="icon-btn" data-act="tab" data-id="settings" aria-label="${t('settings')}">${icon('gear')}</button>
    </div>
    <div class="hero">
      <div class="eyebrow" style="color:inherit;opacity:.65">${t('day')}</div>
      <div class="num big">${String(d).padStart(2, '0')}<small>/${TOTAL}</small></div>
      <div class="meta"><div class="cheer">${cheer}</div>
        <div class="count"><b class="num">${counter('pct', Math.round(p * 100), '%')}</b>${t('doneOf', { a: doneN, b: hs.length })}</div></div>
      <div class="journey">${journey}</div>
    </div>
    <div class="steps">
      <div><div class="eyebrow">${t('steps')} · ${goal == null ? t('observe') : isDone(d, 'steps') ? t('goalHit') + ' ✓' : t('goal', { n: fmt(goal) })}</div>
        <div class="num val">${counter('st', st)} <small>${t('stepsUnit')}</small></div></div>
      <div class="chips">${isIOS ? `<button class="chip solid" data-act="sync">${icon('sync')}${t('sync')}</button>` : ''}<button class="chip" data-act="steps">${icon('pen')}${t('manual')}</button></div>
      <div class="track"><i data-w="${goal ? Math.min(st / goal, 1) * 100 : st ? 100 : 0}%"></i></div>
      ${isAndroid ? `<p class="small muted" style="grid-column:1/-1;margin:6px 0 0">${t('androidNote')}</p>` : ''}
    </div>
    <div class="section"><h2>${t('plan')}</h2><span class="muted small">${doneN}/${hs.length}</span></div>
    <div>${hs.filter((h) => h.id !== 'steps').map((h) => `
      <button class="habit ${isDone(d, h.id) ? 'done' : ''} ${popId === h.id ? 'pop' : ''}" data-act="habit" data-id="${h.id}">
        <span class="em">${h.emoji}</span><span class="grow"><div class="t">${L().habits[h.id][0]}</div><div class="s">${sub(h)}</div></span>${check}
      </button>`).join('')}</div>
    <div class="note"><span class="q">“</span><div><div class="eyebrow">${t('note')}</div><p>${L().tips[d - 1]}</p></div></div>`;
}

function circuitPage() {
  const td = today(), isDay = CIRCUIT_DAYS.includes(td), next = CIRCUIT_DAYS.find((x) => x >= td);
  const all = ticks.size === CIRCUIT_REPS.length * 3, logged = isDone(td, 'circuit');
  const inRound = (r) => CIRCUIT_REPS.filter((_, i) => ticks.has(`${r}:${i}`)).length;
  const p = ticks.size / (CIRCUIT_REPS.length * 3);
  setHue(td);
  return `<div class="bar-top"><div class="grow"><h1>${t('circuitT')}</h1><div class="muted">${isDay ? t('circuitToday') : next ? t('circuitNext', { n: next }) : t('circuitOver')}</div></div></div>
  <div class="hero" style="display:flex;align-items:center;gap:16px">
    <div class="grow">${rest > 0
      ? `<h1>${t('rest')}</h1><p style="margin:6px 0 12px">${t('restSub')}</p><button class="chip solid" data-act="stoprest">${t('skip')}</button>`
      : `<h1>${t('rounds')}</h1><p style="margin:6px 0 0">${t('roundsSub')}</p>`}</div>
    ${rest > 0 ? ring('rest', rest / 90, 96, 9, `<div class="num" style="font-size:28px">${rest}</div>`)
      : ring('circ', p, 96, 9, `<div class="num" style="font-size:22px">${counter('cp', Math.round(p * 100), '%')}</div>`)}
  </div>
  <div class="seg">${[1, 2, 3].map((r) => `<button class="${r === round ? 'on' : ''}" data-act="round" data-id="${r}">${t('round')} ${r} · ${inRound(r)}/5</button>`).join('')}</div>
  <div>${L().circuit.map(([name, tip, how], i) => {
    const id = `${round}:${i}`, q = encodeURIComponent(`${name} ${S.lang === 'it' ? 'esercizio corpo libero' : 'bodyweight exercise form'}`);
    return `<div class="ex ${openEx === i ? 'open' : ''}">
      <div class="ex-head">
        <button class="ex-open" data-act="openex" data-id="${i}" aria-expanded="${openEx === i}">
          <span class="n num">${i + 1}</span><span class="grow"><div class="t">${name}</div><div class="small muted">${CIRCUIT_REPS[i]}</div></span>${icon('chev').replace('class="i"', 'class="i chev"')}
        </button>
        <button class="${ticks.has(id) ? 'done' : ''} ${popId === id ? 'pop' : ''}" data-act="tick" data-id="${id}" aria-label="${name}">${check}</button>
      </div>
      <div class="ex-body"><div><div class="ex-inner">
        <div class="fig-wrap">${figure(i)}</div>
        <ol>${how.map((s) => `<li>${s}</li>`).join('')}</ol>
        <div class="links"><span class="small muted">${tip}</span><a href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener noreferrer">${t('video')} ↗</a></div>
      </div></div></div>
    </div>`;
  }).join('')}</div>
  ${round < 3 && inRound(round) === 5 && rest === 0 ? `<button class="btn" style="margin-top:14px" data-act="rest">${t('restBtn', { n: round + 1 })}</button>` : ''}
  ${isDay && round === 3 ? `<button class="btn" style="margin-top:14px" data-act="logcircuit" ${all && !logged ? '' : 'disabled'}>${logged ? t('circuitDone') : t('logCircuit')}</button>` : ''}`;
}

function measurePage() {
  const td = today(), h = S.height || 170;
  const last = [...WAIST_DAYS].reverse().map((x) => S.waist[x]).find((x) => x != null);
  const first = S.waist[1], ratio = last != null ? last / h : null;
  setHue(td);
  return `<div class="bar-top"><div class="grow"><h1>${t('measure')}</h1><div class="muted">${t('measureSub')}</div></div></div>
  <div class="panel trio">
    <div><div class="eyebrow">${t('start')}</div><div class="num">${first != null ? num(first) : '–'}<small> cm</small></div></div>
    <div><div class="eyebrow">${t('target')}</div><div class="num">${Math.round(h / 2)}<small> cm</small></div></div>
    <div><div class="eyebrow">${t('now')}</div><div class="num" style="color:${ratio == null ? 'inherit' : ratio < .5 ? 'var(--good)' : 'var(--warn)'}">${last != null ? num(last) : '–'}<small> cm</small></div></div>
  </div>
  <p style="margin:12px 4px 0">${ratio == null ? t('ratioNone') : ratio < .5 ? t('ratioGood') : t('ratioHigh', { n: Math.round(h / 2) })}
    ${first != null && last != null && last !== first ? `<b style="color:${last < first ? 'var(--good)' : 'var(--warn)'}">${t('fromDay1', { s: last < first ? '−' : '+', n: num(Math.abs(last - first)) })}</b>` : ''}</p>
  <div class="section"><h2>${t('entries')}</h2></div>
  <div class="panel">${WAIST_DAYS.map((x) => `<button class="row" data-act="waist" data-id="${x}" ${x <= td ? '' : 'disabled'}>
      <span class="num" style="width:28px;color:var(--strong)">${x}</span>
      <span class="grow"><div class="t">${t('day')} ${x}</div><div class="s">${S.waist[x] != null ? num(S.waist[x]) + ' cm' : x <= td ? t('tapToAdd') : dstr(dateOf(x), { day: 'numeric', month: 'short' })}</div></span>${icon('chev')}</button>`).join('')}</div>
  <p class="small muted" style="margin:10px 4px 0">${t('howTo')}</p>`;
}

function progressPage() {
  const td = today();
  const vals = Array.from({ length: TOTAL }, (_, i) => (i + 1 <= td ? progress(i + 1) : 0));
  const avg = vals.slice(0, td).reduce((a, b) => a + b, 0) / td;
  const full = vals.filter((v) => v >= 1).length;
  const totSteps = Object.values(S.steps).reduce((a, b) => a + b, 0);
  setHue(td);
  return `<div style="text-align:center;padding-top:8px"><div class="eyebrow">${t('progress')}</div>
    <h1 class="serif" style="font-size:30px;margin-top:8px">${t('progressT')}</h1></div>
  <div class="panel chart">
    <div class="eyebrow" style="margin-bottom:12px">${t('spectrum')}</div>
    <div class="bars">${vals.map((v, i) => `<div class="b ${i + 1 > td ? 'future' : ''} ${i + 1 === td ? 'sel' : ''}" style="--dcol:${dayColor(i + 1, -0.1, 0.05)}" data-h="${Math.max(v * 100, 3)}%"></div>`).join('')}
      <div class="avg" data-b="${avg * 100}%"><b>⌀ ${Math.round(avg * 100)}%</b></div></div>
    <div class="xl">${vals.map((_, i) => `<span class="${i + 1 === td ? 'on' : ''}">${i + 1}</span>`).join('')}</div>
  </div>
  <div class="panel trio">
    <div><div class="eyebrow">${t('streak')}</div><div class="num">${counter('sk', streak())}</div></div>
    <div><div class="eyebrow">${t('complete')}</div><div class="num">${full}<small>/${TOTAL}</small></div></div>
    <div><div class="eyebrow">${t('totalSteps')}</div><div class="num" style="font-size:20px">${counter('ts', totSteps)}</div></div>
  </div>
  <p class="serif muted" style="text-align:center;font-style:italic;margin-top:26px;font-size:17px">${t('quote')}</p>`;
}

function foodPage() {
  const td = today();
  setHue(td);
  const slice = (d, hue, cls) => `<path d="${d}" class="sl ${cls}" style="fill:oklch(0.86 0.09 ${hue})"/>`;
  const label = (x, y, txt) => `<text x="${x}" y="${y}" text-anchor="middle">${txt}</text>`;
  return `<div class="bar-top"><div class="grow"><h1>${t('food')}</h1><div class="muted">${t('foodSub')}</div></div></div>
  <div class="plate-wrap">
    <svg class="plate" viewBox="0 0 220 210" role="img" aria-label="${t('plateT')}">
      <circle cx="100" cy="105" r="96" class="rim"/>
      ${slice('M100,105 L100,19 A86,86 0 0 1 100,191 Z', 140, 's1')}
      ${slice('M100,105 L14,105 A86,86 0 0 1 100,19 Z', 30, 's2')}
      ${slice('M100,105 L100,191 A86,86 0 0 1 14,105 Z', 80, 's3')}
      <circle cx="190" cy="34" r="17" class="sl s4" style="fill:oklch(0.88 0.1 100)"/>
      ${label(146, 110, t('veg'))}${label(62, 76, t('protein'))}${label(62, 146, t('carbs'))}${label(190, 66, t('fat'))}
    </svg>
  </div>
  <div class="section"><h2>${t('plateT')}</h2></div>
  <div>${L().portions.map(([h, name, size, ex]) => `<div class="habit" style="cursor:default">
      <span class="em" style="font-size:18px">${h}</span>
      <span class="grow"><div class="t">${name} <span class="muted" style="font-weight:500">· ${size}</span></div><div class="s">${ex}</div></span></div>`).join('')}</div>
  <div class="note"><span class="q">“</span><div><div class="eyebrow">${t('orderT')}</div><p>${t('orderB')}</p></div></div>
  <div class="section"><h2>${t('menuT')}</h2></div>
  <p class="muted" style="margin:0 2px 12px">${t('menuB')}</p>
  <div class="panel">${L().meals.map(([meal, opts]) => `<div class="row" style="align-items:flex-start">
      <span class="eyebrow" style="width:84px;padding-top:2px">${meal}</span>
      <span class="grow">${opts.map((o) => `<div class="t" style="margin-bottom:4px">${o}</div>`).join('')}</span></div>`).join('')}</div>
  <div class="tips2">${L().extras.map(([e, h, b]) => `<div><span style="font-size:22px">${e}</span><div class="t">${h}</div><p>${b}</p></div>`).join('')}</div>`;
}

function settingsPage() {
  setHue(today());
  const h = S.height || 170, sd = startDate();
  const ymd = `${sd.getFullYear()}-${String(sd.getMonth() + 1).padStart(2, '0')}-${String(sd.getDate()).padStart(2, '0')}`;
  return `<div class="bar-top"><button class="icon-btn" data-act="tab" data-id="today" aria-label="${t('back')}">${icon('back')}</button><h1 class="grow">${t('settings')}</h1></div>
  <div class="section" style="margin-top:12px"><h2>${t('language')}</h2></div>
  <div class="seg">${Object.entries(LANGS).map(([k, v]) => `<button class="${k === S.lang ? 'on' : ''}" data-act="setlang" data-id="${k}">${v}</button>`).join('')}</div>
  <div class="section"><h2>${t('challenge')}</h2></div>
  <div class="panel">
    <button class="row" data-act="height"><span class="grow"><div class="t">${t('height')}</div><div class="s">${Math.round(h)} cm</div></span>${icon('chev')}</button>
    <label class="row"><span class="grow"><div class="t">${t('startDate')}</div><div class="s">${dstr(sd, { weekday: 'long', day: 'numeric', month: 'long' })}</div></span>
      <input type="date" id="startSel" value="${ymd}" class="date-mini"></label>
  </div>
  <div class="section"><h2>${t('app')}</h2></div>
  <div class="panel">
    <button class="row" data-act="tab" data-id="install"><span class="grow"><div class="t">${t('install')}</div><div class="s">${standalone() ? t('installed') : t('installSub')}</div></span>${icon('chev')}</button>
    ${isIOS ? `<button class="row" data-act="guide"><span class="grow"><div class="t">${t('watch')}</div><div class="s">${t('watchSub')}</div></span>${icon('chev')}</button>` : ''}
  </div>
  <div class="section"><h2>${t('privacy')}</h2></div>
  <p class="muted" style="margin:0 4px">${L().t3[1]}</p>
  <div style="height:20px"></div>
  <div class="panel"><button class="row" data-act="reset"><span class="grow"><div class="t" style="color:var(--warn)">${t('reset')}</div><div class="s">${t('resetSub')}</div></span>${icon('chev')}</button></div>`;
}

const sub = (title, body) => `<div class="bar-top"><button class="icon-btn" data-act="tab" data-id="settings" aria-label="${t('back')}">${icon('back')}</button><h1 class="grow" style="font-size:22px">${title}</h1></div>${body}`;
const PAGES = {
  today: todayPage, settings: settingsPage, food: foodPage, circuit: circuitPage, measure: measurePage, progress: progressPage,
  guide: () => sub(t('guideT'), `<div class="guide">${t('guide')}</div>`),
  install: () => sub(t('install'), `<div class="tour" style="position:static;border-radius:28px;margin-top:12px;padding:20px"><div class="slide play" style="padding:0">
      <div class="art" style="height:240px"><div class="phone"><span class="tile"></span><div class="bar"><span></span><span class="share">${icon('share')}</span><span></span></div></div></div>
      <h1 style="font-size:28px">${L().t4[0]}</h1><p class="lead">${L().t4[1]}</p>${installBlock(true)}</div></div>`),
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
  const navOn = ['guide', 'install', 'settings'].includes(tab) ? '' : tab;
  nav.innerHTML = NAV.map(([id, ic]) => `<button class="${id === navOn ? 'on' : ''}" data-tab="${id}" aria-label="${id}">${icon(ic)}</button>`).join('');
  popId = null;
  afterRender();
}

// ── Azioni ─────────────────────────────────────────────────
document.addEventListener('input', (e) => {
  if (e.target.id === 'h') { heightVal = e.target.value; validateTour(); }
  if (e.target.id === 'pick') { pickDate = e.target.value; validateTour(); }
});
document.addEventListener('change', (e) => {
  if (e.target.id === 'startSel' && e.target.value) { const [y, m, dd] = e.target.value.split('-').map(Number); commit(1, () => { S.start = new Date(y, m - 1, dd).toISOString(); }); }
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
    case 'setlang': return commit(today(), () => { S.lang = id; });
    case 'lang': S.lang = id; save(); return render();
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
        save(); render();
      }, { once: true });
    }
  }
});

// Al ritorno sull'app (anche dopo mezzanotte) ricalcola il giorno.
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.start) render(); });
// Quando arriva una versione nuova dell'app, ricarica una volta: mai file vecchi e nuovi insieme.
if ('serviceWorker' in navigator) {
  const had = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (had) location.reload(); });
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' });
}
history.scrollRestoration = 'manual';
render();
