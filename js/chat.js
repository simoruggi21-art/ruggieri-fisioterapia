import { supabase } from './supabaseClient.js';
import { getState, isStaff, role } from './state.js';
import { qs, el, escapeHtml, formatTime, showToast, avatarHtml } from './ui.js';
import { refresh as refreshNotifications } from './notifications.js';

let activePatientId = null;
let pollingStarted = false;
let editingMessageId = null;
let renderingMessages = false;

async function fetchMyPatients() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'patient')
    .order('full_name');
  if (error) { console.error(error); return []; }
  return data;
}

async function fetchMessages(patientId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: true });
  if (error) { console.error(error); return []; }
  return data;
}

async function attachmentUrl(path) {
  const { data, error } = await supabase.storage.from('attachments').createSignedUrl(path, 3600);
  if (error) { console.error(error); return '#'; }
  return data.signedUrl;
}

export async function render() {
  const { session, profile } = getState();
  if (!session || !profile) return;

  if (isStaff()) {
    const patients = await fetchMyPatients();
    if (!activePatientId && patients.length) activePatientId = patients[0].id;
    renderThreadList(patients);
    qs('.chat-shell')?.classList.remove('no-threads');
    qs('#chatHeader').textContent = patients.find(p => p.id === activePatientId)?.full_name || 'Seleziona un paziente';
  } else {
    activePatientId = session.user.id;
    qs('#threadList').innerHTML = '';
    qs('#threadList').style.display = 'none';
    // Senza la colonna della lista conversazioni, la griglia "260px 1fr" del
    // chat-shell lascerebbe comunque riservata quella prima colonna vuota:
    // .chat-main verrebbe posizionato li' invece di occupare tutto lo spazio,
    // apparendo stretto con un ampio vuoto accanto. Con un solo interlocutore
    // il paziente non ha bisogno della lista: passiamo a una sola colonna.
    qs('.chat-shell')?.classList.add('no-threads');
    qs('#chatHeader').textContent = 'Simone Ruggieri — fisioterapista';
  }

  if (activePatientId) await renderMessages();
  if (isStaff() && activePatientId) await markThreadRead(activePatientId);
  if (activePatientId) await markAsRead(activePatientId);

  if (!pollingStarted) {
    pollingStarted = true;
    setInterval(async () => {
      if (!activePatientId || editingMessageId) return;
      await renderMessages();
      if (isStaff()) await markThreadRead(activePatientId);
      await markAsRead(activePatientId);
    }, 15000);
  }
}

function renderThreadList(patients) {
  const list = qs('#threadList');
  list.style.display = '';
  list.innerHTML = '';
  if (patients.length === 0) {
    list.appendChild(el('div', 'thread-item', 'Nessun paziente assegnato.'));
    return;
  }
  patients.forEach((p) => {
    const item = el('div', 'thread-item' + (p.id === activePatientId ? ' active' : ''), '');
    item.innerHTML = `${avatarHtml(p.full_name || p.email)}<div class="name">${escapeHtml(p.full_name || p.email)}</div>`;
    item.onclick = () => { activePatientId = p.id; render(); };
    list.appendChild(item);
  });
}

function statusHtml(m) {
  if (m.read_at) return `<span class="msg-status seen">Visualizzato · ${formatTime(m.read_at)}</span>`;
  return `<span class="msg-status">Consegnato</span>`;
}

async function renderMessages() {
  if (renderingMessages) return;
  renderingMessages = true;
  try {
    await renderMessagesInner();
  } finally {
    renderingMessages = false;
  }
}

async function renderMessagesInner() {
  const box = qs('#chatMessages');
  const messages = await fetchMessages(activePatientId);
  const myRole = role();
  box.innerHTML = '';
  for (const m of messages) {
    const mine = m.sender_role === myRole;
    const bubble = el('div', 'msg ' + (mine ? 'out' : 'in') + (m.attachment_path ? ' file' : ''), '');
    bubble.dataset.id = m.id;

    let bodyHtml;
    if (m.attachment_path) {
      const url = await attachmentUrl(m.attachment_path);
      bodyHtml = `<div class="file-body"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg> <a href="${url}" target="_blank" rel="noopener" style="color:inherit;">${escapeHtml(m.attachment_path.split('/').pop())}</a></div>`;
    } else {
      bodyHtml = `<span class="msg-body">${escapeHtml(m.body)}</span>`;
    }

    const editBtn = (mine && !m.attachment_path)
      ? `<button class="msg-edit-btn" title="Modifica messaggio" data-edit="${m.id}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></button>`
      : '';

    bubble.innerHTML = `
      ${bodyHtml}
      <div class="msg-meta">
        ${m.edited_at ? '<span class="msg-edited">modificato</span>' : ''}
        <span class="msg-time">${formatTime(m.created_at)}</span>
        ${mine ? statusHtml(m) : ''}
        ${editBtn}
      </div>
    `;
    box.appendChild(bubble);

    const editTrigger = bubble.querySelector('[data-edit]');
    if (editTrigger) editTrigger.onclick = () => startEdit(bubble, m);
  }
  box.scrollTop = box.scrollHeight;
}

function startEdit(bubble, m) {
  editingMessageId = m.id;
  bubble.classList.add('editing');
  bubble.innerHTML = `
    <div class="msg-edit-form">
      <input type="text" value="${escapeHtml(m.body || '')}" id="editInput-${m.id}" />
      <button class="btn btn-primary btn-small" id="editSave-${m.id}">Salva</button>
      <button class="btn btn-ghost btn-small" id="editCancel-${m.id}">Annulla</button>
    </div>
  `;
  const input = qs(`#editInput-${m.id}`);
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
  const finish = () => { editingMessageId = null; };
  qs(`#editCancel-${m.id}`).onclick = () => { finish(); renderMessages(); };
  qs(`#editSave-${m.id}`).onclick = () => saveEdit(m.id, input.value, finish);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEdit(m.id, input.value, finish);
    if (e.key === 'Escape') { finish(); renderMessages(); }
  });
}

async function saveEdit(id, newText, finish) {
  const text = newText.trim();
  if (!text) { showToast('Il messaggio non può essere vuoto.', 'error'); return; }
  const { error } = await supabase
    .from('messages')
    .update({ body: text, edited_at: new Date().toISOString() })
    .eq('id', id);
  finish();
  if (error) { showToast('Errore nella modifica del messaggio.', 'error'); return; }
  await renderMessages();
}

async function markThreadRead(patientId) {
  const { error } = await supabase
    .from('messages')
    .update({ read_by_staff: true })
    .eq('patient_id', patientId)
    .eq('read_by_staff', false);
  if (!error) refreshNotifications();
}

async function markAsRead(patientId) {
  const { error } = await supabase.rpc('mark_messages_read', { pid: patientId });
  if (!error) refreshNotifications();
}

export async function deleteThread() {
  if (!activePatientId) return;
  const { data: files } = await supabase.storage.from('attachments').list(activePatientId);
  if (files && files.length) {
    await supabase.storage.from('attachments').remove(files.map((f) => `${activePatientId}/${f.name}`));
  }
  const { error } = await supabase.from('messages').delete().eq('patient_id', activePatientId);
  if (error) { showToast('Errore nell\'eliminazione della conversazione.', 'error'); return; }
  showToast('Conversazione eliminata.', 'ok');
  await renderMessages();
  refreshNotifications();
}

export async function sendMessage(text) {
  const { session } = getState();
  if (!session || !activePatientId || !text.trim()) return;
  const myRole = role();
  const { error } = await supabase.from('messages').insert({
    patient_id: activePatientId,
    sender_id: session.user.id,
    sender_role: myRole,
    body: text.trim(),
    read_by_staff: myRole !== 'patient',
  });
  if (error) { showToast('Errore invio messaggio.', 'error'); return; }
  await renderMessages();
}

export async function sendAttachment(file) {
  const { session } = getState();
  if (!session || !activePatientId || !file) return;
  if (file.size > 8 * 1024 * 1024) { showToast('File troppo grande (max 8 MB).', 'error'); return; }
  const path = `${activePatientId}/${Date.now()}-${file.name}`;
  const { error: upErr } = await supabase.storage.from('attachments').upload(path, file);
  if (upErr) { showToast('Errore caricamento file.', 'error'); return; }
  const myRole = role();
  const { error } = await supabase.from('messages').insert({
    patient_id: activePatientId,
    sender_id: session.user.id,
    sender_role: myRole,
    attachment_path: path,
    read_by_staff: myRole !== 'patient',
  });
  if (error) { showToast('Errore invio allegato.', 'error'); return; }
  await renderMessages();
}
