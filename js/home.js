import { supabase } from './supabaseClient.js';
import { getState, isStaff } from './state.js';
import { qs, escapeHtml, formatDateTime, formatTime } from './ui.js';
import { openPatient } from './patients.js';

const CARE_LABELS = { in_valutazione: 'In valutazione', in_trattamento: 'In trattamento', in_pausa: 'In pausa', terminato: 'Percorso concluso' };
const HIGH_PAIN = 70;
const PREF_KEY = 'homeWidgetsV1';
const REFRESH_MS = 60000;

let refreshTimer = null;

function weekRange() {
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const next = new Date(monday);
  next.setDate(next.getDate() + 7);
  return { monday, next };
}

function dayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function isSameDay(iso, ref = new Date()) {
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
}

function card(title, body, { href, cta, wide, tone } = {}) {
  return `<article class="home-card${wide ? ' wide' : ''}${tone ? ' ' + tone : ''}">
    <h3>${escapeHtml(title)}</h3>
    ${body}
    ${href ? `<a class="home-link" href="${href}">${escapeHtml(cta || 'Apri')} →</a>` : ''}
  </article>`;
}

function big(value, sub) {
  return `<div class="home-big">${value}</div>${sub ? `<div class="home-sub">${sub}</div>` : ''}`;
}

// ---------------------------------------------------------------- paziente
async function renderPatient(root) {
  const { session, profile } = getState();
  const uid = session.user.id;
  const nowIso = new Date().toISOString();
  const { monday, next } = weekRange();

  const [nextAppt, weekAppts, exercises, unread] = await Promise.all([
    supabase.from('appointments').select('slot_start, status').eq('patient_id', uid)
      .in('status', ['richiesto', 'confermato']).gte('slot_start', nowIso).order('slot_start').limit(1).maybeSingle(),
    supabase.from('appointments').select('id').eq('patient_id', uid).in('status', ['richiesto', 'confermato'])
      .gte('slot_start', monday.toISOString()).lt('slot_start', next.toISOString()),
    supabase.from('patient_exercises').select('id, last_done_at').eq('patient_id', uid),
    supabase.from('messages').select('id', { count: 'exact', head: true }).eq('patient_id', uid)
      .neq('sender_role', 'patient').is('read_at', null),
  ]);

  const appt = nextAppt.data;
  const booked = (weekAppts.data || []).length;
  const exList = exercises.data || [];
  const doneToday = exList.filter((e) => e.last_done_at && isSameDay(e.last_done_at)).length;
  const toDo = exList.length - doneToday;
  const unreadCount = unread.count || 0;
  const perWeek = profile.sessions_per_week;
  const active = profile.care_status !== 'terminato';

  // Una sola cosa da fare adesso, in ordine di importanza.
  const todo = [];
  if (unreadCount) todo.push({ text: `Hai ${unreadCount} ${unreadCount === 1 ? 'messaggio' : 'messaggi'} da leggere`, href: '#messaggi', cta: 'Leggi' });
  if (active && exList.length && toDo > 0) todo.push({ text: `Hai ancora ${toDo} ${toDo === 1 ? 'esercizio' : 'esercizi'} da fare oggi`, href: '#miei-esercizi', cta: 'Vai agli esercizi' });
  if (active && perWeek && booked < perWeek) todo.push({ text: `Questa settimana ti servono ancora ${perWeek - booked} ${perWeek - booked === 1 ? 'seduta' : 'sedute'}`, href: '#agenda', cta: 'Prenota' });
  if (!appt && active && !perWeek) todo.push({ text: 'Non hai appuntamenti in programma', href: '#agenda', cta: 'Prenota una seduta' });

  const agendaHead = qs('#agenda h2');
  if (agendaHead) agendaHead.textContent = 'Appuntamenti';
  const agendaLabel = qs('#agenda .label');
  if (agendaLabel) agendaLabel.textContent = 'appuntamenti';

  const first = (profile.full_name || '').trim().split(/\s+/)[0];
  const todoHtml = todo.length
    ? `<ul class="home-todo">${todo.slice(0, 3).map((t) => `<li><span>${escapeHtml(t.text)}</span><a class="btn btn-primary btn-small" href="${t.href}">${escapeHtml(t.cta)}</a></li>`).join('')}</ul>`
    : '<p class="home-allgood">✓ Per oggi sei a posto. Continua così.</p>';

  const apptCard = appt
    ? card('Prossimo appuntamento', big(escapeHtml(formatDateTime(appt.slot_start)), appt.status === 'richiesto' ? 'In attesa di conferma dallo studio' : 'Confermato'), { href: '#agenda', cta: 'Gestisci appuntamenti' })
    : card('Prossimo appuntamento', big('—', 'Nessun appuntamento in programma'), { href: '#agenda', cta: 'Prenota una seduta' });

  const exCard = exList.length
    ? card('Esercizi di oggi', big(`${doneToday}<span class="home-of"> / ${exList.length}</span>`, doneToday === exList.length ? 'Fatti tutti, bravo' : 'fatti oggi'), { href: '#miei-esercizi', cta: 'Vai agli esercizi' })
    : card('Esercizi di oggi', big('—', 'Nessun esercizio assegnato per ora'));

  const planBody = perWeek && active
    ? big(`${perWeek} ${perWeek === 1 ? 'seduta' : 'sedute'}<span class="home-of"> a settimana</span>`, `${escapeHtml(CARE_LABELS[profile.care_status] || '')} · questa settimana ${booked} su ${perWeek} prenotate`)
      + `<div class="plan-dots" aria-hidden="true">${Array.from({ length: perWeek }, (_, i) => `<span class="${i < booked ? 'on' : ''}"></span>`).join('')}</div>`
    : big(escapeHtml(CARE_LABELS[profile.care_status] || 'In valutazione'), active ? 'Il tuo fisioterapista indicherà quante sedute a settimana' : 'Grazie per la fiducia');
  const planCard = card('Il tuo piano', planBody, { href: '#mio-percorso', cta: 'Vedi il percorso' });

  const msgCard = card('Messaggi', big(String(unreadCount), unreadCount ? 'da leggere' : 'nessun messaggio nuovo'), { href: '#messaggi', cta: 'Scrivi allo studio' });

  root.innerHTML = `
    <p class="label">home</p>
    <h2 class="heading-lg">Ciao${first ? ', ' + escapeHtml(first) : ''}</h2>
    <div class="home-now"><div class="home-now-title">Cosa fare adesso</div>${todoHtml}</div>
    <div class="home-grid">${apptCard}${exCard}${planCard}${msgCard}</div>
    <p class="home-foot"><a href="#preferenze">Promemoria email e preferenze</a></p>`;
}

// ------------------------------------------------------------------- staff
function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; } catch { return {}; }
}
function savePrefs(p) {
  try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch { /* facoltativo */ }
}

async function safe(fn, fallback) {
  try { return await fn(); } catch (e) { console.error(e); return fallback; }
}

function patientButton(id, name) {
  return `<button type="button" class="home-patient" data-open-patient="${escapeHtml(id)}">${escapeHtml(name || 'Paziente')}</button>`;
}

async function loadStaffData() {
  const { start, end } = dayRange();
  const { monday, next } = weekRange();
  const sinceIso = new Date(Date.now() - 7 * 86400000).toISOString();

  const [today, pending, unread, requests, treat, checkins] = await Promise.all([
    safe(async () => (await supabase.from('appointments').select('id, patient_id, slot_start, status, profiles(full_name)')
      .in('status', ['confermato', 'richiesto']).gte('slot_start', start.toISOString()).lt('slot_start', end.toISOString()).order('slot_start')).data || [], []),
    safe(async () => (await supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'richiesto').gte('slot_start', new Date().toISOString())).count || 0, 0),
    safe(async () => (await supabase.from('messages').select('id', { count: 'exact', head: true }).eq('read_by_staff', false)).count || 0, 0),
    safe(async () => (await supabase.from('contact_requests').select('id', { count: 'exact', head: true }).neq('status', 'contattata')).count || 0, 0),
    safe(async () => {
      const { data: pts } = await supabase.from('profiles').select('id, full_name, sessions_per_week')
        .eq('role', 'patient').eq('care_status', 'in_trattamento').not('sessions_per_week', 'is', null);
      const list = pts || [];
      if (!list.length) return [];
      const { data: appts } = await supabase.from('appointments').select('patient_id')
        .in('patient_id', list.map((p) => p.id)).in('status', ['richiesto', 'confermato'])
        .gte('slot_start', monday.toISOString()).lt('slot_start', next.toISOString());
      const count = {};
      (appts || []).forEach((a) => { count[a.patient_id] = (count[a.patient_id] || 0) + 1; });
      return list.map((p) => ({ ...p, booked: count[p.id] || 0 })).filter((p) => p.booked < p.sessions_per_week);
    }, []),
    safe(async () => {
      const { data } = await supabase.from('patient_checkins').select('patient_id, created_at, answers').gte('created_at', sinceIso).order('created_at', { ascending: false });
      const worst = {};
      (data || []).forEach((c) => {
        const v = Number(c.answers?.dolore_oggi);
        if (!Number.isNaN(v) && v >= HIGH_PAIN && !(c.patient_id in worst)) worst[c.patient_id] = { v, at: c.created_at };
      });
      const ids = Object.keys(worst);
      if (!ids.length) return [];
      const { data: names } = await supabase.from('profiles').select('id, full_name').in('id', ids);
      return ids.map((id) => ({ id, name: (names || []).find((n) => n.id === id)?.full_name, ...worst[id] }));
    }, []),
  ]);
  return { today, pending, unread, requests, treat, checkins };
}

function staffWidgets(d) {
  return [
    {
      id: 'today', title: 'Appuntamenti di oggi', wide: true,
      html: d.today.length
        ? `<ul class="home-list">${d.today.map((a) => `<li><span class="home-time">${escapeHtml(formatTime(a.slot_start))}</span>${patientButton(a.patient_id, a.profiles?.full_name)}<span class="home-tag ${a.status}">${a.status === 'richiesto' ? 'da confermare' : 'confermato'}</span></li>`).join('')}</ul>`
        : '<p class="home-sub">Nessun appuntamento oggi.</p>',
      href: '#agenda', cta: 'Apri agenda',
    },
    { id: 'pending', title: 'Richieste di appuntamento', html: big(String(d.pending), d.pending ? 'da confermare o rifiutare' : 'nessuna in attesa'), href: '#agenda', cta: 'Vai all\'agenda', tone: d.pending ? 'attention' : '' },
    { id: 'unread', title: 'Messaggi non letti', html: big(String(d.unread), d.unread ? 'dai pazienti' : 'tutto letto'), href: '#messaggi', cta: 'Apri i messaggi', tone: d.unread ? 'attention' : '' },
    { id: 'requests', title: 'Richieste dal sito', html: big(String(d.requests), d.requests ? 'da richiamare' : 'nessuna da gestire'), href: '#richieste', cta: 'Apri le richieste', tone: d.requests ? 'attention' : '' },
    {
      id: 'missing', title: 'In trattamento, sedute da prenotare', wide: true,
      html: d.treat.length
        ? `<ul class="home-list">${d.treat.map((p) => `<li>${patientButton(p.id, p.full_name)}<span class="home-sub">${p.booked} su ${p.sessions_per_week} prenotate questa settimana</span></li>`).join('')}</ul>`
        : '<p class="home-sub">Tutti i pazienti in trattamento hanno le sedute della settimana.</p>',
    },
    {
      id: 'pain', title: `Dolore alto nei check-in (${HIGH_PAIN}% o più, ultimi 7 giorni)`, wide: true,
      html: d.checkins.length
        ? `<ul class="home-list">${d.checkins.map((c) => `<li>${patientButton(c.id, c.name)}<span class="home-tag high">${c.v}%</span><span class="home-sub">${escapeHtml(formatDateTime(c.at))}</span></li>`).join('')}</ul>`
        : '<p class="home-sub">Nessun valore alto segnalato.</p>',
    },
  ];
}

function applyPrefs(widgets) {
  const prefs = loadPrefs();
  const order = prefs.order || [];
  const sorted = [...widgets].sort((a, b) => {
    const ia = order.indexOf(a.id); const ib = order.indexOf(b.id);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  return { sorted, hidden: new Set(prefs.hidden || []) };
}

function customizeHtml(sorted, hidden) {
  return `<div class="home-custom" id="homeCustom" hidden>
    <p class="home-sub" style="margin:0 0 8px;">Scegli cosa vedere in Home e in che ordine. La scelta resta su questo dispositivo.</p>
    ${sorted.map((w, i) => `<div class="home-custom-row">
      <label><input type="checkbox" data-home-toggle="${w.id}" ${hidden.has(w.id) ? '' : 'checked'}> ${escapeHtml(w.title)}</label>
      <span><button type="button" class="btn btn-ghost btn-small" data-home-move="${w.id}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Sposta su">↑</button>
      <button type="button" class="btn btn-ghost btn-small" data-home-move="${w.id}" data-dir="1" ${i === sorted.length - 1 ? 'disabled' : ''} aria-label="Sposta giù">↓</button></span>
    </div>`).join('')}
  </div>`;
}

async function renderStaff(root) {
  const d = await loadStaffData();
  const widgets = staffWidgets(d);
  const { sorted, hidden } = applyPrefs(widgets);
  const existing = qs('#homeCustom');
  const open = existing ? !existing.hidden : false;
  root.innerHTML = `
    <div class="booking-head">
      <div>
        <p class="label">oggi</p>
        <h2 class="heading-lg">Oggi in studio</h2>
        <p class="text-dim" style="margin-top:8px;">${escapeHtml(new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }))}</p>
      </div>
      <div><button type="button" class="btn btn-ghost btn-small" id="homeCustomBtn">Personalizza</button></div>
    </div>
    ${customizeHtml(sorted, hidden)}
    <div class="home-grid">${sorted.filter((w) => !hidden.has(w.id)).map((w) => card(w.title, w.html, w)).join('')}</div>`;
  const panel = qs('#homeCustom');
  if (panel) panel.hidden = !open;

  qs('#homeCustomBtn').onclick = () => { panel.hidden = !panel.hidden; };
  root.querySelectorAll('[data-home-toggle]').forEach((cb) => {
    cb.onchange = () => {
      const p = loadPrefs();
      const set = new Set(p.hidden || []);
      if (cb.checked) set.delete(cb.dataset.homeToggle); else set.add(cb.dataset.homeToggle);
      savePrefs({ ...p, hidden: [...set] });
      renderStaff(root);
    };
  });
  root.querySelectorAll('[data-home-move]').forEach((btn) => {
    btn.onclick = () => {
      const ids = sorted.map((w) => w.id);
      const i = ids.indexOf(btn.dataset.homeMove);
      const j = i + Number(btn.dataset.dir);
      if (j < 0 || j >= ids.length) return;
      [ids[i], ids[j]] = [ids[j], ids[i]];
      savePrefs({ ...loadPrefs(), order: ids });
      renderStaff(root);
    };
  });
  root.querySelectorAll('[data-open-patient]').forEach((b) => {
    b.onclick = () => openPatient(b.dataset.openPatient);
  });
}

export async function render() {
  const root = qs('#homeContent');
  const { session, profile } = getState();
  if (!root || !session || !profile) return;
  if (isStaff()) await renderStaff(root); else await renderPatient(root);

  // Aggiorna da solo ogni minuto, ma solo se la scheda e' visibile.
  if (!refreshTimer) {
    refreshTimer = setInterval(() => { if (!document.hidden && getState().session) render().catch(() => {}); }, REFRESH_MS);
  }
}
