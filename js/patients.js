import { supabase } from './supabaseClient.js';
import { getState, isAdmin } from './state.js';
import { qs, el, escapeHtml, linkifyHtml, computeAge, showToast, formatDateTime, avatarHtml } from './ui.js';
import { protocolLibrary } from './protocolLibrary.js';
import { exerciseLibrary } from './exerciseLibrary.js';
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

async function fetchUnreadPatientIds() {
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
    body: JSON.stringify({ full_name, email, phone, gender, birth_date }),
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
}

export function wireRegisterPatientModal() {
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

export async function render() {
  const list = qs('#patientList');
  if (!list) return;
  const [patients, unreadIds] = await Promise.all([fetchPatients(), fetchUnreadPatientIds()]);
  if (!activePatientId && patients.length) activePatientId = patients[0].id;

  list.innerHTML = '';
  if (patients.length === 0) {
    list.appendChild(el('div', 'patient-item', 'Nessun paziente assegnato al momento.'));
  }
  patients.forEach((p) => {
    const age = computeAge(p.birth_date);
    const item = el('div', 'patient-item' + (p.id === activePatientId ? ' active' : ''), '');
    const unreadBadge = unreadIds.has(p.id) ? '<span class="unread-dot" title="Nuovo messaggio"></span>' : '';
    item.innerHTML = `${avatarHtml(p.full_name || p.email)}<div class="p-info"><div class="p-name">${escapeHtml(p.full_name || p.email)}${unreadBadge}</div><div class="p-meta">${escapeHtml(p.gender || '—')} · ${age ?? '—'} anni</div></div>`;
    item.onclick = () => { activePatientId = p.id; render(); };
    list.appendChild(item);
  });

  const p = patients.find((x) => x.id === activePatientId);
  await renderDetail(p, unreadIds.has(activePatientId));
}

async function renderDetail(p, hasUnread) {
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
        ${isAdmin() ? `
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

    <div class="record-block suggest">
      <div class="rb-title" style="color:var(--accent);">Suggerimento protocollo</div>
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

    <div class="record-block">
      <div class="rb-title">Percorso di avanzamento</div>
      <p class="rb-sub">Sposta il traguardo quando il paziente lo raggiunge — nessun calcolo automatico, la valutazione resta tua.</p>
      <div id="milestoneTimeline"></div>
    </div>

    <div class="record-block public">
      <div class="rb-title">Protocollo ed esercizi <span class="visibility-tag">visibile al paziente</span></div>
      <p class="rb-sub">Puoi incollare un link (es. un video YouTube che spiega l'esercizio): diventerà cliccabile per il paziente.</p>
      <textarea id="protocolText">${escapeHtml(protocol?.protocol_text || '')}</textarea>
    </div>

    <div class="record-block public">
      <div class="rb-title">I miei esercizi <span class="visibility-tag">visibile al paziente</span></div>
      <p class="rb-sub">Tieni premuto Cmd (Mac) o Ctrl (Windows) per selezionare più esercizi dalla libreria insieme, o compilane uno personalizzato: comparirà nella sezione "I miei esercizi" del paziente.</p>
      <input type="text" id="exerciseSearchInput" placeholder="Cerca nella libreria (es. ginocchio, equilibrio...)" style="width:100%; margin-bottom:10px;">
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
          <div style="flex:3; min-width:200px;">
            <label class="text-dim" style="font-size:12px; display:block; margin-bottom:5px;">Note</label>
            <input type="text" id="customExerciseNotes" style="width:100%;" placeholder="Indicazioni aggiuntive...">
          </div>
          <button class="btn btn-ghost btn-small" id="addCustomExerciseBtn">Aggiungi personalizzato</button>
        </div>
      </div>
      <div id="exerciseList" style="display:flex; flex-direction:column; gap:10px; margin-top:18px;">
        ${exercises.length === 0
          ? '<p class="text-dim" style="font-size:13px;">Nessun esercizio assegnato finora.</p>'
          : exercises.map((ex) => `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; border:1px solid var(--line); border-radius:4px; padding:10px 14px;">
              <div>
                <div style="font-weight:500; font-size:13.5px;">${escapeHtml(ex.name)}</div>
                <div class="text-dim" style="font-size:12.5px; margin-top:3px;">${exerciseDetailHtml(ex)}</div>
              </div>
              <button class="btn btn-ghost btn-small" data-remove-exercise="${ex.id}" style="flex-shrink:0; padding:4px 9px; font-size:12px;">✕</button>
            </div>
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
  qs('#exerciseSearchInput').addEventListener('input', (e) => populateExerciseSelect(e.target.value));
  qs('#addLibraryExerciseBtn').onclick = () => addLibraryExercise(p.id, exercises.length);
  qs('#addCustomExerciseBtn').onclick = () => addCustomExercise(p.id, exercises.length);
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
  const confirmed = confirm(`Eliminare definitivamente ${p.full_name || p.email}? Verranno cancellati per sempre il suo account, le prenotazioni, i messaggi e le schede cliniche. Non si può annullare.`);
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
function exerciseDetailHtml(ex) {
  const structured = [];
  if (ex.sets) structured.push(`Serie: ${escapeHtml(ex.sets)}`);
  if (ex.reps) structured.push(`Ripetizioni: ${escapeHtml(ex.reps)}`);
  const lines = [];
  if (structured.length) lines.push(structured.join(' · '));
  if (ex.notes) lines.push(linkifyHtml(ex.notes));
  if (!lines.length && ex.description) lines.push(linkifyHtml(ex.description));
  return lines.join('<br>');
}

// I 200 esercizi in un'unica tendina sono scomodi da scorrere: il campo di
// ricerca ricostruisce le opzioni filtrando per nome o categoria man mano
// che si digita, cosi' non serve un componente di autocomplete dedicato.
function populateExerciseSelect(filterText = '') {
  const select = qs('#exerciseSuggestSelect');
  if (!select) return;
  const f = filterText.trim().toLowerCase();
  const filtered = f
    ? exerciseLibrary.filter((ex) => ex.name.toLowerCase().includes(f) || ex.category.toLowerCase().includes(f))
    : exerciseLibrary;
  const categories = [...new Set(filtered.map((ex) => ex.category))];
  select.innerHTML = filtered.length
    ? categories.map((cat) =>
        `<optgroup label="${cat}">${filtered.filter((ex) => ex.category === cat).map((ex) => `<option value="${ex.id}">${escapeHtml(ex.name)}</option>`).join('')}</optgroup>`
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
  if (!name) { showToast('Inserisci il nome dell\'esercizio.', 'error'); return; }
  const { session } = getState();
  const { error } = await supabase.from('patient_exercises').insert({
    patient_id: patientId,
    name,
    sets: sets || null,
    reps: reps || null,
    notes: notes || null,
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
  target.innerHTML = exercises.map((ex) => {
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
    </div>
  `;
  }).join('');
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
