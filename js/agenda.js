import { supabase } from './supabaseClient.js';
import { getState, isAdmin, isStaff } from './state.js';
import { qs, el, showToast, formatDateTime, escapeHtml } from './ui.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const APPT_STATUS_LABELS = { confermato: 'Confermato', chiuso: 'Chiuso', annullato: 'Annullato', rifiutato: 'Rifiutato', richiesto: 'In attesa di conferma' };

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

// Agenda continua 8:00-19:00 a step di 30 minuti (invece di soli orari in
// punta d'ora), cosi' un paziente puo' prenotare es. le 12:30. La durata di
// un appuntamento resta fissa a 1 ora: l'ultimo orario prenotabile e' quindi
// le 18:00 (finisce esattamente alle 19:00), ma la griglia visiva arriva
// fino alle 19:00 per mostrare per intero anche l'ultimo appuntamento.
const DAY_START_MIN = 8 * 60;
const DAY_END_MIN = 19 * 60;
const SLOT_MIN = 30;
const APPT_DURATION_MIN = 60;
const TOTAL_ROWS = (DAY_END_MIN - DAY_START_MIN) / SLOT_MIN;
const LAST_BOOKABLE_ROW = (DAY_END_MIN - APPT_DURATION_MIN - DAY_START_MIN) / SLOT_MIN; // 0-based, incluso

let weekOffset = 0;
let movingApptId = null;
let activeApptEntry = null;

function mondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function currentWeekMonday() {
  const m = mondayOf(new Date());
  m.setDate(m.getDate() + weekOffset * 7);
  return m;
}

function weekDays(monday) {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function dateForRow(day, rowIdx) {
  const totalMin = DAY_START_MIN + rowIdx * SLOT_MIN;
  const d = new Date(day);
  d.setHours(Math.floor(totalMin / 60), totalMin % 60, 0, 0);
  return d;
}

function rowIndexFor(dt) {
  const totalMin = dt.getHours() * 60 + dt.getMinutes();
  return Math.round((totalMin - DAY_START_MIN) / SLOT_MIN);
}

function rowTimeLabel(rowIdx) {
  const totalMin = DAY_START_MIN + rowIdx * SLOT_MIN;
  if (totalMin % 60 !== 0) return '';
  const h = Math.floor(totalMin / 60);
  return `${String(h).padStart(2, '0')}:00`;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function fmtDay(d) {
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
}

async function fetchAvailability(fromISO, toISO) {
  const { data, error } = await supabase
    .from('appointment_availability')
    .select('*')
    .gte('slot_start', fromISO)
    .lt('slot_start', toISO);
  if (error) { console.error(error); return []; }
  return data;
}

async function fetchDetailed(fromISO, toISO) {
  const { data, error } = await supabase
    .from('appointments')
    .select('id, patient_id, slot_start, slot_end, status, price, profiles(full_name)')
    .gte('slot_start', fromISO)
    .lt('slot_start', toISO)
    // Un appuntamento rifiutato o annullato libera lo slot (non conta più
    // come occupato: l'EXCLUDE del database infatti non lo considera). Non
    // va quindi disegnato in agenda, altrimenti resta visibile per sempre e
    // si sovrappone visivamente a un nuovo appuntamento creato nello stesso
    // orario, dando l'impressione (solo grafica, mai reale nei dati) di uno
    // scontro fra prenotazioni.
    .not('status', 'in', '(rifiutato,annullato)');
  if (error) { console.error(error); return []; }
  return data;
}

// Riepilogo "a colpo d'occhio" per lo staff: prossimo appuntamento confermato
// e numero di richieste in attesa, indipendenti dalla settimana visualizzata
// nella griglia sottostante (che puo' essere passata/futura mentre l'admin
// naviga). Query separate e leggere, non derivate dai dati gia' caricati.
async function renderTodaySummary() {
  const el = qs('#agendaSummary');
  if (!el) return;
  if (!isStaff()) { el.innerHTML = ''; return; }

  const nowIso = new Date().toISOString();
  const [{ data: nextAppt }, { count: pendingCount }] = await Promise.all([
    supabase.from('appointments').select('slot_start, profiles(full_name)')
      .eq('status', 'confermato').gte('slot_start', nowIso).order('slot_start').limit(1).maybeSingle(),
    supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'richiesto'),
  ]);

  el.className = 'agenda-summary';
  el.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Prossimo appuntamento confermato</div>
      <div class="stat-value">${nextAppt ? `${escapeHtml(nextAppt.profiles?.full_name || 'Paziente')} <span class="stat-sub">— ${formatDateTime(nextAppt.slot_start)}</span>` : '<span class="stat-sub">Nessuno in programma</span>'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Richieste in attesa di conferma</div>
      <div class="stat-value">${pendingCount || 0}</div>
    </div>
  `;
}

async function renderPatientHistory() {
  const list = qs('#apptHistoryList');
  if (!list) return;
  const { session } = getState();
  if (!session || isStaff()) return;

  const { data, error } = await supabase.from('appointments')
    .select('slot_start, status, price')
    .eq('patient_id', session.user.id)
    .lt('slot_start', new Date().toISOString())
    .order('slot_start', { ascending: false })
    .limit(10);
  if (error || !data || !data.length) {
    list.innerHTML = '<p class="text-dim" style="font-size:13px;">Nessuna seduta passata.</p>';
    return;
  }
  list.innerHTML = data.map((a) => `
    <div class="history-row">
      <span>${formatDateTime(a.slot_start)}</span>
      <span class="text-dim">${APPT_STATUS_LABELS[a.status] || a.status}${a.price != null ? ' · €' + Number(a.price).toLocaleString('it-IT') : ''}</span>
    </div>
  `).join('');
}

export async function render() {
  const grid = qs('#calGrid');
  if (!grid) return;
  const { session } = getState();
  if (!session) return;

  await Promise.all([renderTodaySummary(), renderPatientHistory()]);

  const monday = currentWeekMonday();
  const days = weekDays(monday);
  const rangeFrom = monday.toISOString();
  const rangeToDate = new Date(monday); rangeToDate.setDate(rangeToDate.getDate() + 6);
  const rangeTo = rangeToDate.toISOString();

  const [availability, detailed] = await Promise.all([
    fetchAvailability(rangeFrom, rangeTo),
    fetchDetailed(rangeFrom, rangeTo),
  ]);

  const map = new Map();
  availability.forEach((row) => map.set(new Date(row.slot_start).getTime(), { ...row, detailed: false }));
  detailed.forEach((row) => map.set(new Date(row.slot_start).getTime(), { ...row, detailed: true }));
  const entries = Array.from(map.values());

  const weekLabel = qs('#weekLabel');
  if (weekLabel) {
    const last = days[days.length - 1];
    weekLabel.textContent = `${fmtDay(monday)} — ${fmtDay(last)}`;
  }

  grid.innerHTML = '';
  const corner = el('div', 'cal-corner', '');
  corner.style.gridColumn = '1'; corner.style.gridRow = '1';
  grid.appendChild(corner);
  days.forEach((d, i) => {
    const head = el('div', 'cal-day-head', `${DAY_LABELS[i]} ${fmtDay(d)}`);
    head.style.gridColumn = String(i + 2); head.style.gridRow = '1';
    grid.appendChild(head);
  });

  const now = new Date();
  const myId = session.user.id;

  for (let r = 0; r < TOTAL_ROWS; r++) {
    const label = rowTimeLabel(r);
    const timeCell = el('div', 'cal-time', label);
    timeCell.style.gridColumn = '1'; timeCell.style.gridRow = String(r + 2);
    grid.appendChild(timeCell);
  }

  days.forEach((day, dayIdx) => {
    const dayEntries = entries.filter((e) => sameDay(new Date(e.slot_start), day));
    const consumedRows = new Set();

    dayEntries.forEach((entry) => {
      const start = new Date(entry.slot_start);
      const end = new Date(entry.slot_end);
      const startRow = rowIndexFor(start);
      const spanRows = Math.max(1, Math.round((end - start) / (SLOT_MIN * 60000)));
      for (let r = startRow; r < startRow + spanRows && r < TOTAL_ROWS; r++) consumedRows.add(r);

      const slotEl = document.createElement('div');
      slotEl.style.gridColumn = String(dayIdx + 2);
      slotEl.style.gridRow = `${startRow + 2} / span ${spanRows}`;

      if (entry.status === 'chiuso') {
        slotEl.className = 'slot chiuso';
      } else {
        slotEl.className = 'slot ' + entry.status;
        const dot = el('div', 'slot-dot', '');
        slotEl.appendChild(dot);
        if (entry.detailed) {
          const mine = entry.patient_id === myId;
          const label = mine
            ? (entry.status === 'confermato' ? 'Confermato' : 'In attesa')
            : (entry.profiles?.full_name || 'Paziente');
          slotEl.appendChild(el('div', 'slot-name', label));
          if (isAdmin() && entry.status === 'richiesto') {
            const actions = el('div', 'slot-admin-actions', '');
            const acc = el('button', 'accept', '✓');
            acc.onclick = (e) => { e.stopPropagation(); updateStatus(entry.id, 'confermato'); };
            const rej = el('button', 'reject', '✕');
            rej.onclick = (e) => { e.stopPropagation(); updateStatus(entry.id, 'rifiutato'); };
            actions.appendChild(acc); actions.appendChild(rej);
            slotEl.appendChild(actions);
          }
          if (isAdmin() && (entry.status === 'confermato' || entry.status === 'richiesto') && !movingApptId) {
            slotEl.classList.add('slot-clickable');
            slotEl.onclick = () => openApptDetail(entry);
          }
        } else {
          slotEl.appendChild(el('div', 'slot-name', 'Occupato'));
        }
      }
      grid.appendChild(slotEl);
    });

    for (let r = 0; r < TOTAL_ROWS; r++) {
      if (consumedRows.has(r)) continue;
      const dt = dateForRow(day, r);
      const isPast = dt < now;
      // Non basta che la riga cliccata sia libera: l'appuntamento dura
      // APPT_DURATION_MIN, quindi tutte le righe che coprirebbe (es. anche
      // quella successiva, con durata 60 min e slot da 30) devono esserlo,
      // altrimenti si sovrapporrebbe a un appuntamento già esistente.
      const spanRowsForNew = APPT_DURATION_MIN / SLOT_MIN;
      let rangeFree = true;
      for (let i = 0; i < spanRowsForNew; i++) {
        if (consumedRows.has(r + i)) { rangeFree = false; break; }
      }
      const canBook = r <= LAST_BOOKABLE_ROW && rangeFree;
      const slotEl = document.createElement('div');
      slotEl.style.gridColumn = String(dayIdx + 2);
      slotEl.style.gridRow = String(r + 2);
      slotEl.className = 'slot';
      if (!isPast && canBook) {
        slotEl.classList.add('libero');
        if (!isAdmin()) {
          slotEl.onclick = () => requestSlot(dt);
        } else {
          slotEl.onclick = movingApptId ? () => performMove(dt) : () => openNewApptModal(dt);
        }
      }
      grid.appendChild(slotEl);
    }
  });
}

// 23505 = violazione indice univoco (legacy), 23P01 = violazione vincolo
// EXCLUDE su intervalli sovrapposti (il caso normale ora che gli orari sono liberi).
function isSlotConflictError(error) {
  return error?.code === '23505' || error?.code === '23P01';
}

function addApptDuration(dt) {
  const end = new Date(dt);
  end.setMinutes(end.getMinutes() + APPT_DURATION_MIN);
  return end;
}

async function requestSlot(dt) {
  const { session } = getState();
  if (!session) return;
  const confirmed = confirm(`Confermi la richiesta di appuntamento per ${formatDateTime(dt.toISOString())}?`);
  if (!confirmed) return;
  const slotEnd = addApptDuration(dt);
  const { error } = await supabase.from('appointments').insert({
    patient_id: session.user.id,
    slot_start: dt.toISOString(),
    slot_end: slotEnd.toISOString(),
    status: 'richiesto',
  });
  if (error) {
    showToast(
      isSlotConflictError(error) ? 'Questo orario è appena stato occupato, scegline un altro.' : 'Errore nella richiesta.',
      'error'
    );
  } else {
    showToast('Richiesta inviata. Riceverai conferma a breve.', 'ok');
  }
  render();
}

async function updateStatus(id, status) {
  const { error } = await supabase.from('appointments').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) showToast('Errore aggiornamento appuntamento.', 'error');
  render();
}

export async function closeToday() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let r = 0; r < TOTAL_ROWS; r++) {
    const dt = dateForRow(today, r);
    if (dt < new Date()) continue;
    const slotEnd = new Date(dt); slotEnd.setMinutes(slotEnd.getMinutes() + SLOT_MIN);
    await supabase.from('appointments').insert({
      patient_id: null,
      slot_start: dt.toISOString(),
      slot_end: slotEnd.toISOString(),
      status: 'chiuso',
    }); // eventuali conflitti (slot gia' occupato) vengono ignorati dal vincolo di sovrapposizione
  }
  showToast('Giornata odierna chiusa per i nuovi orari liberi.', 'ok');
  render();
}

export function changeWeek(delta) {
  weekOffset += delta;
  render();
}

export function resetWeek() {
  weekOffset = 0;
  render();
}

async function fetchTreatmentNote(appointmentId) {
  const { data } = await supabase.from('appointment_notes').select('*').eq('appointment_id', appointmentId).maybeSingle();
  return data;
}

async function openApptDetail(entry) {
  activeApptEntry = entry;
  movingApptId = null;
  qs('#moveBanner').style.display = 'none';
  qs('#apptDetailTitle').textContent = entry.profiles?.full_name || 'Paziente';
  qs('#apptDetailMeta').textContent = formatDateTime(entry.slot_start);
  const note = await fetchTreatmentNote(entry.id);
  qs('#apptTreatmentText').value = note?.treatment_text || '';
  qs('#apptPriceInput').value = entry.price != null ? entry.price : '';
  qs('#apptDetailOverlay').style.display = 'flex';
}

function closeApptDetail() {
  qs('#apptDetailOverlay').style.display = 'none';
  activeApptEntry = null;
  movingApptId = null;
}

async function performMove(dt) {
  if (!movingApptId) return;
  const slotEnd = addApptDuration(dt);
  const { error } = await supabase.from('appointments').update({
    slot_start: dt.toISOString(),
    slot_end: slotEnd.toISOString(),
    reminder_24h_sent: false,
    reminder_6h_sent: false,
    updated_at: new Date().toISOString(),
  }).eq('id', movingApptId);
  if (error) {
    showToast(isSlotConflictError(error) ? 'Quell\'orario è già occupato, scegline un altro.' : 'Errore nello spostamento.', 'error');
  } else {
    showToast('Appuntamento spostato.', 'ok');
  }
  movingApptId = null;
  qs('#moveBanner').style.display = 'none';
  render();
}

let newPatientMode = false;

async function fetchAllPatients() {
  const { data, error } = await supabase.from('profiles').select('id, full_name, email').eq('role', 'patient').order('full_name');
  if (error) { console.error(error); return []; }
  return data;
}

function pad2(n) { return String(n).padStart(2, '0'); }
function formatDateInput(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function formatTimeInput(d) { return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; }

// Data/ora del modale "nuova prenotazione" sono sempre lette dai due campi
// (data + ora), sia quando il modale si apre da un click su uno slot libero
// in griglia (che li pre-compila) sia dal bottone "+ Nuovo appuntamento" (che
// pre-compila un default modificabile): un'unica fonte di verita' letta al
// momento della conferma, non un valore congelato all'apertura.
function currentNewApptDt() {
  const dateVal = qs('#newApptDateInput').value;
  const timeVal = qs('#newApptTimeInput').value;
  if (!dateVal || !timeVal) return null;
  const [y, mo, d] = dateVal.split('-').map(Number);
  const [h, mi] = timeVal.split(':').map(Number);
  return new Date(y, mo - 1, d, h, mi, 0, 0);
}

function updateNewApptMetaPreview() {
  const dt = currentNewApptDt();
  qs('#newApptMeta').textContent = dt
    ? `Appuntamento: ${formatDateTime(dt.toISOString())} · durata 1 ora`
    : 'Seleziona data e ora.';
}

async function openNewApptModal(dt) {
  const patients = await fetchAllPatients();
  const select = qs('#newApptPatientSelect');
  if (patients.length === 0) {
    select.innerHTML = '<option value="">Nessun paziente registrato</option>';
  } else {
    select.innerHTML = patients.map((p) => `<option value="${p.id}">${escapeHtml(p.full_name || p.email)}</option>`).join('');
  }
  const target = dt || (() => { const t = new Date(); t.setHours(9, 0, 0, 0); return t; })();
  qs('#newApptDateInput').value = formatDateInput(target);
  qs('#newApptTimeInput').value = formatTimeInput(target);
  updateNewApptMetaPreview();
  qs('#newApptPrice').value = '';
  setNewPatientMode(false);
  qs('#newApptOverlay').style.display = 'flex';
}

function setNewPatientMode(on) {
  newPatientMode = on;
  qs('#newPatientFields').style.display = on ? 'flex' : 'none';
  qs('#newApptPatientSelect').style.display = on ? 'none' : '';
  qs('#newPatientToggleBtn').textContent = on ? '← Scegli un paziente già registrato' : '+ Il paziente non è ancora registrato';
  if (!on) {
    ['newPatientName', 'newPatientEmail', 'newPatientPhone', 'newPatientBirthDate'].forEach((id) => { qs('#' + id).value = ''; });
    qs('#newPatientGender').value = '';
  }
}

function closeNewApptModal() {
  qs('#newApptOverlay').style.display = 'none';
}

async function createPatientProfile() {
  const { session } = getState();
  const full_name = qs('#newPatientName').value.trim();
  const email = qs('#newPatientEmail').value.trim();
  const phone = qs('#newPatientPhone').value.trim() || null;
  const gender = qs('#newPatientGender').value || null;
  const birth_date = qs('#newPatientBirthDate').value || null;
  if (!full_name || !email) {
    showToast('Nome ed email sono obbligatori per creare il paziente.', 'error');
    return null;
  }
  const res = await fetch(`${SUPABASE_URL}/functions/v1/create-patient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ full_name, email, phone, gender, birth_date }),
  });
  const data = await res.json();
  if (!res.ok) {
    showToast(data.error || 'Errore nella creazione del paziente.', 'error');
    return null;
  }
  return data.id;
}

async function createManualAppointment() {
  const dt = currentNewApptDt();
  if (!dt) { showToast('Seleziona data e ora dell\'appuntamento.', 'error'); return; }
  let patientId = qs('#newApptPatientSelect').value;
  if (newPatientMode) {
    patientId = await createPatientProfile();
    if (!patientId) return;
  }
  if (!patientId) { showToast('Seleziona o crea un paziente.', 'error'); return; }
  const slotEnd = addApptDuration(dt);
  const priceRaw = qs('#newApptPrice').value.trim();
  const price = priceRaw === '' ? null : Number(priceRaw);
  const { error } = await supabase.from('appointments').insert({
    patient_id: patientId,
    slot_start: dt.toISOString(),
    slot_end: slotEnd.toISOString(),
    status: 'confermato',
    price,
  });
  if (error) {
    showToast(isSlotConflictError(error) ? 'Questo orario è già occupato.' : 'Errore nella creazione della prenotazione.', 'error');
    return;
  }
  showToast('Prenotazione creata e confermata.', 'ok');
  closeNewApptModal();
  render();
}

export function wireAppointmentModal() {
  qs('#newApptBtn')?.addEventListener('click', () => openNewApptModal());
  qs('#newApptDateInput').addEventListener('change', updateNewApptMetaPreview);
  qs('#newApptTimeInput').addEventListener('change', updateNewApptMetaPreview);
  qs('#newApptCloseBtn').onclick = closeNewApptModal;
  qs('#newApptConfirmBtn').onclick = createManualAppointment;
  qs('#newPatientToggleBtn').onclick = () => setNewPatientMode(!newPatientMode);
  qs('#apptDetailCloseBtn').onclick = closeApptDetail;
  qs('#apptMoveBtn').onclick = () => {
    if (!activeApptEntry) return;
    movingApptId = activeApptEntry.id;
    qs('#apptDetailOverlay').style.display = 'none';
    qs('#moveBanner').style.display = 'flex';
    render();
  };
  qs('#moveCancelBtn').onclick = () => {
    movingApptId = null;
    qs('#moveBanner').style.display = 'none';
    render();
  };
  qs('#apptCancelBtn').onclick = async () => {
    if (!activeApptEntry) return;
    await updateStatus(activeApptEntry.id, 'annullato');
    closeApptDetail();
  };
  qs('#apptSaveTreatmentBtn').onclick = async () => {
    if (!activeApptEntry) return;
    const { session } = getState();
    const treatmentText = qs('#apptTreatmentText').value;
    const priceRaw = qs('#apptPriceInput').value.trim();
    const price = priceRaw === '' ? null : Number(priceRaw);
    const [r1, r2] = await Promise.all([
      supabase.from('appointment_notes').upsert({
        appointment_id: activeApptEntry.id,
        treatment_text: treatmentText,
        updated_at: new Date().toISOString(),
        updated_by: session.user.id,
      }),
      supabase.from('appointments').update({ price }).eq('id', activeApptEntry.id),
    ]);
    if (r1.error || r2.error) { showToast('Errore nel salvataggio.', 'error'); return; }
    showToast('Scheda di trattamento salvata.', 'ok');
    closeApptDetail();
    render();
  };
}
