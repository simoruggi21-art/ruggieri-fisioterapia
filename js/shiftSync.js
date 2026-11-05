// Sincronizzazione turni federazione -> chiusure agenda, a partire da uno
// screenshot del calendario mensile condiviso (mai dal documento originale:
// lo staff carica una propria immagine, il documento Google non viene mai
// condiviso con nessun servizio esterno). Il riconoscimento dell'immagine è
// l'unica parte demandata a un'AI (Gemini, via l'Edge Function "sync-shifts");
// la conversione in orari locali e l'inserimento in agenda restano codice
// deterministico, qui, esattamente come per "Chiudi questo orario".
import { supabase } from './supabaseClient.js';
import { getState } from './state.js';
import { qs, showToast } from './ui.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { render as renderAgenda } from './agenda.js';

const AM_START = { h: 9, m: 0 };
const AM_END = { h: 13, m: 0 };
const PM_START = { h: 15, m: 0 };
const PM_END = { h: 19, m: 0 };
const DAY_LABELS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

let pendingClosures = [];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fmtDay(d) {
  return `${DAY_LABELS[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function buildClosure(start, end, label) {
  return { start, end, label: `${fmtDay(start)}, ${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}–${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}${label ? ' (' + label + ')' : ''}` };
}

function expandResult(data) {
  const closures = [];
  const year = data.year;
  const month = data.month; // 1-12
  (data.shifts || []).forEach((s) => {
    const range = s.period === 'AM' ? [AM_START, AM_END] : [PM_START, PM_END];
    const start = new Date(year, month - 1, s.day, range[0].h, range[0].m, 0, 0);
    const end = new Date(year, month - 1, s.day, range[1].h, range[1].m, 0, 0);
    closures.push(buildClosure(start, end, 'turno ' + s.period));
  });
  if (data.ferie) {
    const f = data.ferie;
    const from = new Date(f.startYear, f.startMonth - 1, f.startDay, 0, 0, 0, 0);
    const to = new Date(f.endYear, f.endMonth - 1, f.endDay, 0, 0, 0, 0);
    for (let d = new Date(from); d.getTime() <= to.getTime(); d.setDate(d.getDate() + 1)) {
      const start = new Date(d); start.setHours(8, 0, 0, 0);
      const end = new Date(d); end.setHours(19, 0, 0, 0);
      closures.push(buildClosure(start, end, 'ferie'));
    }
  }
  closures.sort((a, b) => a.start - b.start);
  return closures;
}

// Stato visibile nella finestra (non solo un toast, che resta dietro al modale):
// 'loading' = lettura in corso, 'ok' = esito positivo, 'error' = qualcosa e' andato storto.
function setStatus(kind, text) {
  const el = qs('#shiftSyncStatus');
  if (!el) return;
  el.className = 'shift-status' + (kind ? ' ' + kind : '');
  el.innerHTML = '';
  if (!kind) return;
  if (kind === 'loading') el.insertAdjacentHTML('beforeend', '<span class="shift-spinner" aria-hidden="true"></span>');
  if (kind === 'ok') el.insertAdjacentHTML('beforeend', '<span class="shift-icon" aria-hidden="true">✓</span>');
  if (kind === 'error') el.insertAdjacentHTML('beforeend', '<span class="shift-icon" aria-hidden="true">!</span>');
  const span = document.createElement('span');
  span.textContent = text;
  el.appendChild(span);
  el.setAttribute('role', 'status');
}

function setStep(step) {
  // step: 'pick' (scelta file) | 'review' (controlla e conferma) | 'done' (esito)
  qs('#shiftSyncPickStep').style.display = step === 'review' ? 'none' : '';
  qs('#shiftSyncReviewActions').style.display = step === 'review' ? '' : 'none';
  qs('#shiftSyncDoneBtn').style.display = step === 'done' ? '' : 'none';
}

function updateSelectedCount() {
  const box = qs('#shiftSyncPreview');
  const n = box.querySelectorAll('input[type=checkbox][data-idx]:checked').length;
  const btn = qs('#shiftSyncConfirmBtn');
  btn.disabled = n === 0;
  btn.textContent = n ? `Conferma: chiudi ${n} ${n === 1 ? 'orario' : 'orari'} in agenda` : 'Seleziona almeno un orario';
}

function renderPreview() {
  const box = qs('#shiftSyncPreview');
  if (!box) return;
  if (pendingClosures.length === 0) {
    box.innerHTML = '';
    setStep('pick');
    return;
  }
  box.innerHTML = `
    <div class="shift-all"><label><input type="checkbox" id="shiftSyncAll" checked> Seleziona tutti</label></div>
    ${pendingClosures.map((c, i) => `
    <label class="shift-row">
      <input type="checkbox" data-idx="${i}" checked>
      <span>${c.label}</span>
    </label>`).join('')}`;
  box.querySelectorAll('input[data-idx]').forEach((cb) => { cb.onchange = updateSelectedCount; });
  qs('#shiftSyncAll').onchange = (e) => {
    box.querySelectorAll('input[data-idx]').forEach((cb) => { cb.checked = e.target.checked; });
    updateSelectedCount();
  };
  updateSelectedCount();
  setStep('review');
}

// Riporta la finestra allo stato iniziale (chiamata anche all'apertura).
export function resetShiftSync() {
  pendingClosures = [];
  const input = qs('#shiftSyncFileInput');
  if (input) input.value = '';
  const thumb = qs('#shiftSyncThumb');
  if (thumb) { thumb.removeAttribute('src'); thumb.style.display = 'none'; }
  const box = qs('#shiftSyncPreview');
  if (box) box.innerHTML = '';
  setStatus('', '');
  setStep('pick');
  qs('#shiftSyncDoneBtn').style.display = 'none';
}

export async function analyzeShiftScreenshot(file) {
  const input = qs('#shiftSyncFileInput');
  pendingClosures = [];
  qs('#shiftSyncPreview').innerHTML = '';
  const thumb = qs('#shiftSyncThumb');
  if (thumb) { thumb.src = URL.createObjectURL(file); thumb.style.display = 'block'; }
  if (!file.type.startsWith('image/')) {
    setStatus('error', 'Il file non è un\'immagine. Carica uno screenshot (PNG o JPG).');
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    setStatus('error', 'L\'immagine è troppo grande (massimo 8 MB). Riduci lo screenshot e riprova.');
    return;
  }
  input.disabled = true;
  setStatus('loading', `Caricato «${file.name}». Sto leggendo i turni, di solito servono 5-15 secondi…`);
  try {
    const base64 = await fileToBase64(file);
    const { session } = getState();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/sync-shifts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ imageBase64: base64, mimeType: file.type || 'image/png' }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Errore nella lettura dello screenshot.');
    pendingClosures = expandResult(data);
    if (pendingClosures.length) {
      setStatus('ok', `Screenshot letto: ho trovato ${pendingClosures.length} ${pendingClosures.length === 1 ? 'blocco' : 'blocchi'} per Ruggieri. Controlla l'elenco: non è stato ancora chiuso nulla in agenda.`);
    } else {
      setStatus('error', 'Ho letto lo screenshot ma non ho trovato turni o ferie di Ruggieri. Controlla che il nome sia leggibile e riprova.');
    }
    renderPreview();
  } catch (err) {
    setStatus('error', err.message || 'Qualcosa è andato storto. Riprova.');
  } finally {
    input.disabled = false;
    input.value = '';
  }
}

export async function applyPendingClosures() {
  const box = qs('#shiftSyncPreview');
  const checked = Array.from(box.querySelectorAll('input[data-idx]:checked')).map((cb) => pendingClosures[Number(cb.dataset.idx)]);
  if (checked.length === 0) { setStatus('error', 'Nessun orario selezionato.'); return; }
  if (!confirm(`Chiudere ${checked.length} ${checked.length === 1 ? 'orario' : 'orari'} in agenda?\n\nI pazienti non potranno più prenotare in quegli orari.`)) return;
  const btn = qs('#shiftSyncConfirmBtn');
  btn.disabled = true;
  setStatus('loading', 'Sto chiudendo gli orari in agenda…');
  // L'agenda non accetta orari che si sovrappongono: un blocco lungo (es. 9-13) verrebbe
  // rifiutato per intero se anche una sola ora e' gia' chiusa. Si chiude quindi ora per ora
  // (come "Chiudi questo orario") e si saltano solo le ore gia' occupate o chiuse.
  const HOUR = 60 * 60 * 1000;
  let ok = 0, skipped = 0;
  for (const c of checked) {
    for (let t = c.start.getTime(); t < c.end.getTime(); t += HOUR) {
      const { error } = await supabase.from('appointments').insert({
        patient_id: null,
        slot_start: new Date(t).toISOString(),
        slot_end: new Date(Math.min(t + HOUR, c.end.getTime())).toISOString(),
        status: 'chiuso',
      });
      if (error) skipped++; else ok++;
    }
  }
  pendingClosures = [];
  box.innerHTML = '';
  setStep('done');
  setStatus(ok ? 'ok' : 'error', ok
    ? `Fatto: ${ok} ${ok === 1 ? 'ora chiusa' : 'ore chiuse'} in agenda${skipped ? `; ${skipped} saltate perché già occupate o già chiuse` : ''}.`
    : `Nessuna ora chiusa: ${skipped} erano già occupate o già chiuse.`);
  showToast(ok ? `${ok} ore chiuse.` : 'Nessuna ora chiusa.', ok ? 'ok' : 'error');
  renderAgenda();
}
