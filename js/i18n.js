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
    'hero.ctaWhatsapp': "Scrivimi su WhatsApp", 'hero.ctaCall': "Chiama", 'hero.ctaBook': "Prenota online",
    'hero.trust1': "Iscritto all'Albo TSRM PSTRP di Roma", 'hero.trust2': "Fisioterapista delle squadre nazionali FIJLKAM", 'hero.trust3': "In studio a Roma (Tre Pini) o a domicilio",
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
    'faq.q3': "Quanto dura una seduta e cosa succede alla prima visita?",
    'faq.a3': "Ogni seduta dura 45-60 minuti. Alla prima visita faccio una valutazione funzionale approfondita: raccolgo la tua storia clinica, valuto movimento e dolore con test mirati e definiamo insieme obiettivi e piano di trattamento. Quando possibile il trattamento inizia già nella stessa seduta.",
    'faq.q4': "Serve la prescrizione del medico?",
    'faq.a4': "Per un percorso di fisioterapia privato non è necessaria la prescrizione medica. Se dalla valutazione emerge la necessità di un approfondimento, ti indico io con quale specialista confrontarti. Se vuoi detrarre la spesa o chiedere un rimborso alla tua assicurazione, verifica prima con loro se richiedono una prescrizione.",
    'faq.q5': "Fai fisioterapia a domicilio?",
    'faq.a5': "Sì. La valutazione e il trattamento sono gli stessi della seduta in studio, a casa tua. Chiamami o scrivimi per concordare zona, giorno e orario.",
    'faq.q6': "Quante sedute servono per stare meglio?",
    'faq.a6': "Dipende dal problema, da quanto tempo è presente e dai tuoi obiettivi. Dopo la prima valutazione ti do un'indicazione realistica e verifichiamo i progressi a intervalli regolari. Il percorso a pacchetto (minimo 5 sedute) è pensato per il recupero funzionale e il ritorno allo sport.",
    'faq.q7': "Ti occupi solo di sportivi?",
    'faq.a7': "No. Seguo atleti agonisti, anche delle squadre nazionali FIJLKAM, e chiunque abbia un dolore muscolo-scheletrico che limita la vita di tutti i giorni, come schiena, collo, spalla o ginocchio. L'approccio è lo stesso: valutazione precisa, piano su misura, ritorno al movimento senza dolore.",
    'faq.q8': "Dove si trova lo studio e come prenoto?",
    'faq.a8': "Ricevo presso Fisiomas Tre Pini, in Largo Filippo Juvara 13, 00128 Roma. Puoi prenotare online dalla tua area riservata, oppure chiamarmi o scrivermi su WhatsApp: trovi i recapiti in fondo alla pagina.",
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
    'hero.ctaWhatsapp': "Message me on WhatsApp", 'hero.ctaCall': "Call", 'hero.ctaBook': "Book online",
    'hero.trust1': "Registered with the TSRM PSTRP Rome professional register", 'hero.trust2': "Physiotherapist of the FIJLKAM national teams", 'hero.trust3': "At the Rome clinic (Tre Pini) or at home",
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
    'faq.q3': "How long does a session last and what happens at the first visit?",
    'faq.a3': "Each session lasts 45-60 minutes. At the first visit I carry out an in-depth functional assessment: I take your clinical history, assess movement and pain with targeted tests, and we set goals and a treatment plan together. Whenever possible, treatment starts in the same session.",
    'faq.q4': "Do I need a doctor's prescription?",
    'faq.a4': "A prescription is not required for a private physiotherapy programme. If the assessment shows you need further investigation, I will tell you which specialist to see. If you want to claim the expense as a tax deduction or ask your insurer for reimbursement, check with them first whether they require a prescription.",
    'faq.q5': "Do you offer home visits?",
    'faq.a5': "Yes. The assessment and treatment are the same as in the clinic, at your home. Call or message me to agree on the area, day and time.",
    'faq.q6': "How many sessions will I need?",
    'faq.a6': "It depends on the problem, how long you have had it and your goals. After the first assessment I give you a realistic indication and we check progress at regular intervals. The package programme (minimum 5 sessions) is designed for functional recovery and return to sport.",
    'faq.q7': "Do you only treat athletes?",
    'faq.a7': "No. I work with competitive athletes, including FIJLKAM national team members, and with anyone whose musculoskeletal pain limits everyday life, such as back, neck, shoulder or knee pain. The approach is the same: precise assessment, tailored plan, return to pain-free movement.",
    'faq.q8': "Where is the clinic and how do I book?",
    'faq.a8': "I see patients at Fisiomas Tre Pini, Largo Filippo Juvara 13, 00128 Rome. You can book online from your account, or call or message me on WhatsApp: my contact details are at the bottom of the page.",
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
    'hero.ctaWhatsapp': "Écrivez-moi sur WhatsApp", 'hero.ctaCall': "Appeler", 'hero.ctaBook': "Réserver en ligne",
    'hero.trust1': "Inscrit à l'ordre professionnel TSRM PSTRP de Rome", 'hero.trust2': "Kinésithérapeute des équipes nationales FIJLKAM", 'hero.trust3': "Au cabinet à Rome (Tre Pini) ou à domicile",
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
    'faq.q3': "Combien de temps dure une séance et que se passe-t-il lors de la première visite ?",
    'faq.a3': "Chaque séance dure 45 à 60 minutes. Lors de la première visite, je réalise une évaluation fonctionnelle approfondie : je recueille vos antécédents, j'évalue le mouvement et la douleur avec des tests ciblés, puis nous définissons ensemble les objectifs et le plan de traitement. Dans la mesure du possible, le traitement commence dès la même séance.",
    'faq.q4': "Une ordonnance médicale est-elle nécessaire ?",
    'faq.a4': "Une ordonnance n'est pas nécessaire pour un parcours de kinésithérapie privé. Si l'évaluation montre qu'un examen complémentaire est utile, je vous indique quel spécialiste consulter. Si vous souhaitez déduire la dépense ou demander un remboursement à votre assurance, vérifiez d'abord auprès d'elle si une ordonnance est exigée.",
    'faq.q5': "Proposez-vous des séances à domicile ?",
    'faq.a5': "Oui. L'évaluation et le traitement sont les mêmes qu'au cabinet, chez vous. Appelez-moi ou écrivez-moi pour convenir de la zone, du jour et de l'horaire.",
    'faq.q6': "Combien de séances faut-il pour aller mieux ?",
    'faq.a6': "Cela dépend du problème, de son ancienneté et de vos objectifs. Après la première évaluation, je vous donne une indication réaliste et nous vérifions les progrès à intervalles réguliers. Le forfait (minimum 5 séances) est conçu pour la récupération fonctionnelle et le retour au sport.",
    'faq.q7': "Vous occupez-vous uniquement de sportifs ?",
    'faq.a7': "Non. Je suis des athlètes de compétition, y compris des équipes nationales de la FIJLKAM, ainsi que toute personne dont une douleur musculo-squelettique limite le quotidien, par exemple au dos, au cou, à l'épaule ou au genou. L'approche est la même : évaluation précise, plan sur mesure, retour au mouvement sans douleur.",
    'faq.q8': "Où se trouve le cabinet et comment réserver ?",
    'faq.a8': "Je reçois chez Fisiomas Tre Pini, Largo Filippo Juvara 13, 00128 Rome. Vous pouvez réserver en ligne depuis votre espace personnel, ou m'appeler ou m'écrire sur WhatsApp : mes coordonnées figurent en bas de page.",
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
    'hero.ctaWhatsapp': "Escríbeme por WhatsApp", 'hero.ctaCall': "Llamar", 'hero.ctaBook': "Reservar en línea",
    'hero.trust1': "Colegiado en el registro profesional TSRM PSTRP de Roma", 'hero.trust2': "Fisioterapeuta de los equipos nacionales de la FIJLKAM", 'hero.trust3': "En la consulta de Roma (Tre Pini) o a domicilio",
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
    'faq.q3': "¿Cuánto dura una sesión y qué ocurre en la primera visita?",
    'faq.a3': "Cada sesión dura entre 45 y 60 minutos. En la primera visita realizo una valoración funcional en profundidad: recojo tu historial clínico, valoro el movimiento y el dolor con pruebas específicas y definimos juntos los objetivos y el plan de tratamiento. Cuando es posible, el tratamiento empieza en la misma sesión.",
    'faq.q4': "¿Hace falta receta médica?",
    'faq.a4': "Para un programa de fisioterapia privado no es necesaria la receta médica. Si de la valoración surge la necesidad de profundizar, te indico con qué especialista consultar. Si quieres desgravar el gasto o pedir un reembolso a tu seguro, comprueba antes con ellos si exigen una receta.",
    'faq.q5': "¿Haces fisioterapia a domicilio?",
    'faq.a5': "Sí. La valoración y el tratamiento son los mismos que en la consulta, en tu casa. Llámame o escríbeme para acordar la zona, el día y la hora.",
    'faq.q6': "¿Cuántas sesiones hacen falta para mejorar?",
    'faq.a6': "Depende del problema, de cuánto tiempo lleva y de tus objetivos. Tras la primera valoración te doy una indicación realista y revisamos los progresos a intervalos regulares. El programa de paquete (mínimo 5 sesiones) está pensado para la recuperación funcional y la vuelta al deporte.",
    'faq.q7': "¿Solo atiendes a deportistas?",
    'faq.a7': "No. Trabajo con atletas de competición, incluidos los equipos nacionales de la FIJLKAM, y con cualquier persona cuyo dolor musculoesquelético limite su vida diaria, como espalda, cuello, hombro o rodilla. El enfoque es el mismo: valoración precisa, plan a medida, vuelta al movimiento sin dolor.",
    'faq.q8': "¿Dónde está la consulta y cómo reservo?",
    'faq.a8': "Atiendo en Fisiomas Tre Pini, Largo Filippo Juvara 13, 00128 Roma. Puedes reservar en línea desde tu área personal, o llamarme o escribirme por WhatsApp: los datos de contacto están al final de la página.",
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
    'hero.ctaWhatsapp': "Schreiben Sie mir per WhatsApp", 'hero.ctaCall': "Anrufen", 'hero.ctaBook': "Online buchen",
    'hero.trust1': "Eingetragen im Berufsregister TSRM PSTRP Rom", 'hero.trust2': "Physiotherapeut der Nationalteams der FIJLKAM", 'hero.trust3': "In der Praxis in Rom (Tre Pini) oder zu Hause",
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
    'faq.q3': "Wie lange dauert eine Sitzung und was passiert beim ersten Termin?",
    'faq.a3': "Eine Sitzung dauert 45 bis 60 Minuten. Beim ersten Termin führe ich eine gründliche funktionelle Untersuchung durch: Ich erfasse Ihre Krankengeschichte, beurteile Bewegung und Schmerz mit gezielten Tests, und wir legen gemeinsam Ziele und Behandlungsplan fest. Wenn möglich, beginnt die Behandlung bereits in derselben Sitzung.",
    'faq.q4': "Brauche ich eine ärztliche Verordnung?",
    'faq.a4': "Für eine private Physiotherapie ist keine ärztliche Verordnung erforderlich. Ergibt die Untersuchung weiteren Abklärungsbedarf, sage ich Ihnen, welche Fachärztin oder welchen Facharzt Sie aufsuchen sollten. Wenn Sie die Kosten steuerlich geltend machen oder von Ihrer Versicherung erstattet bekommen möchten, klären Sie vorher dort, ob eine Verordnung verlangt wird.",
    'faq.q5': "Bieten Sie Hausbesuche an?",
    'faq.a5': "Ja. Untersuchung und Behandlung sind dieselben wie in der Praxis, nur bei Ihnen zu Hause. Rufen Sie mich an oder schreiben Sie mir, um Gebiet, Tag und Uhrzeit abzustimmen.",
    'faq.q6': "Wie viele Sitzungen brauche ich?",
    'faq.a6': "Das hängt vom Problem, von der Dauer der Beschwerden und von Ihren Zielen ab. Nach der ersten Untersuchung gebe ich Ihnen eine realistische Einschätzung, und wir prüfen den Fortschritt in regelmäßigen Abständen. Das Paketprogramm (mindestens 5 Sitzungen) ist für die funktionelle Erholung und die Rückkehr zum Sport gedacht.",
    'faq.q7': "Behandeln Sie nur Sportlerinnen und Sportler?",
    'faq.a7': "Nein. Ich betreue Leistungssportler, auch aus den Nationalmannschaften der FIJLKAM, und alle, deren Beschwerden am Bewegungsapparat den Alltag einschränken, zum Beispiel am Rücken, Nacken, an der Schulter oder am Knie. Der Ansatz ist derselbe: präzise Untersuchung, maßgeschneiderter Plan, Rückkehr zur schmerzfreien Bewegung.",
    'faq.q8': "Wo ist die Praxis und wie buche ich?",
    'faq.a8': "Ich empfange bei Fisiomas Tre Pini, Largo Filippo Juvara 13, 00128 Rom. Sie können online über Ihren Bereich buchen oder mich anrufen bzw. über WhatsApp schreiben: Meine Kontaktdaten stehen am Seitenende.",
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
