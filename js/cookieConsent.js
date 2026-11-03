import { t } from './i18n.js';

const STORAGE_KEY = 'cookieConsent';

// Il sito non usa cookie di profilazione/analytics (vedi privacy.html, sez. 8):
// solo localStorage tecnico per la sessione. Il banner e il registro della
// scelta restano comunque necessari per essere pronti a un domani in cui si
// aggiungessero cookie non essenziali, e per dare sempre al visitatore un
// controllo esplicito, come richiesto dalla normativa GDPR/ePrivacy.
function getConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setConsent(choice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, decidedAt: new Date().toISOString() }));
  } catch { /* storage non disponibile: la scelta vale solo per questa visita */ }
}

function buildBanner(onDecided) {
  const el = document.createElement('div');
  el.className = 'cookie-banner';
  el.id = 'cookieBanner';
  el.innerHTML = `
    <p class="cookie-banner-text">
      ${t('cookie.text')}<a href="/privacy.html#cookie">${t('cookie.privacyLink')}</a>.
    </p>
    <div class="cookie-banner-actions">
      <button type="button" class="btn btn-ghost btn-small" data-choice="rejected">${t('cookie.reject')}</button>
      <button type="button" class="btn btn-ghost btn-small" data-choice="necessary">${t('cookie.necessary')}</button>
      <button type="button" class="btn btn-primary btn-small" data-choice="all">${t('cookie.acceptAll')}</button>
    </div>
  `;
  el.querySelectorAll('[data-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setConsent(btn.dataset.choice);
      el.remove();
      if (onDecided) onDecided();
    });
  });
  return el;
}

// onDecided parte quando la scelta sui cookie c'e' (appena fatta, o gia' presente
// da una visita precedente): serve a far comparire dopo i cookie la scelta del tema.
export function initCookieBanner(onDecided) {
  if (getConsent()) { if (onDecided) onDecided(); return; }
  document.body.appendChild(buildBanner(onDecided));
}

// Richiamata dal link "Preferenze cookie" nel footer per cambiare scelta in
// qualsiasi momento, anche dopo averla già espressa.
export function reopenCookieBanner() {
  if (document.getElementById('cookieBanner')) return;
  document.body.appendChild(buildBanner());
}
