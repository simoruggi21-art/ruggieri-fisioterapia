import * as publicContent from './publicContent.js';
import * as blog from './blog.js';
import { initCookieBanner, reopenCookieBanner } from './cookieConsent.js';
import { applyTranslations, wireLanguageSwitcher } from './i18n.js';

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

// Tocco di dinamismo leggero: le card servizi/blog e le righe di
// credenziali/FAQ compaiono con una dissolvenza quando entrano nello
// schermo, invece di essere gia' tutte visibili al caricamento. La classe
// "scroll-reveal" (stato nascosto) viene aggiunta via JS solo agli elementi
// gia' presenti nel DOM: se questo script non parte, il contenuto resta
// semplicemente visibile fin da subito (nessun effetto, nessun contenuto
// perso). Richiamata dopo ogni render, ma ogni elemento viene osservato una
// sola volta (data-revealed) anche al cambio lingua.
let revealObserver = null;
function wireScrollReveal() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
  }
  document.querySelectorAll('.price-row, .faq-item, .credential-row').forEach((el) => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = 'true';
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
    // Se l'elemento e' gia' dentro il viewport al momento in cui viene
    // osservato (es. sopra la piega), l'observer lo segnala quasi subito;
    // nessun bisogno di un controllo aggiuntivo qui.
  });
}

// Richiamata al primo caricamento e ogni volta che il visitatore cambia
// lingua dal selettore: il testo statico si aggiorna subito (applyTranslations),
// mentre bio/servizi/articoli — che vivono nel database con colonne per
// lingua — vanno rifetchati e ridisegnati.
async function renderLocalizedContent() {
  applyTranslations();
  try {
    await publicContent.render();
  } catch (err) {
    console.error('Errore nel caricamento dei contenuti pubblici:', err);
  }
  try {
    await blog.renderPublicList();
  } catch (err) {
    console.error('Errore nel caricamento del blog:', err);
  }
  try {
    blog.renderFaq();
  } catch (err) {
    console.error('Errore nel caricamento delle FAQ:', err);
  }
  wireScrollReveal();
}

document.addEventListener('DOMContentLoaded', async () => {
  wireOrbitBackground();
  initCookieBanner();
  document.getElementById('cookiePreferencesLink')?.addEventListener('click', (e) => { e.preventDefault(); reopenCookieBanner(); });
  wireLanguageSwitcher(document.getElementById('langSwitcherMount'), renderLocalizedContent);
  await renderLocalizedContent();
});
