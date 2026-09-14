// Domande dei check-in di salute. Modificabili liberamente: basta cambiare
// questo file, non serve toccare la logica del popup (checkin.js).
// type: 'scale' (1-5), 'pain' (0-10), 'choice' (opzioni), 'text' (libero)

export const weeklyQuestions = [
  { id: 'stato_generale', label: 'Come valuti il tuo stato di salute generale in questo momento?', type: 'choice', options: ['Ottimo', 'Buono', 'Discreto', 'Scarso'] },
  { id: 'dolori_attuali', label: 'Hai dolori o fastidi muscolo-scheletrici attualmente?', type: 'choice', options: ['No', 'Sì, lievi', 'Sì, importanti'] },
  { id: 'dolori_dove', label: 'Se sì, dove e da quanto tempo?', type: 'text', optional: true },
  { id: 'attivita_fisica', label: 'Con che frequenza pratichi attività fisica?', type: 'choice', options: ['Mai', '1-2 volte a settimana', '3 o più volte a settimana'] },
  { id: 'eventi_recenti', label: 'Infortuni, interventi o nuovi eventi di salute rilevanti di recente?', type: 'text', optional: true },
  { id: 'qualita_sonno', label: 'Come valuti la qualità del tuo sonno nell\'ultima settimana?', type: 'scale', min: 1, max: 5, minLabel: 'Scarsa', maxLabel: 'Ottima' },
  { id: 'livello_stress', label: 'Come valuti il tuo livello di stress nell\'ultima settimana?', type: 'scale', min: 1, max: 5, minLabel: 'Assente', maxLabel: 'Molto alto' },
];

export const dailyQuestions = [
  { id: 'dolore_oggi', label: 'Livello di dolore oggi', type: 'pain_pct' },
  { id: 'dolore_zona', label: 'In quale zona (se presente)?', type: 'text', optional: true },
  { id: 'esercizi_svolti', label: 'Hai svolto gli esercizi assegnati?', type: 'choice', options: ['Sì', 'Parzialmente', 'No'] },
  { id: 'nuovi_sintomi', label: 'Sono comparsi nuovi sintomi dall\'ultima seduta?', type: 'text', optional: true },
  { id: 'rispetto_ieri', label: 'Come ti senti oggi rispetto a ieri?', type: 'choice', options: ['Meglio', 'Uguale', 'Peggio'] },
];
