import { supabase } from './supabaseClient.js';
import { getState, isStaff } from './state.js';
import { qs, el, showToast } from './ui.js';
import { weeklyQuestions, dailyQuestions } from './checkinQuestions.js';

const DAY_MS = 24 * 60 * 60 * 1000;
let dismissedThisSession = false;
let currentQuestions = [];
let currentKind = null;

async function isInActiveTreatment(patientId) {
  const { data } = await supabase
    .from('patient_protocol')
    .select('protocol_text')
    .eq('patient_id', patientId)
    .maybeSingle();
  return !!(data && data.protocol_text && data.protocol_text.trim());
}

async function lastCheckinAt(patientId, kind) {
  const { data } = await supabase
    .from('patient_checkins')
    .select('created_at')
    .eq('patient_id', patientId)
    .eq('kind', kind)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ? new Date(data.created_at) : null;
}

export async function maybeShowPopup() {
  const { session, profile } = getState();
  if (!session || !profile || isStaff() || dismissedThisSession) return;

  const active = await isInActiveTreatment(session.user.id);
  const kind = active ? 'giornaliero' : 'settimanale';
  const intervalMs = active ? DAY_MS : 7 * DAY_MS;

  const last = await lastCheckinAt(session.user.id, kind);
  if (last && Date.now() - last.getTime() < intervalMs) return;

  currentKind = kind;
  currentQuestions = kind === 'giornaliero' ? dailyQuestions : weeklyQuestions;
  renderPopup();
}

function renderPopup() {
  qs('#checkinTitle').textContent = currentKind === 'giornaliero' ? 'Come va oggi?' : 'Come stai questa settimana?';
  qs('#checkinSubtitle').textContent = currentKind === 'giornaliero'
    ? 'Due minuti per tenere traccia del tuo percorso di cura.'
    : 'Qualche domanda generale sul tuo stato di salute.';

  const form = qs('#checkinForm');
  form.innerHTML = '';
  const answers = {};

  currentQuestions.forEach((q) => {
    const wrap = el('div', 'checkin-question', '');
    const label = el('label', 'q-label', q.label + (q.optional ? ' (facoltativo)' : ''));
    wrap.appendChild(label);

    if (q.type === 'choice') {
      const choices = el('div', 'checkin-choices', '');
      q.options.forEach((opt) => {
        const btn = el('button', 'checkin-choice', opt);
        btn.type = 'button';
        btn.onclick = () => {
          answers[q.id] = opt;
          choices.querySelectorAll('.checkin-choice').forEach((b) => b.classList.remove('selected'));
          btn.classList.add('selected');
        };
        choices.appendChild(btn);
      });
      wrap.appendChild(choices);
    } else if (q.type === 'scale') {
      const scale = el('div', 'checkin-scale', '');
      for (let i = q.min; i <= q.max; i++) {
        const btn = el('button', '', String(i));
        btn.type = 'button';
        btn.onclick = () => {
          answers[q.id] = i;
          scale.querySelectorAll('button').forEach((b) => b.classList.remove('selected'));
          btn.classList.add('selected');
        };
        scale.appendChild(btn);
      }
      wrap.appendChild(scale);
      if (q.minLabel && q.maxLabel) {
        const labels = el('div', 'checkin-scale-labels', '');
        labels.innerHTML = `<span>${q.minLabel}</span><span>${q.maxLabel}</span>`;
        wrap.appendChild(labels);
      }
    } else if (q.type === 'pain_pct') {
      const row = el('div', 'checkin-pain-row', '');
      const slider = document.createElement('input');
      slider.type = 'range'; slider.min = '0'; slider.max = '100'; slider.step = '5'; slider.value = '0';
      slider.className = 'checkin-pain-slider';
      const readout = el('span', 'checkin-pain-readout', 'Trascina per rispondere');
      slider.oninput = () => {
        answers[q.id] = Number(slider.value);
        readout.textContent = `${slider.value}%`;
      };
      row.appendChild(slider);
      row.appendChild(readout);
      wrap.appendChild(row);
      const labels = el('div', 'checkin-scale-labels', '');
      labels.innerHTML = '<span>Nessun dolore</span><span>Il peggiore possibile</span>';
      wrap.appendChild(labels);
    } else {
      const textarea = document.createElement('textarea');
      textarea.oninput = () => { answers[q.id] = textarea.value; };
      wrap.appendChild(textarea);
    }

    form.appendChild(wrap);
  });

  const submitBtn = el('button', 'btn btn-primary', 'Invia');
  submitBtn.type = 'submit';
  submitBtn.style.marginTop = '10px';
  form.appendChild(submitBtn);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const missing = currentQuestions.filter((q) => !q.optional && (answers[q.id] === undefined || answers[q.id] === ''));
    if (missing.length) { showToast('Rispondi a tutte le domande obbligatorie.', 'error'); return; }
    await submit(answers);
  };

  qs('#checkinOverlay').style.display = 'flex';
}

async function submit(answers) {
  const { session } = getState();
  const { error } = await supabase.from('patient_checkins').insert({
    patient_id: session.user.id,
    kind: currentKind,
    answers,
  });
  if (error) { showToast('Errore nell\'invio, riprova.', 'error'); return; }
  qs('#checkinOverlay').style.display = 'none';
  showToast('Grazie, check-in registrato.', 'ok');
}

export function wireCheckinModal() {
  qs('#checkinCloseBtn').onclick = () => {
    dismissedThisSession = true;
    qs('#checkinOverlay').style.display = 'none';
  };
}
