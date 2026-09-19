// Sequenze di traguardi (brevi, generiche) per la timeline di avanzamento
// del paziente, una per categoria di protocolLibrary.js. Non sono legate a
// un singolo quadro clinico specifico ma all'area di trattamento: restano
// un punto di riferimento di massima, lo staff avanza/arretra manualmente
// il traguardo raggiunto in base al singolo caso.
export const milestonesByCategory = {
  'Rachide': ['Valutazione iniziale', 'Controllo del dolore acuto', 'Recupero della mobilità', 'Rinforzo progressivo', 'Ritorno alle attività'],
  'Spalla': ['Valutazione iniziale', 'Controllo del dolore e protezione', 'Recupero del movimento', 'Rinforzo della cuffia e stabilità scapolare', 'Ritorno al gesto sportivo/lavorativo'],
  'Gomito, polso e mano': ['Valutazione iniziale', 'Controllo di dolore e infiammazione', 'Recupero della mobilità', 'Rinforzo della presa e funzione', 'Ritorno alle attività'],
  'Anca': ['Valutazione iniziale', 'Controllo del dolore', 'Recupero della mobilità', 'Rinforzo funzionale', 'Ritorno al cammino/attività sportiva'],
  'Ginocchio': ['Valutazione iniziale', 'Controllo di dolore e gonfiore', 'Recupero del ROM', 'Rinforzo progressivo', 'Ritorno allo sport'],
  'Caviglia e piede': ['Valutazione iniziale', 'Controllo di dolore e gonfiore', 'Recupero della mobilità', 'Rinforzo e propriocezione', 'Ritorno alla corsa/sport'],
  'Neurologico': ['Valutazione iniziale', 'Stabilizzazione clinica', 'Recupero funzionale di base', 'Reintegro delle attività quotidiane', 'Consolidamento dell\'autonomia'],
  'Muscolare e tendineo': ['Valutazione iniziale', 'Controllo del dolore', 'Carico progressivo', 'Rinforzo eccentrico/funzionale', 'Ritorno alla piena attività'],
  'Respiratorio': ['Valutazione iniziale', 'Controllo dei sintomi', 'Recupero della funzione respiratoria', 'Ricondizionamento allo sforzo', 'Autonomia nella gestione quotidiana'],
  'Linfatico': ['Valutazione iniziale', 'Riduzione dell\'edema', 'Stabilizzazione', 'Autogestione con compressione', 'Mantenimento a lungo termine'],
  'Equilibrio e propriocezione': ['Valutazione iniziale', 'Sicurezza di base', 'Equilibrio statico', 'Equilibrio dinamico', 'Autonomia nelle attività a rischio'],
  'Altro muscolo-scheletrico': ['Valutazione iniziale', 'Gestione dei sintomi', 'Recupero funzionale', 'Rinforzo progressivo', 'Mantenimento nel tempo'],
  'Vascolare': ['Valutazione iniziale', 'Gestione dei sintomi', 'Miglioramento del circolo', 'Ricondizionamento allo sforzo', 'Autonomia nello stile di vita'],
  'Pediatria e sviluppo motorio': ['Valutazione iniziale', 'Coinvolgimento della famiglia', 'Stimolazione delle tappe motorie', 'Consolidamento delle acquisizioni', 'Autonomia nel gioco/attività'],
  'Pavimento pelvico': ['Valutazione iniziale', 'Presa di coscienza muscolare', 'Rinforzo/rilassamento specifico', 'Integrazione funzionale', 'Autonomia quotidiana'],
  'Sport da combattimento (Judo, Lotta, Karate)': ['Valutazione iniziale', 'Controllo del dolore e protezione', 'Recupero della mobilità', 'Rinforzo specifico e propriocezione', 'Ritorno graduale all\'allenamento', 'Ritorno alla gara'],
};

// Usata quando il protocollo non e' collegato a nessuna voce della libreria
// (testo scritto liberamente dallo staff, protocol_library_id assente).
export const defaultMilestones = ['Valutazione iniziale', 'Trattamento in corso', 'Miglioramento dei sintomi', 'Consolidamento', 'Dimissione/mantenimento'];

export function milestonesForCategory(category) {
  return milestonesByCategory[category] || defaultMilestones;
}
