// node test.mjs
import assert from 'node:assert/strict';
import { dayOf, stepTarget, habitsFor, daysUntil, hueOf, dayColor, DAY_COLORS } from './challenge.js';
import { STR } from './i18n.js';

const s = new Date(2026, 0, 1, 23);
assert.equal(dayOf(s, new Date(2026, 0, 1, 8)), 1);
assert.equal(dayOf(s, new Date(2026, 0, 2, 0, 5)), 2);
assert.equal(dayOf(s, new Date(2026, 2, 29)), 14); // dopo il cambio ora legale
assert.equal(daysUntil(new Date(2026, 0, 3), new Date(2026, 0, 1, 23)), 2);
assert.equal(daysUntil(new Date(2026, 0, 1), new Date(2026, 0, 5)), 0);

const st = { 1: 4000, 2: 6000 };
assert.equal(stepTarget(2, st), null);
assert.equal(stepTarget(3, st), 7000);
assert.equal(stepTarget(6, st), 8000);
assert.equal(stepTarget(10, st), 9000);
assert.equal(stepTarget(10, { 1: 9000 }), 10000);
assert.equal(stepTarget(3, { 1: 12000 }), 12000);

const ids = (d) => habitsFor(d).map((h) => h.id);
assert.ok(ids(1).includes('waist') && !ids(1).includes('plate'));
assert.ok(ids(3).includes('plate') && ids(3).includes('circuit'));
assert.ok(!ids(4).includes('circuit'));
assert.equal(hueOf(1), 30); assert.equal(DAY_COLORS.length, 14); assert.match(dayColor(3, -0.2), /^oklch\(0\.720 /);

// ogni lingua ha le stesse chiavi dell'inglese
for (const [l, o] of Object.entries(STR)) for (const k of Object.keys(STR.en)) assert.ok(k in o, `${l} manca ${k}`);
assert.equal(STR.it.tips.length, 14);
console.log('ok');
