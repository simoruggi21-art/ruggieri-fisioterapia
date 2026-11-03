import { supabase } from './supabaseClient.js';
import { getState, isAdmin, isManager } from './state.js';
import { showInviteResult } from './invite.js';
import { qs, el, escapeHtml, linkifyHtml, computeAge, showToast, formatDateTime, avatarHtml } from './ui.js';
import { protocolLibrary } from './protocolLibrary.js';
import { exerciseLibrary, exercisePhases, phaseLabel, exerciseVideoUrl, exerciseDose, bumpDose } from './exerciseLibrary.js';
import { evidenceByRegion, regionByProtocol, regionPrinciples, regionLabels } from './evidenceLibrary.js';
import { progressionLibrary } from './progressionLibrary.js';
import { milestonesForCategory } from './milestoneLibrary.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

let activePatientId = null;

async function fetchPatients() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'patient')
    .order('full_name');
  if (error) { console.error(error); return []; }
  return data;
}

export async function fetchUnreadPatientIds() {
  const { data } = await supabase.from('messages').select('patient_id').eq('read_by_staff', false);
  return new Set((data || []).map((m) => m.patient_id));
}

async function fetchOperators() {
  const { data, error } = await supabase.from('profiles').select('id, full_name').eq('role', 'operator').order('full_name');
  if (error) { console.error(error); return []; }
  return data;
}

async function fetchProtocol(patientId) {
  const { data } = await supabase.from('patient_protocol').select('*').eq('patient_id', patientId).maybeSingle();
  return data;
}

async function fetchPrivateNotes(patientId) {
  const { data } = await supabase.from('patient_private_notes').select('*').eq('patient_id', patientId).maybeSingle();
  return data;
}

async function fetchExercises(patientId) {
  const { data, error } = await supabase
    .from('patient_exercises')
    .select('*')
    .eq('patient_id', patientId)
    .order('sort_order');
  if (error) { console.error(error); return []; }
  return data || [];
}

async function fetchCheckins(patientId) {
  const { data } = await supabase
    .from('patient_checkins')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
    .limit(10);
  return data || [];
}

function openRegisterPatientModal() {
  ['regPatientName', 'regPatientEmail', 'regPatientPhone', 'regPatientBirthDate'].forEach((id) => { qs('#' + id).value = ''; });
  qs('#regPatientGender').value = '';
  qs('#regPatientInvite').checked = true;
  qs('#registerPatientOverlay').style.display = 'flex';
}

function closeRegisterPatientModal() {
  qs('#registerPatientOverlay').style.display = 'none';
}

async function registerNewPatient() {
  const { session } = getState();
  const full_name = qs('#regPatientName').value.trim();
  const email = qs('#regPatientEmail').value.trim();
  const phone = qs('#regPatientPhone').value.trim() || null;
  const gender = qs('#regPatientGender').value || null;
  const birth_date = qs('#regPatientBirthDate').value || null;
  if (!full_name || !email) {
    showToast('Nome ed email sono obbligatori.', 'error');
    return;
  }
  const res = await fetch(`${SUPABASE_URL}/functions/v1/create-patient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ full_name, email, phone, gender, birth_date, send_invite: qs('#regPatientInvite').checked }),
  });
  const data = await res.json();
  if (!res.ok) {
    showToast(data.error || 'Errore nella creazione del paziente.', 'error');
    return;
  }
  showToast('Paziente registrato.', 'ok');
  closeRegisterPatientModal();
  activePatientId = data.id;
  await render();
  if (qs('#regPatientInvite').checked) showInviteResult({ name: full_name, phone, invite_sent: data.invite_sent, invite_link: data.invite_link });
}

export function wireRegisterPatientModal() {
  qs('#patientSearchInput')?.addEventListener('input', renderPatientList);
  qs('#patientStatusFilter')?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-status]');
    if (!b) return;
    statusFilter = b.dataset.status;
    qs('#patientStatusFilter').querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === b));
    renderPatientList();
  });
  qs('#registerPatientBtn')?.addEventListener('click', openRegisterPatientModal);
  qs('#registerPatientCloseBtn')?.addEventListener('click', closeRegisterPatientModal);
  qs('#registerPatientConfirmBtn')?.addEventListener('click', registerNewPatient);
}

function formatCheckinAnswers(answers) {
  return Object.entries(answers)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}${k === 'dolore_oggi' ? '%' : ''}`)
    .join(' · ');
}

// Omino della timeline di avanzamento: stessa silhouette a linee sottili
// delle altre icone del sito, con una gonna triangolare per le pazienti
// donne (unica differenza, puramente estetica — non e' un\'illustrazione
// dettagliata, resta uno stick-figure coerente con lo stile minimale).
function personSvg(gender) {
  const legs = gender === 'F'
    ? '<path d="M9 13 L15 13 L17 18.5 L7 18.5 Z"/><line x1="10" y1="18.5" x2="8.3" y2="21.5"/><line x1="14" y1="18.5" x2="15.7" y2="21.5"/>'
    : '<line x1="12" y1="13.5" x2="8" y2="21"/><line x1="12" y1="13.5" x2="16" y2="21"/>';
  return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="4" r="2.4"/>
    <line x1="12" y1="6.4" x2="12" y2="13.5"/>
    <line x1="12" y1="9" x2="7.3" y2="7.2"/>
    <line x1="12" y1="9" x2="16.7" y2="11"/>
    ${legs}
  </svg>`;
}

function buildMilestoneTimelineHtml(milestones, idx, gender) {
  const last = milestones.length - 1;
  const pct = last > 0 ? (idx / last) * 100 : 100;
  const dots = milestones.map((label, i) => {
    const dotPct = last > 0 ? (i / last) * 100 : 0;
    return `<div class="milestone-dot${i <= idx ? ' reached' : ''}" style="left:${dotPct}%;" title="${escapeHtml(label)}"></div>`;
  }).join('');
  const labels = milestones.map((label, i) => `<div class="milestone-label${i === idx ? ' current' : ''}">${escapeHtml(label)}</div>`).join('');
  return `
    <div class="milestone-track">
      <div class="milestone-track-line"><div class="milestone-track-line-fill" style="width:${pct}%;"></div></div>
      ${dots}
      <div class="milestone-figure" style="left:${pct}%;">${personSvg(gender)}</div>
    </div>
    <div class="milestone-labels">${labels}</div>
  `;
}

// Disegna la timeline e, se editabile, collega i pulsanti avanti/indietro:
// ogni spostamento richiama onChange(nuovoIndice) (che persiste su
// patient_protocol.milestone_index) e ridisegna subito il blocco.
function renderMilestoneBlock(container, { category, milestoneIndex, gender, editable, onChange }) {
  if (!container) return;
  const milestones = milestonesForCategory(category);
  let idx = Math.max(0, Math.min(milestoneIndex || 0, milestones.length - 1));
  function draw() {
    const controls = editable ? `
      <div class="milestone-controls">
        <button type="button" class="btn btn-ghost btn-small" id="milestoneBackBtn" ${idx === 0 ? 'disabled' : ''}>◂ Indietro</button>
        <button type="button" class="btn btn-ghost btn-small" id="milestoneNextBtn" ${idx === milestones.length - 1 ? 'disabled' : ''}>Avanti ▸</button>
      </div>` : '';
    container.innerHTML = buildMilestoneTimelineHtml(milestones, idx, gender) + controls;
    if (editable) {
      container.querySelector('#milestoneBackBtn')?.addEventListener('click', () => { if (idx > 0) { idx -= 1; onChange(idx); draw(); } });
      container.querySelector('#milestoneNextBtn')?.addEventListener('click', () => { if (idx < milestones.length - 1) { idx += 1; onChange(idx); draw(); } });
    }
  }
  draw();
}

async function updateMilestoneIndex(patientId, newIndex) {
  const { session } = getState();
  const { error } = await supabase.from('patient_protocol').upsert({ patient_id: patientId, milestone_index: newIndex, updated_at: new Date().toISOString(), updated_by: session.user.id });
  if (error) showToast('Errore nell\'aggiornamento del traguardo.', 'error');
}

const CARE_STATUS = [
  { id: 'in_valutazione', label: 'In valutazione' },
  { id: 'in_trattamento', label: 'In trattamento' },
  { id: 'in_pausa', label: 'In pausa' },
  { id: 'terminato', label: 'Concluso' },
];
let statusFilter = '';

let cachedPatients = [];
let cachedUnreadIds = new Set();

export async function render() {
  const list = qs('#patientList');
  if (!list) return;
  const [patients, unreadIds] = await Promise.all([fetchPatients(), fetchUnreadPatientIds()]);
  cachedPatients = patients;
  cachedUnreadIds = unreadIds;
  if (!activePatientId && patients.length) activePatientId = patients[0].id;

  renderPatientList();

  const p = patients.find((x) => x.id === activePatientId);
  await renderDetail(p, unreadIds.has(activePatientId));
}

// Filtra sulla ricerca (nome/email) e ordina mettendo prima chi ha messaggi
// non letti, cosi' con tanti pazienti non si rischia di perderne uno con
// novita' in fondo a una lista lunga. Separata da render() cosi' digitare
// nella ricerca non richiede un nuovo giro di query al database: riusa i
// dati gia' caricati in cachedPatients/cachedUnreadIds.
function renderPatientList() {
  const list = qs('#patientList');
  if (!list) return;
  const query = (qs('#patientSearchInput')?.value || '').trim().toLowerCase();
  let patients = cachedPatients;
  if (query) {
    patients = patients.filter((p) => (p.full_name || '').toLowerCase().includes(query) || (p.email || '').toLowerCase().includes(query));
  }
  // Array.prototype.sort e' stabile: i pazienti arrivano gia' ordinati per
  // nome da fetchPatients(), quindi qui si preserva l'alfabetico all'interno
  // dei due gruppi (non letti prima, poi il resto).
  if (statusFilter) patients = patients.filter((p) => (p.care_status || 'in_valutazione') === statusFilter);
  patients = [...patients].sort((a, b) => (cachedUnreadIds.has(a.id) ? 0 : 1) - (cachedUnreadIds.has(b.id) ? 0 : 1));

  list.innerHTML = '';
  if (patients.length === 0) {
    list.appendChild(el('div', 'patient-item', query ? 'Nessun paziente trovato.' : 'Nessun paziente assegnato al momento.'));
  }
  patients.forEach((p) => {
    const age = computeAge(p.birth_date);
    const item = el('div', 'patient-item' + (p.id === activePatientId ? ' active' : ''), '');
    const unreadBadge = cachedUnreadIds.has(p.id) ? '<span class="unread-dot" title="Nuovo messaggio"></span>' : '';
    item.innerHTML = `${avatarHtml(p.full_name || p.email)}<div class="p-info"><div class="p-name">${escapeHtml(p.full_name || p.email)}${unreadBadge}</div><div class="p-meta">${escapeHtml(p.gender || '—')} · ${age ?? '—'} anni${p.sessions_per_week ? ' · ' + p.sessions_per_week + '/sett.' : ''}</div></div><span class="care-chip care-${p.care_status || 'in_valutazione'}">${CARE_STATUS.find((c) => c.id === (p.care_status || 'in_valutazione'))?.label || ''}</span>`;
    item.onclick = async () => {
      activePatientId = p.id; renderPatientList();
      await renderDetail(p, cachedUnreadIds.has(p.id));
      // Su schermi stretti lista e scheda sono impilate: porta la scheda in vista.
      if (window.innerWidth <= 860) qs('#patientDetail').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    list.appendChild(item);
  });
}

export async function renderDetail(p, hasUnread) {
  const detail = qs('#patientDetail');
  if (!p) { detail.innerHTML = '<p class="text-dim">Seleziona un paziente dalla lista.</p>'; return; }

  const [protocol, notes, operators, checkins, exercises] = await Promise.all([
    fetchProtocol(p.id), fetchPrivateNotes(p.id), isAdmin() ? fetchOperators() : Promise.resolve([]), fetchCheckins(p.id), fetchExercises(p.id),
  ]);
  const age = computeAge(p.birth_date);

  detail.innerHTML = `
    <div class="patient-header">
      <div>
        <h3>${escapeHtml(p.full_name || p.email)}${hasUnread ? '<span class="unread-dot" title="Nuovo messaggio"></span>' : ''}</h3>
        ${isManager() ? `
          <p class="meta-line" style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            ${escapeHtml(p.gender || '—')} ·
            <span style="display:inline-flex; align-items:center; gap:6px;">
              età: <input type="date" id="patientBirthDateInput" value="${p.birth_date || ''}" style="background:var(--bg-alt); border:1px solid var(--line); color:var(--text); padding:3px 6px; border-radius:3px; font-size:12.5px;">
              (${age ?? '—'} anni)
            </span>
            · tel. ${escapeHtml(p.phone || '—')} · ${escapeHtml(p.email || '')}
          </p>
        ` : `
          <p class="meta-line">${escapeHtml(p.gender || '—')} · ${age ?? '—'} anni · tel. ${escapeHtml(p.phone || '—')} · ${escapeHtml(p.email || '')}</p>
        `}
      </div>
      ${isAdmin() ? `
      <div>
        <label class="text-dim" style="font-size:12.5px; display:block; margin-bottom:5px;">Assegnato a</label>
        <select id="assignSelect" style="background:var(--bg-alt); border:1px solid var(--line); color:var(--text); padding:8px 12px; border-radius:3px; font-size:13.5px;">
          <option value="">Solo Simone (nessun operatore)</option>
          ${operators.map(o => `<option value="${o.id}" ${p.operator_id === o.id ? 'selected' : ''}>${escapeHtml(o.full_name)}</option>`).join('')}
        </select>
        <button class="btn btn-danger-ghost btn-small" id="deletePatientBtn" style="margin-top:10px; width:100%;">Elimina paziente</button>
      </div>` : ''}
    </div>

    <div class="record-block" id="carePlan">
      <div class="rb-title">Piano di cura</div>
      <div class="care-grid">
        <label>Stato
          <select id="careStatusSelect">${CARE_STATUS.map((c) => `<option value="${c.id}" ${(p.care_status || 'in_valutazione') === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}</select>
        </label>
        <label>Sedute a settimana
          <span class="rx-step"><button type="button" id="careSessMinus" aria-label="Meno sedute">−</button><input id="careSessionsInput" inputmode="numeric" value="${p.sessions_per_week ?? ''}" placeholder="es. 2"><button type="button" id="careSessPlus" aria-label="Più sedute">+</button></span>
        </label>
      </div>
      <p class="text-dim care-meta" id="careMeta">${careMetaText(p)}</p>
    </div>

    <div class="record-block suggest">
      <details class="library-toggle">
        <summary>Suggerimento protocollo</summary>
        <div class="library-toggle-body">
          <p class="rb-sub">Scegli un quadro clinico: propone un protocollo di partenza da rivedere e personalizzare — non è un'indicazione clinica automatica.</p>
          <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
            <select id="protocolSuggestSelect" style="flex:1; min-width:220px;">
              <option value="">— seleziona un quadro clinico —</option>
              ${[...new Set(protocolLibrary.map(pl => pl.category))].map(cat =>
                `<optgroup label="${cat}">${protocolLibrary.filter(pl => pl.category === cat).map(pl => `<option value="${pl.id}">${pl.label}</option>`).join('')}</optgroup>`
              ).join('')}
            </select>
            <button class="btn btn-ghost btn-small" id="useSuggestBtn">Usa suggerimento</button>
          </div>
          <p id="suggestPreview" class="text-dim" style="font-size:13px; margin-top:12px; display:none; white-space:pre-line;"></p>
        </div>
      </details>
    </div>

    <div class="record-block">
      <div class="rb-title">Percorso di avanzamento</div>
      <p class="rb-sub">Sposta il traguardo quando il paziente lo raggiunge — nessun calcolo automatico, la valutazione resta tua.</p>
      <div id="milestoneTimeline"></div>
    </div>

    <div class="record-block" id="guidedPath">
      <div class="rb-title">Percorso guidato per fasi</div>
      <p class="rb-sub">Per il quadro clinico scelto vedi le fasi (acuta, subacuta, rinforzo, ritorno all'attività) con obiettivi, esercizi e criteri per avanzare. Aggiungi alla scheda gli esercizi della fase in cui si trova il paziente.</p>
      <select id="guidedProtocolSelect" style="width:100%; margin-bottom:14px;">
        <option value="">— scegli un quadro clinico —</option>
        ${[...new Set(protocolLibrary.map(pl => pl.category))].map(cat =>
          `<optgroup label="${cat}">${protocolLibrary.filter(pl => pl.category === cat).map(pl => `<option value="${pl.id}" ${pl.id === protocol?.protocol_library_id ? 'selected' : ''}>${pl.label}</option>`).join('')}</optgroup>`
        ).join('')}
      </select>
      <div id="guidedPhases"></div>
    </div>

    <div class="record-block public">
      <div class="rb-title">Protocollo ed esercizi <span class="visibility-tag">visibile al paziente</span></div>
      <p class="rb-sub">Puoi incollare un link (es. un video YouTube che spiega l'esercizio): diventerà cliccabile per il paziente.</p>
      <textarea id="protocolText">${escapeHtml(protocol?.protocol_text || '')}</textarea>
    </div>

    <div class="record-block public">
      <div class="rb-title">I miei esercizi <span class="visibility-tag">visibile al paziente</span></div>
      <details class="library-toggle">
        <summary>Aggiungi dalla libreria o personalizzato</summary>
        <div class="library-toggle-body">
          <p class="rb-sub">Tieni premuto Cmd (Mac) o Ctrl (Windows) per selezionare più esercizi dalla libreria insieme, o compilane uno personalizzato: comparirà nella sezione "I miei esercizi" del paziente.</p>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
            <select id="exercisePhaseFilter" style="flex:1; min-width:160px;">
              <option value="">Tutte le fasi</option>
              ${exercisePhases.map((ph) => `<option value="${ph.id}">${ph.label}</option>`).join('')}
            </select>
            <input type="text" id="exerciseSearchInput" placeholder="Cerca (es. rotulea, equilibrio...)" style="flex:2; min-width:180px;">
          </div>
          <select id="exerciseSuggestSelect" multiple size="8" style="width:100%; margin-bottom:10px;"></select>
          <div style="display:flex; justify-content:flex-end;">
            <button class="btn btn-ghost btn-small" id="addLibraryExerciseBtn">Aggiungi selezionati</button>
          </div>
          <div style="margin-top:16px; border-top:1px solid var(--line); padding-top:16px;">
            <label class="text-dim" style="font-size:12px; display:block; margin-bottom:5px;">Nome esercizio personalizzato</label>
            <input type="text" id="customExerciseName" style="width:100%;" placeholder="Es. Esercizio specifico...">
            <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end; margin-top:12px;">
              <div style="flex:1; min-width:90px;">
                <label class="text-dim" style="font-size:12px; display:block; margin-bottom:5px;">Serie</label>
                <input type="text" id="customExerciseSets" style="width:100%;" placeholder="Es. 3">
              </div>
              <div style="flex:1; min-width:90px;">
                <label class="text-dim" style="font-size:12px; display:block; margin-bottom:5px;">Ripetizioni</label>
                <input type="text" id="customExerciseReps" style="width:100%;" placeholder="Es. 12">
              </div>
              <div style="flex:1; min-width:130px;">
                <label class="text-dim" style="font-size:12px; display:block; margin-bottom:5px;">Fase</label>
                <select id="customExercisePhase" style="width:100%;"><option value="">Nessuna</option>${exercisePhases.map((ph) => `<option value="${ph.id}">${ph.label}</option>`).join('')}</select>
              </div>
              <div style="flex:3; min-width:200px;">
                <label class="text-dim" style="font-size:12px; display:block; margin-bottom:5px;">Note</label>
                <input type="text" id="customExerciseNotes" style="width:100%;" placeholder="Indicazioni aggiuntive...">
              </div>
              <button class="btn btn-ghost btn-small" id="addCustomExerciseBtn">Aggiungi personalizzato</button>
            </div>
          </div>
        </div>
      </details>
      <div id="exerciseList" style="display:flex; flex-direction:column; gap:10px; margin-top:18px;">
        ${exercises.length === 0
          ? '<p class="text-dim" style="font-size:13px;">Nessun esercizio assegnato finora.</p>'
          : groupExercisesByPhase(exercises).map((g) => `
            <div class="exercise-phase-head">${escapeHtml(g.label)} <span>${g.items.length}</span></div>
            ${g.items.map((ex) => `
            <div class="rx-card">
              <div class="rx-head">
                <div style="min-width:0;">
                  <div style="font-weight:500; font-size:13.5px;">${escapeHtml(ex.name)}</div>
                  <div class="text-dim" style="font-size:12.5px; margin-top:3px;">${exerciseHowHtml(ex)}</div>
                </div>
                <div style="display:flex; gap:6px; flex-shrink:0; align-items:center;">
                  <select data-phase-exercise="${ex.id}" aria-label="Fase" style="font-size:12px; padding:3px 6px; max-width:120px;">
                    <option value="">Senza fase</option>
                    ${exercisePhases.map((ph) => `<option value="${ph.id}" ${ex.phase === ph.id ? 'selected' : ''}>${ph.label}</option>`).join('')}
                  </select>
                  <button class="btn btn-ghost btn-small" data-remove-exercise="${ex.id}" style="padding:4px 9px; font-size:12px;" aria-label="Rimuovi">✕</button>
                </div>
              </div>
              <div class="rx-grid" data-rx="${ex.id}">
                <label>Serie <span class="rx-step"><input data-rx-field="sets" value="${escapeHtml(ex.sets || '')}" inputmode="numeric"><button type="button" data-rx-bump="sets" aria-label="Più serie">+</button></span></label>
                <label>Ripetizioni <span class="rx-step"><input data-rx-field="reps" value="${escapeHtml(ex.reps || '')}"><button type="button" data-rx-bump="reps" aria-label="Più ripetizioni">+</button></span></label>
                <label>Carico / tenuta <input data-rx-field="load" value="${escapeHtml(ex.load || '')}" placeholder="es. 2 kg, tenuta 10 s"></label>
                <label>Frequenza <input data-rx-field="frequency" value="${escapeHtml(ex.frequency || '')}" placeholder="es. 3 volte a settimana"></label>
                <label class="rx-wide">Note per il paziente <input data-rx-field="notes" value="${escapeHtml(ex.notes || '')}" placeholder="Indicazioni, oppure incolla un link video"></label>
              </div>
            </div>`).join('')}
          `).join('')}
      </div>
    </div>

    <div class="record-block private">
      <div class="rb-title">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
        Note private <span class="visibility-tag">non visibili al paziente</span>
      </div>
      <textarea id="privateText">${escapeHtml(notes?.notes_text || '')}</textarea>
    </div>

    <button class="btn btn-primary btn-small" id="saveRecordBtn">Salva scheda</button>

    <div class="record-block" style="margin-top:30px;">
      <div class="rb-title">Check-in di salute recenti</div>
      ${checkins.length === 0
        ? '<p class="text-dim" style="font-size:13px;">Nessun check-in ricevuto finora.</p>'
        : `<div style="display:flex; flex-direction:column; gap:10px;">${checkins.map((c) => `
            <div style="border:1px solid var(--line); border-radius:4px; padding:12px 14px; font-size:12.5px;">
              <div class="text-dim" style="margin-bottom:5px;">${formatDateTime(c.created_at)} — ${escapeHtml(c.kind)}</div>
              <div>${escapeHtml(formatCheckinAnswers(c.answers))}</div>
            </div>
          `).join('')}</div>`}
    </div>
  `;

  // Ricorda quale voce della libreria e' stata usata per l'ultimo
  // suggerimento applicato: individua la categoria (quindi la sequenza di
  // traguardi) da salvare insieme al testo del protocollo. Resta null se lo
  // staff scrive il protocollo a mano senza mai usare un suggerimento.
  let selectedProtocolLibraryId = protocol?.protocol_library_id || null;

  qs('#protocolSuggestSelect').addEventListener('change', (e) => {
    const item = protocolLibrary.find((pl) => pl.id === e.target.value);
    const preview = qs('#suggestPreview');
    if (item) { preview.style.display = 'block'; preview.textContent = item.text; } else { preview.style.display = 'none'; }
  });
  qs('#useSuggestBtn').onclick = () => {
    const item = protocolLibrary.find((pl) => pl.id === qs('#protocolSuggestSelect').value);
    if (!item) return;
    qs('#protocolText').value = item.text;
    selectedProtocolLibraryId = item.id;
  };

  wireCarePlan(p);
  drawGuidedPath(p.id, qs('#guidedProtocolSelect').value, exercises);
  qs('#guidedProtocolSelect').addEventListener('change', (e) => drawGuidedPath(p.id, e.target.value, exercises));

  renderMilestoneBlock(qs('#milestoneTimeline'), {
    category: protocolLibrary.find((pl) => pl.id === protocol?.protocol_library_id)?.category || null,
    milestoneIndex: protocol?.milestone_index || 0,
    gender: p.gender,
    editable: true,
    onChange: (newIndex) => updateMilestoneIndex(p.id, newIndex),
  });
  const assignSelect = qs('#assignSelect');
  if (assignSelect) {
    assignSelect.addEventListener('change', async (e) => {
      const { error } = await supabase.from('profiles').update({ operator_id: e.target.value || null }).eq('id', p.id);
      if (error) showToast('Errore assegnazione operatore.', 'error'); else showToast('Operatore aggiornato.', 'ok');
    });
  }
  const deleteBtn = qs('#deletePatientBtn');
  if (deleteBtn) {
    deleteBtn.onclick = () => deletePatient(p);
  }
  const birthDateInput = qs('#patientBirthDateInput');
  if (birthDateInput) {
    birthDateInput.addEventListener('change', async (e) => {
      const { error } = await supabase.from('profiles').update({ birth_date: e.target.value || null }).eq('id', p.id);
      if (error) { showToast('Errore nell\'aggiornamento della data di nascita.', 'error'); return; }
      showToast('Età aggiornata.', 'ok');
      await render();
    });
  }
  populateExerciseSelect();
  qs('#exerciseSearchInput').addEventListener('input', () => populateExerciseSelect());
  qs('#exercisePhaseFilter').addEventListener('change', () => populateExerciseSelect());
  qs('#addLibraryExerciseBtn').onclick = () => addLibraryExercise(p.id, exercises.length);
  qs('#addCustomExerciseBtn').onclick = () => addCustomExercise(p.id, exercises.length);
  detail.querySelectorAll('[data-rx]').forEach((grid) => {
    const id = grid.dataset.rx;
    const save = async () => {
      const row = {};
      grid.querySelectorAll('[data-rx-field]').forEach((inp) => { row[inp.dataset.rxField] = inp.value.trim() || null; });
      const { error } = await supabase.from('patient_exercises').update({ ...row, updated_by: getState().session.user.id }).eq('id', id);
      if (error) { showToast('Errore nel salvataggio della prescrizione.', 'error'); return; }
      showToast('Prescrizione aggiornata.', 'ok');
    };
    grid.querySelectorAll('input').forEach((inp) => inp.addEventListener('change', save));
    grid.querySelectorAll('[data-rx-bump]').forEach((btn) => {
      btn.onclick = () => {
        const inp = grid.querySelector(`[data-rx-field="${btn.dataset.rxBump}"]`);
        inp.value = bumpDose(inp.value || '0', 1);
        save();
      };
    });
  });
  detail.querySelectorAll('[data-phase-exercise]').forEach((sel) => {
    sel.onchange = async () => {
      const { error } = await supabase.from('patient_exercises').update({ phase: sel.value || null }).eq('id', sel.dataset.phaseExercise);
      if (error) { showToast('Errore nel cambio di fase.', 'error'); return; }
      await render();
    };
  });
  detail.querySelectorAll('[data-remove-exercise]').forEach((btn) => {
    btn.onclick = () => removeExercise(btn.dataset.removeExercise);
  });
  qs('#saveRecordBtn').onclick = async () => {
    const { session } = getState();
    const protocolText = qs('#protocolText').value;
    const notesText = qs('#privateText').value;
    const [r1, r2] = await Promise.all([
      supabase.from('patient_protocol').upsert({ patient_id: p.id, protocol_text: protocolText, protocol_library_id: selectedProtocolLibraryId, updated_at: new Date().toISOString(), updated_by: session.user.id }),
      supabase.from('patient_private_notes').upsert({ patient_id: p.id, notes_text: notesText, updated_at: new Date().toISOString(), updated_by: session.user.id }),
    ]);
    if (r1.error || r2.error) { showToast('Errore nel salvataggio.', 'error'); return; }
    const btn = qs('#saveRecordBtn');
    btn.textContent = 'Salvato ✓';
    setTimeout(() => { btn.textContent = 'Salva scheda'; }, 1400);
  };
}

async function deletePatient(p) {
  const confirmed = confirm(`Eliminare definitivamente ${p.full_name || p.email}? Verranno cancellati per sempre il suo account, le prenotazioni, i messaggi e le schede cliniche. Non si può annullare.\n\nAttenzione: la documentazione sanitaria va di norma conservata per 10 anni dalla conclusione del percorso. Elimina solo se sei sicuro che non ci siano obblighi di conservazione (es. richiesta di cancellazione già valutata o dati inseriti per errore).`);
  if (!confirmed) return;
  const { session } = getState();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/delete-patient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ patient_id: p.id }),
  });
  const data = await res.json();
  if (!res.ok) {
    showToast(data.error || 'Errore nell\'eliminazione del paziente.', 'error');
    return;
  }
  showToast('Paziente eliminato.', 'ok');
  if (activePatientId === p.id) activePatientId = null;
  await render();
}

// Un esercizio da libreria ha solo "description" (testo unico gia' pronto);
// uno compilato a mano ha invece serie/ripetizioni/note separati: mostriamo
// la versione strutturata quando c'e', altrimenti il testo unico.
// Percorso guidato: per ogni fase mostra obiettivo, esercizi (selezionabili) e criterio
// di avanzamento; "Aggiungi" copia nella scheda del paziente gli esercizi spuntati,
// con la fase del percorso, saltando quelli gia' assegnati (stesso nome).
function careMetaText(p) {
  const bits = [];
  if (p.care_started_at) bits.push('Preso in carico il ' + new Date(p.care_started_at).toLocaleDateString('it-IT'));
  if (p.care_status === 'terminato' && p.care_ended_at) bits.push('concluso il ' + new Date(p.care_ended_at).toLocaleDateString('it-IT'));
  if (p.review_requested_at) bits.push('richiesta di recensione inviata il ' + new Date(p.review_requested_at).toLocaleDateString('it-IT'));
  else if (p.care_status === 'terminato') bits.push(p.notify_review ? 'la richiesta di recensione parte 2 giorni dopo la conclusione' : 'il paziente non ha attivato la richiesta di recensione');
  const consents = [p.notify_checkup && 'check-up', p.notify_exercises && 'esercizi', p.notify_review && 'recensione'].filter(Boolean);
  bits.push(consents.length ? 'promemoria attivi: ' + consents.join(', ') : 'promemoria email non attivati dal paziente');
  return bits.join(' · ');
}

// Piano di cura: stato e sedute a settimana si salvano da soli. In trattamento registra la
// data di presa in carico; concluso registra la fine (da cui parte la richiesta di recensione).
function wireCarePlan(p) {
  const status = qs('#careStatusSelect');
  const sess = qs('#careSessionsInput');
  if (!status || !sess) return;
  const save = async (extra = {}) => {
    const v = sess.value.trim();
    const sessions = v === '' ? null : Math.max(0, Math.min(14, parseInt(v, 10) || 0));
    const patch = { care_status: status.value, sessions_per_week: sessions, ...extra };
    if (status.value === 'in_trattamento' && !p.care_started_at) patch.care_started_at = new Date().toISOString();
    if (status.value === 'terminato' && !p.care_ended_at) patch.care_ended_at = new Date().toISOString();
    if (status.value !== 'terminato' && p.care_ended_at) { patch.care_ended_at = null; }
    const { error } = await supabase.from('profiles').update(patch).eq('id', p.id);
    if (error) { showToast('Errore nel salvataggio del piano di cura.', 'error'); return; }
    Object.assign(p, patch);
    const cached = cachedPatients.find((x) => x.id === p.id); if (cached) Object.assign(cached, patch);
    qs('#careMeta').textContent = careMetaText(p);
    renderPatientList();
    showToast('Piano di cura aggiornato.', 'ok');
  };
  status.addEventListener('change', () => save());
  sess.addEventListener('change', () => save());
  qs('#careSessPlus').onclick = () => { sess.value = String(Math.min(14, (parseInt(sess.value, 10) || 0) + 1)); save(); };
  qs('#careSessMinus').onclick = () => { sess.value = String(Math.max(0, (parseInt(sess.value, 10) || 0) - 1)); save(); };
}

function doseLabel(ex) {
  const d = exerciseDose(ex);
  const parts = [];
  if (d.sets && d.reps) parts.push(`${escapeHtml(d.sets)} × ${escapeHtml(d.reps)}`);
  else if (d.reps) parts.push(`${escapeHtml(d.reps)} rip.`);
  if (d.load) parts.push(escapeHtml(d.load));
  if (d.frequency) parts.push(escapeHtml(d.frequency));
  return parts.join(' · ');
}

// Principi di prescrizione e fonti PubMed del distretto (solo per le patologie dei distretti principali).
function evidenceHtml(protocolId) {
  const region = regionByProtocol[protocolId];
  if (!region) return '';
  const refs = evidenceByRegion[region] || [];
  return `
    <div class="guided-evidence">
      <p class="guided-principles"><strong>${escapeHtml(regionLabels[region])} — principi dalla letteratura:</strong> ${escapeHtml(regionPrinciples[region])}</p>
      <details class="guided-sources">
        <summary>Fonti PubMed (${refs.length})</summary>
        <ul>
          ${refs.map((r) => `<li><a href="https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title)}</a> <span class="text-dim">(${escapeHtml(r.journal)}, ${r.year})</span><br><span class="text-dim">${escapeHtml(r.note)}</span></li>`).join('')}
        </ul>
        <p class="text-dim" style="font-size:12px;">Ricerca del 3 novembre 2026. Sintesi in parole nostre: fasi e dosi sono un punto di partenza da adattare al paziente.</p>
      </details>
    </div>`;
}

export function drawGuidedPath(patientId, protocolId, assigned) {
  const box = qs('#guidedPhases');
  if (!box) return;
  const prog = progressionLibrary[protocolId];
  if (!protocolId || !prog) {
    box.innerHTML = '<p class="text-dim" style="font-size:13px;">Scegli un quadro clinico per vedere il percorso a fasi.</p>';
    return;
  }
  const have = new Set(assigned.map((a) => a.name));
  box.innerHTML = evidenceHtml(protocolId) + prog.map((ph, i) => {
    const meta = exercisePhases.find((x) => x.id === ph.phase);
    const items = ph.exercises.map((id) => exerciseLibrary.find((e) => e.id === id)).filter(Boolean);
    return `
    <details class="guided-phase" ${i === 0 ? 'open' : ''}>
      <summary><strong>${escapeHtml(meta.label)}</strong> <span class="text-dim">· ${items.length} esercizi</span></summary>
      <p class="guided-goal"><strong>Obiettivo:</strong> ${escapeHtml(ph.goal)}</p>
      <ul class="guided-list">
        ${items.map((ex) => {
          const done = have.has(ex.name);
          return `<li>
            <label><input type="checkbox" data-guided-ex="${ex.id}" ${done ? 'disabled' : 'checked'}> ${escapeHtml(ex.name)}</label>
            ${done ? '<span class="guided-have">già assegnato</span>' : ''}
            <a class="video-link" href="${exerciseVideoUrl(ex.name)}" target="_blank" rel="noopener noreferrer">▶ video</a>
            ${doseLabel(ex) ? `<div class="guided-dose">Dose di partenza: ${doseLabel(ex)}</div>` : ''}
            <div class="text-dim guided-desc">${escapeHtml(ex.description)}</div>
          </li>`;
        }).join('')}
      </ul>
      <p class="guided-crit"><strong>Per passare alla fase successiva:</strong> ${escapeHtml(ph.criterion)}</p>
      <button type="button" class="btn btn-ghost btn-small" data-guided-add="${ph.phase}">Aggiungi alla scheda gli esercizi selezionati</button>
    </details>`;
  }).join('');
  box.querySelectorAll('[data-guided-add]').forEach((btn) => {
    btn.onclick = () => addGuidedPhase(patientId, btn.dataset.guidedAdd, btn.closest('details'), assigned);
  });
}

async function addGuidedPhase(patientId, phase, detailsEl, assigned) {
  const ids = [...detailsEl.querySelectorAll('[data-guided-ex]:checked')].map((c) => c.dataset.guidedEx);
  const items = ids.map((id) => exerciseLibrary.find((e) => e.id === id)).filter((e) => e && !assigned.some((a) => a.name === e.name));
  if (!items.length) { showToast('Nessun nuovo esercizio selezionato.', 'error'); return; }
  const { session } = getState();
  const rows = items.map((item, i) => ({
    patient_id: patientId,
    name: item.name,
    description: item.description,
    phase,
    ...doseColumns(item),
    sort_order: assigned.length + i,
    updated_by: session.user.id,
  }));
  const { error } = await supabase.from('patient_exercises').insert(rows);
  if (error) { showToast('Errore nell\'aggiunta degli esercizi.', 'error'); return; }
  showToast(items.length > 1 ? `${items.length} esercizi aggiunti.` : 'Esercizio aggiunto.', 'ok');
  await render();
}

// Colonne di prescrizione (serie, ripetizioni, carico/tenuta, frequenza) con la dose di partenza.
function doseColumns(item) {
  const d = exerciseDose(item);
  return { sets: d.sets || null, reps: d.reps || null, load: d.load || null, frequency: d.frequency || null };
}

// Raggruppa gli esercizi per fase (nell'ordine del percorso); quelli senza fase vanno in coda.
function groupExercisesByPhase(exercises) {
  const groups = exercisePhases.map((ph) => ({ ...ph, items: exercises.filter((ex) => ex.phase === ph.id) }));
  const rest = exercises.filter((ex) => !exercisePhases.some((ph) => ph.id === ex.phase));
  if (rest.length) groups.push({ id: '', label: 'Altri esercizi', hint: '', items: rest });
  return groups.filter((g) => g.items.length);
}

// Toglie dal testo le frasi che indicano la dose (es. "3 serie da 10 ripetizioni."):
// quando esiste una prescrizione modificata, restano solo le istruzioni di esecuzione.
function stripDoseSentences(text) {
  const parts = String(text || '').split(/(?<=[.!?])\s+/);
  const kept = parts.filter((p) => !/^(\d+(?:[-–]\d+)?)\s*(serie|ripetizion|volte|minut|secondi|passi|respiri|cicli|sedute|percorsi|saltelli|sessioni)/i.test(p.trim()));
  return (kept.length ? kept : parts).join(' ');
}

// Istruzioni di esecuzione + link video (senza la dose, che sta nella prescrizione).
function exerciseHowHtml(ex) {
  const hasRx = !!(ex.sets || ex.reps || ex.load || ex.frequency);
  const how = ex.description ? linkifyHtml(hasRx ? stripDoseSentences(ex.description) : ex.description) : '';
  const hasOwnLink = /https?:\/\//.test(`${ex.notes || ''} ${ex.description || ''}`);
  const video = ex.name && !hasOwnLink
    ? `<a class="video-link" href="${exerciseVideoUrl(ex.name)}" target="_blank" rel="noopener noreferrer">▶ Guarda un video</a>` : '';
  return [how, video].filter(Boolean).join('<br>');
}

// Vista completa (paziente): prescrizione attuale, istruzioni, note e video.
function exerciseDetailHtml(ex) {
  const rx = [];
  if (ex.sets) rx.push(`Serie: ${escapeHtml(ex.sets)}`);
  if (ex.reps) rx.push(`Ripetizioni: ${escapeHtml(ex.reps)}`);
  if (ex.load) rx.push(`Carico/tenuta: ${escapeHtml(ex.load)}`);
  if (ex.frequency) rx.push(`Frequenza: ${escapeHtml(ex.frequency)}`);
  const lines = [];
  if (rx.length) lines.push(`<strong class="rx-line">${rx.join(' · ')}</strong>`);
  if (ex.notes) lines.push(linkifyHtml(ex.notes));
  const how = exerciseHowHtml(ex);
  if (how) lines.push(how);
  return lines.join('<br>');
}

// I 200 esercizi in un'unica tendina sono scomodi da scorrere: il campo di
// ricerca ricostruisce le opzioni filtrando per nome o categoria man mano
// che si digita, cosi' non serve un componente di autocomplete dedicato.
function populateExerciseSelect() {
  const select = qs('#exerciseSuggestSelect');
  if (!select) return;
  const f = (qs('#exerciseSearchInput')?.value || '').trim().toLowerCase();
  const phase = qs('#exercisePhaseFilter')?.value || '';
  const filtered = exerciseLibrary.filter((ex) =>
    (!phase || ex.phase === phase || ex.always)
    && (!f || ex.name.toLowerCase().includes(f) || ex.category.toLowerCase().includes(f)));
  const categories = [...new Set(filtered.map((ex) => ex.category))];
  select.innerHTML = filtered.length
    ? categories.map((cat) =>
        `<optgroup label="${cat}">${filtered.filter((ex) => ex.category === cat).map((ex) => `<option value="${ex.id}">${escapeHtml(ex.name)}${phase && ex.phase === phase ? '' : ' · ' + (phaseLabel(ex.phase) || '')}</option>`).join('')}</optgroup>`
      ).join('')
    : '<option value="" disabled>Nessun esercizio trovato</option>';
}

async function addLibraryExercise(patientId, currentCount) {
  const select = qs('#exerciseSuggestSelect');
  const selectedIds = [...select.selectedOptions].map((o) => o.value).filter(Boolean);
  if (!selectedIds.length) { showToast('Seleziona almeno un esercizio dalla libreria.', 'error'); return; }
  const items = selectedIds.map((id) => exerciseLibrary.find((ex) => ex.id === id)).filter(Boolean);
  const { session } = getState();
  const rows = items.map((item, i) => ({
    patient_id: patientId,
    name: item.name,
    description: item.description,
    phase: item.phase || null,
    ...doseColumns(item),
    sort_order: currentCount + i,
    updated_by: session.user.id,
  }));
  const { error } = await supabase.from('patient_exercises').insert(rows);
  if (error) { showToast('Errore nell\'aggiunta degli esercizi.', 'error'); return; }
  showToast(items.length > 1 ? `${items.length} esercizi aggiunti.` : 'Esercizio aggiunto.', 'ok');
  await render();
}

async function addCustomExercise(patientId, currentCount) {
  const name = qs('#customExerciseName').value.trim();
  const sets = qs('#customExerciseSets').value.trim();
  const reps = qs('#customExerciseReps').value.trim();
  const notes = qs('#customExerciseNotes').value.trim();
  const phase = qs('#customExercisePhase').value || null;
  if (!name) { showToast('Inserisci il nome dell\'esercizio.', 'error'); return; }
  const { session } = getState();
  const { error } = await supabase.from('patient_exercises').insert({
    patient_id: patientId,
    name,
    sets: sets || null,
    reps: reps || null,
    notes: notes || null,
    phase,
    sort_order: currentCount,
    updated_by: session.user.id,
  });
  if (error) { showToast('Errore nell\'aggiunta dell\'esercizio.', 'error'); return; }
  await render();
}

async function removeExercise(exerciseId) {
  const { error } = await supabase.from('patient_exercises').delete().eq('id', exerciseId);
  if (error) { showToast('Errore nella rimozione dell\'esercizio.', 'error'); return; }
  await render();
}

function isSameDay(isoA, isoB) {
  const a = new Date(isoA); const b = new Date(isoB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export async function renderOwnExercises() {
  const target = qs('#myExercisesList');
  if (!target) return;
  const { session } = getState();
  if (!session) return;
  const exercises = await fetchExercises(session.user.id);
  if (exercises.length === 0) {
    target.innerHTML = '<p class="text-dim">Il tuo fisioterapista non ha ancora assegnato esercizi.</p>';
    return;
  }
  const now = new Date().toISOString();
  target.innerHTML = groupExercisesByPhase(exercises).map((g) => `
    <div class="exercise-phase-head">${escapeHtml(g.label)}${g.hint ? `<small>${escapeHtml(g.hint)}</small>` : ''}</div>
    ${g.items.map((ex) => {
    const doneToday = ex.last_done_at && isSameDay(ex.last_done_at, now);
    return `
    <div class="record-block public">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:14px; flex-wrap:wrap;">
        <div>
          <div class="rb-title" style="font-size:15px;">${escapeHtml(ex.name)}</div>
          <p class="text-dim" style="margin-top:6px; line-height:1.6;">${exerciseDetailHtml(ex)}</p>
        </div>
        ${doneToday
          ? `<span style="color:var(--ok); font-size:13px; white-space:nowrap;">✓ Fatto oggi alle ${new Date(ex.last_done_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>`
          : `<button class="btn btn-ghost btn-small" data-mark-done="${ex.id}" style="white-space:nowrap; flex-shrink:0;">Segna come fatto oggi</button>`}
      </div>
    </div>`;
  }).join('')}
  `).join('');
  target.querySelectorAll('[data-mark-done]').forEach((btn) => {
    btn.onclick = () => markExerciseDone(btn.dataset.markDone);
  });
}

async function markExerciseDone(exerciseId) {
  const { error } = await supabase.rpc('mark_exercise_done', { exercise_id: exerciseId });
  if (error) { showToast('Errore nell\'aggiornamento.', 'error'); return; }
  showToast('Esercizio segnato come fatto oggi.', 'ok');
  await renderOwnExercises();
}

export async function renderOwnProtocol() {
  const target = qs('#myProtocolText');
  if (!target) return;
  const { session, profile } = getState();
  if (!session) return;
  const protocol = await fetchProtocol(session.user.id);
  target.innerHTML = protocol?.protocol_text?.trim()
    ? linkifyHtml(protocol.protocol_text)
    : 'Il tuo fisioterapista non ha ancora inserito un protocollo. Torna a controllare dopo la tua prossima seduta.';

  const timelineEl = qs('#myMilestoneTimeline');
  if (timelineEl) {
    renderMilestoneBlock(timelineEl, {
      category: protocolLibrary.find((pl) => pl.id === protocol?.protocol_library_id)?.category || null,
      milestoneIndex: protocol?.milestone_index || 0,
      gender: profile?.gender,
      editable: false,
    });
  }
}
