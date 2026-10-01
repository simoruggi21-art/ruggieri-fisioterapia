// Assistente AI ad uso esclusivo dello staff (mai esposto ai pazienti): un
// aiuto nell'interpretare casi clinici, suggerire protocolli/esercizi da
// valutare, e buttare giu' bozze di note. La conversazione vive solo in
// memoria (non viene salvata), e passa per l'Edge Function "ai-assistant"
// che inoltra la richiesta al modello mantenendo la chiave API lato server.
import { getState } from './state.js';
import { qs, el } from './ui.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const WELCOME_TEXT = 'Ciao Simone. Scrivimi un caso clinico, una domanda su un esercizio/protocollo o cosa ti serve per una nota: ti do suggerimenti professionali. Restano sempre una tua valutazione e una tua decisione: non condividere le mie risposte direttamente con i pazienti.';

let history = [];
let sending = false;

function appendBubble(role, text, extraClass) {
  const box = qs('#aiMessages');
  if (!box) return null;
  const bubble = el('div', 'msg ' + (role === 'user' ? 'out' : 'in') + (extraClass ? ' ' + extraClass : ''), '');
  bubble.appendChild(el('span', 'msg-body', text));
  box.appendChild(bubble);
  box.scrollTop = box.scrollHeight;
  return bubble;
}

function renderWelcome() {
  const box = qs('#aiMessages');
  if (!box) return;
  box.innerHTML = '';
  appendBubble('model', WELCOME_TEXT);
}

export function render() {
  if (!qs('#aiMessages')) return;
  if (history.length === 0) renderWelcome();
}

export function newConversation() {
  history = [];
  renderWelcome();
}

async function callAssistant(message) {
  const { session } = getState();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Errore dell\'assistente AI.');
  return data.reply;
}

export async function sendMessage(text) {
  const trimmed = (text || '').trim();
  if (!trimmed || sending) return;
  sending = true;
  appendBubble('user', trimmed);
  const thinking = appendBubble('model', 'Sto pensando…', 'ai-thinking');
  try {
    const reply = await callAssistant(trimmed);
    history.push({ role: 'user', content: trimmed }, { role: 'model', content: reply });
    thinking.remove();
    appendBubble('model', reply);
  } catch (err) {
    thinking.remove();
    appendBubble('model', err.message, 'ai-thinking');
  } finally {
    sending = false;
  }
}
