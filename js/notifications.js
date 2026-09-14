import { supabase } from './supabaseClient.js';
import { isAdmin, isStaff, getState } from './state.js';
import { qs, showToast } from './ui.js';

const POLL_MS = 15000;
const baseTitle = document.title;

let lastMessageCount = null;
let lastApptCount = null;
let pollingStarted = false;

async function countUnreadMessagesStaff() {
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('read_by_staff', false);
  if (error) { console.error(error); return 0; }
  return count || 0;
}

async function countUnreadMessagesPatient(patientId) {
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', patientId)
    .neq('sender_role', 'patient')
    .is('read_at', null);
  if (error) { console.error(error); return 0; }
  return count || 0;
}

async function countPendingAppointments() {
  const { count, error } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'richiesto');
  if (error) { console.error(error); return 0; }
  return count || 0;
}

function setBadge(id, count) {
  const node = qs('#' + id);
  if (!node) return;
  if (count > 0) {
    node.textContent = count > 99 ? '99+' : String(count);
    node.style.display = '';
  } else {
    node.style.display = 'none';
  }
}

function setDot(id, active) {
  const node = qs('#' + id);
  if (!node) return;
  node.style.display = active ? '' : 'none';
}

function updateTitle(total) {
  document.title = total > 0 ? `(${total}) ${baseTitle}` : baseTitle;
}

export async function refresh() {
  const { session } = getState();
  if (!session) { updateTitle(0); return; }

  if (isStaff()) {
    const msgCount = await countUnreadMessagesStaff();
    setDot('messagesBadge', msgCount > 0);

    let apptCount = 0;
    if (isAdmin()) {
      apptCount = await countPendingAppointments();
      setBadge('agendaBadge', apptCount);
    }

    if (lastMessageCount !== null && msgCount > lastMessageCount) {
      showToast('Hai un nuovo messaggio da un paziente.', 'ok');
    }
    if (lastApptCount !== null && apptCount > lastApptCount) {
      showToast('Nuova richiesta di appuntamento.', 'ok');
    }
    lastMessageCount = msgCount;
    lastApptCount = apptCount;
    updateTitle(msgCount + apptCount);
  } else {
    const msgCount = await countUnreadMessagesPatient(session.user.id);
    setDot('messagesBadge', msgCount > 0);

    if (lastMessageCount !== null && msgCount > lastMessageCount) {
      showToast('Hai un nuovo messaggio dal tuo fisioterapista.', 'ok');
    }
    lastMessageCount = msgCount;
    updateTitle(msgCount);
  }
}

export function startPolling() {
  if (pollingStarted) return;
  pollingStarted = true;
  setInterval(refresh, POLL_MS);
}
