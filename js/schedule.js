// Giorni della settimana per gli esercizi: null = ogni giorno, [] = in riserva (non programmato),
// altrimenti i giorni in cui farlo. Qui anche la distribuzione automatica sulla settimana.

export const DAYS = [
  { id: 'lun', label: 'Lun', full: 'Lunedì' }, { id: 'mar', label: 'Mar', full: 'Martedì' },
  { id: 'mer', label: 'Mer', full: 'Mercoledì' }, { id: 'gio', label: 'Gio', full: 'Giovedì' },
  { id: 'ven', label: 'Ven', full: 'Venerdì' }, { id: 'sab', label: 'Sab', full: 'Sabato' },
  { id: 'dom', label: 'Dom', full: 'Domenica' },
];

const JS_DAYS = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
export const todayId = (d = new Date()) => JS_DAYS[d.getDay()];

export function isScheduledOn(ex, dayId) {
  return ex.days == null || ex.days.includes(dayId);
}
export const isReserve = (ex) => Array.isArray(ex.days) && ex.days.length === 0;

export function daysLabel(ex) {
  if (ex.days == null) return 'Ogni giorno';
  if (!ex.days.length) return 'In riserva';
  return DAYS.filter((d) => ex.days.includes(d.id)).map((d) => d.label).join(' · ');
}

const PHASE_ORDER = ['acuta', 'subacuta', 'rinforzo', 'ritorno'];
// Quante volte a settimana, al massimo, per tipo di fase (poi limitato dai giorni scelti).
const FREQ = { 'prev-mobilita': 3, 'prev-stretching': 2, 'prev-rinforzo': 2, 'prev-mantenimento': 2, acuta: 7, subacuta: 4, rinforzo: 3, ritorno: 3 };
// Quanto conta tenere l'esercizio quando c'e' troppo carico in un giorno (1 = da tenere).
const KEEP = { 'prev-rinforzo': 1, acuta: 1, subacuta: 1, rinforzo: 1, ritorno: 2, 'prev-mobilita': 2, 'prev-mantenimento': 3, 'prev-stretching': 4 };
const CLASS_ORDER = ['prev-mobilita', 'prev-rinforzo', 'prev-mantenimento', 'prev-stretching', 'acuta', 'subacuta', 'rinforzo', 'ritorno'];

// Distribuisce gli esercizi sui giorni scelti, senza superare 'cap' esercizi al giorno.
// upToPhase: i percorsi a fasi (acuta...ritorno) si programmano solo fino a questa fase;
// le fasi successive restano "in riserva" finche' il paziente non avanza.
export function distribute(exercises, dayIds, { cap = 10, upToPhase = null, base = {} } = {}) {
  const N = dayIds.length;
  const out = new Map();
  if (!N) return { out, counts: {}, reserve: exercises.length };
  const upIdx = upToPhase ? PHASE_ORDER.indexOf(upToPhase) : -1;
  const active = [];
  exercises.forEach((ex) => {
    const p = PHASE_ORDER.indexOf(ex.phase);
    if (upToPhase && p > upIdx) out.set(ex.id, []); else active.push(ex);
  });
  let offset = 0;
  [...CLASS_ORDER, null].forEach((cls) => {
    const items = active.filter((ex) => (cls === null ? !CLASS_ORDER.includes(ex.phase) : ex.phase === cls));
    const k = Math.max(1, Math.min(N, cls === null ? N : FREQ[cls]));
    const step = Math.max(1, Math.floor(N / k));
    items.forEach((ex, i) => {
      const start = (offset + i) % N;
      const set = new Set();
      for (let t = 0; t < k; t += 1) set.add(dayIds[(start + t * step) % N]);
      out.set(ex.id, [...set]);
    });
    offset += items.length;
  });
  const byId = new Map(exercises.map((e) => [e.id, e]));
  // 'base': esercizi gia' fissati a mano per giorno (contano nel carico ma non si spostano).
  const load = () => { const c = Object.fromEntries(dayIds.map((d) => [d, Array.from({ length: base[d] || 0 }, () => null)])); out.forEach((days, id) => days.forEach((d) => c[d] && c[d].push(id))); return c; };
  for (let guard = 0; guard < 2000; guard += 1) {
    const c = load();
    const busy = dayIds.reduce((a, d) => (c[d].length > c[a].length ? d : a), dayIds[0]);
    if (c[busy].length <= cap) break;
    const multi = c[busy].filter((id) => id !== null && out.get(id).length > 1);
    const pool = multi.length ? multi : c[busy].filter((id) => id !== null);
    if (!pool.length) break;
    const rank = (id) => KEEP[byId.get(id).phase] ?? 2;
    const pick = pool.reduce((a, b) => (rank(b) > rank(a) || (rank(b) === rank(a) && out.get(b).length > out.get(a).length) ? b : a));
    if (multi.length) out.set(pick, out.get(pick).filter((d) => d !== busy)); else out.set(pick, []);
  }
  const counts = Object.fromEntries(dayIds.map((d) => [d, base[d] || 0]));
  let reserve = 0;
  out.forEach((days) => { if (!days.length) reserve += 1; days.forEach((d) => { counts[d] += 1; }); });
  return { out, counts, reserve };
}
