// Disegni schematici degli esercizi: figure stilizzate in SVG, tutte nello stesso stile,
// generate da una posa (angoli delle articolazioni) e da pochi oggetti di scena
// (palla, elastico, superficie instabile, bersaglio). Ogni esercizio ha una o due
// immagini (partenza e posizione finale). Le immagini non sono foto: servono a far
// capire la posizione, il testo dell'esercizio resta la guida.
import { exerciseLibrary } from './exerciseLibrary.js';

const G = 146; // linea del pavimento
const L = { to: 40, ua: 18, fa: 17, th: 30, sh: 28, ne: 5, hr: 7, ft: 7 };
const rad = (d) => (d * Math.PI) / 180;
const pt = (p, len, deg) => [p[0] + len * Math.cos(rad(deg)), p[1] - len * Math.sin(rad(deg))];
const n1 = (n) => Math.round(n * 10) / 10;
const pts = (a) => a.map((p) => `${n1(p[0])},${n1(p[1])}`).join(' ');
const poly = (a, cls) => `<polyline class="${cls}" points="${pts(a)}"/>`;
const deg = (r) => (r * 180) / Math.PI;

// ------------------------------------------------------------------ corpo
function body(p) {
  const j = {};
  j.pelvis = p.pelvis;
  j.sh = pt(p.pelvis, L.to, p.torso);
  const hd = p.headDir ?? p.torso;
  j.neck = pt(j.sh, L.ne, hd);
  j.head = pt(j.neck, L.hr, hd);
  const sN = p.front ? [j.sh[0] + 8, j.sh[1]] : j.sh;
  const sF = p.front ? [j.sh[0] - 8, j.sh[1]] : j.sh;
  const hN = p.front ? [j.pelvis[0] + 5, j.pelvis[1]] : j.pelvis;
  const hF = p.front ? [j.pelvis[0] - 5, j.pelvis[1]] : j.pelvis;
  const arm = (a, from) => {
    if (!a) return null;
    if (a.reach) {
      const ang = deg(Math.atan2(from[1] - a.reach[1], a.reach[0] - from[0]));
      const e = pt(from, L.ua, ang);
      return [from, e, pt(e, L.fa, ang)];
    }
    const e = pt(from, L.ua, a[0]);
    return [from, e, pt(e, L.fa, a[1])];
  };
  const leg = (l, from) => {
    if (!l) return null;
    const k = pt(from, L.th, l[0]);
    const a = pt(k, L.sh, l[1]);
    return [from, k, a, p.front ? pt(a, L.ft, l[0] < 270 ? 200 : 340) : pt(a, L.ft, l[1] + 90)];
  };
  const aN = arm((p.arms || [])[0], sN);
  const aF = arm((p.arms || [])[1], sF);
  const lN = leg((p.legs || [])[0], hN);
  const lF = leg((p.legs || [])[1], hF);
  j.handN = aN && aN[2]; j.elbowN = aN && aN[1]; j.handF = aF && aF[2];
  j.footN = lN && lN[2]; j.footF = lF && lF[2]; j.kneeN = lN && lN[1];
  j.shN = sN;
  let s = '';
  if (aF) s += poly(aF, 'fx-b fx-far');
  if (lF) s += poly(lF, 'fx-b fx-far');
  s += poly([j.pelvis, j.sh, j.neck], 'fx-b');
  if (p.front) s += poly([sF, sN], 'fx-b') + poly([hF, hN], 'fx-b');
  if (lN) s += poly(lN, 'fx-b');
  s += `<circle class="fx-head" cx="${n1(j.head[0])}" cy="${n1(j.head[1])}" r="${L.hr}"/>`;
  if (aN) s += poly(aN, 'fx-b');
  return { s, j };
}

// ------------------------------------------------------------------- scena
const ball = (c, r = 14) => `<circle class="fx-prop fx-ball" cx="${n1(c[0])}" cy="${n1(c[1])}" r="${r}"/><path class="fx-prop" d="M${n1(c[0] - r * 0.6)},${n1(c[1] - r * 0.6)} q${n1(r * 0.5)},${n1(r * 0.55)} ${n1(r * 0.05)},${n1(r * 1.1)}"/>`;
const pad = (x, y, w = 34) => `<path class="fx-fill" d="M${n1(x - w / 2)},${n1(y)} A${n1(w / 2)},9 0 0 1 ${n1(x + w / 2)},${n1(y)} Z"/>`;
const band = (a, b) => `<line class="fx-acc fx-dash" x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}"/>`;
const arrow = (a, b) => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const h = (da) => [b[0] - 6 * Math.cos(ang + da), b[1] - 6 * Math.sin(ang + da)];
  const h1 = h(0.5); const h2 = h(-0.5);
  return `<line class="fx-acc" x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}"/><polyline class="fx-acc" points="${pts([h1, b, h2])}"/>`;
};
const arrow2 = (a, b) => arrow(a, b) + arrow(b, a);
const dot = (p, r = 4) => `<circle class="fx-dot" cx="${n1(p[0])}" cy="${n1(p[1])}" r="${r}"/>`;
const wall = (x) => `<line class="fx-wall" x1="${x}" y1="14" x2="${x}" y2="${G}"/>` + [30, 50, 70, 90, 110, 130].map((y) => `<line class="fx-wall" x1="${x}" y1="${y}" x2="${x + 7}" y2="${y - 7}"/>`).join('');
const target = (x, y) => `<circle class="fx-prop" cx="${x}" cy="${y}" r="9"/><circle class="fx-prop" cx="${x}" cy="${y}" r="4"/>`;
const laser = (a, b) => `<line class="fx-acc fx-dash" x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}"/>`;
const bottle = (h) => `<rect class="fx-prop fx-fillrect" x="${n1(h[0] - 3)}" y="${n1(h[1] - 11)}" width="6" height="12" rx="2"/>`;
const towel = (p) => `<rect class="fx-fill" x="${n1(p[0] - 4)}" y="${n1(p[1] - 6)}" width="8" height="12" rx="2"/>`;
const eyesClosed = (h) => `<path class="fx-acc" d="M${n1(h[0] + 1)},${n1(h[1] - 1)} q3,3 6,0"/>`;
const circ = (c, r = 11) => `<path class="fx-acc" d="M${n1(c[0] + r)},${n1(c[1])} A${r},${r} 0 1 1 ${n1(c[0] + r * 0.2)},${n1(c[1] - r * 0.98)}"/><polyline class="fx-acc" points="${pts([[c[0] + r * 0.2 - 1, c[1] - r * 0.98 - 5], [c[0] + r * 0.2 + 3, c[1] - r * 0.98], [c[0] + r * 0.2 - 3, c[1] - r * 0.98 + 3]])}"/>`;
const motion = (p) => [-6, 0, 6].map((d) => `<line class="fx-acc" x1="${n1(p[0] + d)}" y1="${n1(p[1] + 4)}" x2="${n1(p[0] + d)}" y2="${n1(p[1] + 11)}"/>`).join('');

// ------------------------------------------------------------------ pose
const stand = (x = 100, o = {}) => ({ pelvis: [x, G - 58], torso: 90, legs: [[270, 270], [270, 270]], arms: [[282, 285], null], ...o });
const stag = [[285, 262], [250, 268]]; // gamba opposta avanti
const lift = [[320, 265], [270, 270]]; // gamba del lato infortunato sollevata
const seat = (x = 92, o = {}) => ({ pelvis: [x, G - 28], torso: 90, legs: [[0, 270], [0, 270]], arms: [[282, 285], null], ...o });
const seatBall = (x = 92) => ball([x, G - 14]);
const supine = (o = {}) => ({ pelvis: [140, G - 6], torso: 180, legs: [[55, 305], [55, 305]], arms: [[90, 90], null], ...o });
const proneLie = (o = {}) => ({ pelvis: [135, G - 6], torso: 180, legs: [[0, 0], [0, 0]], arms: [[355, 355], null], ...o });
const front = (o = {}) => ({ front: true, pelvis: [100, G - 58], torso: 90, legs: [[262, 270], [278, 270]], arms: [[0, 90], [270, 270]], ...o });

// Corpo in appoggio sulle mani: spalla a altezza s, piedi a toeH oppure bacino su palla (pelvisY).
function prone(hx, s, o = {}) {
  const sh = [hx, G - s];
  let a; let pelvis;
  if (o.pelvisY != null) { pelvis = [0, o.pelvisY]; a = Math.asin(Math.max(-1, Math.min(1, (pelvis[1] - sh[1]) / L.to))); pelvis[0] = sh[0] - L.to * Math.cos(a); }
  else { a = Math.asin((s - (o.toeH ?? 0)) / (L.to + L.th + L.sh + L.ft * 0)); pelvis = [sh[0] - L.to * Math.cos(a), sh[1] + L.to * Math.sin(a)]; }
  const ang = deg(a);
  return { pelvis, torso: ang, legs: [[ang + 180, ang + 180], [ang + 180, ang + 180]], arms: o.arms || [[270, 270], null], headDir: o.headDir };
}
const quad = (hx, o = {}) => {
  const sh = [hx, G - 35];
  const a = Math.asin(5 / L.to);
  return { pelvis: [sh[0] - L.to * Math.cos(a), G - 30], torso: deg(a), legs: [[270, 180], [270, 180]], arms: o.arms || [[270, 270], null] };
};

// ------------------------------------------------------------ definizioni
const D = {};
const def = (id, ...frames) => { D[id] = frames; };
const fr = (pose, extra) => ({ pose, extra });

const S = (n) => 'spalla-sinex-' + n;

// 1 - controllo scapolare
def(S('1a'),
  fr(proneLie(), () => ''),
  fr(proneLie(), (j) => dot([j.sh[0] + 2, j.sh[1] - 7], 4) + arrow([j.sh[0] + 4, j.sh[1] - 13], [j.sh[0] + 18, j.sh[1] - 13])));
def(S('1b'),
  fr(seat(), (j) => seatBall(92) + arrow([j.head[0] + 2, j.head[1] - 14], [j.head[0] - 12, j.head[1] - 14])),
  fr(seat(), (j) => seatBall(92) + arrow([j.head[0] - 2, j.head[1] - 14], [j.head[0] + 12, j.head[1] - 14])));
def(S('1c'),
  fr(seat(), () => seatBall()),
  fr(seat(92, { arms: [[80, 80], [80, 80]] }), () => seatBall()));
def(S('1d'),
  fr(seat(92, { legs: [[10, 300], [0, 270]] }), () => seatBall()),
  fr(seat(92, { legs: [[10, 300], [0, 270]], arms: [[80, 80], [80, 80]] }), () => seatBall()));
def(S('1e'),
  fr(seat(92, { legs: [[10, 300], [0, 270]] }), (j) => seatBall() + band(j.footF, j.sh)),
  fr(seat(92, { legs: [[10, 300], [0, 270]], arms: [[80, 80], [80, 80]] }), (j) => seatBall() + band(j.footF, j.handN)));
def(S('1f'),
  fr(stand(90), (j) => band(j.footF, j.handN)),
  fr(stand(90, { arms: [[80, 80], [100, 100]] }), (j) => band(j.footF, j.handN)));
def(S('1g'),
  fr(stand(90, { legs: lift }), (j) => band(j.footF, j.handN)),
  fr(stand(90, { legs: lift, arms: [[80, 80], [100, 100]] }), (j) => band(j.footF, j.handN)));

// 2 e 3 - rotazioni (supino visto dall'alto)
function plan({ abd = 90, fore = 'neutra', towelOn = true, bandTo = null }) {
  return { plan: true, abd, fore, towelOn, bandTo };
}
function drawPlan(f) {
  const hd = [34, 64]; const sh = [64, 64];
  const e = [sh[0] + 22 * Math.sin(rad(f.abd) * 1) * (f.abd < 90 ? 0.7 : 0), sh[1] + 22 * (f.abd < 90 ? 0.8 : 1)];
  let s = `<circle class="fx-head" cx="${hd[0]}" cy="${hd[1]}" r="8"/>`;
  s += `<rect class="fx-prop" x="46" y="52" width="70" height="24" rx="10"/>`;
  s += poly([[116, 58], [150, 52], [180, 52]], 'fx-b fx-far') + poly([[116, 70], [150, 76], [180, 76]], 'fx-b fx-far');
  s += poly([[sh[0], sh[1] - 4], [sh[0], sh[1] - 18], [sh[0] + 30, sh[1] - 18]], 'fx-b fx-far');
  if (f.towelOn) s += `<rect class="fx-fill" x="${e[0] - 8}" y="${e[1] - 3}" width="16" height="6" rx="2"/>`;
  s += poly([[sh[0], sh[1] + 6], e], 'fx-b');
  let h;
  if (f.fore === 'IR') h = [e[0] + 20, e[1]];
  else if (f.fore === 'ER') h = [e[0] - 20, e[1]];
  else h = null;
  if (h) s += poly([e, h], 'fx-b');
  else s += `<circle class="fx-prop" cx="${e[0]}" cy="${e[1]}" r="5"/><circle class="fx-dot" cx="${e[0]}" cy="${e[1]}" r="1.6"/>`;
  if (f.bandTo && h) s += band(h, [f.bandTo, h[1]]);
  s += dot([sh[0] + 1, sh[1] + 1], 3.5);
  return s;
}
def(S('2a'), plan({ abd: 45 }), plan({ abd: 45, fore: 'IR' }));
def(S('2b'), plan({ abd: 45, fore: 'IR' }), plan({ abd: 45, fore: 'ER' }));
def(S('2c'), plan({ fore: 'neutra' }), plan({ fore: 'IR', bandTo: 192 }));
def(S('2d'), plan({ fore: 'neutra', towelOn: false }), plan({ fore: 'IR', towelOn: false }));
def(S('3c'), plan({ fore: 'neutra' }), plan({ fore: 'ER', bandTo: 8 }));

// rotazioni in piedi (visto di fronte)
const fa = (ua, fo) => front({ arms: [[ua, fo], [270, 270]] });
const fl = (ua, fo, far) => front({ legs: [[262, 270], [268, 215]], arms: [[ua, fo], [270, 270]], ...(far || {}) });
const anchor = (j, side) => band(j.handN, [side, j.handN[1]]) + `<circle class="fx-dot" cx="${side}" cy="${n1(j.handN[1])}" r="3"/>`;
def(S('2e'), fr(fa(0, 90), (j) => anchor(j, 8)), fr(fa(0, 270), (j) => anchor(j, 8)));
def(S('2f'), fr(fa(35, 90), (j) => anchor(j, 8)), fr(fa(35, 320), (j) => anchor(j, 8)));
def(S('2g'), fr(fl(35, 90), (j) => anchor(j, 8)), fr(fl(35, 320), (j) => anchor(j, 8)));
def(S('3e'), fr(fa(0, 270), (j) => anchor(j, 8)), fr(fa(0, 90), (j) => anchor(j, 8)));
def(S('3f'), fr(fa(35, 320), (j) => anchor(j, 8)), fr(fa(35, 90), (j) => anchor(j, 8)));
def(S('3g'), fr(fl(35, 320), (j) => anchor(j, 8)), fr(fl(35, 90), (j) => anchor(j, 8)));

// 4 - co-contrazione (push-up plus)
const protr = (j) => dot([j.sh[0] - 7, j.sh[1] - 6], 4) + arrow([j.sh[0] - 12, j.sh[1] - 12], [j.sh[0] + 2, j.sh[1] - 12]);
const bp = (hx, s, arms, extra) => prone(hx, s, { pelvisY: G - 31 - Math.max(0, s - 35), arms: arms || [[270, 270], null], ...(extra || {}) });
def(S('4a'),
  fr(bp(140, 35), (j) => ball([j.pelvis[0] - 14, G - 14])),
  fr(bp(140, 35), (j) => ball([j.pelvis[0] - 14, G - 14]) + protr(j)));
def(S('4b'),
  fr(bp(140, 35), (j) => ball([j.pelvis[0] - 14, G - 14]) + protr(j) + arrow2([j.sh[0] - 14, j.sh[1] + 22], [j.sh[0] - 36, j.sh[1] + 22])),
  fr(bp(140, 35), (j) => ball([j.pelvis[0] - 14, G - 14]) + protr(j) + arrow2([j.sh[0] - 14, j.sh[1] + 22], [j.sh[0] - 36, j.sh[1] + 22])));
const wallBall = () => wall(160) + ball([142, G - 96], 17);
const lean = (reachN, reachF) => ({ pelvis: [62, G - 58], torso: 72, legs: [[270, 270], [262, 268]], arms: [{ reach: reachN }, reachF ? { reach: reachF } : { reach: [125, G - 96] }] });
def(S('4c'),
  fr(lean([125, G - 96]), () => wallBall()),
  fr(lean([125, G - 96], [128, G - 126]), () => wallBall()));
def(S('4d'),
  fr(bp(130, 35), (j) => ball([j.pelvis[0] - 40, G - 14]) + protr(j)),
  fr(bp(160, 35), (j) => ball([j.pelvis[0] - 40, G - 14]) + protr(j)));
def(S('4e'),
  fr(bp(160, 35), (j) => ball([j.pelvis[0] - 40, G - 14]) + protr(j)),
  fr(bp(160, 25, [[225, 315], null]), (j) => ball([j.pelvis[0] - 40, G - 14])));
def(S('4f'),
  fr(bp(160, 25, [[225, 315], null]), (j) => ball([j.pelvis[0] - 40, G - 14])),
  fr(bp(160, 49, [[270, 270], null]), (j) => ball([j.pelvis[0] - 40, G - 14]) + motion([j.handN[0], j.handN[1] + 4])));
def(S('4g'),
  fr(prone(130, 22, { toeH: 0, arms: [[225, 315], null] }), () => ''),
  fr(prone(130, 52, { toeH: 17, arms: [[270, 270], null] }), (j) => motion([j.handN[0], j.handN[1] + 4]) + motion([j.footN ? j.footN[0] : 40, j.footN ? j.footN[1] + 4 : 140])));

// 5 - stabilità dinamica
const wallR = () => wall(192);
const rhythm = (h) => arrow2([h[0] - 6, h[1] + 12], [h[0] + 6, h[1] + 12]);
def(S('5a'), fr(seat(92, { arms: [[270, 0], [275, 355]] }), (j) => seatBall() + towel([j.elbowN[0] - 6, j.elbowN[1] + 1]) + arrow([j.handN[0] + 20, j.handN[1]], [j.handN[0] + 6, j.handN[1]])));
def(S('5b'), fr(seat(92, { arms: [[270, 0], null] }), (j) => seatBall() + towel([j.elbowN[0] - 6, j.elbowN[1] + 1]) + wallR() + band(j.handN, [192, j.handN[1]]) + rhythm(j.handN)));
def(S('5c'), fr(seat(92, { arms: [[270, 0], null], legs: [[10, 300], [0, 270]] }), (j) => seatBall() + towel([j.elbowN[0] - 6, j.elbowN[1] + 1]) + wallR() + band(j.handN, [192, j.handN[1]]) + rhythm(j.handN)));
def(S('5d'), fr(seat(92, { arms: [[300, 5], null] }), (j) => seatBall() + wallR() + band(j.handN, [192, j.handN[1]]) + rhythm(j.handN)));
def(S('5e'),
  fr(stand(90, { arms: [[290, 290], [255, 255]] }), (j) => band(j.handN, j.handF)),
  fr(stand(90, { arms: [[80, 80], [97, 97]] }), (j) => band(j.handN, j.handF) + arrow2([j.handN[0] + 4, j.handN[1] - 8], [j.handN[0] + 4, j.handN[1] - 18])));
const throwArm = [[30, 90], null];
def(S('5f'), fr(stand(110, { legs: stag, arms: throwArm }), (j) => wall(8) + band(j.handN, [8, j.handN[1]]) + bottle(j.handN) + rhythm(j.handN)));
def(S('5g'), fr(stand(110, { legs: [[320, 265], [262, 268]], arms: throwArm }), (j) => wall(8) + band(j.handN, [8, j.handN[1]]) + bottle(j.handN) + rhythm(j.handN)));

// 6 - propriocezione con palla
const sup = (arms) => supine({ arms });
const ballAt = (h, r = 11) => ball([h[0], h[1] - r], r);
def(S('6a'),
  fr(sup([[80, 150], [80, 150]]), (j) => ballAt(j.handN)),
  fr(sup([[90, 90], [90, 90]]), (j) => ballAt(j.handN)));
def(S('6b'),
  fr(sup([[80, 150], [80, 150]]), (j) => ballAt(j.handN) + eyesClosed(j.head)),
  fr(sup([[90, 90], [90, 90]]), (j) => ballAt(j.handN) + eyesClosed(j.head)));
def(S('6c'),
  fr(sup([[80, 150], [80, 140]]), (j) => ballAt(j.handN)),
  fr(sup([[90, 90], [88, 80]]), (j) => ballAt(j.handN)));
def(S('6d'),
  fr(sup([[90, 90], [88, 80]]), (j) => ballAt(j.handN)),
  fr(sup([[125, 125], [88, 80]]), (j) => ballAt(j.handN)));
const rect = (h) => `<path class="fx-acc" d="M${n1(h[0] - 7)},${n1(h[1] - 22)} h14 v8 h-14 z"/>`;
def(S('6e'),
  fr(stand(105, { legs: stag, arms: [[270, 0], null] }), (j) => ballAt(j.handN)),
  fr(stand(105, { legs: stag, arms: [[0, 0], null] }), (j) => ballAt(j.handN) + rect(j.handN)));
def(S('6f'),
  fr(stand(105, { legs: stag, arms: [[270, 0], null] }), (j) => ballAt(j.handN) + eyesClosed(j.head)),
  fr(stand(105, { legs: stag, arms: [[0, 0], null] }), (j) => ballAt(j.handN) + rect(j.handN) + eyesClosed(j.head)));
const lunge = { pelvis: [90, G - 40], torso: 90, legs: [[335, 275], [230, 215]], arms: [[0, 0], null] };
def(S('6g'),
  fr(stand(105, { legs: stag, arms: [[0, 0], null] }), (j) => ballAt(j.handN)),
  fr(lunge, (j) => ballAt(j.handN) + arrow([j.handN[0] + 4, j.handN[1] - 24], [j.handN[0] + 18, j.handN[1] - 24])));

// 7 - puntatore laser
const TH = G - 58; const TS = G - 98; const TO = G - 128;
const lz = (y, extra) => (j) => wall(176) + target(170, y) + laser(j.handN, [170, y]) + (extra ? extra(j) : '');
const rest = (x, pose, y) => fr(stand(x, pose || {}), () => wall(176) + target(170, y));
const reachFrame = (x, pose, y, extra) => fr({ ...stand(x, pose || {}), arms: [{ reach: [170, y] }, null] }, (j) => lz(y, extra)(j));
def(S('7a'), rest(125, null, TH), reachFrame(125, null, TH));
def(S('7b'), rest(125, null, TS), reachFrame(125, null, TS));
def(S('7c'), rest(125, null, TO), reachFrame(125, null, TO));
def(S('7d'), rest(125, { legs: stag }, TO), reachFrame(125, { legs: stag }, TO));
def(S('7e'), rest(125, { legs: lift }, TO), reachFrame(125, { legs: lift }, TO));
def(S('7f'), rest(125, { legs: lift }, TO), reachFrame(125, { legs: lift }, TO, (j) => bottle(j.handN)));
def(S('7g'),
  fr(stand(125), (j) => wall(176) + target(170, TO) + band(j.footF, j.handN)),
  fr({ ...stand(125), arms: [{ reach: [170, TO] }, null] }, (j) => wall(176) + target(170, TO) + laser(j.handN, [170, TO]) + band(j.footF, j.handN)));

// Esercizi di propriocezione per atleta high level
const toPad = (x, y) => ({ ...stand(x), arms: [{ reach: [162, y] }, null] });
def('spalla-hl-cerchi-90-instabile',
  fr(toPad(118, TS), (j) => wall(172) + `<ellipse class="fx-fill" cx="165" cy="${TS}" rx="5" ry="11"/>` + circ([150, TS - 18], 7)),
  fr(front({ arms: [[0, 0], [270, 270]] }), (j) => `<ellipse class="fx-fill" cx="${n1(j.handN[0] + 4)}" cy="${n1(j.handN[1])}" rx="5" ry="9"/>` + circ([j.handN[0] + 4, j.handN[1] - 17], 7)));
def('spalla-hl-perturbazioni-90',
  fr(toPad(118, TS), (j) => wall(172) + `<ellipse class="fx-fill" cx="165" cy="${TS}" rx="5" ry="11"/>` + arrow([j.elbowN[0] + 6, j.elbowN[1] - 22], [j.elbowN[0] + 6, j.elbowN[1] - 6]) + arrow([j.elbowN[0] - 8, j.elbowN[1] + 22], [j.elbowN[0] - 8, j.elbowN[1] + 6])),
  fr(front({ arms: [[0, 0], [270, 270]] }), (j) => `<ellipse class="fx-fill" cx="${n1(j.handN[0] + 4)}" cy="${n1(j.handN[1])}" rx="5" ry="9"/>` + arrow([j.elbowN[0], j.elbowN[1] - 22], [j.elbowN[0], j.elbowN[1] - 6]) + arrow([j.elbowN[0], j.elbowN[1] + 22], [j.elbowN[0], j.elbowN[1] + 6])));
def('spalla-hl-quadrupedia-instabile',
  fr(quad(120), (j) => pad(j.handN[0], G, 36)),
  fr(quad(132), (j) => pad(j.handN[0] - 10, G, 36) + arrow([j.sh[0] - 6, j.sh[1] - 22], [j.sh[0] + 10, j.sh[1] - 22])));
def('spalla-hl-quadrupedia-instabile-monolaterale',
  fr(quad(120), (j) => pad(j.handN[0], G, 36)),
  fr(quad(120, { arms: [[270, 270], [0, 0]] }), (j) => pad(j.handN[0], G, 36)));
def('spalla-hl-plank-instabile-mani',
  fr(prone(120, 35, { toeH: 0 }), (j) => pad(j.handN[0], G, 36)),
  fr(prone(120, 35, { toeH: 0 }), (j) => pad(j.handN[0], G, 36) + arrow2([j.sh[0] - 8, j.sh[1] - 20], [j.sh[0] + 8, j.sh[1] - 20])));
def('spalla-hl-plank-instabile-bacino',
  fr(bp(150, 35), (j) => ball([j.pelvis[0] - 8, G - 14])),
  fr(bp(150, 35), (j) => ball([j.pelvis[0] - 8, G - 14]) + arrow2([j.sh[0] - 8, j.sh[1] - 20], [j.sh[0] + 8, j.sh[1] - 20])));
def('spalla-hl-plank-instabile-piedi',
  fr(prone(150, 35, { toeH: 28 }), (j) => ball([j.footN[0] - 4, G - 14])),
  fr(prone(150, 35, { toeH: 28 }), (j) => ball([j.footN[0] - 4, G - 14]) + arrow2([j.sh[0] - 8, j.sh[1] - 20], [j.sh[0] + 8, j.sh[1] - 20])));
def('spalla-hl-bracciata-secco',
  fr(quad(120), (j) => pad(j.handN[0], G, 36) + circ([j.handN[0], G - 24], 7)),
  fr(prone(120, 35, { toeH: 0 }), (j) => pad(j.handN[0], G, 36) + circ([j.handN[0], G - 24], 7)));

// ------------------------------------------------------------- rendering
function frameSvg(f, offset) {
  let inner = '';
  if (f.plan) inner = drawPlan(f);
  else {
    const { s, j } = body(f.pose);
    inner = (f.extra ? f.extra(j) : '') + s;
  }
  return `<g transform="translate(${offset},0)"><line class="fx-floor" x1="6" y1="${G + 2}" x2="194" y2="${G + 2}"/>${inner}</g>`;
}

export function figureSvg(id, label) {
  const frames = D[id];
  if (!frames) return '';
  const two = frames.length > 1;
  const parts = frames.map((f, i) => frameSvg(f, two ? i * 200 : 100)).join('');
  const sep = two ? '<line class="fx-sep" x1="200" y1="14" x2="200" y2="150"/><text class="fx-num" x="10" y="16">1</text><text class="fx-num" x="210" y="16">2</text>' : '';
  return `<svg class="ex-fig" viewBox="0 0 400 160" role="img" aria-label="${(label || 'Esercizio').replace(/"/g, '&quot;')}: ${two ? 'posizione di partenza e posizione finale' : 'posizione'}" xmlns="http://www.w3.org/2000/svg">${parts}${sep}</svg>`;
}

let byName = null;
export function figureHtmlForName(name) {
  if (!byName) byName = new Map(exerciseLibrary.map((e) => [e.name, e.id]));
  const id = byName.get(name);
  if (!id || !D[id]) return '';
  return `<figure class="ex-figure">${figureSvg(id, name)}</figure>`;
}

export function hasFigure(id) { return !!D[id]; }
export const figureIds = () => Object.keys(D);
