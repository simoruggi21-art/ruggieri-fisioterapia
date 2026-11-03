// Percorsi guidati per fasi, uno per ogni quadro clinico di protocolLibrary.js.
// Ogni fase ha un obiettivo, gli esercizi della libreria da proporre e il criterio
// per passare alla fase successiva. Sono modelli di partenza: vanno rivisti e
// adattati al singolo paziente, non sono un'indicazione clinica automatica.
export const progressionLibrary = {
  "cervicalgia": [
    { phase: "acuta", goal: "Calmare il dolore e mantenere il movimento senza forzare.", exercises: ["cervicale-mobilita-generale", "cervicale-retrazione-mento", "cervicale-stretching-trapezio", "cervicale-stretching-elevatore-scapola", "cervicale-stretch-scaleni", "cervicale-rotazione-assistita-asciugamano"], criterion: "Rotazioni quasi complete e dolore a riposo sotto 3/10." },
    { phase: "subacuta", goal: "Recuperare controllo e resistenza dei muscoli del collo.", exercises: ["cervicale-isometria-flessione", "cervicale-isometria-estensione", "cervicale-isometria-laterale", "cervicale-scapular-clock", "cervicale-postura-seduta", "cervicale-flessione-craniocervicale", "cervicale-propriocezione-testa-bersaglio", "cervicale-slider-mediano-cervicale", "toracica-open-book"], criterion: "Isometrie tenute 10 secondi senza dolore e postura sostenibile per un'ora." },
    { phase: "rinforzo", goal: "Rinforzare collo e cingolo scapolare con carichi crescenti.", exercises: ["cervicale-rinforzo-profondi", "postura-attivazione-scapole-seduti", "spalla-face-pull", "funzionale-trazione-elastico", "cervicale-rinforzo-elastico-scapole", "cervicale-resistenza-flessori-collo", "cervicale-isometrici-rotazione", "cervicale-estensione-collo-prono", "cervicale-flessione-laterale-elastico"], criterion: "Esercizi con elastico eseguiti senza dolore il giorno dopo." },
    { phase: "ritorno", goal: "Tornare a lavoro, guida e sport e prevenire le ricadute.", exercises: ["postura-rinforzo-dorsali", "generale-mobilita-toracica", "spalla-prone-y-t-w", "cervicale-pause-attive-lavoro", "cervicale-farmer-collo-neutro"], criterion: "Mantenimento 2 volte a settimana e pause di movimento durante il lavoro." }
  ],
  "colpo-frusta": [
    { phase: "acuta", goal: "Rassicurazione e movimento precoce entro il range indolore.", exercises: ["cervicale-mobilita-generale", "cervicale-retrazione-mento", "respirazione-diaframmatica", "cervicale-stretching-trapezio", "cervicale-stretch-scaleni", "cervicale-rotazione-assistita-asciugamano"], criterion: "Dolore in calo e rotazioni in aumento rispetto al primo giorno." },
    { phase: "subacuta", goal: "Recuperare range completo e controllo cervicale.", exercises: ["cervicale-isometria-flessione", "cervicale-isometria-estensione", "cervicale-isometria-laterale", "cervicale-scapular-clock", "cervicale-flessione-craniocervicale", "cervicale-propriocezione-testa-bersaglio"], criterion: "Range completo o quasi, assenza di vertigini o nausea con i movimenti." },
    { phase: "rinforzo", goal: "Rinforzo dei flessori profondi e dei muscoli scapolari.", exercises: ["cervicale-rinforzo-profondi", "spalla-face-pull", "postura-attivazione-scapole-seduti", "equilibrio-monopodalico-base", "cervicale-rinforzo-elastico-scapole", "cervicale-resistenza-flessori-collo", "cervicale-isometrici-rotazione", "cervicale-estensione-collo-prono", "cervicale-flessione-laterale-elastico"], criterion: "Rinforzo tollerato, nessuna vertigine, nessun peggioramento a fine giornata." },
    { phase: "ritorno", goal: "Ritorno a guida, lavoro e sport.", exercises: ["postura-rinforzo-dorsali", "combattimento-rinforzo-collo-multidirezionale", "generale-mobilita-toracica", "cervicale-pause-attive-lavoro", "cervicale-farmer-collo-neutro"], criterion: "Attività quotidiane senza sintomi. In caso di sintomi persistenti, rivalutazione medica." }
  ],
  "dorsalgia": [
    { phase: "acuta", goal: "Ridurre rigidità e dolore con movimento dolce.", exercises: ["generale-mobilita-toracica", "core-cat-camel", "respirazione-toracica-mobilita", "postura-stretching-pettorali", "toracica-open-book", "toracica-estensione-schienale"], criterion: "Mobilità toracica aumentata e dolore sotto 3/10." },
    { phase: "subacuta", goal: "Attivare estensori e muscoli scapolari.", exercises: ["core-superman", "postura-attivazione-scapole-seduti", "postura-angeli-al-muro", "generale-mobilita-lombare-rotazione", "toracica-estensione-foam-roller", "toracica-thread-the-needle", "toracica-respirazione-costale-3d", "toracica-rotazione-seduta-bastone"], criterion: "Esercizi eseguiti senza dolore, postura sostenibile per un'ora." },
    { phase: "rinforzo", goal: "Rinforzo progressivo della catena posteriore.", exercises: ["postura-rinforzo-dorsali", "funzionale-trazione-elastico", "spalla-face-pull", "core-plank", "toracica-prono-estensione-sollevamento", "toracica-rematore-retrazione", "toracica-pull-apart"], criterion: "Rinforzo con elastico senza dolore il giorno dopo." },
    { phase: "ritorno", goal: "Autonomia nelle attività e prevenzione.", exercises: ["postura-rinforzo-core-antigravitario", "spalla-prone-y-t-w", "funzionale-circuito-misto", "cervicale-pause-attive-lavoro", "toracica-rematore-sospeso", "toracica-toracica-rotazione-landmine"], criterion: "Mantenimento 2-3 volte a settimana e pause durante il lavoro sedentario." }
  ],
  "lombalgia-aspecifica": [
    { phase: "acuta", goal: "Restare attivi e calmare il dolore.", exercises: ["core-cat-camel", "bacino-basculamento", "bacino-respirazione-core", "generale-cammino", "lombare-ginocchia-al-petto", "lombare-cammino-intervallato-lombare", "lombare-rotazione-ginocchia-laterali"], criterion: "Cammino di 15-20 minuti tollerato, dolore sotto 4/10." },
    { phase: "subacuta", goal: "Attivare il core e recuperare mobilità.", exercises: ["bacino-transverso-attivazione", "core-bird-dog", "core-dead-bug", "core-bridge", "generale-mobilita-lombare-rotazione", "lombare-abdominal-bracing", "lombare-multifido-quadrupedia", "lombare-cyclette-lombare"], criterion: "Core-stability di base senza dolore e posture varie tollerate." },
    { phase: "rinforzo", goal: "Rinforzo progressivo e controllo del carico.", exercises: ["core-plank", "core-side-plank", "funzionale-deadlift-kettlebell", "core-pallof-press", "funzionale-squat-completo", "lombare-hip-hinge-bastone", "lombare-carico-asimmetrico", "lombare-sorensen-isometrico", "lombare-roll-up-controllato"], criterion: "Carichi di casa e lavoro senza dolore e senza strascichi il giorno dopo." },
    { phase: "ritorno", goal: "Ritorno al lavoro, sport e prevenzione delle ricadute.", exercises: ["funzionale-circuito-misto", "core-farmers-walk", "sport-core-stability-avanzato", "lombare-stacco-progressivo", "lombare-kettlebell-swing", "lombare-landmine-rotazione", "lombare-pallof-press-a-passo"], criterion: "Piano di mantenimento 2 volte a settimana, nessuna paura del movimento." }
  ],
  "lombosciatalgia": [
    { phase: "acuta", goal: "Posizioni di sollievo e movimento dolce.", exercises: ["core-mckenzie", "core-cat-camel", "bacino-respirazione-core", "generale-cammino", "lombare-ginocchia-al-petto", "lombare-cammino-intervallato-lombare"], criterion: "Dolore alla gamba che si avvicina alla schiena (centralizzazione) e cammino possibile." },
    { phase: "subacuta", goal: "Stabilizzazione e mobilizzazione neurale se indicata.", exercises: ["bacino-transverso-attivazione", "core-bird-dog", "core-bridge", "sciatico-slider-neurale", "lombare-abdominal-bracing", "lombare-multifido-quadrupedia", "lombare-cyclette-lombare"], criterion: "Nessun peggioramento del dolore alla gamba, forza stabile." },
    { phase: "rinforzo", goal: "Rinforzo di core e anche con carico graduale.", exercises: ["core-side-plank", "bacino-ponte-progressivo", "anca-hip-thrust", "funzionale-deadlift-kettlebell", "lombare-hip-hinge-bastone", "lombare-carico-asimmetrico"], criterion: "Esercizi senza dolore in gamba, nessun nuovo deficit di forza." },
    { phase: "ritorno", goal: "Ritorno a lavoro e sport.", exercises: ["funzionale-squat-completo", "funzionale-circuito-misto", "core-farmers-walk", "lombare-stacco-progressivo", "lombare-kettlebell-swing", "lombare-landmine-rotazione", "lombare-pallof-press-a-passo"], criterion: "Attività complete tollerate. Se compare perdita di forza o disturbi di vescica, rivolgersi subito a un medico." }
  ],
  "stenosi-lombare": [
    { phase: "acuta", goal: "Alleviare i sintomi con posizioni in lieve flessione.", exercises: ["stenosi-flessione-lombare-seduti", "bacino-basculamento", "respirazione-diaframmatica", "bacino-mobilita-lombo-pelvica", "lombare-ginocchia-al-petto"], criterion: "Tempo di cammino aumentato e sintomi gestibili a riposo." },
    { phase: "subacuta", goal: "Attivare il core e migliorare la resistenza al cammino.", exercises: ["bacino-transverso-attivazione", "core-dead-bug", "core-bridge", "stenosi-cyclette-flessione", "lombare-cyclette-lombare", "lombare-abdominal-bracing"], criterion: "Resistenza aerobica in aumento e sintomi stabili." },
    { phase: "rinforzo", goal: "Rinforzo di core e anche in sicurezza.", exercises: ["core-bird-dog", "anca-hip-thrust", "funzionale-squat-completo", "acqua-cammino-vasca", "lombare-hip-hinge-bastone"], criterion: "Esercizi senza dolore in gamba e cammino migliorato." },
    { phase: "ritorno", goal: "Mantenimento attivo.", exercises: ["generale-cammino", "stenosi-cyclette-flessione", "funzionale-carry", "lombare-pallof-press-a-passo"], criterion: "Programma settimanale regolare e strategia per i giorni peggiori." }
  ],
  "scoliosi": [
    { phase: "acuta", goal: "Educazione e consapevolezza della postura.", exercises: ["scoliosi-autocorrezione-specchio", "respirazione-diaframmatica", "generale-mobilita-toracica"], criterion: "Corregge la postura guardandosi allo specchio con facilità." },
    { phase: "subacuta", goal: "Esercizi specifici di autocorrezione e mobilità.", exercises: ["scoliosi-autocorrezione-specchio", "scoliosi-respirazione-rotazionale", "core-cat-camel", "bacino-mobilita-lombo-pelvica"], criterion: "Mantiene la correzione durante gli esercizi." },
    { phase: "rinforzo", goal: "Rinforzo del tronco in posizione corretta.", exercises: ["core-side-plank", "core-bird-dog", "postura-rinforzo-dorsali", "bacino-stabilita-monopodalica"], criterion: "Rinforzo eseguito mantenendo l'autocorrezione." },
    { phase: "ritorno", goal: "Integrare la correzione nella vita quotidiana e nello sport.", exercises: ["postura-rinforzo-core-antigravitario", "funzionale-circuito-misto"], criterion: "Controlli periodici concordati con il medico. Nessun esercizio sostituisce il follow-up ortopedico." }
  ],
  "spalla-conflitto": [
    { phase: "acuta", goal: "Ridurre il dolore evitando i gesti irritanti sopra la testa.", exercises: ["spalla-pendolo", "spalla-scapular-retraction", "respirazione-diaframmatica", "generale-mobilita-spalle-cerchi", "spalla-isometrici-rotatori-muro", "spalla-stretch-capsula-posteriore", "spalla-mobilita-distale", "spalla-respirazione-posizione-scapolare", "spalla-isometrico-abduzione-muro", "spalla-isometrico-flessione-muro"], criterion: "Dolore a riposo sotto 3/10 e movimento passivo quasi completo." },
    { phase: "subacuta", goal: "Recuperare mobilità e controllo scapolare: esercizio attivo e assistito, pochi gradi in più per volta. Progressione: da 2 a 3 serie, poi più ripetizioni e tenuta.", exercises: ["spalla-rotazione-esterna", "spalla-rotazione-interna", "spalla-wall-slide", "spalla-flessione-assistita", "spalla-mob-table-slide", "spalla-mob-bastone-elevazione", "spalla-mob-elevazione-scapolare", "spalla-serratus-wall-punch", "spalla-mob-pettorale-porta", "spalla-mob-cross-body", "spalla-stretch-capsula-posteriore"], criterion: "Movimento attivo senza dolore fino a circa 120° e dolore sotto 3/10 durante e dopo gli esercizi." },
    { phase: "rinforzo", goal: "Rinforzo progressivo della cuffia e dei muscoli scapolari.", exercises: ["spalla-abduzione-elastico", "spalla-face-pull", "spalla-push-up-plus", "spalla-push-up-parete", "spalla-scaption-manubrio", "spalla-extrarotazione-90-elastico", "spalla-rematore-elastico-spalla", "spalla-stretch-capsula-posteriore", "spalla-extrarotazione-decubito-laterale", "spalla-scapular-push-up"], criterion: "Rinforzo con elastico senza dolore il giorno dopo." },
    { phase: "ritorno", goal: "Gesti sopra la testa e di lancio, sport e lavoro.", exercises: ["spalla-prone-y-t-w", "spalla-diagonale-kabat", "combattimento-rinforzo-cuffia-proiezioni", "spalla-bottom-up-kettlebell", "spalla-lanci-medicine-ball", "spalla-stretch-capsula-posteriore", "spalla-plank-shoulder-tap", "spalla-press-sopra-testa-landmine", "spalla-trazioni-assistite"], criterion: "Gesto specifico senza dolore, forza simmetrica." }
  ],
  "capsulite-adesiva": [
    { phase: "acuta", goal: "Controllare il dolore e mantenere il movimento senza forzare.", exercises: ["spalla-pendolo", "postchir-spalla-carrucola", "spalla-flessione-assistita", "respirazione-diaframmatica", "spalla-mob-table-slide", "spalla-mob-cross-body", "spalla-stretch-capsula-posteriore", "spalla-mobilita-distale", "spalla-respirazione-posizione-scapolare"], criterion: "Dolore notturno ridotto, rigidità stabile." },
    { phase: "subacuta", goal: "Allungamenti tenuti e mobilità assistita ogni giorno. Progressione: aumentare di pochi gradi per volta l'ampiezza, poi la tenuta (da 5 a 15-30 secondi) e le serie (da 2 a 3-4).", exercises: ["spalla-stretch-capsula-posteriore", "spalla-flessione-assistita", "postchir-spalla-carrucola", "spalla-wall-slide", "spalla-mob-bastone-elevazione", "spalla-mob-bastone-rotazione-esterna", "spalla-mob-mano-dietro-schiena", "spalla-mob-wall-walk", "spalla-mob-preghiera-quadrupedia", "spalla-mob-pettorale-porta", "spalla-mob-estensione-bastone", "spalla-mob-circonduzione-assistita", "toracica-open-book"], criterion: "Range in aumento da una settimana all'altra e capacità di svolgere gesti quotidiani (pettinarsi, allacciarsi il reggiseno o la cintura)." },
    { phase: "rinforzo", goal: "Forza nel nuovo range di movimento.", exercises: ["spalla-rotazione-esterna", "spalla-rotazione-interna", "spalla-abduzione-elastico", "spalla-scapular-retraction", "spalla-scaption-manubrio", "spalla-rematore-elastico-spalla", "spalla-stretch-capsula-posteriore", "spalla-extrarotazione-decubito-laterale", "spalla-scapular-push-up"], criterion: "Gesti quotidiani (lavarsi i capelli, allacciarsi) possibili senza dolore." },
    { phase: "ritorno", goal: "Ripresa delle attività e prevenzione di nuove rigidità.", exercises: ["spalla-face-pull", "spalla-push-up-plus", "spalla-prone-y-t-w", "spalla-extrarotazione-90-elastico", "spalla-stretch-capsula-posteriore", "spalla-plank-shoulder-tap", "spalla-press-sopra-testa-landmine"], criterion: "Funzione completa, la mobilità resta stabile nel tempo." }
  ],
  "cuffia-rotatori": [
    { phase: "acuta", goal: "Protezione e controllo del dolore, movimento passivo.", exercises: ["postchir-spalla-pendolo-precoce", "postchir-spalla-mobilita-passiva-assistita", "postchir-spalla-isometria-protetta", "spalla-scapular-retraction", "spalla-isometrici-rotatori-muro", "spalla-stretch-capsula-posteriore", "spalla-mobilita-distale", "spalla-respirazione-posizione-scapolare", "spalla-isometrico-abduzione-muro", "spalla-isometrico-flessione-muro"], criterion: "Assenza di dolore a riposo; rispetto dei tempi indicati dal chirurgo." },
    { phase: "subacuta", goal: "Movimento attivo-assistito e controllo scapolare.", exercises: ["postchir-spalla-carrucola", "postchir-spalla-progressione-attiva", "spalla-wall-slide", "spalla-flessione-assistita", "spalla-mob-table-slide", "spalla-mob-bastone-elevazione", "spalla-mob-abduzione-supina", "spalla-serratus-wall-punch", "spalla-mob-elevazione-scapolare", "spalla-stretch-capsula-posteriore"], criterion: "Movimento attivo senza compensi e senza dolore." },
    { phase: "rinforzo", goal: "Rinforzo progressivo della cuffia.", exercises: ["spalla-rotazione-esterna", "spalla-rotazione-interna", "spalla-abduzione-elastico", "postchir-spalla-rinforzo-tardivo", "spalla-scaption-manubrio", "spalla-extrarotazione-90-elastico", "spalla-rematore-elastico-spalla", "spalla-stretch-capsula-posteriore", "spalla-extrarotazione-decubito-laterale", "spalla-scapular-push-up"], criterion: "Forza di cuffia adeguata nei test manuali, dolore assente." },
    { phase: "ritorno", goal: "Gesti specifici e carichi sopra la testa.", exercises: ["spalla-push-up-plus", "spalla-face-pull", "spalla-prone-y-t-w", "spalla-diagonale-kabat", "spalla-bottom-up-kettlebell", "spalla-lanci-medicine-ball", "spalla-stretch-capsula-posteriore", "spalla-plank-shoulder-tap", "spalla-press-sopra-testa-landmine", "spalla-trazioni-assistite"], criterion: "Gesto di lavoro o sport senza dolore né debolezza." }
  ],
  "instabilita-spalla": [
    { phase: "acuta", goal: "Calmare e proteggere, con controllo del movimento.", exercises: ["spalla-scapular-retraction", "postchir-spalla-isometria-protetta", "respirazione-diaframmatica", "spalla-pendolo", "spalla-isometrici-rotatori-muro", "spalla-stretch-capsula-posteriore", "spalla-mobilita-distale", "spalla-respirazione-posizione-scapolare"], criterion: "Dolore sotto 3/10 e assenza di sensazioni di cedimento." },
    { phase: "subacuta", goal: "Controllo della scapola e della cuffia in posizioni sicure.", exercises: ["spalla-rotazione-esterna", "spalla-rotazione-interna", "spalla-wall-slide", "spalla-push-up-parete", "spalla-serratus-wall-punch", "spalla-mob-elevazione-scapolare", "spalla-stretch-capsula-posteriore"], criterion: "Controllo scapolare buono senza cedimenti." },
    { phase: "rinforzo", goal: "Rinforzo dinamico e stabilità.", exercises: ["spalla-push-up-plus", "spalla-face-pull", "spalla-abduzione-elastico", "spalla-prone-y-t-w", "spalla-extrarotazione-90-elastico", "spalla-rematore-elastico-spalla", "spalla-stretch-capsula-posteriore", "spalla-extrarotazione-decubito-laterale", "spalla-scapular-push-up"], criterion: "Posizioni di fine range controllate e senza paura." },
    { phase: "ritorno", goal: "Ritorno a sport e lavoro con gesti specifici.", exercises: ["spalla-diagonale-kabat", "combattimento-rinforzo-cuffia-proiezioni", "sport-test-funzionale-ritorno", "spalla-bottom-up-kettlebell", "spalla-lanci-medicine-ball", "spalla-stretch-capsula-posteriore", "spalla-plank-shoulder-tap", "spalla-press-sopra-testa-landmine"], criterion: "Test funzionali superati, nessuna sublussazione." }
  ],
  "lussazione-spalla": [
    { phase: "acuta", goal: "Protezione secondo indicazioni mediche e controllo del dolore.", exercises: ["postchir-spalla-isometria-protetta", "spalla-scapular-retraction", "postchir-spalla-pendolo-precoce", "respirazione-diaframmatica", "spalla-isometrici-rotatori-muro", "spalla-stretch-capsula-posteriore", "spalla-mobilita-distale", "spalla-respirazione-posizione-scapolare"], criterion: "Fine del periodo di protezione indicato dal medico." },
    { phase: "subacuta", goal: "Recupero graduale del movimento.", exercises: ["postchir-spalla-mobilita-passiva-assistita", "spalla-pendolo", "spalla-flessione-assistita", "spalla-wall-slide", "spalla-serratus-wall-punch", "spalla-mob-elevazione-scapolare", "spalla-mob-table-slide", "spalla-mob-bastone-elevazione", "spalla-stretch-capsula-posteriore"], criterion: "Movimento attivo quasi completo senza dolore." },
    { phase: "rinforzo", goal: "Rinforzo di cuffia e scapola.", exercises: ["spalla-rotazione-esterna", "spalla-rotazione-interna", "spalla-push-up-plus", "spalla-face-pull", "spalla-extrarotazione-90-elastico", "spalla-rematore-elastico-spalla", "spalla-stretch-capsula-posteriore", "spalla-extrarotazione-decubito-laterale", "spalla-scapular-push-up"], criterion: "Forza adeguata, nessuna sensazione di instabilità." },
    { phase: "ritorno", goal: "Ritorno allo sport e prevenzione di una nuova lussazione.", exercises: ["spalla-prone-y-t-w", "spalla-diagonale-kabat", "combattimento-rinforzo-cuffia-proiezioni", "spalla-bottom-up-kettlebell", "spalla-lanci-medicine-ball", "spalla-stretch-capsula-posteriore", "spalla-plank-shoulder-tap", "spalla-press-sopra-testa-landmine"], criterion: "Test di forza e di stabilità superati, gesto sportivo senza paura." }
  ],
  "epicondilite": [
    { phase: "acuta", goal: "Ridurre il carico irritante e calmare il dolore.", exercises: ["gomito-isometrici-estensori", "gomito-stretch-estensori", "gomito-mobilita-attiva", "gomito-estensione-assistita"], criterion: "Dolore a riposo assente e presa tollerata per azioni leggere." },
    { phase: "subacuta", goal: "Carico tendineo graduale.", exercises: ["gomito-grip-isometrico", "gomito-pronosupinazione", "gomito-rinforzo-estensori-elastico"], criterion: "Rinforzo eseguibile con dolore sotto 3/10 e senza strascichi." },
    { phase: "rinforzo", goal: "Rinforzo eccentrico e della presa.", exercises: ["gomito-tyler-twist", "gomito-rinforzo-estensori-elastico", "polso-rinforzo-presa", "gomito-eccentrici-estensori-manubrio", "gomito-bicipite-eccentrico", "gomito-tricipite-french-elastico"], criterion: "Presa e sollevamento di pesi senza dolore." },
    { phase: "ritorno", goal: "Ritorno al lavoro e sport (racchetta, palestra).", exercises: ["funzionale-trazione-elastico", "funzionale-carry", "polso-propriocezione-appoggio", "gomito-plank-spinta-controllata", "gomito-lancio-palla-medica-gomito", "gomito-trazione-presa-sbarra"], criterion: "Gesto specifico eseguito senza dolore." }
  ],
  "epitrocleite": [
    { phase: "acuta", goal: "Calmare il dolore e ridurre il carico.", exercises: ["gomito-stretch-flessori", "gomito-mobilita-attiva", "gomito-grip-isometrico", "gomito-isometrici-flessori-polso", "gomito-estensione-assistita"], criterion: "Dolore a riposo assente." },
    { phase: "subacuta", goal: "Carico tendineo graduale.", exercises: ["gomito-pronosupinazione", "gomito-rinforzo-flessori-elastico", "polso-mobilita-flesso-estensione", "gomito-martello-pronosupinazione"], criterion: "Rinforzo con dolore sotto 3/10." },
    { phase: "rinforzo", goal: "Rinforzo eccentrico e della presa.", exercises: ["gomito-tyler-twist", "gomito-rinforzo-flessori-elastico", "polso-rinforzo-presa", "gomito-bicipite-eccentrico", "gomito-tricipite-french-elastico"], criterion: "Presa forte e senza dolore." },
    { phase: "ritorno", goal: "Ritorno a golf, lancio e lavoro manuale.", exercises: ["funzionale-carry", "funzionale-trazione-elastico", "gomito-plank-spinta-controllata", "gomito-lancio-palla-medica-gomito", "gomito-trazione-presa-sbarra"], criterion: "Gesto sportivo senza dolore." }
  ],
  "tunnel-carpale": [
    { phase: "acuta", goal: "Ridurre i sintomi con riposo mirato e movimenti dolci.", exercises: ["mano-tendon-glide", "polso-mobilita-flesso-estensione", "polso-stretching-generale"], criterion: "Formicolii notturni ridotti." },
    { phase: "subacuta", goal: "Scorrimento del nervo e mobilità.", exercises: ["mano-nerve-glide-mediano", "mano-tendon-glide", "mano-plastilina"], criterion: "Sintomi stabili o in calo." },
    { phase: "rinforzo", goal: "Rinforzo funzionale della mano.", exercises: ["polso-rinforzo-presa", "mano-opposizione-pollice", "mano-pinza-fine"], criterion: "Presa senza peggioramento dei sintomi." },
    { phase: "ritorno", goal: "Autonomia nel lavoro e nelle attività quotidiane.", exercises: ["polso-stretching-generale", "mano-tendon-glide"], criterion: "Sintomi gestibili. Se compare perdita di forza o i sintomi persistono, valutazione medica." }
  ],
  "de-quervain": [
    { phase: "acuta", goal: "Calmare il dolore al pollice e al polso.", exercises: ["mano-isometrici-pollice", "polso-mobilita-flesso-estensione", "polso-stretching-generale"], criterion: "Dolore a riposo assente." },
    { phase: "subacuta", goal: "Mobilità e carico tendineo graduale.", exercises: ["mano-opposizione-pollice", "mano-tendon-glide", "mano-isometrici-pollice"], criterion: "Movimento del pollice tollerato senza dolore intenso." },
    { phase: "rinforzo", goal: "Rinforzo di presa e pinza.", exercises: ["mano-pinza-fine", "polso-rinforzo-presa", "mano-estensione-dita-elastico"], criterion: "Presa e pinza senza dolore." },
    { phase: "ritorno", goal: "Ritorno alle attività ripetitive.", exercises: ["polso-propriocezione-appoggio", "funzionale-carry"], criterion: "Gesti di lavoro tollerati." }
  ],
  "rizoartrosi": [
    { phase: "acuta", goal: "Protezione e controllo del dolore.", exercises: ["polso-stretching-generale", "mano-tendon-glide", "mano-isometrici-pollice"], criterion: "Dolore a riposo in calo." },
    { phase: "subacuta", goal: "Mobilità del pollice e controllo.", exercises: ["mano-opposizione-pollice", "mano-plastilina", "mano-estensione-dita-elastico"], criterion: "Mobilità senza dolore acuto." },
    { phase: "rinforzo", goal: "Rinforzo dei muscoli del pollice e della presa.", exercises: ["mano-pinza-fine", "polso-rinforzo-presa", "mano-plastilina"], criterion: "Presa sufficiente per le attività quotidiane." },
    { phase: "ritorno", goal: "Autonomia con adattamento delle attività.", exercises: ["anziani-esercizi-mano-funzionali", "mano-opposizione-pollice"], criterion: "Strategie di protezione articolare apprese." }
  ],
  "lussazione-dito": [
    { phase: "acuta", goal: "Protezione e controllo del gonfiore.", exercises: ["mano-tendon-glide", "polso-mobilita-flesso-estensione"], criterion: "Gonfiore in calo e dolore sotto 3/10." },
    { phase: "subacuta", goal: "Recupero del movimento dell'articolazione.", exercises: ["mano-tendon-glide", "mano-opposizione-pollice", "mano-plastilina"], criterion: "Movimento attivo quasi completo." },
    { phase: "rinforzo", goal: "Rinforzo della presa.", exercises: ["mano-pinza-fine", "polso-rinforzo-presa", "mano-estensione-dita-elastico"], criterion: "Presa forte e senza dolore." },
    { phase: "ritorno", goal: "Ritorno allo sport e al lavoro.", exercises: ["combattimento-mobilita-dita-presa", "combattimento-rinforzo-avambraccio-presa"], criterion: "Gesti sportivi o di lavoro senza dolore." }
  ],
  "coxartrosi": [
    { phase: "acuta", goal: "Ridurre il dolore e mantenere la mobilità.", exercises: ["anca-heel-slide", "anziani-mobilita-anca-seduti", "anca-rotazione-esterna-interna", "acqua-cammino-vasca", "anca-flessione-assistita-anca"], criterion: "Dolore gestibile e mobilità stabile." },
    { phase: "subacuta", goal: "Mobilità e controllo dell'anca.", exercises: ["anca-clamshell", "anca-abduzione", "generale-mobilita-anca-cerchi", "anca-flessori-stretch", "anca-marcia-in-appoggio-anca", "ginocchio-sit-to-stand-controllato", "anca-fire-hydrant"], criterion: "Controllo del bacino durante gli esercizi." },
    { phase: "rinforzo", goal: "Rinforzo di glutei e quadricipite.", exercises: ["core-bridge", "anca-hip-thrust", "anziani-alzata-sedia", "anca-abduzione-elastico-piedi", "anca-step-up-laterale", "anca-hip-hinge-eccentrico", "anca-side-plank-abduzione"], criterion: "Alzata dalla sedia e scale senza dolore importante." },
    { phase: "ritorno", goal: "Mantenimento attivo e autonomia.", exercises: ["generale-cammino", "acqua-aquajogging", "funzionale-squat-completo"], criterion: "Programma regolare, 2-3 volte a settimana." }
  ],
  "conflitto-femoro-acetabolare": [
    { phase: "acuta", goal: "Calmare il dolore evitando le flessioni profonde.", exercises: ["anca-heel-slide", "anca-rocking-quadrupedia", "bacino-respirazione-core", "anca-rotazione-esterna-interna", "anca-flessione-assistita-anca", "anca-rotazione-interna-prono"], criterion: "Dolore inguinale a riposo assente." },
    { phase: "subacuta", goal: "Controllo di bacino e anca.", exercises: ["anca-clamshell", "anca-abduzione", "bacino-stabilita-quadrupedia", "core-bridge", "anca-marcia-in-appoggio-anca", "anca-fire-hydrant"], criterion: "Movimento del bacino controllato." },
    { phase: "rinforzo", goal: "Rinforzo di glutei e core.", exercises: ["anca-hip-thrust", "anca-ponte-monopodalico", "anca-monster-walk", "core-side-plank", "anca-step-up-laterale", "anca-stacco-monopodalico", "anca-hip-hinge-eccentrico", "anca-side-plank-abduzione"], criterion: "Squat e affondi senza dolore inguinale." },
    { phase: "ritorno", goal: "Ritorno allo sport e gesti specifici.", exercises: ["funzionale-squat-completo", "sport-cambio-direzione", "sport-core-stability-avanzato", "anca-hip-airplane", "anca-skater-jump", "anca-affondo-laterale-dinamico"], criterion: "Gesto sportivo senza dolore, test funzionali superati." }
  ],
  "borsite-trocanterica": [
    { phase: "acuta", goal: "Ridurre il carico sul trocantere.", exercises: ["anca-isometrico-abduzione-parete", "bacino-respirazione-core", "anca-heel-slide"], criterion: "Dolore a riposo e di notte ridotto; evitare di dormire sul lato dolente." },
    { phase: "subacuta", goal: "Attivare i glutei senza compressione.", exercises: ["anca-clamshell", "anca-abduzione", "core-bridge", "anca-fire-hydrant"], criterion: "Dolore sotto 3/10 durante gli esercizi." },
    { phase: "rinforzo", goal: "Rinforzo progressivo dei glutei.", exercises: ["anca-abduzione-elastico-piedi", "anca-hip-thrust", "anca-ponte-monopodalico", "anca-monster-walk", "anca-step-up-laterale", "anca-stacco-monopodalico", "anca-side-plank-abduzione"], criterion: "Cammino e scale senza dolore laterale." },
    { phase: "ritorno", goal: "Ritorno alla corsa e allo sport.", exercises: ["funzionale-squat-completo", "bacino-stabilita-monopodalica", "sport-corsa-progressiva", "anca-hip-airplane", "anca-skater-jump", "anca-affondo-laterale-dinamico"], criterion: "Corsa senza dolore, forza simmetrica." }
  ],
  "protesi-anca": [
    { phase: "acuta", goal: "Mobilità precoce e protezione rispettando le precauzioni del chirurgo.", exercises: ["postchir-anca-pompe-e-ponte-leggero", "anca-heel-slide", "respirazione-diaframmatica"], criterion: "Precauzioni chirurgiche rispettate e dolore controllato." },
    { phase: "subacuta", goal: "Cammino con ausili e abduzione.", exercises: ["postchir-anca-cammino-con-ausili", "postchir-anca-abduzione-decubito-protesi", "core-bridge", "anca-marcia-in-appoggio-anca", "anca-fire-hydrant"], criterion: "Cammino con appoggio completo secondo prescrizione." },
    { phase: "rinforzo", goal: "Rinforzo e autonomia nelle attività quotidiane.", exercises: ["postchir-anca-sit-to-stand-protesi", "anca-abduzione", "anziani-alzata-sedia", "anca-step-up-laterale", "anca-side-plank-abduzione"], criterion: "Alzata dalla sedia e scale in autonomia." },
    { phase: "ritorno", goal: "Ritorno alle attività di vita e sport a basso impatto.", exercises: ["generale-cammino", "acqua-aquajogging", "anca-hip-thrust"], criterion: "Controllo del chirurgo per le attività consentite." }
  ],
  "contusione-anca-coscia": [
    { phase: "acuta", goal: "Mobilità precoce indolore e controllo dell'ematoma.", exercises: ["contusione-mobilita-precoce-indolore", "muscolo-isometrici-graduali"], criterion: "Dolore e gonfiore in calo." },
    { phase: "subacuta", goal: "Ripresa graduale del carico e della mobilità.", exercises: ["contusione-carico-graduale-trauma", "generale-stretching-quadricipite", "anca-heel-slide", "anca-fire-hydrant"], criterion: "Mobilità quasi completa." },
    { phase: "rinforzo", goal: "Rinforzo del quadricipite e dei glutei.", exercises: ["ginocchio-mini-squat", "anca-clamshell", "core-bridge", "muscolo-affondo-camminato-lunghezza", "anca-side-plank-abduzione"], criterion: "Forza simmetrica." },
    { phase: "ritorno", goal: "Ritorno allo sport.", exercises: ["sport-corsa-progressiva", "sport-cambio-direzione", "anca-skater-jump", "anca-affondo-laterale-dinamico"], criterion: "Nessun dolore o calo di forza; se la zona si indurisce e fa male, rivalutazione medica (miosite ossificante)." }
  ],
  "ginocchio-lca": [
    { phase: "acuta", goal: "Controllo di gonfiore e dolore, estensione completa e attivazione del quadricipite.", exercises: ["postchir-ginocchio-pompe-caviglia", "postchir-ginocchio-quad-set", "postchir-ginocchio-slr-tutore", "postchir-ginocchio-flessione-passiva", "ginocchio-heel-slide-flessione", "ginocchio-isometrico-estensione-cuscino"], criterion: "Estensione completa, gonfiore controllato, controllo del quadricipite." },
    { phase: "subacuta", goal: "Flessione, carico e propriocezione precoce.", exercises: ["postchir-ginocchio-carico-progressivo", "postchir-ginocchio-cyclette-scarico", "postchir-ginocchio-propriocezione-precoce", "ginocchio-mini-squat", "ginocchio-terminal-extension", "ginocchio-cyclette-range", "ginocchio-sit-to-stand-controllato", "ginocchio-leg-extension-range-protetto"], criterion: "Range quasi completo, cammino senza zoppia." },
    { phase: "rinforzo", goal: "Rinforzo in catena cinetica chiusa e controllo del ginocchio.", exercises: ["postchir-ginocchio-rinforzo-catena-cinetica", "ginocchio-leg-press-corta", "ginocchio-step-down", "ginocchio-hamstring-curl", "ginocchio-leg-press-monopodalica", "ginocchio-single-leg-squat-box", "ginocchio-hamstring-curl-scivolamento", "ginocchio-skater-squat", "ginocchio-spanish-squat-elastico", "ginocchio-rdl-monopodalico-flessione", "ginocchio-camminata-laterale-semisquat-banda", "ginocchio-wall-sit-estensione-alternata", "ginocchio-split-squat-statico", "ginocchio-reverse-nordic"], criterion: "Forza del quadricipite e degli ischiocrurali vicina all'altro lato." },
    { phase: "ritorno", goal: "Corsa, salti e ritorno allo sport con criteri oggettivi: forza e salti confrontati con l'altro lato, non solo il tempo dall'intervento.", exercises: ["sport-corsa-progressiva", "sport-pliometria-base", "ginocchio-atterraggio-controllato", "sport-cambio-direzione", "sport-test-funzionale-ritorno", "ginocchio-hop-test-progressivo", "ginocchio-perturbazioni-monopodaliche", "ginocchio-frenata-decelerazione", "ginocchio-salto-laterale-bound"], criterion: "Rapporto fra i due lati (LSI) almeno 90% nei test di forza e di salto, assenza di gonfiore e dolore, fiducia nel gesto; non prima dei tempi concordati con il chirurgo." }
  ],
  "gonartrosi": [
    { phase: "acuta", goal: "Ridurre il dolore e mantenere la mobilità.", exercises: ["ginocchio-quad-isometrico", "ginocchio-slr", "acqua-cammino-vasca", "acqua-mobilita-articolare"], criterion: "Dolore gestibile e mobilità stabile." },
    { phase: "subacuta", goal: "Attivare quadricipite e controllo del ginocchio.", exercises: ["ginocchio-terminal-extension", "ginocchio-mini-squat", "anziani-rinforzo-quadricipite-seduti", "ginocchio-hamstring-curl", "ginocchio-sit-to-stand-controllato", "ginocchio-cyclette-range"], criterion: "Esercizi senza dolore intenso e senza gonfiore." },
    { phase: "rinforzo", goal: "Rinforzo progressivo di gambe.", exercises: ["ginocchio-step-up", "anziani-alzata-sedia", "ginocchio-leg-press-corta", "anca-clamshell", "caviglia-calf-raise", "ginocchio-spanish-squat-elastico", "ginocchio-rdl-monopodalico-flessione", "ginocchio-camminata-laterale-semisquat-banda", "ginocchio-wall-sit-estensione-alternata", "ginocchio-split-squat-statico"], criterion: "Alzata dalla sedia e scale con meno dolore." },
    { phase: "ritorno", goal: "Mantenimento attivo.", exercises: ["generale-cammino", "acqua-aquajogging", "funzionale-squat-completo"], criterion: "Programma regolare 3 volte a settimana, pesi e dolore sotto controllo." }
  ],
  "condropatia-femoro-rotulea": [
    { phase: "acuta", goal: "Ridurre il dolore, evitando flessioni profonde sotto carico.", exercises: ["ginocchio-quad-isometrico", "ginocchio-slr", "anca-isometrico-abduzione-parete", "bacino-respirazione-core"], criterion: "Dolore a riposo assente." },
    { phase: "subacuta", goal: "Attivare quadricipite e anca.", exercises: ["ginocchio-terminal-extension", "ginocchio-mini-squat", "anca-clamshell", "anca-abduzione", "core-bridge", "ginocchio-leg-extension-range-protetto", "ginocchio-sit-to-stand-controllato"], criterion: "Dolore sotto 3/10 nelle scale." },
    { phase: "rinforzo", goal: "Rinforzo combinato di anca e ginocchio (più efficace del solo ginocchio): glutei, quadricipite e controllo del valgismo.", exercises: ["ginocchio-step-down", "ginocchio-leg-press-corta", "anca-monster-walk", "anca-hip-thrust", "ginocchio-wall-sit", "ginocchio-single-leg-squat-box", "ginocchio-skater-squat", "ginocchio-spanish-squat-elastico", "ginocchio-rdl-monopodalico-flessione", "ginocchio-camminata-laterale-semisquat-banda", "ginocchio-wall-sit-estensione-alternata", "ginocchio-split-squat-statico"], criterion: "Step-down e squat monopodalico senza dolore né cedimento interno del ginocchio." },
    { phase: "ritorno", goal: "Ritorno alla corsa e allo sport.", exercises: ["sport-corsa-progressiva", "sport-cambio-direzione", "ginocchio-atterraggio-controllato", "ginocchio-perturbazioni-monopodaliche"], criterion: "Corsa senza dolore e senza gonfiore il giorno dopo." }
  ],
  "tendinopatia-rotulea": [
    { phase: "acuta", goal: "Ridurre il carico irritante e calmare il dolore con isometrici.", exercises: ["tendinopatia-rotulea-isometrici-70", "tendinopatia-rotulea-spanish-squat", "tendinopatia-rotulea-wall-sit-tendineo"], criterion: "Dolore sotto 3-4/10 e nessun peggioramento nelle 24 ore." },
    { phase: "subacuta", goal: "Carichi lenti isotonici a range protetto.", exercises: ["tendinopatia-rotulea-estensione-lenta", "tendinopatia-rotulea-mini-squat-3s", "tendinopatia-rotulea-leg-press-lenta"], criterion: "Carichi lenti eseguiti senza strascichi il giorno dopo." },
    { phase: "rinforzo", goal: "Heavy slow resistance e rinforzo della catena.", exercises: ["tendinopatia-rotulea-hsr-leg-press", "tendinopatia-rotulea-hsr-squat", "tendinopatia-rotulea-decline-squat", "tendinopatia-rotulea-step-down-decline", "tendinopatia-rotulea-affondo-bulgaro-tend", "tendinopatia-rotulea-catena-posteriore-tend", "ginocchio-spanish-squat-elastico", "ginocchio-rdl-monopodalico-flessione", "ginocchio-camminata-laterale-semisquat-banda", "ginocchio-wall-sit-estensione-alternata", "ginocchio-split-squat-statico", "ginocchio-reverse-nordic"], criterion: "Carichi elevati tollerati e saltelli di prova senza dolore." },
    { phase: "ritorno", goal: "Carico elastico e ritorno allo sport.", exercises: ["tendinopatia-rotulea-pogo-jump", "tendinopatia-rotulea-salto-contromovimento", "tendinopatia-rotulea-drop-jump", "tendinopatia-rotulea-cambio-direzione-tend", "tendinopatia-rotulea-test-rientro-rotuleo", "ginocchio-frenata-decelerazione", "ginocchio-salto-laterale-bound"], criterion: "Single-leg decline squat senza dolore e test di salto superati." }
  ],
  "protesi-ginocchio": [
    { phase: "acuta", goal: "Gonfiore, estensione e flessione precoce.", exercises: ["postchir-ginocchio-pompe-caviglia", "postchir-ginocchio-quad-set", "postchir-ginocchio-slr-tutore", "postchir-ginocchio-flessione-passiva", "ginocchio-heel-slide-flessione", "ginocchio-isometrico-estensione-cuscino"], criterion: "Estensione completa e flessione in aumento ogni giorno." },
    { phase: "subacuta", goal: "Cammino, scale e cyclette senza resistenza.", exercises: ["postchir-ginocchio-carico-progressivo", "postchir-ginocchio-cyclette-scarico", "postchir-ginocchio-propriocezione-precoce", "ginocchio-terminal-extension", "ginocchio-cyclette-range", "ginocchio-sit-to-stand-controllato"], criterion: "Cammino senza ausili e flessione vicina a 110-120° secondo il chirurgo." },
    { phase: "rinforzo", goal: "Rinforzo funzionale.", exercises: ["ginocchio-mini-squat", "ginocchio-step-up", "anziani-alzata-sedia", "ginocchio-hamstring-curl", "postchir-ginocchio-rinforzo-catena-cinetica", "ginocchio-spanish-squat-elastico", "ginocchio-rdl-monopodalico-flessione", "ginocchio-camminata-laterale-semisquat-banda", "ginocchio-wall-sit-estensione-alternata", "ginocchio-split-squat-statico"], criterion: "Scale in autonomia e alzata dalla sedia senza aiuto." },
    { phase: "ritorno", goal: "Attività a basso impatto e mantenimento.", exercises: ["generale-cammino", "acqua-aquajogging", "equilibrio-monopodalico-base"], criterion: "Controllo periodico dal chirurgo." }
  ],
  "lussazione-rotula": [
    { phase: "acuta", goal: "Protezione e controllo del gonfiore.", exercises: ["ginocchio-quad-isometrico", "ginocchio-slr", "postchir-ginocchio-pompe-caviglia", "ginocchio-heel-slide-flessione", "ginocchio-isometrico-estensione-cuscino"], criterion: "Gonfiore in calo e assenza di cedimenti." },
    { phase: "subacuta", goal: "Attivazione di quadricipite e anca.", exercises: ["ginocchio-terminal-extension", "ginocchio-mini-squat", "anca-clamshell", "anca-abduzione"], criterion: "Controllo del ginocchio senza sensazione di instabilità." },
    { phase: "rinforzo", goal: "Rinforzo e controllo del valgismo.", exercises: ["ginocchio-step-down", "ginocchio-leg-press-corta", "anca-monster-walk", "anca-hip-thrust", "ginocchio-skater-squat", "ginocchio-single-leg-squat-box", "ginocchio-spanish-squat-elastico", "ginocchio-rdl-monopodalico-flessione", "ginocchio-camminata-laterale-semisquat-banda", "ginocchio-wall-sit-estensione-alternata", "ginocchio-split-squat-statico"], criterion: "Forza vicina all'altro lato e step-down corretto." },
    { phase: "ritorno", goal: "Ritorno allo sport e prevenzione.", exercises: ["sport-cambio-direzione", "ginocchio-atterraggio-controllato", "sport-test-funzionale-ritorno", "ginocchio-hop-test-progressivo", "ginocchio-perturbazioni-monopodaliche", "ginocchio-frenata-decelerazione", "ginocchio-salto-laterale-bound"], criterion: "Test funzionali superati, nessuna sensazione di instabilità." }
  ],
  "contusione-ginocchio": [
    { phase: "acuta", goal: "Mobilità precoce indolore e controllo del gonfiore.", exercises: ["contusione-mobilita-precoce-indolore", "ginocchio-quad-isometrico", "postchir-ginocchio-pompe-caviglia", "ginocchio-heel-slide-flessione", "ginocchio-isometrico-estensione-cuscino"], criterion: "Gonfiore e dolore in calo." },
    { phase: "subacuta", goal: "Ripresa del carico e della mobilità.", exercises: ["contusione-carico-graduale-trauma", "ginocchio-slr", "ginocchio-terminal-extension", "ginocchio-mini-squat"], criterion: "Mobilità quasi completa." },
    { phase: "rinforzo", goal: "Rinforzo e propriocezione.", exercises: ["ginocchio-step-up", "ginocchio-hamstring-curl", "equilibrio-monopodalico-base", "ginocchio-leg-press-corta", "ginocchio-skater-squat", "ginocchio-single-leg-squat-box", "ginocchio-spanish-squat-elastico", "ginocchio-rdl-monopodalico-flessione", "ginocchio-camminata-laterale-semisquat-banda", "ginocchio-wall-sit-estensione-alternata", "ginocchio-split-squat-statico"], criterion: "Forza simmetrica." },
    { phase: "ritorno", goal: "Ritorno allo sport.", exercises: ["sport-corsa-progressiva", "sport-cambio-direzione", "ginocchio-hop-test-progressivo", "ginocchio-perturbazioni-monopodaliche"], criterion: "Nessun gonfiore residuo o dolore. Se persiste, rivalutazione medica." }
  ],
  "caviglia-distorsione": [
    { phase: "acuta", goal: "Proteggere, ridurre il gonfiore e muoversi presto.", exercises: ["caviglia-alfabeto", "caviglia-mobilita-dorsiflessione", "caviglia-theraband-flex", "caviglia-isometrici-eversione"], criterion: "Cammino senza zoppia, gonfiore in calo." },
    { phase: "subacuta", goal: "Recuperare mobilità e controllo.", exercises: ["caviglia-eversione-elastico", "caviglia-stretch-tendine-achille", "caviglia-propriocezione", "caviglia-cammino-tacchi-punte", "caviglia-dorsiflessione-affondo-banda", "caviglia-tibiale-posteriore-elastico"], criterion: "Mobilità completa e equilibrio su un piede per 30 secondi." },
    { phase: "rinforzo", goal: "Forza e propriocezione dinamica.", exercises: ["caviglia-calf-raise", "caviglia-tavola-instabile", "equilibrio-superficie-instabile", "piede-equilibrio-superficie-morbida", "caviglia-calf-raise-monopodalico-lento", "caviglia-tibiale-anteriore-elastico"], criterion: "Equilibrio instabile senza dolore e 15 sollevamenti monopodalici." },
    { phase: "ritorno", goal: "Corsa, salti e ritorno allo sport.", exercises: ["sport-corsa-progressiva", "caviglia-salti-controllati", "sport-cambio-direzione", "combattimento-propriocezione-caviglia-dinamica", "caviglia-hop-stabilizzazione", "caviglia-perturbazioni-partner", "caviglia-lateral-hop-quadrato", "caviglia-salto-corda"], criterion: "Test di salto monopodalico superati e fiducia nel movimento." }
  ],
  "lussazione-caviglia": [
    { phase: "acuta", goal: "Protezione secondo indicazioni mediche, controllo del gonfiore.", exercises: ["caviglia-alfabeto", "postchir-ginocchio-pompe-caviglia", "respirazione-diaframmatica", "caviglia-isometrici-eversione"], criterion: "Fine dell'immobilizzazione indicata dal medico." },
    { phase: "subacuta", goal: "Recupero graduale della mobilità e del carico.", exercises: ["caviglia-mobilita-dorsiflessione", "caviglia-theraband-flex", "caviglia-cammino-tacchi-punte", "caviglia-stretch-tendine-achille", "caviglia-dorsiflessione-affondo-banda", "caviglia-tibiale-posteriore-elastico"], criterion: "Cammino senza ausili." },
    { phase: "rinforzo", goal: "Rinforzo e propriocezione.", exercises: ["caviglia-eversione-elastico", "caviglia-calf-raise", "caviglia-propriocezione", "caviglia-tavola-instabile", "caviglia-calf-raise-monopodalico-lento", "caviglia-tibiale-anteriore-elastico"], criterion: "Equilibrio monopodalico stabile." },
    { phase: "ritorno", goal: "Ritorno allo sport.", exercises: ["sport-corsa-progressiva", "caviglia-salti-controllati", "sport-cambio-direzione", "caviglia-hop-stabilizzazione", "caviglia-perturbazioni-partner", "caviglia-lateral-hop-quadrato", "caviglia-salto-corda"], criterion: "Test funzionali superati e permesso dello specialista." }
  ],
  "tendinopatia-achillea": [
    { phase: "acuta", goal: "Calmare il dolore con isometrici e ridurre i carichi irritanti.", exercises: ["achille-isometrici-achille", "caviglia-mobilita-dorsiflessione", "generale-stretching-polpaccio"], criterion: "Dolore sotto 3-4/10 e nessun peggioramento nelle 24 ore." },
    { phase: "subacuta", goal: "Carico tendineo progressivo.", exercises: ["caviglia-calf-raise", "caviglia-eccentrico-achille", "anziani-rinforzo-polpacci-seduti"], criterion: "Sollevamenti sulle punte senza dolore e senza rigidità mattutina." },
    { phase: "rinforzo", goal: "Rinforzo lento con carico crescente.", exercises: ["achille-calf-raise-carico-lento", "tendinopatia-rotulea-catena-posteriore-tend", "core-bridge", "caviglia-calf-raise-monopodalico-lento", "caviglia-tibiale-anteriore-elastico"], criterion: "Carichi elevati tollerati." },
    { phase: "ritorno", goal: "Carico elastico e ritorno alla corsa.", exercises: ["achille-rimbalzi-ritmici", "caviglia-salti-controllati", "sport-corsa-progressiva", "caviglia-salto-corda"], criterion: "Saltelli e corsa senza dolore e senza rigidità il giorno dopo." }
  ],
  "fascite-plantare": [
    { phase: "acuta", goal: "Calmare il dolore al tallone.", exercises: ["piede-stretching-fascia-plantare", "piede-rullo-plantare", "piede-stretching-dita", "generale-stretching-polpaccio"], criterion: "Dolore dei primi passi del mattino in calo." },
    { phase: "subacuta", goal: "Attivare il piede e il polpaccio.", exercises: ["piede-arco-plantare", "piede-asciugamano-dita", "piede-estensione-dita", "caviglia-calf-raise"], criterion: "Camminata di 20 minuti senza dolore importante." },
    { phase: "rinforzo", goal: "Carico progressivo (high load).", exercises: ["piede-calf-raise-asciugamano", "piede-sollevamento-arco", "piede-equilibrio-superficie-morbida"], criterion: "Calf raise con asciugamano senza dolore." },
    { phase: "ritorno", goal: "Ritorno a corsa e attività in piedi.", exercises: ["piede-cammino-terreni-vari", "sport-corsa-progressiva"], criterion: "Corsa senza dolore al tallone." }
  ],
  "contusione-piede": [
    { phase: "acuta", goal: "Mobilità precoce indolore e controllo del gonfiore.", exercises: ["contusione-mobilita-precoce-indolore", "caviglia-alfabeto"], criterion: "Gonfiore in calo." },
    { phase: "subacuta", goal: "Ripresa del carico.", exercises: ["contusione-carico-graduale-trauma", "piede-arco-plantare", "caviglia-theraband-flex"], criterion: "Cammino senza zoppia." },
    { phase: "rinforzo", goal: "Rinforzo e propriocezione.", exercises: ["caviglia-calf-raise", "piede-asciugamano-dita", "caviglia-propriocezione"], criterion: "Equilibrio e forza simmetrici." },
    { phase: "ritorno", goal: "Ritorno allo sport.", exercises: ["caviglia-salti-controllati", "sport-corsa-progressiva"], criterion: "Nessun dolore. Se persiste, rivalutazione medica." }
  ],
  "lesione-muscolare": [
    { phase: "acuta", goal: "Protezione relativa e mobilità precoce indolore.", exercises: ["muscolo-isometrici-graduali", "contusione-mobilita-precoce-indolore", "generale-cammino"], criterion: "Dolore a riposo assente, contrazione isometrica senza dolore." },
    { phase: "subacuta", goal: "Carico progressivo e allungamento controllato.", exercises: ["muscolo-ponte-ischiocrurali-carico", "generale-stretching-ischiocrurali", "generale-stretching-quadricipite", "generale-stretching-adduttori"], criterion: "Esercizi con carico senza dolore e range completo." },
    { phase: "rinforzo", goal: "Rinforzo eccentrico e funzionale.", exercises: ["muscolo-stacco-rumeno", "sport-rinforzo-eccentrico-ischiocrurali", "muscolo-affondo-camminato-lunghezza", "core-bridge"], criterion: "Forza del lato lesionato vicina all'altro lato." },
    { phase: "ritorno", goal: "Corsa progressiva e ritorno allo sport.", exercises: ["muscolo-corsa-progressiva-lesione", "sport-sprint-progressivi", "sport-cambio-direzione", "sport-test-funzionale-ritorno"], criterion: "Sprint e cambi di direzione senza dolore e test di forza superati." }
  ],
  "strappo-quadricipite": [
    { phase: "acuta", goal: "Protezione relativa e attivazione.", exercises: ["ginocchio-quad-isometrico", "muscolo-isometrici-graduali", "ginocchio-slr", "generale-cammino"], criterion: "Isometrici senza dolore." },
    { phase: "subacuta", goal: "Carico e mobilità.", exercises: ["ginocchio-mini-squat", "ginocchio-terminal-extension", "generale-stretching-quadricipite", "ginocchio-step-up"], criterion: "Mobilità completa e squat senza dolore." },
    { phase: "rinforzo", goal: "Rinforzo eccentrico.", exercises: ["ginocchio-eccentrico-quad", "ginocchio-leg-press-corta", "ginocchio-affondo-bulgaro", "muscolo-affondo-camminato-lunghezza", "ginocchio-rdl-monopodalico-flessione", "ginocchio-reverse-nordic", "ginocchio-split-squat-statico"], criterion: "Forza simmetrica." },
    { phase: "ritorno", goal: "Corsa e ritorno allo sport.", exercises: ["muscolo-corsa-progressiva-lesione", "sport-sprint-progressivi", "sport-cambio-direzione"], criterion: "Test superati e assenza di dolore." }
  ],
  "strappo-ischiocrurali": [
    { phase: "acuta", goal: "Protezione relativa e isometrici.", exercises: ["muscolo-isometrici-graduali", "generale-cammino", "muscolo-ponte-ischiocrurali-carico"], criterion: "Isometrici senza dolore." },
    { phase: "subacuta", goal: "Carico e flessibilità.", exercises: ["muscolo-ponte-ischiocrurali-carico", "ginocchio-hamstring-curl", "generale-stretching-ischiocrurali", "core-bridge"], criterion: "Ponte monopodalico senza dolore." },
    { phase: "rinforzo", goal: "Rinforzo eccentrico (Nordic).", exercises: ["muscolo-stacco-rumeno", "sport-rinforzo-eccentrico-ischiocrurali", "anca-ponte-monopodalico", "anca-hip-thrust", "ginocchio-rdl-monopodalico-flessione"], criterion: "Forza vicina all'altro lato." },
    { phase: "ritorno", goal: "Sprint e ritorno allo sport.", exercises: ["muscolo-corsa-progressiva-lesione", "sport-sprint-progressivi", "sport-agility-scaletta", "sport-test-funzionale-ritorno"], criterion: "Sprint massimali senza dolore, test superati." }
  ],
  "strappo-adduttori": [
    { phase: "acuta", goal: "Protezione relativa e squeeze indolori.", exercises: ["muscolo-adduttori-squeeze", "muscolo-isometrici-graduali", "generale-cammino"], criterion: "Squeeze a intensità crescente senza dolore." },
    { phase: "subacuta", goal: "Mobilità e carico.", exercises: ["generale-stretching-adduttori", "core-bridge", "bacino-stabilita-quadrupedia", "anca-clamshell"], criterion: "Mobilità completa e dolore assente nei movimenti del giorno." },
    { phase: "rinforzo", goal: "Rinforzo specifico degli adduttori.", exercises: ["muscolo-copenhagen-adduttori", "anca-monster-walk", "bacino-squat-sumo", "muscolo-affondo-camminato-lunghezza"], criterion: "Copenhagen senza dolore." },
    { phase: "ritorno", goal: "Corsa, cambi di direzione e ritorno allo sport.", exercises: ["muscolo-corsa-progressiva-lesione", "sport-cambio-direzione", "sport-test-funzionale-ritorno", "anca-affondo-laterale-dinamico", "anca-skater-jump"], criterion: "Squeeze al 100% senza dolore e test superati." }
  ],
  "strappo-polpaccio": [
    { phase: "acuta", goal: "Protezione relativa e mobilità indolore.", exercises: ["caviglia-alfabeto", "caviglia-mobilita-dorsiflessione", "muscolo-isometrici-graduali"], criterion: "Cammino senza zoppia." },
    { phase: "subacuta", goal: "Carico progressivo.", exercises: ["caviglia-calf-raise", "generale-stretching-polpaccio", "anziani-rinforzo-polpacci-seduti"], criterion: "Sollevamento bipodalico senza dolore." },
    { phase: "rinforzo", goal: "Rinforzo eccentrico monopodalico.", exercises: ["caviglia-eccentrico-achille", "achille-calf-raise-carico-lento", "tendinopatia-rotulea-catena-posteriore-tend"], criterion: "Sollevamento monopodalico senza dolore." },
    { phase: "ritorno", goal: "Corsa e ritorno allo sport.", exercises: ["achille-rimbalzi-ritmici", "muscolo-corsa-progressiva-lesione", "caviglia-salti-controllati", "sport-cambio-direzione"], criterion: "Salti e corsa senza dolore." }
  ],
  "contusione-muscolare": [
    { phase: "acuta", goal: "Mobilità precoce indolore e controllo dell'ematoma.", exercises: ["contusione-mobilita-precoce-indolore", "muscolo-isometrici-graduali"], criterion: "Dolore e gonfiore in calo." },
    { phase: "subacuta", goal: "Ripresa del carico e dell'allungamento.", exercises: ["contusione-carico-graduale-trauma", "generale-stretching-quadricipite", "generale-stretching-ischiocrurali"], criterion: "Mobilità completa." },
    { phase: "rinforzo", goal: "Rinforzo funzionale.", exercises: ["ginocchio-mini-squat", "core-bridge", "muscolo-affondo-camminato-lunghezza"], criterion: "Forza simmetrica." },
    { phase: "ritorno", goal: "Ritorno allo sport.", exercises: ["sport-corsa-progressiva", "sport-cambio-direzione"], criterion: "Nessun dolore. Se la zona si indurisce e fa male, rivalutazione medica." }
  ],
  "pubalgia": [
    { phase: "acuta", goal: "Ridurre i carichi irritanti e il dolore.", exercises: ["muscolo-adduttori-squeeze", "bacino-respirazione-core", "bacino-transverso-attivazione", "generale-stretching-adduttori"], criterion: "Squeeze senza dolore." },
    { phase: "subacuta", goal: "Stabilità del core e del bacino.", exercises: ["core-dead-bug", "core-bird-dog", "bacino-ponte-progressivo", "bacino-stabilita-quadrupedia"], criterion: "Core stability di base senza dolore inguinale." },
    { phase: "rinforzo", goal: "Rinforzo di adduttori e core.", exercises: ["muscolo-copenhagen-adduttori", "core-side-plank", "core-pallof-press", "bacino-squat-sumo"], criterion: "Copenhagen senza dolore." },
    { phase: "ritorno", goal: "Corsa, cambi di direzione e calcio.", exercises: ["muscolo-corsa-progressiva-lesione", "sport-cambio-direzione", "sport-core-stability-avanzato", "sport-test-funzionale-ritorno", "anca-skater-jump", "anca-affondo-laterale-dinamico"], criterion: "Squeeze al 100% e test superati." }
  ],
  "doms-sovraccarico": [
    { phase: "acuta", goal: "Muoversi dolcemente per ridurre la rigidità.", exercises: ["generale-cammino", "generale-stretching-catena-posteriore", "generale-mobilita-anca-cerchi"], criterion: "Rigidità in calo entro 48-72 ore." },
    { phase: "subacuta", goal: "Riprendere con allenamento leggero.", exercises: ["riscaldamento-mobilita-articolare-generale", "riscaldamento-cammino-veloce", "acqua-mobilita-articolare"], criterion: "Allenamento leggero senza dolore." },
    { phase: "rinforzo", goal: "Ripristinare il carico in modo graduale.", exercises: ["funzionale-squat-completo", "core-plank", "funzionale-circuito-misto"], criterion: "Carichi precedenti ripresi senza dolore." },
    { phase: "ritorno", goal: "Prevenzione: pianificare i carichi.", exercises: ["sport-riscaldamento-strutturato", "riscaldamento-attivazione-glutei"], criterion: "Aumenti di carico non superiori al 10% a settimana." }
  ],
  "osteoporosi": [
    { phase: "acuta", goal: "Educazione, respirazione e mobilità sicura (evitare flessioni e torsioni forzate del tronco).", exercises: ["respirazione-diaframmatica", "postura-mobilita-bacino", "generale-cammino", "anziani-mobilita-anca-seduti"], criterion: "Cammino regolare tollerato." },
    { phase: "subacuta", goal: "Postura ed estensione toracica.", exercises: ["postura-attivazione-scapole-seduti", "postura-angeli-al-muro", "core-superman", "anziani-equilibrio-appoggio"], criterion: "Postura migliorata, equilibrio sicuro." },
    { phase: "rinforzo", goal: "Carico osseo e rinforzo progressivo.", exercises: ["osteo-heel-drops", "osteo-squat-carico-ossa", "anziani-alzata-sedia", "postura-rinforzo-dorsali", "funzionale-trazione-elastico"], criterion: "Carichi aumentati senza dolore alla schiena." },
    { phase: "ritorno", goal: "Mantenimento e prevenzione delle cadute.", exercises: ["equilibrio-tandem", "equilibrio-monopodalico-base", "funzionale-carry"], criterion: "Programma costante 2-3 volte a settimana." }
  ],
  "fibromialgia": [
    { phase: "acuta", goal: "Gestione dei sintomi, respirazione e movimento leggero.", exercises: ["respirazione-rilassamento", "respirazione-diaframmatica", "anziani-stretching-dolce", "acqua-rilassamento-galleggiamento"], criterion: "Esercizio di 5-10 minuti tollerato senza peggioramenti il giorno dopo." },
    { phase: "subacuta", goal: "Cammino leggero e mobilità.", exercises: ["fibro-cammino-leggero-progressivo", "acqua-cammino-vasca", "generale-mobilita-toracica", "generale-stretching-catena-posteriore"], criterion: "Cammino di 20 minuti tollerato." },
    { phase: "rinforzo", goal: "Rinforzo a bassa intensità.", exercises: ["acqua-rinforzo-arti-inferiori", "anziani-alzata-sedia", "core-bridge", "acqua-rinforzo-arti-superiori"], criterion: "Aumento dell'intensità senza ricadute di dolore e fatica." },
    { phase: "ritorno", goal: "Consolidamento dello stile di vita attivo.", exercises: ["generale-cammino", "acqua-aquajogging", "funzionale-circuito-misto"], criterion: "Attività regolare con gestione dell'energia." }
  ],
  "contusione-ossea": [
    { phase: "acuta", goal: "Protezione relativa e controllo del dolore.", exercises: ["contusione-mobilita-precoce-indolore", "respirazione-diaframmatica", "generale-cammino"], criterion: "Dolore in calo." },
    { phase: "subacuta", goal: "Ripresa graduale del carico.", exercises: ["contusione-carico-graduale-trauma", "generale-mobilita-squat-flow", "caviglia-alfabeto"], criterion: "Carico tollerato senza dolore osseo." },
    { phase: "rinforzo", goal: "Rinforzo e propriocezione.", exercises: ["ginocchio-mini-squat", "equilibrio-monopodalico-base", "core-bridge"], criterion: "Forza e equilibrio simmetrici." },
    { phase: "ritorno", goal: "Ritorno alle attività sportive.", exercises: ["sport-corsa-progressiva", "sport-cambio-direzione"], criterion: "Nessun dolore. In caso di dolore persistente, rivalutazione medica." }
  ],
  "ictus": [
    { phase: "acuta", goal: "Posizionamento, mobilizzazione e prime verticalizzazioni.", exercises: ["neuro-posizionamento-letto", "neuro-mobilizzazione-passiva-arto", "neuro-stretching-spasticita"], criterion: "Stabilità clinica e autorizzazione medica alla mobilizzazione attiva." },
    { phase: "subacuta", goal: "Controllo del tronco, trasferimenti e carico.", exercises: ["neuro-controllo-tronco-seduto", "neuro-trasferimenti-letto-sedia", "neuro-alzata-assistita", "neuro-carico-arto-plegico"], criterion: "Seduto stabile senza appoggio e trasferimenti con assistenza minima." },
    { phase: "rinforzo", goal: "Cammino e uso funzionale dell'arto.", exercises: ["neuro-cammino-parallele", "neuro-compito-funzionale-arto-superiore", "neuro-rinforzo-sottomassimale"], criterion: "Cammino con ausili in sicurezza." },
    { phase: "ritorno", goal: "Autonomia e ricondizionamento.", exercises: ["neuro-cammino-aerobico-supervisionato", "neuro-equilibrio-dinamico-neuro", "equilibrio-doppio-compito"], criterion: "Autonomia nelle attività quotidiane, supervisione ridotta." }
  ],
  "parkinson": [
    { phase: "acuta", goal: "Mobilità e rilassamento.", exercises: ["neuro-rotazioni-tronco-parkinson", "respirazione-diaframmatica", "generale-mobilita-toracica", "generale-stretching-catena-posteriore"], criterion: "Rigidità e dolori ridotti." },
    { phase: "subacuta", goal: "Ampiezza dei movimenti e postura.", exercises: ["neuro-movimenti-ampi", "postura-angeli-al-muro", "postura-attivazione-scapole-seduti"], criterion: "Movimenti più ampi nella vita quotidiana." },
    { phase: "rinforzo", goal: "Cammino ritmato e rinforzo.", exercises: ["neuro-cammino-ritmo-sonoro", "anziani-alzata-sedia", "core-bridge", "equilibrio-tandem"], criterion: "Cammino con passo più lungo e meno blocchi." },
    { phase: "ritorno", goal: "Equilibrio dinamico e mantenimento.", exercises: ["neuro-equilibrio-dinamico-neuro", "equilibrio-doppio-compito", "neuro-cammino-aerobico-supervisionato"], criterion: "Programma regolare 3-4 volte a settimana." }
  ],
  "sclerosi-multipla": [
    { phase: "acuta", goal: "Gestione della fatica e mobilità dolce.", exercises: ["respirazione-rilassamento", "neuro-stretching-spasticita", "generale-mobilita-toracica", "neuro-recupero-graduale-attivita"], criterion: "Fatica gestita, sintomi stabili." },
    { phase: "subacuta", goal: "Controllo di tronco, equilibrio e cammino.", exercises: ["neuro-controllo-tronco-seduto", "anziani-equilibrio-appoggio", "neuro-carico-arto-plegico", "generale-cammino"], criterion: "Equilibrio e cammino sicuri con supervisione." },
    { phase: "rinforzo", goal: "Rinforzo sottomassimale e resistenza.", exercises: ["neuro-rinforzo-sottomassimale", "anziani-alzata-sedia", "acqua-rinforzo-arti-inferiori", "core-bridge"], criterion: "Rinforzo senza peggioramento della fatica dopo 24 ore." },
    { phase: "ritorno", goal: "Aerobico moderato e mantenimento.", exercises: ["neuro-cammino-aerobico-supervisionato", "acqua-aquajogging", "neuro-equilibrio-dinamico-neuro"], criterion: "Evitare il surriscaldamento; programma costante." }
  ],
  "lesione-midollare": [
    { phase: "acuta", goal: "Posizionamento, mobilizzazione e prevenzione delle complicanze.", exercises: ["neuro-posizionamento-letto", "neuro-mobilizzazione-passiva-arto", "neuro-stretching-spasticita", "respirazione-costale"], criterion: "Stabilità clinica e autorizzazione del medico." },
    { phase: "subacuta", goal: "Controllo del tronco e trasferimenti.", exercises: ["neuro-controllo-tronco-seduto", "neuro-trasferimenti-letto-sedia", "neuro-sollevamenti-scarico-carrozzina", "respirazione-diaframmatica"], criterion: "Trasferimenti con assistenza minima." },
    { phase: "rinforzo", goal: "Rinforzo degli arti superiori e autonomia.", exercises: ["neuro-trasferimenti-autonomi", "neuro-rinforzo-sottomassimale", "spalla-face-pull", "neuro-sollevamenti-scarico-carrozzina"], criterion: "Trasferimenti in autonomia in sicurezza." },
    { phase: "ritorno", goal: "Ricondizionamento e partecipazione.", exercises: ["neuro-cammino-aerobico-supervisionato", "acqua-rinforzo-arti-superiori"], criterion: "Programma regolare con equipaggiamento adeguato." }
  ],
  "guillain-barre": [
    { phase: "acuta", goal: "Posizionamento e mobilizzazione dolce senza fatica.", exercises: ["neuro-posizionamento-letto", "neuro-mobilizzazione-passiva-arto", "respirazione-diaframmatica"], criterion: "Stabilità clinica e miglioramento della forza." },
    { phase: "subacuta", goal: "Attivazione e gestione dell'energia.", exercises: ["neuro-recupero-graduale-attivita", "neuro-controllo-tronco-seduto", "neuro-alzata-assistita"], criterion: "Sedersi e alzarsi con assistenza ridotta." },
    { phase: "rinforzo", goal: "Rinforzo sottomassimale.", exercises: ["neuro-rinforzo-sottomassimale", "anziani-alzata-sedia", "neuro-cammino-parallele"], criterion: "Nessuna fatica eccessiva dopo l'esercizio." },
    { phase: "ritorno", goal: "Ricondizionamento graduale.", exercises: ["neuro-cammino-aerobico-supervisionato", "equilibrio-tandem", "acqua-cammino-vasca"], criterion: "Aumento graduale senza ricadute di fatica." }
  ],
  "vertigini-vestibolare": [
    { phase: "acuta", goal: "Esercizi guidati dal terapista dopo valutazione.", exercises: ["vestib-brandt-daroff", "respirazione-rilassamento", "cervicale-mobilita-generale"], criterion: "Vertigini posizionali in calo; la manovra di riposizionamento si fa in studio." },
    { phase: "subacuta", goal: "Stabilizzazione dello sguardo e abituazione.", exercises: ["vestib-stabilizzazione-sguardo", "vestib-abituazione-movimenti-testa", "equilibrio-monopodalico-base"], criterion: "Movimenti scatenanti tollerati con sintomi lievi." },
    { phase: "rinforzo", goal: "Equilibrio con informazioni ridotte.", exercises: ["vestib-equilibrio-schiuma-occhi-chiusi", "equilibrio-tandem", "equilibrio-superficie-instabile"], criterion: "Equilibrio con occhi chiusi per 30 secondi." },
    { phase: "ritorno", goal: "Cammino e attività con movimenti della testa.", exercises: ["vestib-cammino-con-rotazioni-testa", "equilibrio-doppio-compito", "equilibrio-camminata-linea"], criterion: "Cammino con rotazioni senza vertigini intense. Sintomi nuovi o neurologici: valutazione medica." }
  ],
  "paralisi-facciale": [
    { phase: "acuta", goal: "Massaggio dolce e protezione dell'occhio.", exercises: ["neuro-facciale-massaggio-dolce", "respirazione-rilassamento"], criterion: "Tono muscolare e sensibilità in recupero." },
    { phase: "subacuta", goal: "Mimica lenta e simmetrica allo specchio.", exercises: ["neuro-facciale-mimica-specchio", "neuro-facciale-massaggio-dolce"], criterion: "Movimenti volontari presenti e simmetrici." },
    { phase: "rinforzo", goal: "Controllo fine ed evitare le sincinesie.", exercises: ["neuro-facciale-mimica-specchio"], criterion: "Movimenti isolati senza coinvolgere altri muscoli del viso." },
    { phase: "ritorno", goal: "Naturalezza del movimento nella vita quotidiana.", exercises: ["neuro-facciale-mimica-specchio"], criterion: "Mimica spontanea simmetrica." }
  ],
  "neuropatia-periferica": [
    { phase: "acuta", goal: "Educazione, cura dei piedi ed esercizio leggero.", exercises: ["neuro-neuropatia-equilibrio-sicuro", "respirazione-rilassamento", "generale-cammino"], criterion: "Cammino regolare tollerato; piedi controllati ogni giorno." },
    { phase: "subacuta", goal: "Equilibrio e sensibilità dei piedi.", exercises: ["neuro-neuropatia-equilibrio-sicuro", "piede-arco-plantare", "piede-estensione-dita", "equilibrio-tandem"], criterion: "Equilibrio più stabile." },
    { phase: "rinforzo", goal: "Rinforzo delle gambe.", exercises: ["neuro-neuropatia-rinforzo-gambe", "anziani-alzata-sedia", "caviglia-theraband-flex", "equilibrio-monopodalico-base"], criterion: "Forza in aumento senza ferite ai piedi." },
    { phase: "ritorno", goal: "Attività aerobica e prevenzione delle cadute.", exercises: ["generale-cammino", "acqua-cammino-vasca", "equilibrio-doppio-compito"], criterion: "Programma costante. Segnalare ferite o arrossamenti." }
  ],
  "linfedema-secondario": [
    { phase: "acuta", goal: "Respirazione drenante e decongestione.", exercises: ["linfa-respirazione-drenante", "linfa-autodrenaggio", "linfa-pompa-muscolare-arto-superiore"], criterion: "Volume stabile o in calo." },
    { phase: "subacuta", goal: "Movimento con compressione.", exercises: ["linfa-esercizio-con-compressione", "linfa-pompa-muscolare-arto-superiore", "spalla-flessione-assistita"], criterion: "Movimento tollerato con compressione." },
    { phase: "rinforzo", goal: "Rinforzo progressivo a basso carico.", exercises: ["linfa-rinforzo-progressivo-linfedema", "funzionale-trazione-elastico", "acqua-rinforzo-arti-superiori"], criterion: "Nessun aumento del volume." },
    { phase: "ritorno", goal: "Mantenimento attivo.", exercises: ["linfa-mantenimento-attivo", "acqua-aquajogging", "generale-cammino"], criterion: "Programma costante e controlli periodici." }
  ],
  "linfedema-primario": [
    { phase: "acuta", goal: "Respirazione drenante e decongestione.", exercises: ["linfa-respirazione-drenante", "linfa-autodrenaggio", "linfa-pompa-muscolare-arto-inferiore"], criterion: "Volume stabile o in calo." },
    { phase: "subacuta", goal: "Movimento con compressione.", exercises: ["linfa-esercizio-con-compressione", "linfa-pompa-muscolare-arto-inferiore", "vasc-pompa-caviglia"], criterion: "Movimento tollerato con compressione." },
    { phase: "rinforzo", goal: "Rinforzo progressivo a basso carico.", exercises: ["linfa-rinforzo-progressivo-linfedema", "acqua-rinforzo-arti-inferiori", "anziani-alzata-sedia"], criterion: "Nessun aumento del volume." },
    { phase: "ritorno", goal: "Mantenimento attivo.", exercises: ["linfa-mantenimento-attivo", "acqua-aquajogging", "generale-cammino"], criterion: "Programma costante e controlli periodici." }
  ],
  "edema-post-chirurgico": [
    { phase: "acuta", goal: "Elevazione e pompa muscolare.", exercises: ["vasc-pompa-caviglia", "linfa-pompa-muscolare-arto-inferiore", "linfa-respirazione-drenante"], criterion: "Gonfiore in calo." },
    { phase: "subacuta", goal: "Movimento con compressione.", exercises: ["linfa-esercizio-con-compressione", "caviglia-alfabeto", "generale-cammino"], criterion: "Cammino regolare senza aumento dell'edema." },
    { phase: "rinforzo", goal: "Rinforzo funzionale.", exercises: ["caviglia-calf-raise", "ginocchio-mini-squat", "anziani-alzata-sedia"], criterion: "Gonfiore stabile a fine giornata." },
    { phase: "ritorno", goal: "Mantenimento.", exercises: ["generale-cammino", "acqua-aquajogging"], criterion: "Se il gonfiore aumenta o compare dolore al polpaccio, rivolgersi al medico." }
  ],
  "bpco": [
    { phase: "acuta", goal: "Controllo della respirazione e della dispnea.", exercises: ["respirazione-labbra-socchiuse", "respirazione-diaframmatica", "respirazione-costale", "respirazione-controllo-sforzo"], criterion: "Respiro controllato a riposo e dispnea sotto controllo." },
    { phase: "subacuta", goal: "Tolleranza allo sforzo con cammino a intervalli.", exercises: ["resp-cammino-intervallato", "respirazione-toracica-mobilita", "generale-mobilita-toracica", "resp-tecniche-espettorazione"], criterion: "Camminata a intervalli di 15-20 minuti tollerata." },
    { phase: "rinforzo", goal: "Rinforzo di arti e ricondizionamento.", exercises: ["resp-rinforzo-arti-sup-respiro", "anziani-alzata-sedia", "funzionale-step-up-carico", "acqua-rinforzo-arti-inferiori"], criterion: "Dispnea tollerabile 3-4/10 durante l'esercizio." },
    { phase: "ritorno", goal: "Mantenimento aerobico e autogestione.", exercises: ["neuro-cammino-aerobico-supervisionato", "resp-sit-to-stand-fatica", "generale-cammino"], criterion: "Programma regolare. Segnalare peggioramenti o cambiamenti dell'espettorato." }
  ],
  "post-covid": [
    { phase: "acuta", goal: "Respirazione e gestione della fatica.", exercises: ["respirazione-diaframmatica", "respirazione-labbra-socchiuse", "respirazione-rilassamento", "neuro-recupero-graduale-attivita"], criterion: "Respiro controllato e fatica gestita con pause." },
    { phase: "subacuta", goal: "Cammino leggero a intervalli e mobilità.", exercises: ["resp-cammino-intervallato", "respirazione-toracica-mobilita", "generale-mobilita-toracica"], criterion: "Cammino di 15 minuti senza peggioramento il giorno dopo." },
    { phase: "rinforzo", goal: "Ricondizionamento progressivo.", exercises: ["resp-sit-to-stand-fatica", "resp-rinforzo-arti-sup-respiro", "anziani-alzata-sedia", "acqua-cammino-vasca"], criterion: "Aumento graduale senza ricadute di fatica o respiro corto." },
    { phase: "ritorno", goal: "Ritorno a lavoro e attività.", exercises: ["neuro-cammino-aerobico-supervisionato", "funzionale-circuito-misto"], criterion: "Evitare sforzi massimali finché persistono sintomi; valutazione medica se compaiono dolore toracico o dispnea importante." }
  ],
  "post-chirurgia-toracica": [
    { phase: "acuta", goal: "Prevenzione delle complicanze respiratorie.", exercises: ["resp-spirometria-incentivante", "respirazione-diaframmatica", "respirazione-costale", "resp-tecniche-espettorazione"], criterion: "Respirazione profonda e tosse senza dolore importante." },
    { phase: "subacuta", goal: "Mobilizzazione precoce e cammino.", exercises: ["generale-cammino", "generale-mobilita-toracica", "respirazione-toracica-mobilita", "spalla-flessione-assistita"], criterion: "Cammino autonomo nel reparto." },
    { phase: "rinforzo", goal: "Rinforzo e ricondizionamento.", exercises: ["resp-rinforzo-arti-sup-respiro", "anziani-alzata-sedia", "core-bridge"], criterion: "Rispetto delle limitazioni al sollevamento indicate dal chirurgo." },
    { phase: "ritorno", goal: "Ritorno alle attività.", exercises: ["resp-cammino-intervallato", "funzionale-carry"], criterion: "Attività leggere riprese con autorizzazione del chirurgo." }
  ],
  "arteriopatia-periferica": [
    { phase: "acuta", goal: "Educazione e cammino a basso carico.", exercises: ["vasc-pompa-caviglia", "generale-cammino", "respirazione-diaframmatica"], criterion: "Cammino senza dolore a riposo; dolore a riposo o ulcere: valutazione medica urgente." },
    { phase: "subacuta", goal: "Rinforzo dei polpacci e cammino a intervalli.", exercises: ["vasc-sollevamenti-polpacci-claudicatio", "vasc-camminata-fino-al-dolore", "anziani-rinforzo-polpacci-seduti"], criterion: "Distanza di cammino in aumento." },
    { phase: "rinforzo", goal: "Cammino strutturato fino al dolore moderato.", exercises: ["vasc-camminata-fino-al-dolore", "vasc-intervalli-cammino", "caviglia-calf-raise"], criterion: "30-45 minuti totali, 3 volte a settimana." },
    { phase: "ritorno", goal: "Mantenimento e stile di vita.", exercises: ["vasc-intervalli-cammino", "generale-cammino", "acqua-aquajogging"], criterion: "Programma costante, controllo di pressione, glicemia e fumo." }
  ],
  "trombosi-venosa-esiti": [
    { phase: "acuta", goal: "Cammino precoce e pompe di caviglia secondo il medico.", exercises: ["vasc-pompa-caviglia", "linfa-pompa-muscolare-arto-inferiore", "generale-cammino"], criterion: "Terapia anticoagulante in corso; assenza di nuovi gonfiori." },
    { phase: "subacuta", goal: "Movimento con calza elastica.", exercises: ["linfa-esercizio-con-compressione", "caviglia-alfabeto", "caviglia-theraband-flex"], criterion: "Gonfiore stabile a fine giornata." },
    { phase: "rinforzo", goal: "Rinforzo della pompa muscolare.", exercises: ["caviglia-calf-raise", "anziani-alzata-sedia", "acqua-cammino-vasca"], criterion: "Esercizi senza dolore e senza aumento dell'edema." },
    { phase: "ritorno", goal: "Mantenimento.", exercises: ["generale-cammino", "acqua-aquajogging", "linfa-mantenimento-attivo"], criterion: "Programma regolare. Dolore o gonfiore improvviso: contattare subito il medico." }
  ],
  "incontinenza-urinaria": [
    { phase: "acuta", goal: "Consapevolezza e rilassamento del pavimento pelvico.", exercises: ["pelvi-respiro-rilassamento", "pelvi-ginocchia-al-petto-rilassamento", "bacino-respirazione-core"], criterion: "Sa individuare i muscoli da contrarre." },
    { phase: "subacuta", goal: "Contrazioni di base.", exercises: ["pelvi-contrazione-base", "pelvi-contrazioni-resistenti", "bacino-transverso-attivazione"], criterion: "10 contrazioni da 8 secondi." },
    { phase: "rinforzo", goal: "Contrazione prima dello sforzo.", exercises: ["pelvi-knack", "pelvi-ponte-con-contrazione", "bacino-ponte-progressivo"], criterion: "Perdite in calo durante colpi di tosse." },
    { phase: "ritorno", goal: "Integrazione nei gesti.", exercises: ["pelvi-squat-con-contrazione", "funzionale-squat-completo", "core-pallof-press"], criterion: "Continenza mantenuta nello sport e nel lavoro." }
  ],
  "diastasi-addominale": [
    { phase: "acuta", goal: "Attivazione del trasverso e respirazione.", exercises: ["pelvi-diastasi-attivazione-trasverso", "pelvi-respiro-rilassamento", "bacino-respirazione-core"], criterion: "Attiva il trasverso senza rigonfiamento a cupola." },
    { phase: "subacuta", goal: "Esercizi protetti.", exercises: ["pelvi-diastasi-testa-sollevata-protetta", "bacino-marcia-supina", "bacino-transverso-attivazione", "core-bridge"], criterion: "Diastasi stabile o in riduzione." },
    { phase: "rinforzo", goal: "Rinforzo progressivo.", exercises: ["pelvi-plank-progressivo-postparto", "core-bird-dog", "core-dead-bug", "pelvi-ponte-con-contrazione"], criterion: "Nessun rigonfiamento durante lo sforzo." },
    { phase: "ritorno", goal: "Ritorno allo sport.", exercises: ["funzionale-circuito-misto", "core-side-plank", "sport-core-stability-avanzato"], criterion: "Controllo del core stabile durante lo sforzo." }
  ],
  "torcicollo-miogeno": [
    { phase: "acuta", goal: "Posizionamento e giochi (con i genitori, concordati con il terapista).", exercises: ["pedia-tummy-time", "pedia-rotazione-capo-gioco"], criterion: "Il bambino gira il capo verso il lato limitato con più facilità." },
    { phase: "subacuta", goal: "Stimolare la rotazione e l'inclinazione.", exercises: ["pedia-rotazione-capo-gioco", "pedia-rotolamento-gioco", "pedia-tummy-time"], criterion: "Range cervicale in aumento." },
    { phase: "rinforzo", goal: "Controllo del capo e del tronco.", exercises: ["pedia-gattonamento", "pedia-rotolamento-gioco"], criterion: "Postura simmetrica." },
    { phase: "ritorno", goal: "Gioco motorio e controllo periodico.", exercises: ["pedia-gioco-attivo-guidato"], criterion: "Valutazione periodica dal pediatra e dal terapista." }
  ],
  "ritardo-sviluppo-motorio": [
    { phase: "acuta", goal: "Posizioni a pancia in giù e interazione.", exercises: ["pedia-tummy-time", "pedia-rotolamento-gioco"], criterion: "Il bambino solleva la testa e partecipa al gioco." },
    { phase: "subacuta", goal: "Rotolamento e seduto.", exercises: ["pedia-rotolamento-gioco", "pedia-gattonamento"], criterion: "Rotola nelle due direzioni." },
    { phase: "rinforzo", goal: "Gattonamento e primi passi.", exercises: ["pedia-gattonamento", "pedia-piedi-nudi-giochi"], criterion: "Cambia posizione in autonomia." },
    { phase: "ritorno", goal: "Gioco motorio e consolidamento.", exercises: ["pedia-gioco-attivo-guidato", "pedia-piedi-nudi-giochi"], criterion: "Valutazione periodica dal pediatra e dal terapista." }
  ],
  "instabilita-cronica-caviglia": [
    { phase: "acuta", goal: "Controllo dei sintomi e mobilità.", exercises: ["caviglia-alfabeto", "caviglia-mobilita-dorsiflessione", "caviglia-theraband-flex", "caviglia-isometrici-eversione"], criterion: "Gonfiore e dolore assenti." },
    { phase: "subacuta", goal: "Rinforzo dei peronei e propriocezione base.", exercises: ["caviglia-eversione-elastico", "caviglia-propriocezione", "piede-arco-plantare", "equilibrio-monopodalico-base", "caviglia-dorsiflessione-affondo-banda", "caviglia-tibiale-posteriore-elastico"], criterion: "Equilibrio monopodalico per 30 secondi." },
    { phase: "rinforzo", goal: "Propriocezione dinamica.", exercises: ["caviglia-tavola-instabile", "equilibrio-superficie-instabile", "piede-equilibrio-superficie-morbida", "equilibrio-star-excursion", "caviglia-calf-raise-monopodalico-lento", "caviglia-tibiale-anteriore-elastico"], criterion: "Star excursion simmetrica." },
    { phase: "ritorno", goal: "Corsa, salti e sport.", exercises: ["caviglia-salti-controllati", "sport-cambio-direzione", "combattimento-propriocezione-caviglia-dinamica", "sport-corsa-progressiva", "caviglia-hop-stabilizzazione", "caviglia-perturbazioni-partner", "caviglia-lateral-hop-quadrato", "caviglia-salto-corda"], criterion: "Sport senza cedimenti." }
  ],
  "rieducazione-equilibrio-generale": [
    { phase: "acuta", goal: "Sicurezza e appoggi.", exercises: ["anziani-equilibrio-appoggio", "anziani-cammino-assistito", "respirazione-diaframmatica"], criterion: "Esercizi con appoggio senza vertigini." },
    { phase: "subacuta", goal: "Equilibrio statico.", exercises: ["equilibrio-monopodalico-base", "equilibrio-tandem", "anziani-cammino-ostacoli-bassi"], criterion: "Tandem per 20 secondi." },
    { phase: "rinforzo", goal: "Equilibrio dinamico e forza.", exercises: ["equilibrio-camminata-linea", "equilibrio-superficie-instabile", "anziani-alzata-sedia", "caviglia-calf-raise"], criterion: "Cammino e alzata dalla sedia in sicurezza." },
    { phase: "ritorno", goal: "Doppio compito e attività a rischio.", exercises: ["equilibrio-doppio-compito", "anziani-doppio-compito-cammino", "equilibrio-perturbazioni"], criterion: "Programma 3 volte a settimana, nessuna caduta." }
  ],
  "sublussazione-rotula": [
    { phase: "acuta", goal: "Controllo di dolore e gonfiore.", exercises: ["ginocchio-quad-isometrico", "ginocchio-slr", "anca-isometrico-abduzione-parete", "ginocchio-heel-slide-flessione", "ginocchio-isometrico-estensione-cuscino"], criterion: "Gonfiore ridotto." },
    { phase: "subacuta", goal: "Quadricipite e anca.", exercises: ["ginocchio-terminal-extension", "ginocchio-mini-squat", "anca-clamshell", "anca-abduzione"], criterion: "Controllo del ginocchio senza cedimenti." },
    { phase: "rinforzo", goal: "Controllo dinamico del ginocchio.", exercises: ["ginocchio-step-down", "anca-monster-walk", "equilibrio-monopodalico-base", "equilibrio-superficie-instabile", "ginocchio-skater-squat", "ginocchio-single-leg-squat-box", "ginocchio-spanish-squat-elastico", "ginocchio-rdl-monopodalico-flessione", "ginocchio-camminata-laterale-semisquat-banda", "ginocchio-wall-sit-estensione-alternata", "ginocchio-split-squat-statico"], criterion: "Step-down corretto e senza dolore." },
    { phase: "ritorno", goal: "Ritorno allo sport.", exercises: ["sport-cambio-direzione", "ginocchio-atterraggio-controllato", "sport-test-funzionale-ritorno", "ginocchio-hop-test-progressivo", "ginocchio-perturbazioni-monopodaliche", "ginocchio-frenata-decelerazione", "ginocchio-salto-laterale-bound"], criterion: "Nessuna sensazione di instabilità." }
  ],
  "instabilita-funzionale-ginocchio-lca": [
    { phase: "acuta", goal: "Gonfiore, estensione e quadricipite.", exercises: ["ginocchio-quad-isometrico", "ginocchio-slr", "ginocchio-terminal-extension", "ginocchio-heel-slide-flessione", "ginocchio-isometrico-estensione-cuscino"], criterion: "Ginocchio sgonfio, estensione completa." },
    { phase: "subacuta", goal: "Controllo neuromuscolare di base.", exercises: ["ginocchio-mini-squat", "equilibrio-monopodalico-base", "core-bridge", "ginocchio-hamstring-curl"], criterion: "Squat controllato senza cedimenti." },
    { phase: "rinforzo", goal: "Rinforzo e controllo dinamico.", exercises: ["ginocchio-step-down", "ginocchio-leg-press-monopodalica", "equilibrio-superficie-instabile", "equilibrio-affondo-dinamico", "ginocchio-skater-squat", "ginocchio-single-leg-squat-box", "ginocchio-spanish-squat-elastico", "ginocchio-rdl-monopodalico-flessione", "ginocchio-camminata-laterale-semisquat-banda", "ginocchio-wall-sit-estensione-alternata", "ginocchio-split-squat-statico"], criterion: "Test monopodalici stabili." },
    { phase: "ritorno", goal: "Salti, cambi di direzione e sport.", exercises: ["ginocchio-atterraggio-controllato", "sport-pliometria-base", "sport-cambio-direzione", "sport-test-funzionale-ritorno", "ginocchio-hop-test-progressivo", "ginocchio-perturbazioni-monopodaliche", "ginocchio-frenata-decelerazione", "ginocchio-salto-laterale-bound"], criterion: "Hop test e test di forza superati." }
  ],
  "deficit-propriocettivo-immobilizzazione": [
    { phase: "acuta", goal: "Mobilità e attivazione muscolare.", exercises: ["caviglia-alfabeto", "contusione-mobilita-precoce-indolore", "ginocchio-quad-isometrico"], criterion: "Mobilità in aumento senza dolore." },
    { phase: "subacuta", goal: "Equilibrio base.", exercises: ["equilibrio-monopodalico-base", "equilibrio-tandem", "piede-arco-plantare"], criterion: "Equilibrio monopodalico per 20 secondi." },
    { phase: "rinforzo", goal: "Propriocezione dinamica e forza.", exercises: ["equilibrio-superficie-instabile", "caviglia-tavola-instabile", "equilibrio-camminata-linea", "ginocchio-mini-squat"], criterion: "Appoggio stabile sull'arto interessato." },
    { phase: "ritorno", goal: "Ritorno alle attività.", exercises: ["equilibrio-perturbazioni", "equilibrio-star-excursion", "sport-agility-scaletta"], criterion: "Test funzionali superati." }
  ],
  "instabilita-spalla-proiezioni": [
    { phase: "acuta", goal: "Protezione e controllo del dolore.", exercises: ["postchir-spalla-isometria-protetta", "spalla-scapular-retraction", "spalla-pendolo", "spalla-isometrici-rotatori-muro", "spalla-stretch-capsula-posteriore", "spalla-mobilita-distale", "spalla-respirazione-posizione-scapolare"], criterion: "Dolore sotto 3/10 e nessun cedimento." },
    { phase: "subacuta", goal: "Controllo di cuffia e scapola.", exercises: ["spalla-rotazione-esterna", "spalla-rotazione-interna", "spalla-wall-slide", "spalla-push-up-parete", "spalla-serratus-wall-punch", "spalla-mob-elevazione-scapolare", "spalla-stretch-capsula-posteriore"], criterion: "Controllo scapolare buono." },
    { phase: "rinforzo", goal: "Rinforzo specifico per le proiezioni.", exercises: ["combattimento-rinforzo-cuffia-proiezioni", "spalla-push-up-plus", "spalla-face-pull", "combattimento-core-antirotazione", "spalla-extrarotazione-90-elastico", "spalla-rematore-elastico-spalla", "spalla-stretch-capsula-posteriore", "spalla-extrarotazione-decubito-laterale", "spalla-scapular-push-up"], criterion: "Forza e controllo in posizioni di fine range." },
    { phase: "ritorno", goal: "Caduta controllata, prese e randori.", exercises: ["combattimento-controllo-caduta-ukemi", "spalla-diagonale-kabat", "combattimento-riscaldamento-neuromuscolare", "sport-test-funzionale-ritorno", "spalla-bottom-up-kettlebell", "spalla-lanci-medicine-ball", "spalla-stretch-capsula-posteriore", "spalla-plank-shoulder-tap", "spalla-press-sopra-testa-landmine"], criterion: "Test superati e rientro graduale al randori." }
  ],
  "lesioni-dita-mani-judogi": [
    { phase: "acuta", goal: "Protezione, gonfiore e mobilità dolce.", exercises: ["mano-tendon-glide", "polso-mobilita-flesso-estensione"], criterion: "Gonfiore in calo e dolore sotto 3/10." },
    { phase: "subacuta", goal: "Mobilità delle dita e della presa.", exercises: ["combattimento-mobilita-dita-presa", "mano-plastilina", "mano-opposizione-pollice"], criterion: "Movimento quasi completo." },
    { phase: "rinforzo", goal: "Rinforzo della presa.", exercises: ["combattimento-rinforzo-avambraccio-presa", "polso-rinforzo-presa", "mano-pinza-fine"], criterion: "Presa forte e senza dolore." },
    { phase: "ritorno", goal: "Ritorno alle prese al judogi.", exercises: ["mano-estensione-dita-elastico", "combattimento-riscaldamento-neuromuscolare"], criterion: "Presa e kumikata senza dolore." }
  ],
  "trauma-cervicale-ponte-lotta": [
    { phase: "acuta", goal: "Rassicurazione e mobilità dolce.", exercises: ["cervicale-mobilita-generale", "cervicale-retrazione-mento", "respirazione-diaframmatica", "cervicale-stretching-trapezio", "cervicale-stretch-scaleni", "cervicale-rotazione-assistita-asciugamano"], criterion: "Dolore e rigidità in calo." },
    { phase: "subacuta", goal: "Controllo cervicale di base.", exercises: ["cervicale-isometria-flessione", "cervicale-isometria-estensione", "cervicale-isometria-laterale", "cervicale-scapular-clock", "cervicale-flessione-craniocervicale", "cervicale-propriocezione-testa-bersaglio"], criterion: "Isometrie senza dolore." },
    { phase: "rinforzo", goal: "Rinforzo multidirezionale del collo.", exercises: ["combattimento-rinforzo-collo-multidirezionale", "cervicale-rinforzo-profondi", "spalla-face-pull", "cervicale-rinforzo-elastico-scapole", "cervicale-resistenza-flessori-collo", "cervicale-isometrici-rotazione", "cervicale-estensione-collo-prono", "cervicale-flessione-laterale-elastico"], criterion: "Forza simmetrica nel collo." },
    { phase: "ritorno", goal: "Ritorno al ponte, ai combattimenti a terra e agli allenamenti di lotta.", exercises: ["generale-mobilita-toracica", "combattimento-controllo-caduta-ukemi", "combattimento-riscaldamento-neuromuscolare", "cervicale-farmer-collo-neutro"], criterion: "Assenza di sintomi neurologici; test superati e autorizzazione dello staff medico." }
  ],
  "infortunio-ginocchio-placcaggio": [
    { phase: "acuta", goal: "Controllo di dolore, gonfiore e quadricipite.", exercises: ["ginocchio-quad-isometrico", "ginocchio-slr", "postchir-ginocchio-pompe-caviglia", "ginocchio-heel-slide-flessione", "ginocchio-isometrico-estensione-cuscino"], criterion: "Gonfiore e dolore in calo." },
    { phase: "subacuta", goal: "Mobilità e carico.", exercises: ["ginocchio-mini-squat", "ginocchio-terminal-extension", "combattimento-mobilita-anca-guardia", "equilibrio-monopodalico-base"], criterion: "Range completo e cammino senza zoppia." },
    { phase: "rinforzo", goal: "Rinforzo e controllo eccentrico.", exercises: ["combattimento-controllo-eccentrico-ginocchio", "ginocchio-step-down", "ginocchio-leg-press-corta", "ginocchio-hamstring-curl", "ginocchio-skater-squat", "ginocchio-single-leg-squat-box", "ginocchio-spanish-squat-elastico", "ginocchio-rdl-monopodalico-flessione", "ginocchio-camminata-laterale-semisquat-banda", "ginocchio-wall-sit-estensione-alternata", "ginocchio-split-squat-statico"], criterion: "Forza vicina all'altro lato." },
    { phase: "ritorno", goal: "Gesto specifico e ritorno agli allenamenti.", exercises: ["sport-cambio-direzione", "sport-pliometria-base", "sport-test-funzionale-ritorno", "combattimento-riscaldamento-neuromuscolare", "ginocchio-hop-test-progressivo", "ginocchio-perturbazioni-monopodaliche", "ginocchio-frenata-decelerazione", "ginocchio-salto-laterale-bound"], criterion: "Test superati e consenso dello staff medico." }
  ],
  "iperestensione-gomito-leva": [
    { phase: "acuta", goal: "Protezione e controllo del dolore.", exercises: ["gomito-mobilita-attiva", "gomito-stretch-tricipite", "respirazione-diaframmatica", "gomito-estensione-assistita"], criterion: "Gonfiore e dolore in calo." },
    { phase: "subacuta", goal: "Mobilità e controllo.", exercises: ["gomito-mobilita-attiva", "gomito-pronosupinazione", "gomito-grip-isometrico", "gomito-martello-pronosupinazione"], criterion: "Estensione completa senza dolore." },
    { phase: "rinforzo", goal: "Rinforzo di gomito e avambraccio.", exercises: ["gomito-rinforzo-flessori-elastico", "gomito-rinforzo-estensori-elastico", "combattimento-rinforzo-avambraccio-presa", "spalla-push-up-parete", "gomito-bicipite-eccentrico", "gomito-tricipite-french-elastico"], criterion: "Forza simmetrica." },
    { phase: "ritorno", goal: "Ritorno a prese e leve.", exercises: ["spalla-push-up-plus", "combattimento-riscaldamento-neuromuscolare", "sport-test-funzionale-ritorno", "gomito-plank-spinta-controllata", "gomito-lancio-palla-medica-gomito", "gomito-trazione-presa-sbarra"], criterion: "Estensione senza paura e senza dolore; consenso dello staff medico." }
  ],
  "tendinopatia-achillea-karate": [
    { phase: "acuta", goal: "Calmare il dolore con isometrici e ridurre i salti.", exercises: ["achille-isometrici-achille", "caviglia-mobilita-dorsiflessione", "generale-stretching-polpaccio"], criterion: "Dolore sotto 3-4/10." },
    { phase: "subacuta", goal: "Carico tendineo progressivo.", exercises: ["caviglia-calf-raise", "caviglia-eccentrico-achille", "anziani-rinforzo-polpacci-seduti"], criterion: "Sollevamenti sulle punte senza dolore." },
    { phase: "rinforzo", goal: "Rinforzo lento e carico crescente.", exercises: ["achille-calf-raise-carico-lento", "combattimento-rinforzo-eccentrico-achille-calci", "core-bridge", "caviglia-calf-raise-monopodalico-lento", "caviglia-tibiale-anteriore-elastico"], criterion: "Carichi elevati tollerati." },
    { phase: "ritorno", goal: "Salti, calci e ritorno agli allenamenti.", exercises: ["achille-rimbalzi-ritmici", "caviglia-salti-controllati", "sport-pliometria-base", "combattimento-propriocezione-caviglia-dinamica", "caviglia-salto-corda"], criterion: "Salti e calci senza dolore il giorno dopo." }
  ],
  "lombalgia-sovraccarico-lotta": [
    { phase: "acuta", goal: "Calmare il dolore e restare attivi.", exercises: ["core-cat-camel", "bacino-basculamento", "bacino-respirazione-core", "generale-cammino", "lombare-ginocchia-al-petto", "lombare-cammino-intervallato-lombare"], criterion: "Cammino tollerato." },
    { phase: "subacuta", goal: "Attivazione del core e mobilità.", exercises: ["bacino-transverso-attivazione", "core-bird-dog", "core-dead-bug", "combattimento-mobilita-toracica-rotazione", "combattimento-mobilita-anca-guardia", "lombare-abdominal-bracing", "lombare-multifido-quadrupedia", "lombare-cyclette-lombare"], criterion: "Core stability senza dolore." },
    { phase: "rinforzo", goal: "Rinforzo di core e catena posteriore.", exercises: ["core-side-plank", "combattimento-core-antirotazione", "funzionale-deadlift-kettlebell", "anca-hip-thrust", "lombare-hip-hinge-bastone", "lombare-carico-asimmetrico", "lombare-sorensen-isometrico"], criterion: "Carichi sollevati senza dolore." },
    { phase: "ritorno", goal: "Ritorno agli allenamenti di lotta.", exercises: ["funzionale-circuito-misto", "sport-core-stability-avanzato", "combattimento-riscaldamento-neuromuscolare", "lombare-stacco-progressivo", "lombare-kettlebell-swing", "lombare-landmine-rotazione", "lombare-pallof-press-a-passo"], criterion: "Gesti specifici senza dolore." }
  ],
  "insufficienza-venosa-cronica": [
    { phase: "acuta", goal: "Pompe di caviglia e riposo con gambe elevate.", exercises: ["vasc-pompa-caviglia", "linfa-pompa-muscolare-arto-inferiore", "linfa-respirazione-drenante"], criterion: "Gonfiore ridotto a fine giornata." },
    { phase: "subacuta", goal: "Cammino con calze elastiche.", exercises: ["linfa-esercizio-con-compressione", "generale-cammino", "caviglia-alfabeto"], criterion: "Cammino di 20 minuti con gonfiore stabile." },
    { phase: "rinforzo", goal: "Rinforzo della pompa del polpaccio.", exercises: ["caviglia-calf-raise", "vasc-sollevamenti-polpacci-claudicatio", "anziani-rinforzo-polpacci-seduti"], criterion: "Sollevamenti senza dolore." },
    { phase: "ritorno", goal: "Mantenimento attivo.", exercises: ["acqua-aquajogging", "acqua-cammino-vasca", "generale-cammino"], criterion: "Programma 3-4 volte a settimana." }
  ],
  "ulcere-vascolari-arti-inferiori": [
    { phase: "acuta", goal: "Movimento della caviglia senza carico sulla lesione.", exercises: ["vasc-pompa-caviglia", "caviglia-alfabeto", "respirazione-diaframmatica"], criterion: "Lesione protetta e medicazione secondo il medico." },
    { phase: "subacuta", goal: "Pompe muscolari e mobilità.", exercises: ["linfa-pompa-muscolare-arto-inferiore", "caviglia-theraband-flex", "generale-cammino"], criterion: "Nessun peggioramento della lesione." },
    { phase: "rinforzo", goal: "Rinforzo con compressione.", exercises: ["caviglia-calf-raise", "linfa-esercizio-con-compressione", "anziani-rinforzo-polpacci-seduti"], criterion: "Lesione in guarigione." },
    { phase: "ritorno", goal: "Mantenimento.", exercises: ["generale-cammino", "acqua-cammino-vasca"], criterion: "Esercizi solo con autorizzazione del medico o dell'infermiere." }
  ],
  "post-chirurgia-vascolare-bypass": [
    { phase: "acuta", goal: "Pompe di caviglia e respirazione.", exercises: ["vasc-pompa-caviglia", "respirazione-diaframmatica", "resp-spirometria-incentivante"], criterion: "Ferita e arto controllati dal chirurgo." },
    { phase: "subacuta", goal: "Cammino progressivo.", exercises: ["vasc-cammino-dopo-bypass", "generale-cammino", "caviglia-alfabeto"], criterion: "Cammino in aumento senza gonfiore o dolore." },
    { phase: "rinforzo", goal: "Rinforzo e cammino fino al dolore moderato.", exercises: ["vasc-sollevamenti-polpacci-claudicatio", "vasc-camminata-fino-al-dolore", "anziani-alzata-sedia"], criterion: "Distanza in aumento." },
    { phase: "ritorno", goal: "Mantenimento attivo.", exercises: ["vasc-intervalli-cammino", "acqua-aquajogging"], criterion: "Controlli vascolari periodici." }
  ],
  "lipedema": [
    { phase: "acuta", goal: "Respirazione e movimento dolce.", exercises: ["linfa-respirazione-drenante", "linfa-pompa-muscolare-arto-inferiore", "acqua-cammino-vasca"], criterion: "Dolore e pesantezza gestiti." },
    { phase: "subacuta", goal: "Movimento con compressione.", exercises: ["linfa-esercizio-con-compressione", "generale-cammino", "acqua-mobilita-articolare"], criterion: "Cammino di 20-30 minuti tollerato." },
    { phase: "rinforzo", goal: "Rinforzo a basso impatto.", exercises: ["acqua-rinforzo-arti-inferiori", "anziani-alzata-sedia", "core-bridge"], criterion: "Aumento graduale del carico senza dolore." },
    { phase: "ritorno", goal: "Mantenimento attivo.", exercises: ["acqua-aquajogging", "generale-cammino"], criterion: "Programma regolare 3-4 volte a settimana." }
  ],
  "drenaggio-linfatico-preventivo-oncologico": [
    { phase: "acuta", goal: "Respirazione e mobilità precoce dopo l'intervento.", exercises: ["linfa-respirazione-drenante", "spalla-flessione-assistita", "linfa-pompa-muscolare-arto-superiore"], criterion: "Rispetto delle indicazioni del chirurgo." },
    { phase: "subacuta", goal: "Recupero del range della spalla.", exercises: ["postchir-spalla-carrucola", "spalla-wall-slide", "spalla-pendolo", "linfa-autodrenaggio"], criterion: "Range completo senza dolore." },
    { phase: "rinforzo", goal: "Rinforzo progressivo a basso carico.", exercises: ["linfa-rinforzo-progressivo-linfedema", "spalla-scapular-retraction", "funzionale-trazione-elastico"], criterion: "Nessun gonfiore dopo gli esercizi." },
    { phase: "ritorno", goal: "Mantenimento e attenzione ai segnali.", exercises: ["linfa-mantenimento-attivo", "acqua-aquajogging"], criterion: "Gonfiore, pesantezza o arrossamento: contattare il medico." }
  ],
  "asma-bronchiale-adulto": [
    { phase: "acuta", goal: "Respirazione controllata e nasale.", exercises: ["resp-respiro-controllato-asma", "respirazione-diaframmatica", "respirazione-rilassamento"], criterion: "Respiro regolare a riposo." },
    { phase: "subacuta", goal: "Mobilità toracica e cammino leggero.", exercises: ["generale-mobilita-toracica", "respirazione-toracica-mobilita", "generale-cammino", "riscaldamento-cammino-veloce"], criterion: "Cammino tollerato senza sintomi." },
    { phase: "rinforzo", goal: "Ricondizionamento e riscaldamento prolungato.", exercises: ["riscaldamento-mobilita-articolare-generale", "acqua-aquajogging", "funzionale-circuito-misto"], criterion: "Sforzo moderato senza broncospasmo." },
    { phase: "ritorno", goal: "Attività fisica regolare e prevenzione.", exercises: ["neuro-cammino-aerobico-supervisionato", "funzionale-squat-completo"], criterion: "Terapia di base e farmaco al bisogno seguiti come da medico." }
  ],
  "bronchiectasie-clearance": [
    { phase: "acuta", goal: "Tecniche di clearance delle vie aeree.", exercises: ["resp-ciclo-attivo-respiro", "resp-tecniche-espettorazione", "respirazione-diaframmatica", "respirazione-costale"], criterion: "Secrezioni gestite senza fatica eccessiva." },
    { phase: "subacuta", goal: "Mobilità toracica e cammino.", exercises: ["generale-mobilita-toracica", "respirazione-toracica-mobilita", "generale-cammino"], criterion: "Cammino di 15-20 minuti tollerato." },
    { phase: "rinforzo", goal: "Ricondizionamento.", exercises: ["resp-cammino-intervallato", "resp-rinforzo-arti-sup-respiro", "resp-sit-to-stand-fatica"], criterion: "Sforzo tollerato senza peggioramento dell'espettorato." },
    { phase: "ritorno", goal: "Mantenimento.", exercises: ["neuro-cammino-aerobico-supervisionato", "resp-ciclo-attivo-respiro"], criterion: "Clearance quotidiana. Febbre o espettorato scuro: contattare il medico." }
  ],
  "algodistrofia-crps": [
    { phase: "acuta", goal: "Controllo del dolore con immagini motorie e specchio.", exercises: ["crps-terapia-specchio", "respirazione-rilassamento", "polso-mobilita-flesso-estensione"], criterion: "Dolore e gonfiore stabili o in calo." },
    { phase: "subacuta", goal: "Desensibilizzazione e movimento graduale.", exercises: ["crps-desensibilizzazione", "mano-tendon-glide", "gomito-mobilita-attiva", "caviglia-alfabeto"], criterion: "Tolleranza al tatto e al movimento in aumento." },
    { phase: "rinforzo", goal: "Uso funzionale e carico graduale.", exercises: ["mano-plastilina", "polso-rinforzo-presa", "piede-cammino-terreni-vari", "spalla-flessione-assistita"], criterion: "Funzione del segmento in aumento." },
    { phase: "ritorno", goal: "Ritorno alle attività e autonomia.", exercises: ["anziani-esercizi-mano-funzionali", "funzionale-carry", "generale-cammino"], criterion: "Attività quotidiane riprese. Seguire sempre il medico per la terapia." }
  ],
  "sarcopenia-anziano": [
    { phase: "acuta", goal: "Sicurezza e attivazione muscolare di base.", exercises: ["anziani-rinforzo-quadricipite-seduti", "anziani-rinforzo-polpacci-seduti", "anziani-mobilita-anca-seduti", "anziani-cammino-assistito"], criterion: "Esercizi seduti tollerati." },
    { phase: "subacuta", goal: "Alzata dalla sedia e cammino.", exercises: ["anziani-alzata-sedia", "anziani-equilibrio-appoggio", "anziani-cammino-ostacoli-bassi", "generale-cammino"], criterion: "Alzata dalla sedia 5 volte in meno di 15 secondi." },
    { phase: "rinforzo", goal: "Rinforzo progressivo con resistenze.", exercises: ["sarcopenia-resistenza-elastico", "funzionale-step-up-carico", "core-bridge", "funzionale-trazione-elastico"], criterion: "Resistenza aumentata ogni 2 settimane senza dolore." },
    { phase: "ritorno", goal: "Mantenimento e stile di vita attivo.", exercises: ["funzionale-carry", "anziani-doppio-compito-cammino", "equilibrio-tandem"], criterion: "Allenamento della forza 2-3 volte a settimana, proteine adeguate." }
  ],
  "displasia-anca-neonatale": [
    { phase: "acuta", goal: "Posizione di trasporto con anche flesse e abdotte.", exercises: ["pedia-posizione-trasporto-anca", "pedia-tummy-time"], criterion: "Segue le indicazioni dell'ortopedico." },
    { phase: "subacuta", goal: "Movimenti liberi dopo il tutore.", exercises: ["pedia-posizione-trasporto-anca", "pedia-rotolamento-gioco"], criterion: "Movimento libero delle anche." },
    { phase: "rinforzo", goal: "Stimolo motorio.", exercises: ["pedia-gattonamento", "pedia-piedi-nudi-giochi"], criterion: "Sviluppo motorio regolare." },
    { phase: "ritorno", goal: "Gioco attivo e controllo.", exercises: ["pedia-gioco-attivo-guidato"], criterion: "Controlli ortopedici periodici." }
  ],
  "piede-piatto-pediatrico": [
    { phase: "acuta", goal: "Osservazione e giochi a piedi nudi.", exercises: ["pedia-piedi-nudi-giochi", "piede-asciugamano-dita"], criterion: "Piede flessibile e senza dolore." },
    { phase: "subacuta", goal: "Attivazione dell'arco.", exercises: ["piede-arco-plantare", "piede-biglie-dita", "pedia-piedi-nudi-giochi"], criterion: "Il bambino attiva l'arco in gioco." },
    { phase: "rinforzo", goal: "Rinforzo in gioco.", exercises: ["piede-cammino-terreni-vari", "caviglia-cammino-tacchi-punte", "pedia-gioco-attivo-guidato"], criterion: "Cammino regolare e senza dolore." },
    { phase: "ritorno", goal: "Attività sportiva.", exercises: ["pedia-gioco-attivo-guidato"], criterion: "Controllo periodico dal pediatra o dall'ortopedico." }
  ],
  "paralisi-cerebrale-infantile-generale": [
    { phase: "acuta", goal: "Posizionamento e stretching dolce con i genitori.", exercises: ["neuro-posizionamento-letto", "neuro-stretching-spasticita", "pedia-tummy-time"], criterion: "Posture e posizioni confortevoli." },
    { phase: "subacuta", goal: "Stimolazione motoria nel gioco.", exercises: ["pedia-rotolamento-gioco", "pedia-gattonamento", "neuro-controllo-tronco-seduto"], criterion: "Partecipazione al gioco motorio." },
    { phase: "rinforzo", goal: "Rinforzo funzionale e cammino.", exercises: ["neuro-carico-arto-plegico", "neuro-cammino-parallele", "anziani-alzata-sedia"], criterion: "Alzata e cammino assistiti in sicurezza." },
    { phase: "ritorno", goal: "Autonomia e partecipazione.", exercises: ["neuro-equilibrio-dinamico-neuro", "pedia-gioco-attivo-guidato"], criterion: "Programma individualizzato condiviso con il team." }
  ],
  "dolore-pelvico-cronico": [
    { phase: "acuta", goal: "Rilassamento e respirazione.", exercises: ["pelvi-respiro-rilassamento", "pelvi-ginocchia-al-petto-rilassamento", "respirazione-rilassamento"], criterion: "Tensione e dolore in calo." },
    { phase: "subacuta", goal: "Mobilità e consapevolezza corporea.", exercises: ["bacino-mobilita-lombo-pelvica", "bacino-basculamento", "postura-mobilita-bacino", "generale-stretching-adduttori"], criterion: "Dolore gestibile." },
    { phase: "rinforzo", goal: "Rinforzo del core e dell'anca.", exercises: ["core-bridge", "anca-clamshell", "bacino-stabilita-quadrupedia", "anca-abduzione"], criterion: "Esercizi senza peggioramento del dolore." },
    { phase: "ritorno", goal: "Attività fisica e stile di vita.", exercises: ["generale-cammino", "acqua-cammino-vasca", "funzionale-circuito-misto"], criterion: "Programma costante. Dolore intenso o sanguinamento: valutazione medica." }
  ],
  "riabilitazione-post-parto-perineale": [
    { phase: "acuta", goal: "Rilassamento e consapevolezza.", exercises: ["pelvi-respiro-rilassamento", "pelvi-ginocchia-al-petto-rilassamento", "pelvi-diastasi-attivazione-trasverso"], criterion: "Sa individuare i muscoli." },
    { phase: "subacuta", goal: "Contrazioni di base e trasverso.", exercises: ["pelvi-contrazione-base", "pelvi-contrazioni-resistenti", "bacino-transverso-attivazione"], criterion: "10 contrazioni da 8 secondi." },
    { phase: "rinforzo", goal: "Rinforzo e integrazione.", exercises: ["pelvi-knack", "pelvi-ponte-con-contrazione", "core-bridge", "pelvi-plank-progressivo-postparto"], criterion: "Nessuna perdita durante gli sforzi." },
    { phase: "ritorno", goal: "Ritorno allo sport.", exercises: ["pelvi-squat-con-contrazione", "funzionale-squat-completo", "sport-core-stability-avanzato"], criterion: "Nessun peso o dolore pelvico durante l'attività." }
  ],
};
