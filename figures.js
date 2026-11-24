// Figurine animate degli esercizi: due pose per esercizio, interpolate con SVG <animate>.
// Punti: h testa, n collo, p bacino, k/f ginocchio/piede, k2/f2 l'altra gamba, e gomito, w mano.
const P = (h, n, p, k, f, k2, f2, e, w) => ({ h, n, p, k, f, k2: k2 || k, f2: f2 || f, e, w });

const POSES = [
  // squat
  [P([80, 15], [80, 26], [80, 56], [81, 78], [80, 100], 0, 0, [80, 40], [81, 54]),
   P([83, 37], [78, 48], [60, 72], [82, 76], [80, 100], 0, 0, [92, 47], [106, 47])],
  // piegamenti
  [P([121, 67], [110, 72], [70, 84], [49, 90], [28, 96], 0, 0, [110, 85], [110, 98]),
   P([121, 83], [110, 86], [70, 91], [49, 93.5], [28, 96], 0, 0, [100, 94], [110, 98])],
  // affondi
  [P([80, 15], [80, 26], [80, 56], [81, 78], [82, 100], [79, 78], [78, 100], [80, 40], [80, 54]),
   P([78, 32], [78, 43], [78, 73], [99, 77], [100, 100], [70, 94], [50, 98], [78, 57], [79, 70])],
  // rematore con asciugamano (porta a sinistra)
  [P([98, 36], [92, 46], [72, 72], [62, 86], [52, 100], 0, 0, [78, 47.6], [64, 49]),
   P([80, 34], [76, 44], [64, 72], [58, 86], [52, 100], 0, 0, [86, 54], [70, 48])],
  // plank
  [P([124, 74], [112, 78], [72, 85], [48, 91], [26, 97], 0, 0, [112, 98], [130, 98]),
   P([124, 75], [112, 79], [72, 87], [48, 92], [26, 97], 0, 0, [112, 98], [130, 98])],
];
const SEG = [['n', 'p'], ['p', 'k2'], ['k2', 'f2'], ['p', 'k'], ['k', 'f'], ['n', 'e'], ['e', 'w']];
const DUR = ['2.4s', '2.4s', '3s', '2.4s', '4s'];

export function figure(i) {
  const [A, B] = POSES[i], dur = DUR[i];
  const anim = (attr, a, b) => `<animate attributeName="${attr}" values="${a};${b};${a}" dur="${dur}" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/>`;
  const line = ([s, t], back) => `<line x1="${A[s][0]}" y1="${A[s][1]}" x2="${A[t][0]}" y2="${A[t][1]}" class="${back ? 'back' : ''}">
    ${anim('x1', A[s][0], B[s][0])}${anim('y1', A[s][1], B[s][1])}${anim('x2', A[t][0], B[t][0])}${anim('y2', A[t][1], B[t][1])}</line>`;
  const extra = i === 3
    ? `<line x1="16" y1="14" x2="16" y2="100" class="prop"/><circle cx="20" cy="54" r="2.5" class="propdot"/>
       <line x1="20" y1="54" x2="${A.w[0]}" y2="${A.w[1]}" class="towel">${anim('x2', A.w[0], B.w[0])}${anim('y2', A.w[1], B.w[1])}</line>`
    : '';
  return `<svg class="fig" viewBox="0 0 150 106" aria-hidden="true">
    <line x1="4" y1="101" x2="146" y2="101" class="floor"/>${extra}
    ${SEG.map((s, j) => line(s, j === 1 || j === 2)).join('')}
    <circle cx="${A.h[0]}" cy="${A.h[1]}" r="8" class="head">${anim('cx', A.h[0], B.h[0])}${anim('cy', A.h[1], B.h[1])}</circle>
  </svg>`;
}
