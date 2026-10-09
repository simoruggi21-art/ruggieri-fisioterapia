// Modulo "richiedi un appuntamento" del sito pubblico: non richiede
// registrazione. Scrive in contact_requests (inserimento consentito ad anon,
// lettura solo per lo staff). Difese contro lo spam: campo trappola nascosto,
// tempo minimo di compilazione, limiti di lunghezza e tetto orario lato DB.
import { supabase } from './supabaseClient.js';
import { qs } from './ui.js';
import { t } from './i18n.js';

const MIN_FILL_MS = 3000;
let openedAt = Date.now();

function setStatus(kind, text) {
  const el = qs('#cfStatus');
  if (!el) return;
  el.className = 'contact-status' + (kind ? ' ' + kind : '');
  el.textContent = text;
}

export function wireContactForm() {
  const form = qs('#contactForm');
  if (!form) return;
  openedAt = Date.now();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = qs('#cfName').value.trim();
    const contact = qs('#cfContact').value.trim();
    const time = qs('#cfTime').value.trim();
    const message = qs('#cfMessage').value.trim();
    const consent = qs('#cfConsent').checked;

    if (name.length < 2 || contact.length < 5 || !consent) {
      setStatus('err', t('contact.invalid'));
      return;
    }
    // Un bot compila il campo nascosto o invia subito: fingiamo successo
    // senza scrivere nulla, cosi' non ha un segnale per adattarsi.
    if (qs('#cfWebsite').value || Date.now() - openedAt < MIN_FILL_MS) {
      form.reset();
      setStatus('ok', t('contact.ok'));
      return;
    }

    const btn = qs('#cfSubmit');
    btn.disabled = true;
    setStatus('', t('contact.sending'));
    const { error } = await supabase.from('contact_requests').insert({
      full_name: name,
      contact,
      preferred_time: time || null,
      message: message || null,
      consent: true,
    });
    btn.disabled = false;
    if (error) {
      console.error(error);
      setStatus('err', t('contact.error'));
      return;
    }
    form.reset();
    openedAt = Date.now();
    setStatus('ok', t('contact.ok'));
  });
}
