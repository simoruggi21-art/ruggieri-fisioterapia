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
// Cinematica inversa a due segmenti: angoli [segmento 1, segmento 2] per arrivare a 'to' partendo da 'from'.
function ik(from, to, fwd = true, l1 = L.th, l2 = L.sh) {
  const dx = to[0] - from[0]; const dy = from[1] - to[1];
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.01);
  const phi = Math.atan2(dy, dx);
  const A = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const th = phi + (fwd ? A : -A);
  const k = [from[0] + l1 * Math.cos(th), from[1] - l1 * Math.sin(th)];
  const sh = Math.atan2(k[1] - to[1], to[0] - k[0]);
  return [deg(th), deg(sh)];
}
const legsTo = (pelvis, a1, a2, fwd = true) => [ik(pelvis, a1, fwd), ik(pelvis, a2 || [a1[0] - 5, a1[1]], fwd)];

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
  j.footN = lN && lN[2]; j.footF = lF && lF[2]; j.kneeN = lN && lN[1]; j.kneeF = lF && lF[1]; j.elbowF = aF && aF[1];
  j.shN = sN;
  // Disegno: sagoma realistica a strati (contorno + riempimento), arti piu' larghi vicino al tronco.
  const part = (a, w, far) => {
    const [p1, p2] = a;
    return { ol: `<line class="fx-ol" x1="${n1(p1[0])}" y1="${n1(p1[1])}" x2="${n1(p2[0])}" y2="${n1(p2[1])}" stroke-width="${n1(w + 2.6)}"/>`,
      fl: `<line class="${far ? 'fx-skf' : 'fx-sk'}" x1="${n1(p1[0])}" y1="${n1(p1[1])}" x2="${n1(p2[0])}" y2="${n1(p2[1])}" stroke-width="${n1(w)}"/>` };
  };
  const chain = (pts, ws, far) => {
    const ps = ws.map((w, i) => part([pts[i], pts[i + 1]], w, far));
    return ps.map((q) => q.ol).join('') + ps.map((q) => q.fl).join('');
  };
  const armSvg = (a, far) => (a ? chain(a, [8.6, 7], far) + `<circle class="fx-olf" cx="${n1(a[2][0])}" cy="${n1(a[2][1])}" r="${far ? 4.6 : 5}"/><circle class="${far ? 'fx-skf0' : 'fx-sk0'}" cx="${n1(a[2][0])}" cy="${n1(a[2][1])}" r="${far ? 3.4 : 3.8}"/>` : '');
  const legSvg = (l, far) => (l ? chain(l, [13, 9.5, 5.6], far) : '');
  const midT = [(j.pelvis[0] + j.sh[0]) / 2, (j.pelvis[1] + j.sh[1]) / 2];
  const trunk = chain([j.pelvis, midT, j.sh], [17, 20], false);
  const neckSvg = chain([j.sh, j.neck], [6.5], false);
  const shorts = (l, hipP) => (l ? `<line class="fx-sh" x1="${n1(hipP[0])}" y1="${n1(hipP[1])}" x2="${n1(hipP[0] + (l[1][0] - hipP[0]) * 0.5)}" y2="${n1(hipP[1] + (l[1][1] - hipP[1]) * 0.5)}" stroke-width="14.5"/>` : '');
  const pelvisCap = `<circle class="fx-sh0" cx="${n1(j.pelvis[0])}" cy="${n1(j.pelvis[1])}" r="8.6"/>`;
  const mark = (p.hl || []).map((h) => hlSvg(h, j, p)).join('');
  let s = '';
  s += armSvg(aF, true) + legSvg(lF, true);
  s += trunk + neckSvg;
  s += legSvg(lN, false) + shorts(lF, hF) + pelvisCap + shorts(lN, hN);
  s += `<ellipse class="fx-head" cx="${n1(j.head[0])}" cy="${n1(j.head[1])}" rx="7.4" ry="8.4" transform="rotate(${n1(-(hd - 90))} ${n1(j.head[0])} ${n1(j.head[1])})"/>`;
  s += armSvg(aN, false);
  s += mark;
  return { s, j };
}

// Evidenziazione dei muscoli lavorati (rosso trasparente).
function hlSvg(name, j, p) {
  const c = (pt0, r) => `<circle class="fx-hl" cx="${n1(pt0[0])}" cy="${n1(pt0[1])}" r="${r}"/>`;
  const sg = (a, b, w) => `<line class="fx-hl fx-hll" x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}" stroke-width="${w}"/>`;
  const mid = (a, b, t = 0.5) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  if (name === 'spalla') return c(j.shN || j.sh, 7) + (j.sh ? c([j.sh[0] - Math.cos(rad(p.torso)) * 6, j.sh[1] + Math.sin(rad(p.torso)) * 6], 5.5) : '');
  if (name === 'core') return sg(mid(j.pelvis, j.sh, 0.12), mid(j.pelvis, j.sh, 0.7), 15);
  if (name === 'gluteo') return c(j.pelvis, 10);
  if (name === 'quadricipite' && j.kneeN) return sg(mid(j.pelvis, j.kneeN, 0.1), mid(j.pelvis, j.kneeN, 0.9), 11);
  if (name === 'polpaccio' && j.kneeN && j.footN) return sg(mid(j.kneeN, j.footN, 0.15), mid(j.kneeN, j.footN, 0.8), 8);
  if (name === 'collo') return sg(j.neck, j.sh, 9);
  if (name === 'gomito' && j.elbowN) return c(j.elbowN, 7);
  return '';
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
const HL = {};
const hlFor = (id) => HL[id] || (/ginocchio|rotulea/.test(id) ? ['quadricipite'] : /spalla/.test(id) ? (/-(4[a-g]|hl-plank|hl-quadrupedia|hl-bracciata)/.test(id) ? ['spalla', 'core'] : ['spalla']) : []);
const def = (id, ...frames) => { frames.forEach((f) => { if (f.pose && !f.pose.hl) f.pose.hl = hlFor(id); }); D[id] = frames; };
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
  if (f.fore === 'straight') { s += poly([[sh[0], sh[1] + 6], [sh[0] + (e[0] - sh[0]) * 1.7, sh[1] + 6 + (e[1] - sh[1] - 6) * 1.7]], 'fx-b'); s += dot([sh[0] + 1, sh[1] + 1], 3.5); return s; }
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

// ---- Spalla: altri esercizi della libreria
const tbl = (x, y, w = 56) => `<line class="fx-prop" stroke-width="3" x1="${x}" y1="${y}" x2="${x + w}" y2="${y}"/><line class="fx-prop" x1="${x + 6}" y1="${y}" x2="${x + 6}" y2="${G}"/><line class="fx-prop" x1="${x + w - 6}" y1="${y}" x2="${x + w - 6}" y2="${G}"/>`;
const chair = (x) => `<line class="fx-prop" stroke-width="3" x1="${x - 16}" y1="${G - 27}" x2="${x + 18}" y2="${G - 27}"/><line class="fx-prop" x1="${x - 14}" y1="${G - 27}" x2="${x - 14}" y2="${G}"/><line class="fx-prop" x1="${x + 16}" y1="${G - 27}" x2="${x + 16}" y2="${G}"/><line class="fx-prop" x1="${x - 16}" y1="${G - 27}" x2="${x - 16}" y2="${G - 78}"/>`;
const stickL = (a, b) => `<line class="fx-stick" x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}"/>`;
const dumb = (h) => `<rect class="fx-prop fx-fillrect" x="${n1(h[0] - 6)}" y="${n1(h[1] - 3)}" width="12" height="6" rx="2"/>`;
const bar = (y) => `<line class="fx-prop" stroke-width="3.5" x1="60" y1="${y}" x2="140" y2="${y}"/>`;
const pulley = (p) => `<circle class="fx-prop" cx="${p[0]}" cy="${p[1]}" r="5"/><line class="fx-prop" x1="${p[0]}" y1="8" x2="${p[0]}" y2="${p[1] - 5}"/>`;
const kb = (h) => `<rect class="fx-prop fx-fillrect" x="${n1(h[0] - 3)}" y="${n1(h[1] - 3)}" width="6" height="6"/><circle class="fx-prop fx-fillrect" cx="${n1(h[0])}" cy="${n1(h[1] - 10)}" r="6"/>`;
const sideLie = (o = {}) => ({ pelvis: [140, G - 9], torso: 180, legs: [[20, 340], [10, 335]], arms: [[90, 10], null], ...o });
const benT = (o = {}) => ({ pelvis: [95, G - 58], torso: 35, legs: stag, arms: [[270, 270], { reach: [150, G - 76] }], ...o });
const benchT = () => tbl(138, G - 76, 52);
const wallPush = (bent) => bent
  ? { pelvis: [88, G - 58], torso: 66, legs: [[270, 270], [262, 268]], arms: [[330, 60], [330, 60]] }
  : { pelvis: [72, G - 58], torso: 72, legs: [[270, 270], [262, 268]], arms: [[330, 100], [330, 100]] };
const wp = () => wall(160);

def('spalla-pendolo',
  fr(benT({ arms: [[250, 250], { reach: [150, G - 76] }] }), (j) => benchT() + circ([j.handN[0], j.handN[1] - 4], 8)),
  fr(benT({ arms: [[292, 292], { reach: [150, G - 76] }] }), (j) => benchT() + circ([j.handN[0], j.handN[1] - 4], 8)));
D['postchir-spalla-pendolo-precoce'] = D['spalla-pendolo'];
def('spalla-mob-circonduzione-assistita',
  fr(benT({ arms: [[250, 250], { reach: [150, G - 76] }] }), (j) => benchT() + circ([j.handN[0], j.handN[1] - 4], 10)),
  fr(benT({ arms: [[295, 295], { reach: [150, G - 76] }] }), (j) => benchT() + circ([j.handN[0], j.handN[1] - 4], 10)));
const rotE = (a, b, anc) => [fr(front({ arms: [[270, a], [270, 270]] }), (j) => band(j.handN, [anc, j.handN[1]]) + `<circle class="fx-dot" cx="${anc}" cy="${n1(j.handN[1])}" r="3"/>`), fr(front({ arms: [[270, b], [270, 270]] }), (j) => band(j.handN, [anc, j.handN[1]]) + `<circle class="fx-dot" cx="${anc}" cy="${n1(j.handN[1])}" r="3"/>`)];
def('spalla-rotazione-esterna', ...rotE(180, 0, 10));
def('spalla-rotazione-interna', ...rotE(0, 180, 190));
def('postchir-spalla-rinforzo-tardivo', ...rotE(180, 0, 10));
def('spalla-scapular-retraction',
  fr(stand(100, { arms: [[270, 355], null] }), () => ''),
  fr(stand(100, { arms: [[242, 335], null] }), (j) => dot([j.sh[0] - 7, j.sh[1] - 5], 4) + arrow([j.sh[0] + 6, j.sh[1] - 14], [j.sh[0] - 10, j.sh[1] - 14])));
def('spalla-wall-slide',
  fr(stand(60, { arms: [[300, 75], null] }), () => wall(44)),
  fr(stand(60, { arms: [[88, 88], null] }), () => wall(44) + arrow([76, 60], [76, 30])));
def('spalla-flessione-assistita',
  fr(stand(100, { arms: [{ reach: [132, G - 60] }, { reach: [132, G - 62] }] }), (j) => stickL(j.handN, j.handF)),
  fr(stand(100, { arms: [{ reach: [112, G - 134] }, { reach: [112, G - 136] }] }), (j) => stickL(j.handN, j.handF)));
def('spalla-abduzione-elastico',
  fr(front({ arms: [[290, 290], [270, 270]] }), (j) => band(j.footN, j.handN)),
  fr(front({ arms: [[0, 0], [270, 270]] }), (j) => band(j.footN, j.handN)));
const pp = (arrowOn) => fr(prone(120, 35, { toeH: 0 }), (j) => (arrowOn ? protr(j) : ''));
def('spalla-push-up-plus', pp(false), pp(true));
def('spalla-scapular-push-up', pp(false), pp(true));
def('spalla-prone-y-t-w',
  fr(proneLie({ arms: [[180, 180], null] }), () => ''),
  fr(proneLie({ arms: [[160, 160], null] }), (j) => dumb(j.handN) + arrow([j.handN[0], j.handN[1] + 8], [j.handN[0], j.handN[1] - 6])));
const sleeper = (fo) => fr(sideLie({ arms: [[90, fo], null] }), (j) => '');
def('spalla-stretch-capsula-posteriore', sleeper(10), fr(sideLie({ arms: [[90, 325], null] }), (j) => arrow([j.handN[0] + 4, j.handN[1] - 14], [j.handN[0] + 4, j.handN[1] - 2])));
D['spalla-sleeper-stretch-dinamico'] = D['spalla-stretch-capsula-posteriore'];
def('spalla-face-pull',
  fr(stand(90, { arms: [{ reach: [130, G - 98] }, null] }), (j) => wall(186) + band(j.handN, [186, G - 100])),
  fr(stand(90, { arms: [[350, 105], null] }), (j) => wall(186) + band(j.handN, [186, G - 100])));
def('spalla-diagonale-kabat',
  fr(stand(90, { arms: [[310, 310], null] }), (j) => band(j.footF, j.handN)),
  fr(stand(90, { arms: [[50, 50], null] }), (j) => band(j.footF, j.handN)));
def('spalla-push-up-parete', fr(wallPush(false), () => wp()), fr(wallPush(true), () => wp()));
def('spalla-serratus-wall-punch',
  fr(wallPush(false), () => wp()),
  fr(wallPush(false), (j) => wp() + protr(j)));
def('postchir-spalla-mobilita-passiva-assistita',
  fr(sup([[70, 150], [76, 150]]), (j) => stickL(j.handN, j.handF)),
  fr(sup([[100, 100], [106, 106]]), (j) => stickL(j.handN, j.handF)));
def('spalla-mob-bastone-elevazione',
  fr(sup([[90, 90], [96, 96]]), (j) => stickL(j.handN, j.handF)),
  fr(sup([[130, 130], [136, 136]]), (j) => stickL(j.handN, j.handF)));
def('spalla-mob-bastone-rotazione-esterna', plan({ abd: 20, fore: 'neutra' }), plan({ abd: 20, fore: 'ER' }));
def('spalla-mob-abduzione-supina', plan({ abd: 20, fore: 'straight', towelOn: false }), plan({ abd: 90, fore: 'straight', towelOn: false }));
def('postchir-spalla-isometria-protetta',
  fr(stand(100, { arms: [[270, 0], null] }), (j) => wall(150) + towel([j.elbowN[0] - 6, j.elbowN[1]]) + arrow2([j.handN[0] + 4, j.handN[1] - 6], [j.handN[0] + 16, j.handN[1] - 6])));
def('postchir-spalla-mobilita-scapolare-precoce',
  fr(seat(92, { arms: [[270, 270], null] }), (j) => chair(92) + arrow([j.sh[0] + 10, j.sh[1] - 14], [j.sh[0] + 10, j.sh[1] - 26])),
  fr(seat(92, { arms: [[270, 270], null] }), (j) => chair(92) + arrow([j.sh[0] + 10, j.sh[1] - 26], [j.sh[0] + 10, j.sh[1] - 14])));
def('postchir-spalla-carrucola',
  fr(stand(100, { arms: [[270, 270], { reach: [118, G - 140] }] }), (j) => pulley([120, 24]) + stickL(j.handN, [119, 29]) + stickL(j.handF, [121, 29])),
  fr(stand(100, { arms: [{ reach: [112, 24] }, { reach: [118, G - 108] }] }), (j) => pulley([120, 24]) + stickL(j.handN, [119, 29]) + stickL(j.handF, [121, 29])));
def('postchir-spalla-cammino-pendolo',
  fr(stand(100, { legs: [[300, 280], [245, 255]], arms: [[282, 282], null] }), () => ''),
  fr(stand(100, { legs: [[245, 255], [300, 280]], arms: [[258, 258], null] }), () => ''));
def('postchir-spalla-progressione-attiva',
  fr(stand(100, { arms: [[270, 270], null] }), () => ''),
  fr(stand(100, { arms: [[20, 20], null] }), (j) => arrow([j.handN[0] + 4, j.handN[1] + 8], [j.handN[0] + 4, j.handN[1] - 6])));
def('spalla-mob-table-slide',
  fr(seat(70, { torso: 80, arms: [{ reach: [112, G - 60] }, null] }), () => chair(70) + tbl(100, G - 60, 60)),
  fr(seat(70, { torso: 55, arms: [{ reach: [150, G - 60] }, null] }), () => chair(70) + tbl(100, G - 60, 60) + arrow([118, G - 70], [140, G - 70])));
def('spalla-mob-mano-dietro-schiena',
  fr(stand(100, { arms: [[250, 160], [75, 215]] }), (j) => stickL(j.handN, j.handF)),
  fr(stand(100, { arms: [[245, 120], [75, 215]] }), (j) => stickL(j.handN, j.handF)));
def('spalla-mob-wall-walk',
  fr({ pelvis: [95, G - 58], torso: 80, legs: [[270, 270], [262, 268]], arms: [{ reach: [156, G - 70] }, { reach: [156, G - 72] }] }, () => wall(160)),
  fr({ pelvis: [110, G - 58], torso: 84, legs: [[270, 270], [262, 268]], arms: [{ reach: [156, G - 128] }, { reach: [156, G - 130] }] }, () => wall(160)));
def('spalla-mob-cross-body',
  fr(front({ arms: [[190, 190], [260, 165]] }), () => ''),
  fr(front({ arms: [[185, 185], [255, 150]] }), (j) => arrow([j.handN[0] - 4, j.handN[1] - 12], [j.handN[0] - 18, j.handN[1] - 12])));
def('spalla-mob-preghiera-quadrupedia',
  fr(quad(120), () => ''),
  fr({ pelvis: [62, G - 22], torso: 14, legs: [[330, 180], [330, 180]], arms: [{ reach: [150, G] }, null] }, (j) => arrow([80, G - 40], [60, G - 40])));
def('spalla-mob-pettorale-porta',
  fr(stand(100, { arms: [[0, 90], null] }), () => wall(140)),
  fr(stand(112, { legs: stag, arms: [[0, 90], null], torso: 94 }), () => wall(140) + arrow([100, G - 100], [112, G - 100])));
def('spalla-mob-estensione-bastone',
  fr(stand(100, { arms: [[262, 262], [266, 266]] }), (j) => stickL(j.handN, j.handF)),
  fr(stand(100, { arms: [[240, 240], [244, 244]] }), (j) => stickL(j.handN, j.handF)));
def('spalla-mob-elevazione-scapolare',
  fr(stand(100, { arms: [[270, 270], null] }), () => ''),
  fr(stand(100, { arms: [[25, 25], null] }), (j) => arrow([j.sh[0] + 14, j.sh[1] + 16], [j.sh[0] + 14, j.sh[1] + 4])));
def('spalla-isometrici-rotatori-muro',
  fr(front({ arms: [[270, 0], [270, 270]] }), (j) => wall(j.handN[0] + 8) + arrow([j.handN[0] - 8, j.handN[1] - 8], [j.handN[0] + 4, j.handN[1] - 8])));
def('spalla-scaption-manubrio',
  fr(stand(100, { arms: [[270, 270], null] }), (j) => dumb(j.handN)),
  fr(stand(100, { arms: [[22, 22], null] }), (j) => dumb(j.handN)));
def('spalla-extrarotazione-90-elastico',
  fr(front({ arms: [[0, 270], [270, 270]] }), (j) => band(j.handN, [178, G - 30])),
  fr(front({ arms: [[0, 90], [270, 270]] }), (j) => band(j.handN, [178, G - 30])));
def('spalla-rematore-elastico-spalla',
  fr(seat(92, { arms: [{ reach: [138, G - 70] }, null] }), (j) => chair(92) + wall(188) + band(j.handN, [188, j.handN[1]])),
  fr(seat(92, { arms: [[240, 20], null] }), (j) => chair(92) + wall(188) + band(j.handN, [188, j.handN[1]])));
def('spalla-bottom-up-kettlebell',
  fr(stand(100, { legs: [[290, 268], [250, 262]], arms: [[270, 0], null] }), (j) => kb(j.handN)),
  fr(stand(100, { legs: [[250, 262], [290, 268]], arms: [[270, 0], null] }), (j) => kb(j.handN)));
def('spalla-lanci-medicine-ball',
  fr(stand(90, { arms: [[85, 85], [95, 95]] }), (j) => wall(176) + ball([j.handN[0], j.handN[1] - 10], 10)),
  fr(stand(90, { arms: [[25, 25], [32, 32]] }), (j) => wall(176) + ball([j.handN[0] + 10, j.handN[1] - 4], 10) + arrow([j.handN[0] + 24, j.handN[1] - 4], [160, j.handN[1] - 4])));
def('spalla-isometrico-abduzione-muro',
  fr(front({ arms: [[285, 85], [270, 270]] }), (j) => wall(j.elbowN[0] + 6) + arrow([j.elbowN[0] - 10, j.elbowN[1] - 4], [j.elbowN[0] + 2, j.elbowN[1] - 4])));
def('spalla-isometrico-flessione-muro',
  fr(stand(110, { arms: [[270, 0], null] }), (j) => wall(j.handN[0] + 8) + arrow([j.handN[0] - 8, j.handN[1] - 12], [j.handN[0] + 4, j.handN[1] - 12])));
def('spalla-mobilita-distale',
  fr(seat(92, { arms: [[270, 0], null] }), (j) => chair(92)),
  fr(seat(92, { arms: [[270, 70], null] }), (j) => chair(92) + circ([j.handN[0], j.handN[1] - 14], 6)));
def('spalla-respirazione-posizione-scapolare',
  fr(supine({ arms: [[0, 0], null] }), (j) => arrow([j.sh[0] + 22, j.pelvis[1] - 6 - 4], [j.sh[0] + 22, j.pelvis[1] - 22])),
  fr(supine({ arms: [[0, 0], null] }), (j) => arrow([j.sh[0] + 22, j.pelvis[1] - 22], [j.sh[0] + 22, j.pelvis[1] - 6 - 4])));
def('spalla-extrarotazione-decubito-laterale',
  fr(sideLie({ arms: [[0, 20], null] }), (j) => towel([j.elbowN[0] - 6, j.elbowN[1] + 3])),
  fr(sideLie({ arms: [[0, 85], null] }), (j) => towel([j.elbowN[0] - 6, j.elbowN[1] + 3]) + dumb(j.handN)));
def('spalla-plank-shoulder-tap',
  fr(prone(120, 35, { toeH: 0 }), () => ''),
  fr(prone(120, 35, { toeH: 0, arms: [[270, 270], [125, 205]] }), () => ''));
def('spalla-trazioni-assistite',
  fr({ pelvis: [100, 97], torso: 90, legs: [[270, 180], [270, 180]], arms: [[90, 90], [90, 90]] }, () => bar(22)),
  fr({ pelvis: [100, 82], torso: 90, legs: [[270, 180], [270, 180]], arms: [[255, 80], [255, 80]] }, () => bar(38)));
def('spalla-press-sopra-testa-landmine',
  fr(stand(100, { arms: [[290, 70], null] }), (j) => dumb(j.handN)),
  fr(stand(100, { arms: [[80, 88], null] }), (j) => dumb(j.handN)));

// ---- Ginocchio, tendinopatia rotulea e post-chirurgico ginocchio
const box = (x, w, h) => `<rect class="fx-prop fx-fillrect" x="${x}" y="${G - h}" width="${w}" height="${h}" rx="2"/>`;
const wedge = (x, w, h) => `<path class="fx-prop fx-fillrect" d="M${x},${G} L${x + w},${G} L${x + w},${G - h} Z"/>`;
const dbell = (h) => `<rect class="fx-prop fx-fillrect" x="${n1(h[0] - 4)}" y="${n1(h[1])}" width="8" height="8" rx="2"/>`;
const sqPose = (x, depth, o = {}) => {
  const pelvis = [x, G - 58 + depth * 33];
  const foot = [x + 6 + depth * 12, G];
  return { pelvis, torso: 90 - depth * 38, legs: legsTo(pelvis, foot, [foot[0] - 6, G]), arms: [[270 + depth * 80, 270 + depth * 80], null], ...o };
};
const slPose = (x, depth, far = 'front', o = {}) => {
  const pelvis = [x, G - 58 + depth * 30];
  const foot = [x + 4 + depth * 8, G];
  const f2 = far === 'back' ? ik(pelvis, [x - 30, G - 24], false) : ik(pelvis, [x + 30, G - 24]);
  return { pelvis, torso: 90 - depth * 32, legs: [ik(pelvis, foot), f2], arms: [[270 + depth * 60, 270 + depth * 60], null], ...o };
};
const lungeP = (y, o = {}) => {
  const pelvis = [92, y];
  return { pelvis, torso: 90, legs: [ik(pelvis, [114, G]), ik(pelvis, [64, G])], arms: [[300, 300], null], ...o };
};
const wallSitP = (y, o = {}) => {
  const pelvis = [62, y];
  return { pelvis, torso: 90, legs: [ik(pelvis, [92, G]), ik(pelvis, [88, G])], arms: [[300, 350], null], ...o };
};
const longSit = (o = {}) => ({ pelvis: [70, G - 6], torso: 98, legs: [[0, 0], [0, 0]], arms: [[262, 262], null], ...o });
const supL = (a, b, o = {}) => supine({ legs: [a, b], arms: [[355, 355], null], ...o });
const bridge = (footX, o = {}) => {
  const pelvis = [118, G - 26];
  return { pelvis, torso: 198, legs: [ik(pelvis, [footX, G]), ik(pelvis, [footX - 4, G])], arms: [[345, 345], null], ...o };
};
const liftX = (o = {}) => ({ ...stand(100), ...o });
const crutch = (a, b) => `<line class="fx-stick" x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}"/>`;
const seatKnee = (flex, o = {}) => seat(80, { legs: [flex ? [0, 270] : [0, 0], [0, 270]], ...o });
const bikeP = (a, o = {}) => {
  const C = [128, G - 32]; const pe = (ang) => [C[0] + 13 * Math.cos(rad(ang)), C[1] - 13 * Math.sin(rad(ang))];
  const pelvis = [84, G - 78];
  const pn = pe(a); const pf = pe(a + 180);
  return { pelvis, torso: 62, legs: [ik(pelvis, [pn[0], pn[1] + 3]), ik(pelvis, [pf[0], pf[1] + 3])], arms: [{ reach: [146, G - 96] }, null], ...o };
};
const bikeProp = () => `<circle class="fx-prop" cx="128" cy="${G - 32}" r="18"/><line class="fx-prop" x1="84" y1="${G - 70}" x2="128" y2="${G - 32}"/><line class="fx-prop" x1="128" y1="${G - 32}" x2="146" y2="${G - 96}"/><line class="fx-prop" x1="76" y1="${G - 71}" x2="94" y2="${G - 71}"/>`;
const pressP = (ext, one) => {
  const pelvis = [56, G - 30];
  const ank = ext ? [104, G - 64] : [86, G - 74];
  return { pelvis, torso: 135, legs: [ik(pelvis, ank), one ? [20, 330] : ik(pelvis, [ank[0] - 3, ank[1] + 2])], arms: [[320, 320], null] };
};
const pressProp = (ext) => { const a = ext ? [104, G - 64] : [86, G - 74]; return `<line class="fx-prop" stroke-width="3" x1="${a[0] + 5}" y1="${a[1] - 26}" x2="${a[0] + 11}" y2="${a[1] + 26}"/><line class="fx-prop" stroke-width="3" x1="30" y1="${G - 62}" x2="48" y2="${G - 8}"/><line class="fx-prop" x1="48" y1="${G - 8}" x2="150" y2="${G - 8}"/>`; };
const dn = (p) => arrow([p[0], p[1] - 16], [p[0], p[1] - 4]);
const up = (p) => arrow([p[0], p[1] - 4], [p[0], p[1] - 16]);
const mot = (p) => motion(p);

HL['ginocchio-hamstring-curl-scivolamento'] = ['gluteo']; HL['ginocchio-rdl-monopodalico-flessione'] = ['gluteo']; HL['postchir-ginocchio-rinforzo-catena-cinetica'] = ['gluteo'];
HL['tendinopatia-rotulea-catena-posteriore-tend'] = ['polpaccio', 'gluteo']; HL['postchir-ginocchio-pompe-caviglia'] = ['polpaccio']; HL['ginocchio-hamstring-curl'] = ['polpaccio'];

def('ginocchio-quad-isometrico',
  fr(longSit(), () => ''), fr(longSit(), (j) => dn([j.kneeN[0], j.kneeN[1] - 4])));
def('postchir-ginocchio-quad-set',
  fr(supL([0, 0], [55, 305]), (j) => towel([j.kneeN[0] + 2, G - 4])), fr(supL([0, 0], [55, 305]), (j) => towel([j.kneeN[0] + 2, G - 4]) + dn([j.kneeN[0], j.kneeN[1] - 4])));
def('ginocchio-isometrico-estensione-cuscino',
  fr(supL([0, 0], [55, 305]), (j) => ball([j.kneeN[0], G - 5], 5)), fr(supL([0, 0], [55, 305]), (j) => ball([j.kneeN[0], G - 5], 5) + dn([j.kneeN[0], j.kneeN[1] - 4])));
def('ginocchio-slr', fr(supL([0, 0], [55, 305]), () => ''), fr(supL([35, 35], [55, 305]), (j) => up([j.footN[0] - 14, j.footN[1] + 12])));
def('postchir-ginocchio-slr-tutore',
  fr(supL([0, 0], [55, 305]), (j) => `<rect class="fx-prop fx-fillrect" x="${n1(j.kneeN[0] - 7)}" y="${n1(j.kneeN[1] - 6)}" width="14" height="10" rx="3"/>`),
  fr(supL([35, 35], [55, 305]), (j) => `<rect class="fx-prop fx-fillrect" x="${n1(j.kneeN[0] - 7)}" y="${n1(j.kneeN[1] - 6)}" width="14" height="10" rx="3"/>` + up([j.footN[0] - 14, j.footN[1] + 12])));
def('ginocchio-heel-slide-flessione',
  fr(supL([0, 0], [55, 305]), () => ''),
  fr(supine({ legs: [ik([140, G - 6], [160, G - 3]), [55, 305]], arms: [[355, 355], null] }), (j) => arrow([j.footN[0] + 10, G - 2], [j.footN[0] - 8, G - 2])));
def('postchir-ginocchio-flessione-passiva',
  fr(supL([0, 0], [55, 305]), () => ''),
  fr(supine({ legs: [ik([140, G - 6], [162, G - 3]), [55, 305]], arms: [{ reach: [168, G - 6] }, null] }), (j) => `<line class="fx-stick" x1="${n1(j.footN[0])}" y1="${n1(j.footN[1])}" x2="${n1(j.handN[0])}" y2="${n1(j.handN[1])}"/>`));
def('postchir-ginocchio-pompe-caviglia',
  fr(supL([0, 0], [0, 0]), (j) => up([j.footN[0] + 6, j.footN[1] + 6])),
  fr(supL([0, 0], [0, 0]), (j) => dn([j.footN[0] + 6, j.footN[1] + 20])));
def('ginocchio-mini-squat', fr(sqPose(100, 0), () => wall(176)), fr(sqPose(96, 0.38), () => wall(176)));
def('tendinopatia-rotulea-mini-squat-3s', fr(sqPose(100, 0), () => ''), fr(sqPose(96, 0.38), (j) => dn([j.sh[0] + 20, j.sh[1]])));
def('ginocchio-eccentrico-quad', fr(sqPose(96, 0.15), () => ''), fr(sqPose(94, 0.9), (j) => arrow([j.sh[0] + 22, j.sh[1] - 26], [j.sh[0] + 22, j.sh[1] - 6])));
def('ginocchio-sit-to-stand-controllato',
  fr(seat(92, { arms: [[300, 330], null] }), () => chair(92)),
  fr(stand(98, { arms: [[310, 330], null] }), () => chair(92)));
const stepUpA = () => ({ pelvis: [95, G - 58], torso: 90, legs: [ik([95, G - 58], [126, G - 20]), [270, 270]], arms: [[282, 285], null] });
const stepUpB = () => ({ pelvis: [128, G - 78], torso: 90, legs: [[270, 270], [270, 270]], arms: [[282, 285], null] });
def('ginocchio-step-up', fr(stepUpA(), () => box(108, 40, 20)), fr(stepUpB(), () => box(108, 40, 20)));
const sdA = () => ({ pelvis: [112, G - 83], torso: 90, legs: [[270, 270], [270, 270]], arms: [[282, 285], null] });
const sdB = () => ({ pelvis: [112, G - 58], torso: 75, legs: [ik([112, G - 58], [112, G - 25]), ik([112, G - 58], [130, G])], arms: [[320, 320], null] });
def('ginocchio-step-down', fr(sdA(), () => box(90, 44, 25)), fr(sdB(), () => box(90, 44, 25)));
def('tendinopatia-rotulea-step-down-decline', fr(sdA(), () => box(90, 44, 25)), fr(sdB(), () => box(90, 44, 25) + dn([140, G - 70])));
def('ginocchio-hamstring-curl',
  fr(stand(90, { arms: [{ reach: [150, G - 72] }, null] }), () => wall(156)),
  fr(stand(90, { legs: [[270, 150], [270, 270]], arms: [{ reach: [150, G - 72] }, null] }), () => wall(156)));
def('ginocchio-terminal-extension',
  fr(stand(100, { legs: [[282, 255], [270, 270]] }), (j) => wall(190) + band(j.kneeN, [190, j.kneeN[1] - 2])),
  fr(stand(100, { legs: [[270, 270], [270, 270]] }), (j) => wall(190) + band(j.kneeN, [190, j.kneeN[1] - 2])));
const wsFrames = (y1, y2, extra) => [fr(stand(62), () => wall(46)), fr(wallSitP(y2), extra || (() => wall(46)))];
def('ginocchio-wall-sit', ...wsFrames(G - 58, G - 30));
def('tendinopatia-rotulea-wall-sit-tendineo', fr(stand(62), () => wall(46)), fr(wallSitP(G - 38), () => wall(46)));
def('ginocchio-wall-sit-estensione-alternata',
  fr(wallSitP(G - 36), () => wall(46)),
  fr(wallSitP(G - 36, { legs: [ik([62, G - 36], [94, G]), [0, 0]] }), () => wall(46)));
def('ginocchio-leg-press-corta', fr(pressP(false), () => pressProp(false)), fr(pressP(true), () => pressProp(true)));
def('tendinopatia-rotulea-leg-press-lenta', fr(pressP(false), () => pressProp(false)), fr(pressP(true), () => pressProp(true)));
def('tendinopatia-rotulea-hsr-leg-press', fr(pressP(false), () => pressProp(false)), fr(pressP(true), () => pressProp(true)));
def('ginocchio-leg-press-monopodalica', fr(pressP(false, true), () => pressProp(false)), fr(pressP(true, true), () => pressProp(true)));
const barB = (j) => `<line class="fx-stick" x1="${n1(j.sh[0] - 16)}" y1="${n1(j.sh[1] - 2)}" x2="${n1(j.sh[0] + 6)}" y2="${n1(j.sh[1] - 2)}"/>`;
def('tendinopatia-rotulea-hsr-squat', fr(sqPose(100, 0, { arms: [[40, 130], null] }), barB), fr(sqPose(94, 0.7, { arms: [[40, 130], null] }), barB));
def('ginocchio-leg-extension-range-protetto', fr(seatKnee(true), () => chair(80)), fr(seatKnee(false), (j) => chair(80) + arrow([j.footN[0] + 6, j.footN[1] - 14], [j.footN[0] + 6, j.footN[1] - 34])));
def('tendinopatia-rotulea-estensione-lenta', fr(seatKnee(true), () => chair(80)), fr(seatKnee(false), (j) => chair(80) + arrow([j.footN[0] + 6, j.footN[1] - 14], [j.footN[0] + 6, j.footN[1] - 34])));
def('tendinopatia-rotulea-isometrici-70',
  fr(seat(80, { legs: [ik([80, G - 28], [100, G - 6]), [0, 270]] }), (j) => chair(80) + band(j.footN, [18, j.footN[1]])),
  fr(seat(80, { legs: [ik([80, G - 28], [100, G - 6]), [0, 270]] }), (j) => chair(80) + band(j.footN, [18, j.footN[1]]) + arrow([j.footN[0] - 6, j.footN[1] - 12], [j.footN[0] + 10, j.footN[1] - 12])));
def('ginocchio-cyclette-range', fr(bikeP(10), bikeProp), fr(bikeP(190), bikeProp));
def('postchir-ginocchio-cyclette-scarico', fr(bikeP(10), bikeProp), fr(bikeP(190), bikeProp));
def('ginocchio-affondo-bulgaro',
  fr({ pelvis: [100, G - 52], torso: 90, legs: [ik([100, G - 52], [124, G]), ik([100, G - 52], [58, G - 24], true)], arms: [[300, 300], null] }, () => box(36, 28, 24)),
  fr({ pelvis: [100, G - 38], torso: 80, legs: [ik([100, G - 38], [124, G]), ik([100, G - 38], [58, G - 24], true)], arms: [[300, 300], null] }, () => box(36, 28, 24)));
D['tendinopatia-rotulea-affondo-bulgaro-tend'] = D['ginocchio-affondo-bulgaro'];
def('ginocchio-split-squat-statico', fr(lungeP(G - 56), () => ''), fr(lungeP(G - 38), (j) => dn([j.sh[0] + 20, j.sh[1] - 4])));
def('ginocchio-single-leg-squat-box',
  fr(slPose(100, 0), () => bench(60, 22, 30)),
  fr(slPose(100, 0.7), () => bench(60, 22, 30)));
function bench(x, w, h) { return box(x, w, h); }
def('ginocchio-skater-squat', fr(slPose(100, 0, 'back'), () => ''), fr(slPose(100, 0.75, 'back'), () => ''));
const dec = () => wedge(70, 70, 22);
def('tendinopatia-rotulea-decline-squat', fr(sqPose(100, 0, { }), dec), fr(sqPose(96, 0.5, { }), dec));
D['tendinopatia-rotulea-test-rientro-rotuleo'] = D['tendinopatia-rotulea-decline-squat'];
def('ginocchio-hamstring-curl-scivolamento', fr(bridge(160), (j) => '<line class="fx-prop" x1="150" y1="' + (G + 1) + '" x2="198" y2="' + (G + 1) + '"/>'), fr(bridge(186), () => ''));
def('postchir-ginocchio-rinforzo-catena-cinetica', fr(supL([55, 305], [55, 305]), () => ''), fr(bridge(160), () => ''));
def('ginocchio-hop-test-progressivo',
  fr(slPose(60, 0.2), (j) => arrow([80, G - 90], [140, G - 90])),
  fr(slPose(135, 0.6), () => ''));
def('ginocchio-perturbazioni-monopodaliche',
  fr(stand(100, { legs: lift, arms: [[330, 330], [20, 20]] }), (j) => arrow([30, j.pelvis[1]], [78, j.pelvis[1]]) + arrow([170, j.sh[1] + 14], [124, j.sh[1] + 14])),
  fr(stand(100, { legs: lift, arms: [[330, 330], [20, 20]] }), (j) => ball([50, G - 100], 10) + arrow([62, G - 100], [88, G - 100])));
def('ginocchio-spanish-squat-elastico', fr(sqPose(80, 0), (j) => wall(190) + band(j.kneeN, [190, j.kneeN[1]])), fr(sqPose(80, 0.55, { arms: [[350, 350], null] }), (j) => wall(190) + band(j.kneeN, [190, j.kneeN[1]])));
D['tendinopatia-rotulea-spanish-squat'] = D['ginocchio-spanish-squat-elastico'];
const rdlP = (hinge) => { const pelvis = [100, G - 58]; return hinge ? { pelvis, torso: 22, legs: [ik(pelvis, [104, G]), [200, 195]], arms: [[270, 270], null] } : stand(100, { legs: [[272, 268], [270, 270]] }); };
def('ginocchio-rdl-monopodalico-flessione', fr(rdlP(false), () => ''), fr(rdlP(true), (j) => dumb([j.handN[0], j.handN[1] + 2])));
def('ginocchio-camminata-laterale-semisquat-banda',
  fr(front({ pelvis: [90, G - 52.5], legs: [[305, 265], [235, 275]], arms: [[300, 300], [240, 240]] }), (j) => band(j.kneeN, j.kneeF) + arrow([118, G - 20], [150, G - 20])),
  fr(front({ pelvis: [120, G - 52.5], legs: [[305, 265], [235, 275]], arms: [[300, 300], [240, 240]] }), (j) => band(j.kneeN, j.kneeF)));
def('ginocchio-reverse-nordic',
  fr({ pelvis: [90, G - 30], torso: 90, legs: [[270, 180], [270, 180]], arms: [[330, 350], null] }, () => ''),
  fr({ pelvis: [90, G - 30], torso: 128, legs: [[270, 180], [270, 180]], arms: [[330, 350], null] }, (j) => arrow([j.sh[0] - 10, j.sh[1] - 16], [j.sh[0] - 24, j.sh[1] - 4])));
def('ginocchio-frenata-decelerazione',
  fr({ pelvis: [100, G - 56], torso: 80, legs: [ik([100, G - 56], [128, G - 20]), ik([100, G - 56], [66, G - 24], false)], arms: [[320, 70], [250, 100]] }, () => arrow([30, G - 120], [76, G - 120])),
  fr({ pelvis: [96, G - 46], torso: 100, legs: [ik([96, G - 46], [118, G]), ik([96, G - 46], [88, G])], arms: [[300, 20], [320, 330]] }, () => ''));
def('ginocchio-atterraggio-controllato',
  fr(stand(50, { arms: [[270, 270], null] }), () => box(24, 52, 22) + arrow([90, G - 100], [120, G - 70])),
  fr(sqPose(130, 0.5), () => ''));
def('tendinopatia-rotulea-drop-jump',
  fr(stand(50, { arms: [[270, 270], null] }), () => box(24, 52, 22) + arrow([90, G - 100], [120, G - 70])),
  fr(stand(130, { pelvis: [130, G - 78], arms: [[80, 80], null] }), (j) => mot([j.footN ? j.footN[0] : 130, G - 10])));
def('tendinopatia-rotulea-salto-contromovimento',
  fr(sqPose(100, 0.55, { arms: [[240, 240], null] }), () => ''),
  fr(stand(100, { pelvis: [100, G - 86], arms: [[85, 85], null] }), () => mot([100, G - 12])));
def('tendinopatia-rotulea-pogo-jump',
  fr(stand(100), () => ''), fr(stand(100, { pelvis: [100, G - 70] }), () => mot([100, G - 6])));
def('tendinopatia-rotulea-cambio-direzione-tend',
  fr({ pelvis: [90, G - 56], torso: 78, legs: [ik([90, G - 56], [122, G - 22]), ik([90, G - 56], [60, G - 22], false)], arms: [[320, 70], [250, 100]] }, () => arrow([40, G - 126], [96, G - 126])),
  fr({ pelvis: [96, G - 48], torso: 70, legs: [ik([96, G - 48], [116, G]), ik([96, G - 48], [86, G])], arms: [[300, 40], [250, 90]] }, () => arrow([110, G - 126], [140, G - 150])));
def('tendinopatia-rotulea-catena-posteriore-tend',
  fr(stand(100, { arms: [[270, 270], null] }), () => ''),
  fr(stand(100, { pelvis: [100, G - 66], arms: [[270, 270], null] }), (j) => up([j.footN[0] + 2, G - 4])));
def('ginocchio-salto-laterale-bound',
  fr(front({ pelvis: [58, G - 58], legs: [[270, 270], [275, 215]], arms: [[300, 300], [240, 240]] }), () => arrow([78, G - 20], [146, G - 20])),
  fr(front({ pelvis: [142, G - 50], legs: [[255, 275], [285, 255]], arms: [[300, 300], [240, 240]] }), () => ''));
def('postchir-ginocchio-propriocezione-precoce',
  fr(front({ arms: [[300, 300], [240, 240]] }), (j) => arrow2([j.head[0] - 14, j.head[1] - 14], [j.head[0] + 14, j.head[1] - 14])),
  fr(front({ arms: [[300, 300], [240, 240]] }), (j) => arrow2([j.head[0] - 14, j.head[1] - 14], [j.head[0] + 14, j.head[1] - 14])));
def('postchir-ginocchio-carico-progressivo',
  fr(stand(100, { arms: [[300, 300], null] }), (j) => crutch([j.sh[0] + 4, j.sh[1] + 6], [j.sh[0] + 30, G]) + dn([j.footN[0], G - 14])),
  fr(stand(100, { arms: [[300, 300], null] }), (j) => crutch([j.sh[0] + 4, j.sh[1] + 6], [j.sh[0] + 30, G]) + dn([j.footN[0], G - 14]) + dn([j.footN[0] + 10, G - 14])));

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
