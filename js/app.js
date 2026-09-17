import * as auth from './auth.js';
import { isAdmin, isStaff } from './state.js';
import { qs, showToast } from './ui.js';
import * as agenda from './agenda.js';
import * as chat from './chat.js';
import * as patients from './patients.js';
import * as operators from './operators.js';
import * as profileAdmin from './profileAdmin.js';
import * as finance from './finance.js';
import * as notifications from './notifications.js';
import * as checkin from './checkin.js';
import * as blog from './blog.js';
import { initCookieBanner, reopenCookieBanner } from './cookieConsent.js';

const ROLE_LABELS = { admin: 'Amministratore', operator: 'Operatore', patient: 'Paziente' };

async function safeRun(label, fn) {
  try {
    await fn();
  } catch (err) {
    console.error(`Errore nella sezione "${label}":`, err);
  }
}

async function boot(state) {
  const body = document.body;
  body.classList.toggle('authed', !!state.session);
  body.classList.remove('role-admin', 'role-operator', 'role-patient');
  if (state.profile) body.classList.add('role-' + state.profile.role);
  // "Impostazioni" esiste solo per l'admin: per chiunque altro (logout,
  // login di un paziente/operatore sullo stesso browser) non deve restare
  // agganciata da una sessione precedente.
  if (!isAdmin()) body.classList.remove('showing-settings');

  renderNavUser(state);

  try {
    if (state.session && state.profile) {
      // Ogni sezione e' isolata dalle altre: un errore in una (es. agenda)
      // non deve mai impedire il funzionamento delle altre (es. chat) — prima
      // di questo isolamento, un errore imprevisto in una singola sezione
      // interrompeva silenziosamente il caricamento di tutte quelle successive.
      await safeRun('notifiche', async () => {
        await notifications.refresh();
        notifications.startPolling();
      });
      await safeRun('agenda', () => agenda.render());
      await safeRun('chat', () => chat.render());
      if (isStaff()) await safeRun('pazienti', () => patients.render());
      if (!isStaff()) {
        await safeRun('il mio percorso', () => patients.renderOwnProtocol());
        await safeRun('i miei esercizi', () => patients.renderOwnExercises());
      }
      if (isAdmin()) {
        await safeRun('operatori', () => operators.render());
        await safeRun('impostazioni', () => profileAdmin.render());
        await safeRun('gestionale', () => finance.render());
        await safeRun('blog', () => blog.renderAdmin());
      }
      if (!isStaff()) await safeRun('check-in', () => checkin.maybeShowPopup());
    }
  } catch (err) {
    console.error('Errore durante il caricamento della pagina:', err);
    showToast('Problema di connessione: alcuni contenuti potrebbero non essere aggiornati.', 'error');
  }
}

// "Impostazioni" si apre come schermata a se stante (vedi CSS
// body.showing-settings) invece che con il normale scroll: la tendina la
// apre, un click su un qualsiasi altro link della nav la richiude.
function wireSettingsDropdown() {
  const trigger = qs('#settingsDropdownTrigger');
  const menu = qs('#settingsMenu');
  const settingsLink = qs('#settingsNavLink');
  if (!trigger || !menu || !settingsLink) return;

  trigger.onclick = (e) => { e.stopPropagation(); menu.classList.toggle('open'); };
  document.addEventListener('click', () => menu.classList.remove('open'));
  menu.addEventListener('click', (e) => e.stopPropagation());

  settingsLink.onclick = () => {
    document.body.classList.add('showing-settings');
    menu.classList.remove('open');
  };
  qs('#navLinks').querySelectorAll('a').forEach((a) => {
    if (a.id !== 'settingsNavLink') a.addEventListener('click', () => document.body.classList.remove('showing-settings'));
  });
}

function renderNavUser(state) {
  const area = qs('#navUserArea');
  if (!area) return;
  if (state.session && state.profile) {
    area.innerHTML = `
      <span class="role-tag">${ROLE_LABELS[state.profile.role] || ''}</span>
      <span>${state.profile.full_name || state.profile.email || ''}</span>
      <button class="btn btn-ghost btn-small" id="logoutBtn">Esci</button>
    `;
    qs('#logoutBtn').onclick = () => auth.signOut();
  } else {
    area.innerHTML = `<a href="#accesso" class="btn btn-ghost btn-small">Accedi / Registrati</a>`;
  }
}

function wireAuthForms() {
  const tabLogin = qs('#authTabLogin');
  const tabSignup = qs('#authTabSignup');
  const loginForm = qs('#loginForm');
  const signupForm = qs('#signupForm');

  tabLogin.onclick = () => {
    tabLogin.classList.add('active'); tabSignup.classList.remove('active');
    loginForm.style.display = 'flex'; signupForm.style.display = 'none';
  };
  tabSignup.onclick = () => {
    tabSignup.classList.add('active'); tabLogin.classList.remove('active');
    signupForm.style.display = 'flex'; loginForm.style.display = 'none';
  };

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = qs('#authError'); errEl.textContent = '';
    const { error } = await auth.signIn({
      email: qs('#loginEmail').value.trim(),
      password: qs('#loginPassword').value,
      remember: qs('#rememberMeCheckbox').checked,
    });
    if (error) errEl.textContent = 'Accesso non riuscito: ' + error.message;
  });

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = qs('#authError'); const infoEl = qs('#authInfo');
    errEl.textContent = ''; infoEl.textContent = '';
    const { error, data } = await auth.signUp({
      email: qs('#signupEmail').value.trim(),
      password: qs('#signupPassword').value,
      fullName: qs('#signupFullName').value.trim(),
      phone: qs('#signupPhone').value.trim(),
      gender: qs('#signupGender').value,
      birthDate: qs('#signupBirthDate').value || null,
    });
    if (error) { errEl.textContent = 'Registrazione non riuscita: ' + error.message; return; }
    if (data?.session) {
      infoEl.textContent = 'Registrazione completata.';
    } else {
      signupForm.reset();
      qs('#signupSuccessOverlay').style.display = 'flex';
    }
  });

  const closeSignupSuccess = () => {
    qs('#signupSuccessOverlay').style.display = 'none';
    tabLogin.click();
  };
  qs('#signupSuccessCloseBtn').onclick = closeSignupSuccess;
  qs('#signupSuccessOkBtn').onclick = closeSignupSuccess;
}

// Sfondo decorativo fisso (vedi .bg-orbits in index.html/styles.css): i
// cerchi restano fermi, i due archi dorati ruotano attorno al centro (210,210
// nel viewBox dell'SVG) in proporzione allo scroll. Usa l'attributo SVG
// "transform" (rotate(angolo cx cy)) invece del transform CSS perche' ruota
// in modo affidabile attorno a un punto arbitrario su ogni browser, senza le
// ambiguita' di transform-origin/transform-box sugli elementi SVG.
function wireOrbitBackground() {
  const arc1 = document.getElementById('orbitArc1');
  const arc2 = document.getElementById('orbitArc2');
  if (!arc1 || !arc2) return;
  let ticking = false;
  function update() {
    const y = window.scrollY;
    arc1.setAttribute('transform', `rotate(${y * 0.12} 210 210)`);
    arc2.setAttribute('transform', `rotate(${-y * 0.18} 210 210)`);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

// Modalita' chiara dell'area riservata, salvata per il prossimo accesso sullo
// stesso browser (localStorage, come per "ricordami" e la lingua del sito
// pubblico). Il link nel footer alterna testo e classe ad ogni click.
const THEME_KEY = 'appTheme';

function applyTheme(theme) {
  document.body.classList.toggle('light-theme', theme === 'light');
  const link = qs('#themeToggleLink');
  if (link) link.textContent = theme === 'light' ? 'Modalità scura' : 'Modalità chiara';
}

function wireThemeToggle() {
  const saved = (() => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } })();
  applyTheme(saved === 'light' ? 'light' : 'dark');
  qs('#themeToggleLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    const next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* preferenza valida solo per questa visita */ }
  });
}

function wirePasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.onclick = () => {
      const input = qs('#' + btn.dataset.target);
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.classList.toggle('is-visible', !showing);
    };
  });
}

// Un solo elemento mancante (es. dopo una futura modifica al markup) non deve
// interrompere il collegamento di tutti gli altri controlli della pagina: un
// singolo "qs(...).onclick = ..." che fallisce silenziosamente bloccherebbe
// anche il bottone di invio della chat, se capitasse prima nella lista.
function wireClick(id, handler) {
  const el = qs('#' + id);
  if (!el) { console.error('Elemento mancante in pagina: #' + id); return; }
  el.onclick = handler;
}

function wireChange(id, handler) {
  const el = qs('#' + id);
  if (!el) { console.error('Elemento mancante in pagina: #' + id); return; }
  el.onchange = handler;
}

function wireStaticControls() {
  wireClick('sendBtn', () => {
    const input = qs('#chatText');
    chat.sendMessage(input.value);
    input.value = '';
  });
  const chatText = qs('#chatText');
  if (chatText) chatText.addEventListener('keydown', (e) => { if (e.key === 'Enter') qs('#sendBtn')?.click(); });
  wireClick('attachBtn', () => qs('#fileInput')?.click());
  wireChange('fileInput', (e) => { if (e.target.files[0]) chat.sendAttachment(e.target.files[0]); e.target.value = ''; });
  wireClick('deleteChatBtn', () => {
    if (confirm('Eliminare definitivamente questa conversazione? Non si può annullare.')) chat.deleteThread();
  });

  wireClick('weekPrevBtn', () => agenda.changeWeek(-1));
  wireClick('weekNextBtn', () => agenda.changeWeek(1));
  wireClick('weekTodayBtn', () => agenda.resetWeek());
  wireClick('closeTodayBtn', () => agenda.closeToday());

  wireClick('addServiceBtn', () => profileAdmin.addServiceRow());
  wireClick('saveProfileBtn', () => profileAdmin.saveProfile());
  wireClick('uploadPhotoBtn', () => qs('#profilePhotoInput')?.click());
  wireChange('profilePhotoInput', (e) => { if (e.target.files[0]) profileAdmin.uploadPhoto(e.target.files[0]); });
  wireClick('removePhotoBtn', () => profileAdmin.removePhoto());

  wireClick('uploadActionPhotoBtn', () => qs('#actionPhotoInput')?.click());
  wireChange('actionPhotoInput', (e) => { if (e.target.files[0]) profileAdmin.uploadActionPhoto(e.target.files[0]); e.target.value = ''; });
  wireClick('removeActionPhotoBtn', () => profileAdmin.removeActionPhoto());

  wireClick('uploadDetailPhotoBtn', () => qs('#detailPhotoInput')?.click());
  wireChange('detailPhotoInput', (e) => { if (e.target.files[0]) profileAdmin.uploadDetailPhoto(e.target.files[0]); e.target.value = ''; });
  wireClick('removeDetailPhotoBtn', () => profileAdmin.removeDetailPhoto());

  wireClick('btnForfettario', () => finance.setRegime('forfettario'));
  wireClick('btnOrdinario', () => finance.setRegime('ordinario'));
  ['annualRevenue', 'coeffRedd', 'aliquotaSostitutiva', 'deductExpenses', 'addRegCom', 'inpsRate'].forEach((id) => {
    const node = qs('#' + id);
    if (!node) { console.error('Elemento mancante in pagina: #' + id); return; }
    node.addEventListener('input', () => finance.updateRegimeCalc());
    node.addEventListener('change', () => finance.updateRegimeCalc());
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  wireAuthForms();
  wireStaticControls();
  wirePasswordToggles();
  wireSettingsDropdown();
  wireOrbitBackground();
  wireThemeToggle();
  initCookieBanner();
  qs('#cookiePreferencesLink')?.addEventListener('click', (e) => { e.preventDefault(); reopenCookieBanner(); });
  checkin.wireCheckinModal();
  agenda.wireAppointmentModal();
  patients.wireRegisterPatientModal();
  blog.wireAdmin();
  await auth.init(boot);
});
