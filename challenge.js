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

/** Tinta OKLCH del giorno: i 14 giorni percorrono la ruota dei colori. */
export const hueOf = (day) => Math.round(25 + (day - 1) * (300 / (TOTAL - 1)));

export const CIRCUIT_REPS = ['12–20', '6–15', '8–12', '10–15', '20–40 s'];

/** Giorni mancanti all'inizio (0 se è già iniziata). */
export function daysUntil(start, now) {
  const a = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((a - b) / 864e5));
}
