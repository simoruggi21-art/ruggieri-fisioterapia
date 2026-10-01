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

function renderPreview() {
  const box = qs('#shiftSyncPreview');
  if (!box) return;
  if (pendingClosures.length === 0) {
    box.innerHTML = '<p class="text-dim" style="font-size:13px;">Nessun turno o ferie di Ruggieri trovato nello screenshot.</p>';
    qs('#shiftSyncConfirmBtn').style.display = 'none';
    return;
  }
  box.innerHTML = pendingClosures.map((c, i) => `
    <label style="display:flex; align-items:center; gap:10px; padding:8px 0; font-size:13.5px;">
      <input type="checkbox" data-idx="${i}" checked>
      ${c.label}
    </label>
  `).join('');
  qs('#shiftSyncConfirmBtn').style.display = '';
}

export async function analyzeShiftScreenshot(file) {
  const statusEl = qs('#shiftSyncStatus');
  const preview = qs('#shiftSyncPreview');
  if (statusEl) statusEl.textContent = 'Sto leggendo lo screenshot…';
  if (preview) preview.innerHTML = '';
  qs('#shiftSyncConfirmBtn').style.display = 'none';
  pendingClosures = [];
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
    if (statusEl) statusEl.textContent = pendingClosures.length
      ? `Trovati ${pendingClosures.length} blocchi da chiudere. Controlla e conferma.`
      : 'Analisi completata.';
    renderPreview();
  } catch (err) {
    if (statusEl) statusEl.textContent = '';
    showToast(err.message, 'error');
  }
}

export async function applyPendingClosures() {
  const box = qs('#shiftSyncPreview');
  const checked = Array.from(box.querySelectorAll('input[type=checkbox]:checked')).map((cb) => pendingClosures[Number(cb.dataset.idx)]);
  if (checked.length === 0) { showToast('Nessun blocco selezionato.', 'error'); return; }
  let ok = 0, skipped = 0;
  for (const c of checked) {
    const { error } = await supabase.from('appointments').insert({
      patient_id: null,
      slot_start: c.start.toISOString(),
      slot_end: c.end.toISOString(),
      status: 'chiuso',
    });
    if (error) skipped++; else ok++;
  }
  showToast(`${ok} orari chiusi${skipped ? `, ${skipped} già occupati/esistenti saltati` : ''}.`, 'ok');
  pendingClosures = [];
  renderPreview();
  qs('#shiftSyncStatus').textContent = '';
  renderAgenda();
}
