const THEME_KEY = 'appTheme';

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function setSavedTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch { /* preferenza valida solo per questa visita */ }
}

function applyTheme(theme) {
  document.body.classList.toggle('light-theme', theme === 'light');
}

// Applica subito la preferenza salvata (o il tema scuro di default). Va
// chiamata il prima possibile all'avvio, sia su app.html che su index.html,
// cosi' la pagina non lampeggia nel tema sbagliato prima del primo render.
export function initTheme() {
  applyTheme(getSavedTheme() === 'light' ? 'light' : 'dark');
}

// Pannello di scelta del tema: stesso meccanismo/stile del banner cookie
// (vedi cookieConsent.js e .cookie-banner in styles.css), riaperto in
// qualsiasi momento dal pulsante "Aspetto" in barra di navigazione. I testi
// arrivano da una funzione (non da un oggetto gia' calcolato) cosi' che sul
// sito pubblico riflettano sempre la lingua corrente anche se cambiata dopo
// il caricamento della pagina, esattamente come fa gia' buildBanner() in
// cookieConsent.js con t().
function buildThemeBanner(getStrings) {
  const strings = getStrings();
  const el = document.createElement('div');
  el.className = 'cookie-banner';
  el.id = 'themeBanner';
  el.innerHTML = `
    <p class="cookie-banner-text">${strings.text}</p>
    <div class="cookie-banner-actions">
      <button type="button" class="btn btn-ghost btn-small" data-theme="dark">${strings.dark}</button>
      <button type="button" class="btn btn-primary btn-small" data-theme="light">${strings.light}</button>
    </div>
  `;
  el.querySelectorAll('[data-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      setSavedTheme(btn.dataset.theme);
      el.remove();
    });
  });
  return el;
}

export function openThemeBanner(getStrings) {
  if (document.getElementById('themeBanner')) return;
  document.body.appendChild(buildThemeBanner(getStrings));
}

export function wireThemeTrigger(getStrings) {
  document.getElementById('themeToggleBtn')?.addEventListener('click', () => openThemeBanner(getStrings));
}
