export const LOCALES = ['it', 'en', 'fr', 'es', 'de'];
export const LOCALE_LABELS = { it: 'IT', en: 'EN', fr: 'FR', es: 'ES', de: 'DE' };
const STORAGE_KEY = 'siteLocale';
const DEFAULT_LOCALE = 'it';

// Dizionario dei testi statici (nav, sezioni, FAQ, cookie banner...). I
// contenuti che vivono nel database (bio, servizi, articoli del blog) sono
// tradotti separatamente con colonne per lingua (vedi publicContent.js e
// blog.js) e non passano da qui.
const dict = {
  it: {
    'nav.about': 'Chi sono', 'nav.services': 'Servizi', 'nav.blog': 'Blog', 'nav.faq': 'FAQ', 'nav.login': 'Accedi / Registrati',
    'hero.ctaRegister': 'Registrati e prenota', 'hero.ctaLogin': 'Accedi alla tua area',
    'services.label': 'servizi', 'services.heading': 'Trattamenti e tariffe',
    'services.disclaimer': "Le tariffe indicate sono definite in conformità al tariffario professionale dei fisioterapisti e hanno valore indicativo: possono variare in base alla valutazione del singolo caso clinico e alle specifiche esigenze del paziente. Ogni eventuale variazione viene sempre comunicata in modo trasparente e concordata preventivamente prima dell'inizio del percorso.",
    'about.label': 'presentazione', 'about.openMaps': 'Apri in Google Maps',
    'credentials.formazione': 'Formazione', 'credentials.specializzazione': 'Specializzazione', 'credentials.albo': 'Albo professionale',
    'blog.label': 'blog', 'blog.heading': 'Articoli e approfondimenti',
    'blog.subtitle': 'Letture scientifiche e pratiche su dolore, recupero e riabilitazione.',
    'blog.empty': 'Presto nuovi articoli.',
    'blog.showAll': 'Vedi tutti gli articoli', 'blog.showFeatured': 'Mostra solo in evidenza',
    'blog.readMore': 'Leggi →', 'blog.pubmedTag': 'PubMed', 'blog.pubmedRead': 'PubMed ↗',
    'blog.pubmedExcerpt': 'Studio scientifico internazionale: approfondimento su PubMed.',
    'faq.label': 'domande frequenti', 'faq.heading': 'Domande frequenti',
    'faq.q1': 'Cosa succede se non posso venire ad una seduta?',
    'faq.a1': 'Se non puoi presentarti a un appuntamento, ti chiedo di avvisarmi il prima possibile, idealmente con almeno 24 ore di anticipo, così da poter liberare lo slot per un altro paziente. Puoi disdire o spostare la seduta direttamente dalla tua area riservata (sezione Agenda) oppure scrivendomi in chat o via email. Le disdette con breve preavviso vanno valutate caso per caso.',
    'faq.q2': 'Come posso pagare?',
    'faq.a2': 'Puoi pagare in contanti o con carta direttamente in studio al termine della seduta, oppure tramite bonifico bancario. Se hai esigenze particolari (rimborso assicurativo) scrivimi pure, così vediamo insieme la soluzione più comoda.',
    'recap.label': 'a colpo d\'occhio', 'recap.heading': 'In breve: dove, quanto, come contattarmi',
    'recap.phone': 'Telefono', 'recap.email': 'Email', 'recap.where': 'Dove', 'recap.prices': 'Tariffe',
    'recap.pricesNote': 'Valori indicativi, a norma del tariffario professionale: possono variare in base al caso clinico, sempre concordati in anticipo —',
    'recap.pricesDetails': 'dettagli',
    'recap.loginCta': 'Accedi o registrati →',
    'recap.reviewCta': '★ Lasciami una recensione su Google',
    'footer.contactLine': 'Sedute private su appuntamento — {email}',
    'footer.piva': 'Simone Ruggieri — P.IVA 18105221008',
    'footer.gdpr': 'i dati clinici sono trattati in conformità al Regolamento (UE) 2016/679 (GDPR).',
    'footer.privacyLink': 'Informativa privacy', 'footer.cookiePrefs': 'Preferenze cookie',
    'cookie.text': "Questo sito utilizza solo cookie e tecnologie tecniche necessarie al funzionamento (es. per mantenere la sessione di accesso). Non sono presenti cookie di profilazione o di analisi statistica. Per saperne di più consulta l'",
    'cookie.privacyLink': 'informativa privacy',
    'cookie.reject': 'Rifiuta', 'cookie.necessary': 'Solo necessari', 'cookie.acceptAll': 'Accetta tutti',
    'nav.theme': 'Aspetto',
    'theme.text': 'Scegli l\'aspetto del sito: chiaro o scuro.',
    'theme.dark': 'Scura', 'theme.light': 'Chiara',
    'blogpost.backToSite': 'Torna al sito', 'blogpost.backToAll': '← Tutti gli articoli',
    'blogpost.notFoundLabel': 'articolo non trovato', 'blogpost.notFoundTitle': 'Questo articolo non esiste o non è più disponibile.',
    'blogpost.notFoundBack': 'Torna al blog',
  },
  en: {
    'nav.about': 'About', 'nav.services': 'Services', 'nav.blog': 'Blog', 'nav.faq': 'FAQ', 'nav.login': 'Log in / Sign up',
    'hero.ctaRegister': 'Sign up and book', 'hero.ctaLogin': 'Log in to your account',
    'services.label': 'services', 'services.heading': 'Treatments and rates',
    'services.disclaimer': "Rates shown are set in line with the professional physiotherapists' fee schedule and are indicative: they may vary based on the clinical case and the patient's specific needs. Any change is always communicated transparently and agreed in advance, before starting treatment.",
    'about.label': 'about', 'about.openMaps': 'Open in Google Maps',
    'credentials.formazione': 'Education', 'credentials.specializzazione': 'Specialisation', 'credentials.albo': 'Professional register',
    'blog.label': 'blog', 'blog.heading': 'Articles and insights',
    'blog.subtitle': 'Scientific and practical reading on pain, recovery and rehabilitation.',
    'blog.empty': 'New articles coming soon.',
    'blog.showAll': 'View all articles', 'blog.showFeatured': 'Show featured only',
    'blog.readMore': 'Read →', 'blog.pubmedTag': 'PubMed', 'blog.pubmedRead': 'PubMed ↗',
    'blog.pubmedExcerpt': 'International scientific study: read more on PubMed.',
    'faq.label': 'faq', 'faq.heading': 'Frequently asked questions',
    'faq.q1': "What happens if I can't make it to an appointment?",
    'faq.a1': "If you can't make it to an appointment, please let me know as soon as possible, ideally at least 24 hours in advance, so the slot can be freed up for another patient. You can cancel or reschedule directly from your account (Agenda section) or by writing to me in chat or by email. Late cancellations are assessed on a case-by-case basis.",
    'faq.q2': 'How can I pay?',
    'faq.a2': "You can pay in cash or by card directly at the clinic at the end of the session, or by bank transfer. If you have specific needs (insurance reimbursement), just get in touch and we'll find the most convenient solution together.",
    'recap.label': 'at a glance', 'recap.heading': 'In brief: where, how much, how to reach me',
    'recap.phone': 'Phone', 'recap.email': 'Email', 'recap.where': 'Where', 'recap.prices': 'Rates',
    'recap.pricesNote': 'Indicative rates, set per the professional fee schedule: they may vary by clinical case and are always agreed in advance —',
    'recap.pricesDetails': 'details',
    'recap.loginCta': 'Log in or sign up →',
    'recap.reviewCta': '★ Leave me a review on Google',
    'footer.contactLine': 'Private sessions by appointment — {email}',
    'footer.piva': 'Simone Ruggieri — VAT 18105221008',
    'footer.gdpr': 'Health data is processed in accordance with EU Regulation 2016/679 (GDPR).',
    'footer.privacyLink': 'Privacy policy', 'footer.cookiePrefs': 'Cookie preferences',
    'cookie.text': "This site only uses technical cookies strictly necessary for it to work (e.g. to keep you logged in). No profiling or analytics cookies are used. Learn more in the ",
    'cookie.privacyLink': 'privacy policy',
    'cookie.reject': 'Reject', 'cookie.necessary': 'Necessary only', 'cookie.acceptAll': 'Accept all',
    'nav.theme': 'Appearance',
    'theme.text': 'Choose the site appearance: light or dark.',
    'theme.dark': 'Dark', 'theme.light': 'Light',
    'blogpost.backToSite': 'Back to site', 'blogpost.backToAll': '← All articles',
    'blogpost.notFoundLabel': 'article not found', 'blogpost.notFoundTitle': 'This article no longer exists or is unavailable.',
    'blogpost.notFoundBack': 'Back to blog',
  },
  fr: {
    'nav.about': 'À propos', 'nav.services': 'Services', 'nav.blog': 'Blog', 'nav.faq': 'FAQ', 'nav.login': 'Connexion / Inscription',
    'hero.ctaRegister': "S'inscrire et réserver", 'hero.ctaLogin': 'Accéder à mon espace',
    'services.label': 'services', 'services.heading': 'Prestations et tarifs',
    'services.disclaimer': "Les tarifs indiqués sont fixés conformément au barème professionnel des kinésithérapeutes et ont une valeur indicative : ils peuvent varier selon l'évaluation du cas clinique et les besoins spécifiques du patient. Toute variation est toujours communiquée de manière transparente et convenue au préalable, avant le début du parcours.",
    'about.label': 'présentation', 'about.openMaps': 'Ouvrir dans Google Maps',
    'credentials.formazione': 'Formation', 'credentials.specializzazione': 'Spécialisation', 'credentials.albo': 'Ordre professionnel',
    'blog.label': 'blog', 'blog.heading': 'Articles et analyses',
    'blog.subtitle': 'Lectures scientifiques et pratiques sur la douleur, la récupération et la rééducation.',
    'blog.empty': 'Nouveaux articles à venir.',
    'blog.showAll': 'Voir tous les articles', 'blog.showFeatured': 'Afficher uniquement la sélection',
    'blog.readMore': 'Lire →', 'blog.pubmedTag': 'PubMed', 'blog.pubmedRead': 'PubMed ↗',
    'blog.pubmedExcerpt': 'Étude scientifique internationale : à lire sur PubMed.',
    'faq.label': 'questions fréquentes', 'faq.heading': 'Questions fréquentes',
    'faq.q1': 'Que se passe-t-il si je ne peux pas venir à une séance ?',
    'faq.a1': "Si vous ne pouvez pas vous présenter à un rendez-vous, merci de me prévenir le plus tôt possible, idéalement au moins 24 heures à l'avance, afin de pouvoir libérer le créneau pour un autre patient. Vous pouvez annuler ou déplacer la séance directement depuis votre espace personnel (section Agenda) ou en m'écrivant par chat ou par e-mail. Les annulations tardives sont examinées au cas par cas.",
    'faq.q2': 'Comment puis-je payer ?',
    'faq.a2': "Vous pouvez régler en espèces ou par carte directement au cabinet à la fin de la séance, ou par virement bancaire. Pour tout besoin particulier (remboursement par une assurance), contactez-moi et nous trouverons ensemble la solution la plus pratique.",
    'recap.label': "en un coup d'œil", 'recap.heading': 'En bref : où, combien, comment me contacter',
    'recap.phone': 'Téléphone', 'recap.email': 'E-mail', 'recap.where': 'Où', 'recap.prices': 'Tarifs',
    'recap.pricesNote': 'Tarifs indicatifs, conformes au barème professionnel : ils peuvent varier selon le cas clinique et sont toujours convenus au préalable —',
    'recap.pricesDetails': 'détails',
    'recap.loginCta': 'Connexion ou inscription →',
    'recap.reviewCta': '★ Laissez-moi un avis sur Google',
    'footer.contactLine': 'Séances privées sur rendez-vous — {email}',
    'footer.piva': 'Simone Ruggieri — TVA 18105221008',
    'footer.gdpr': 'Les données de santé sont traitées conformément au Règlement (UE) 2016/679 (RGPD).',
    'footer.privacyLink': 'Politique de confidentialité', 'footer.cookiePrefs': 'Préférences cookies',
    'cookie.text': "Ce site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement (par ex. pour maintenir votre connexion). Aucun cookie de profilage ou d'analyse n'est utilisé. Pour en savoir plus, consultez la ",
    'cookie.privacyLink': 'politique de confidentialité',
    'cookie.reject': 'Refuser', 'cookie.necessary': 'Nécessaires uniquement', 'cookie.acceptAll': 'Tout accepter',
    'nav.theme': 'Apparence',
    'theme.text': "Choisissez l'apparence du site : claire ou sombre.",
    'theme.dark': 'Sombre', 'theme.light': 'Claire',
    'blogpost.backToSite': 'Retour au site', 'blogpost.backToAll': '← Tous les articles',
    'blogpost.notFoundLabel': 'article introuvable', 'blogpost.notFoundTitle': "Cet article n'existe plus ou n'est plus disponible.",
    'blogpost.notFoundBack': 'Retour au blog',
  },
  es: {
    'nav.about': 'Sobre mí', 'nav.services': 'Servicios', 'nav.blog': 'Blog', 'nav.faq': 'FAQ', 'nav.login': 'Acceder / Registrarse',
    'hero.ctaRegister': 'Regístrate y reserva', 'hero.ctaLogin': 'Accede a tu área',
    'services.label': 'servicios', 'services.heading': 'Tratamientos y tarifas',
    'services.disclaimer': 'Las tarifas indicadas se establecen conforme al tarifario profesional de los fisioterapeutas y tienen carácter indicativo: pueden variar según la valoración del caso clínico y las necesidades específicas del paciente. Cualquier variación se comunica siempre de forma transparente y se acuerda previamente, antes de iniciar el proceso.',
    'about.label': 'presentación', 'about.openMaps': 'Abrir en Google Maps',
    'credentials.formazione': 'Formación', 'credentials.specializzazione': 'Especialización', 'credentials.albo': 'Colegio profesional',
    'blog.label': 'blog', 'blog.heading': 'Artículos y reflexiones',
    'blog.subtitle': 'Lecturas científicas y prácticas sobre dolor, recuperación y rehabilitación.',
    'blog.empty': 'Próximamente nuevos artículos.',
    'blog.showAll': 'Ver todos los artículos', 'blog.showFeatured': 'Mostrar solo destacados',
    'blog.readMore': 'Leer →', 'blog.pubmedTag': 'PubMed', 'blog.pubmedRead': 'PubMed ↗',
    'blog.pubmedExcerpt': 'Estudio científico internacional: más información en PubMed.',
    'faq.label': 'preguntas frecuentes', 'faq.heading': 'Preguntas frecuentes',
    'faq.q1': '¿Qué ocurre si no puedo acudir a una sesión?',
    'faq.a1': 'Si no puedes acudir a una cita, por favor avísame lo antes posible, idealmente con al menos 24 horas de antelación, para poder liberar el hueco para otro paciente. Puedes cancelar o cambiar la sesión directamente desde tu área personal (sección Agenda) o escribiéndome por chat o correo electrónico. Las cancelaciones con poco margen se valoran caso por caso.',
    'faq.q2': '¿Cómo puedo pagar?',
    'faq.a2': 'Puedes pagar en efectivo o con tarjeta directamente en la consulta al final de la sesión, o mediante transferencia bancaria. Si tienes alguna necesidad particular (reembolso del seguro), escríbeme y buscamos juntos la solución más cómoda.',
    'recap.label': 'de un vistazo', 'recap.heading': 'En resumen: dónde, cuánto, cómo contactarme',
    'recap.phone': 'Teléfono', 'recap.email': 'Email', 'recap.where': 'Dónde', 'recap.prices': 'Tarifas',
    'recap.pricesNote': 'Valores indicativos, conforme al tarifario profesional: pueden variar según el caso clínico, siempre acordados con antelación —',
    'recap.pricesDetails': 'detalles',
    'recap.loginCta': 'Accede o regístrate →',
    'recap.reviewCta': '★ Déjame una reseña en Google',
    'footer.contactLine': 'Sesiones privadas con cita previa — {email}',
    'footer.piva': 'Simone Ruggieri — NIF/IVA 18105221008',
    'footer.gdpr': 'Los datos clínicos se tratan de conformidad con el Reglamento (UE) 2016/679 (RGPD).',
    'footer.privacyLink': 'Política de privacidad', 'footer.cookiePrefs': 'Preferencias de cookies',
    'cookie.text': 'Este sitio utiliza únicamente cookies técnicas estrictamente necesarias para su funcionamiento (p. ej., para mantener tu sesión iniciada). No se utilizan cookies de perfilado ni de análisis. Más información en la ',
    'cookie.privacyLink': 'política de privacidad',
    'cookie.reject': 'Rechazar', 'cookie.necessary': 'Solo necesarias', 'cookie.acceptAll': 'Aceptar todas',
    'nav.theme': 'Apariencia',
    'theme.text': 'Elige el aspecto del sitio: claro u oscuro.',
    'theme.dark': 'Oscuro', 'theme.light': 'Claro',
    'blogpost.backToSite': 'Volver al sitio', 'blogpost.backToAll': '← Todos los artículos',
    'blogpost.notFoundLabel': 'artículo no encontrado', 'blogpost.notFoundTitle': 'Este artículo ya no existe o no está disponible.',
    'blogpost.notFoundBack': 'Volver al blog',
  },
  de: {
    'nav.about': 'Über mich', 'nav.services': 'Leistungen', 'nav.blog': 'Blog', 'nav.faq': 'FAQ', 'nav.login': 'Anmelden / Registrieren',
    'hero.ctaRegister': 'Registrieren und buchen', 'hero.ctaLogin': 'Zu Ihrem Bereich',
    'services.label': 'leistungen', 'services.heading': 'Behandlungen und Preise',
    'services.disclaimer': 'Die angegebenen Preise entsprechen der Gebührenordnung für Physiotherapeuten und sind unverbindlich: Sie können je nach klinischem Fall und individuellem Bedarf des Patienten variieren. Jede Änderung wird stets transparent mitgeteilt und vor Beginn der Behandlung vereinbart.',
    'about.label': 'vorstellung', 'about.openMaps': 'In Google Maps öffnen',
    'credentials.formazione': 'Ausbildung', 'credentials.specializzazione': 'Spezialisierung', 'credentials.albo': 'Berufsregister',
    'blog.label': 'blog', 'blog.heading': 'Artikel und Einblicke',
    'blog.subtitle': 'Wissenschaftliche und praktische Lektüre zu Schmerz, Genesung und Rehabilitation.',
    'blog.empty': 'Neue Artikel folgen in Kürze.',
    'blog.showAll': 'Alle Artikel ansehen', 'blog.showFeatured': 'Nur Auswahl anzeigen',
    'blog.readMore': 'Lesen →', 'blog.pubmedTag': 'PubMed', 'blog.pubmedRead': 'PubMed ↗',
    'blog.pubmedExcerpt': 'Internationale wissenschaftliche Studie: mehr dazu auf PubMed.',
    'faq.label': 'häufige fragen', 'faq.heading': 'Häufige Fragen',
    'faq.q1': 'Was passiert, wenn ich nicht zu einem Termin kommen kann?',
    'faq.a1': 'Wenn Sie einen Termin nicht wahrnehmen können, geben Sie mir bitte so früh wie möglich Bescheid, idealerweise mindestens 24 Stunden im Voraus, damit der Termin für eine andere Patientin oder einen anderen Patienten frei wird. Sie können den Termin direkt in Ihrem Bereich (Abschnitt Agenda) stornieren oder verschieben, oder mir im Chat oder per E-Mail schreiben. Kurzfristige Absagen werden im Einzelfall bewertet.',
    'faq.q2': 'Wie kann ich bezahlen?',
    'faq.a2': 'Sie können direkt in der Praxis am Ende der Sitzung bar oder mit Karte bezahlen, oder per Banküberweisung. Bei besonderen Bedürfnissen (Erstattung durch die Versicherung) schreiben Sie mir einfach, dann finden wir gemeinsam die passendste Lösung.',
    'recap.label': 'auf einen blick', 'recap.heading': 'Kurz gefasst: wo, wie viel, wie Sie mich erreichen',
    'recap.phone': 'Telefon', 'recap.email': 'E-Mail', 'recap.where': 'Wo', 'recap.prices': 'Preise',
    'recap.pricesNote': 'Richtwerte gemäß Gebührenordnung: können je nach klinischem Fall variieren, stets vorab vereinbart —',
    'recap.pricesDetails': 'Details',
    'recap.loginCta': 'Anmelden oder registrieren →',
    'recap.reviewCta': '★ Bewerten Sie mich auf Google',
    'footer.contactLine': 'Private Sitzungen nach Vereinbarung — {email}',
    'footer.piva': 'Simone Ruggieri — USt-IdNr. 18105221008',
    'footer.gdpr': 'Gesundheitsdaten werden gemäß der EU-Verordnung 2016/679 (DSGVO) verarbeitet.',
    'footer.privacyLink': 'Datenschutzerklärung', 'footer.cookiePrefs': 'Cookie-Einstellungen',
    'cookie.text': 'Diese Website verwendet ausschließlich technische Cookies, die für den Betrieb unbedingt erforderlich sind (z. B. um Sie angemeldet zu halten). Es werden keine Profiling- oder Analyse-Cookies verwendet. Mehr dazu in der ',
    'cookie.privacyLink': 'Datenschutzerklärung',
    'cookie.reject': 'Ablehnen', 'cookie.necessary': 'Nur notwendige', 'cookie.acceptAll': 'Alle akzeptieren',
    'nav.theme': 'Erscheinungsbild',
    'theme.text': 'Wähle das Erscheinungsbild der Website: hell oder dunkel.',
    'theme.dark': 'Dunkel', 'theme.light': 'Hell',
    'blogpost.backToSite': 'Zurück zur Website', 'blogpost.backToAll': '← Alle Artikel',
    'blogpost.notFoundLabel': 'Artikel nicht gefunden', 'blogpost.notFoundTitle': 'Dieser Artikel existiert nicht mehr oder ist nicht verfügbar.',
    'blogpost.notFoundBack': 'Zurück zum Blog',
  },
};

export function getLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return LOCALES.includes(stored) ? stored : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function setLocale(loc) {
  if (!LOCALES.includes(loc)) return;
  try { localStorage.setItem(STORAGE_KEY, loc); } catch { /* ignore */ }
}

export function t(key) {
  const loc = getLocale();
  return dict[loc]?.[key] ?? dict[DEFAULT_LOCALE][key] ?? key;
}

// Legge un campo tradotto dal database (es. row.bio_en): se manca la
// traduzione per la lingua corrente, ricade sull'italiano (campo base).
export function tField(row, baseField) {
  if (!row) return '';
  const loc = getLocale();
  if (loc === DEFAULT_LOCALE) return row[baseField] || '';
  return row[`${baseField}_${loc}`] || row[baseField] || '';
}

export function applyTranslations(root = document) {
  document.documentElement.lang = getLocale();
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
}

function buildSwitcher() {
  const select = document.createElement('select');
  select.id = 'langSwitcher';
  select.setAttribute('aria-label', 'Lingua / Language');
  LOCALES.forEach((loc) => {
    const opt = document.createElement('option');
    opt.value = loc;
    opt.textContent = LOCALE_LABELS[loc];
    select.appendChild(opt);
  });
  select.value = getLocale();
  return select;
}

// Inserisce il selettore di lingua nel nav e richiama onChange (che si
// occupa di riapplicare le traduzioni e ri-renderizzare i contenuti dal
// database) ogni volta che il visitatore cambia lingua.
export function wireLanguageSwitcher(mountEl, onChange) {
  if (!mountEl) return;
  const select = buildSwitcher();
  mountEl.appendChild(select);
  select.addEventListener('change', () => {
    setLocale(select.value);
    onChange?.();
  });
}
