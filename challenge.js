// Regole della sfida di 14 giorni (logica pura, niente testi: quelli sono in i18n.js).
export const TOTAL = 14;
export const CIRCUIT_DAYS = [3, 5, 8, 10, 12];
export const WAIST_DAYS = [1, 7, 14];

export const HABITS = [
  ['drinks', '💧'], ['plate', '🥗'], ['walk', '🚶'], ['steps', '👟'],
  ['circuit', '💪'], ['wake', '⏰'], ['kitchen', '🌙'], ['waist', '📏'],
].map(([id, emoji]) => ({ id, emoji }));

export const habitsFor = (day) =>
  HABITS.filter((h) =>
    h.id === 'plate' ? day >= 3
    : h.id === 'circuit' ? CIRCUIT_DAYS.includes(day)
    : h.id === 'waist' ? WAIST_DAYS.includes(day)
    : true);

/** Giorno della sfida (1..14), a mezzanotte locale. */
export function dayOf(start, now) {
  const a = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = Math.round((b - a) / 864e5) + 1;
  return Math.min(Math.max(d, 1), TOTAL);
}

/** Media passi giorni 1–2, null se non inseriti. */
export function baseline(steps) {
  const v = [steps[1], steps[2]].filter((x) => x != null);
  return v.length ? Math.floor(v.reduce((a, b) => a + b) / v.length) : null;
}

/** null nei giorni 1–2; +2000 dal 3, +1000 al 6 e al 10, tetto 10.000; chi è sopra resta. */
export function stepTarget(day, steps) {
  if (day <= 2) return null;
  const base = baseline(steps) ?? 5000; // ponytail: 5000 se non hai contato i passi nei giorni 1–2
  const bonus = day >= 10 ? 4000 : day >= 6 ? 3000 : 2000;
  return base >= 10000 ? base : Math.min(base + bonus, 10000);
}

/** Palette dei 14 giorni, scelta a mano: [luminosità, intensità, tinta] OKLCH. */
export const DAY_COLORS = [
  [0.85, 0.09, 30],  // corallo
  [0.87, 0.09, 60],  // albicocca
  [0.92, 0.09, 95],  // burro
  [0.9, 0.09, 130],  // pistacchio
  [0.88, 0.08, 165], // menta
  [0.88, 0.07, 205], // acqua
  [0.85, 0.08, 245], // cielo
  [0.84, 0.08, 278], // pervinca
  [0.84, 0.09, 305], // lavanda
  [0.85, 0.09, 330], // orchidea
  [0.86, 0.08, 355], // rosa
  [0.84, 0.09, 15],  // rosa antico
  [0.88, 0.07, 50],  // pesca
  [0.89, 0.1, 85],   // oro, traguardo
];
export const hueOf = (day) => DAY_COLORS[day - 1][2];
/** Colore del giorno; dl scurisce (negativo) o schiarisce. */
export const dayColor = (day, dl = 0, dc = 0) => { const [l, ch, h] = DAY_COLORS[day - 1]; return `oklch(${(l + dl).toFixed(3)} ${(ch + dc).toFixed(3)} ${h})`; };

export const CIRCUIT_REPS = ['12–20', '6–15', '8–12', '10–15', '20–40 s'];

/** Giorni mancanti all'inizio (0 se è già iniziata). */
export function daysUntil(start, now) {
  const a = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((a - b) / 864e5));
}
