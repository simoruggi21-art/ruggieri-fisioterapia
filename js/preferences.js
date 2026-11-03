import { supabase } from './supabaseClient.js';
import { getState, setState } from './state.js';
import { qs, showToast } from './ui.js';

// Preferenze del paziente sui promemoria via email. Prima volta (nessuna scelta ancora
// registrata, ad esempio chi e' stato invitato dallo studio): compare una domanda semplice.
// Dopo: tre interruttori nella sezione "Le mie preferenze". Nessun promemoria parte senza consenso.
async function save(values) {
  const { session, profile } = getState();
  if (!session || !profile) return false;
  const patch = { ...values, notify_consent_at: new Date().toISOString() };
  const { error } = await supabase.from('profiles').update(patch).eq('id', session.user.id);
  if (error) { showToast('Errore nel salvataggio delle preferenze.', 'error'); return false; }
  setState({ profile: { ...profile, ...patch } });
  return true;
}

function fill() {
  const { profile } = getState();
  if (!profile) return;
  qs('#prefCheckup').checked = !!profile.notify_checkup;
  qs('#prefExercises').checked = !!profile.notify_exercises;
  qs('#prefReview').checked = !!profile.notify_review;
  const prompt = qs('#reminderPrompt');
  if (prompt) prompt.style.display = profile.notify_consent_at ? 'none' : '';
}

export function wire() {
  ['prefCheckup', 'prefExercises', 'prefReview'].forEach((id) => {
    qs('#' + id)?.addEventListener('change', async () => {
      const ok = await save({
        notify_checkup: qs('#prefCheckup').checked,
        notify_exercises: qs('#prefExercises').checked,
        notify_review: qs('#prefReview').checked,
      });
      if (ok) showToast('Preferenze salvate.', 'ok');
      fill();
    });
  });
  qs('#reminderYes')?.addEventListener('click', async () => {
    if (await save({ notify_checkup: true, notify_exercises: true, notify_review: true })) { showToast('Promemoria attivati: puoi cambiarli quando vuoi da "Le mie preferenze".', 'ok'); fill(); }
  });
  qs('#reminderNo')?.addEventListener('click', async () => {
    if (await save({ notify_checkup: false, notify_exercises: false, notify_review: false })) { showToast('Va bene, nessun promemoria.', 'ok'); fill(); }
  });
}

export function render() { fill(); }
