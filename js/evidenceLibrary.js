// Evidenze da PubMed usate per costruire fasi, dosi e criteri dei percorsi guidati
// nei distretti principali. Ricerca effettuata il 3 novembre 2026 su revisioni
// sistematiche, meta-analisi, linee guida e trial randomizzati; per ogni voce si
// riporta una sintesi in parole nostre (non il testo dell'abstract).
// Le fasi e le dosi sono una sintesi di queste fonti e della pratica clinica:
// vanno sempre adattate al singolo paziente.

export const regionLabels = {
  spalla: 'Spalla',
  ginocchio: 'Ginocchio',
  anca: 'Anca',
  caviglia: 'Caviglia',
  gomito: 'Gomito',
  lombare: 'Colonna lombare',
  toracica: 'Colonna toracica',
  cervicale: 'Colonna cervicale',
};

// Quali patologie del database appartengono a ciascun distretto.
export const regionByProtocol = {
  'spalla-conflitto': 'spalla', 'capsulite-adesiva': 'spalla', 'cuffia-rotatori': 'spalla', 'instabilita-spalla': 'spalla',
  'lussazione-spalla': 'spalla', 'instabilita-spalla-proiezioni': 'spalla',
  'tendinopatia-rotulea': 'ginocchio', 'ginocchio-lca': 'ginocchio', 'gonartrosi': 'ginocchio', 'condropatia-femoro-rotulea': 'ginocchio',
  'protesi-ginocchio': 'ginocchio', 'lussazione-rotula': 'ginocchio', 'contusione-ginocchio': 'ginocchio', 'sublussazione-rotula': 'ginocchio',
  'instabilita-funzionale-ginocchio-lca': 'ginocchio', 'infortunio-ginocchio-placcaggio': 'ginocchio',
  'coxartrosi': 'anca', 'conflitto-femoro-acetabolare': 'anca', 'borsite-trocanterica': 'anca', 'protesi-anca': 'anca', 'contusione-anca-coscia': 'anca',
  'caviglia-distorsione': 'caviglia', 'lussazione-caviglia': 'caviglia', 'tendinopatia-achillea': 'caviglia', 'instabilita-cronica-caviglia': 'caviglia',
  'tendinopatia-achillea-karate': 'caviglia', 'contusione-piede': 'caviglia',
  'epicondilite': 'gomito', 'epitrocleite': 'gomito', 'iperestensione-gomito-leva': 'gomito',
  'lombalgia-aspecifica': 'lombare', 'lombosciatalgia': 'lombare', 'stenosi-lombare': 'lombare', 'lombalgia-sovraccarico-lotta': 'lombare',
  'dorsalgia': 'toracica',
  'cervicalgia': 'cervicale', 'colpo-frusta': 'cervicale', 'trauma-cervicale-ponte-lotta': 'cervicale',
};

// Principi di prescrizione ricavati dalle fonti, mostrati sopra l'elenco.
export const regionPrinciples = {
  spalla: 'Educazione e riabilitazione attiva sono la base. Per le tendinopatie: carico esterno progressivo (elastici, manubri), 2-3 sedute a settimana, dolore come guida (accettabile fino a 3-4/10 senza peggioramento nelle 24 ore). Nella spalla rigida: stretching e mobilità tutti i giorni, con ampiezza che cresce di pochi gradi per volta.',
  ginocchio: 'Dolore femoro-rotuleo: rinforzo di anca e ginocchio insieme. Tendinopatia rotulea: carico lento e pesante (HSR) o strategie di carico progressivo equivalenti. Dopo il legamento crociato: progressione per criteri (forza e salti ≥90% rispetto all\'altro lato, assenza di gonfiore, prontezza psicologica), non solo per tempi.',
  anca: 'Esercizio ed educazione sono la base. Nel conflitto femoro-acetabolare rinforzo mirato e stretching migliorano entrambi la qualità di vita; il rinforzo dà più forza e meno dolore percepito. Nella tendinopatia glutea: carico progressivo senza compressione (evitare adduzione prolungata).',
  caviglia: 'Dopo la distorsione: movimento precoce, poi forza e allenamento dell\'equilibrio, che migliora il controllo dinamico. Il ritorno allo sport è un percorso continuo con criteri personalizzati. Nelle tendinopatie: carico progressivo con aggiunta di peso.',
  gomito: 'Esercizio progressivo con componente eccentrica e carico esterno crescente; il dolore guida la progressione. Frequenza non quotidiana (2-3 sedute a settimana) per la fase di rinforzo.',
  lombare: 'Le cure non farmacologiche (educazione, esercizio, approccio che riduce la paura del movimento) sono di prima scelta. Stabilizzazione del core efficace nella fase subacuta; restare attivi anche in fase acuta; aumento graduale dei carichi nel ritorno a lavoro e sport.',
  toracica: 'Mobilità toracica attiva come complemento di collo e spalla. Le manipolazioni hanno evidenza di bassa qualità: l\'esercizio di mobilità e rinforzo posturale è la base.',
  cervicale: 'Esercizio dolce e progressivo (mobilità, flessori profondi, scapolari). L\'ergonomia da sola non basta: associare pause attive e rinforzo.',
};

export const evidenceByRegion = {
  spalla: [
    { pmid: '35964498', doi: '10.1016/j.msksp.2022.102645', year: 2022, journal: 'Musculoskelet Sci Pract', title: 'Progressive therapeutic exercise in upper limb tendinopathies: systematic review and meta-analysis',
      note: 'Nelle tendinopatie della spalla e del gomito l\'esercizio progressivo è efficace (evidenza di qualità bassa); il dolore è il criterio più usato per avanzare, con componente eccentrica.' },
    { pmid: '37169370', doi: '10.1136/bjsports-2022-105754', year: 2023, journal: 'Br J Sports Med', title: 'Effect of resistance exercise dose components for tendinopathy management',
      note: 'Su 110 studi (cuffia, Achille, gomito, rotuleo, gluteo): effetti maggiori con carichi esterni aggiuntivi e con frequenza meno che quotidiana.' },
    { pmid: '35179326', doi: '10.23736/S0022-4707.22.13054-9', year: 2022, journal: 'J Sports Med Phys Fitness', title: 'Rehabilitative treatments in adhesive capsulitis: a systematic review',
      note: 'Capsulite adesiva: lo stretching non può mancare; utili le mobilizzazioni con approccio posteriore; ultrasuoni poco efficaci; esercizi orientati alle attività quotidiane.' },
    { pmid: '33326025', doi: '10.1001/jamanetworkopen.2020.29581', year: 2020, journal: 'JAMA Netw Open', title: 'Comparison of treatments for frozen shoulder: systematic review and meta-analysis',
      note: 'Nei primi mesi di spalla congelata, l\'iniezione di cortisone dà più sollievo a breve termine (decisione del medico); un programma di esercizi semplici a casa dà vantaggi a medio termine.' },
    { pmid: '42529008', doi: '10.1177/17585732261473885', year: 2026, journal: 'Shoulder Elbow', title: 'Kinesiotaping in rotator cuff-related shoulder pain: systematic review and meta-analysis',
      note: 'Nel dolore di spalla legato alla cuffia le linee guida privilegiano educazione e riabilitazione attiva; il kinesiotape ha solo benefici piccoli e non sostituisce l\'esercizio.' },
  ],
  ginocchio: [
    { pmid: '39934098', doi: '10.1002/msc.70059', year: 2025, journal: 'Musculoskeletal Care', title: 'Hip and knee strengthening versus knee strengthening alone in patellofemoral pain syndrome',
      note: 'Dolore femoro-rotuleo: rinforzare anca e ginocchio insieme riduce di più il dolore e migliora più la funzione rispetto al solo ginocchio.' },
    { pmid: '39923086', doi: '10.1186/s40001-025-02347-3', year: 2025, journal: 'Eur J Med Res', title: 'Lower limb strengthening, biomechanics and knee pain in patellofemoral pain',
      note: 'Il rinforzo dell\'anca ha dato riduzioni di dolore e miglioramenti di funzione maggiori del solo ginocchio.' },
    { pmid: '42192475', doi: '10.1186/s13102-026-01743-4', year: 2026, journal: 'BMC Sports Sci Med Rehabil', title: 'Comparative effectiveness of exercise for patellar tendinopathy: network meta-analysis',
      note: 'Tendinopatia rotulea: nessun esercizio supera con chiarezza il carico lento e pesante (HSR), che resta un buon riferimento; le strategie di carico progressivo sono simili.' },
    { pmid: '40421598', doi: '10.1002/14651858.CD013078.pub2', year: 2025, journal: 'Cochrane Database Syst Rev', title: 'Exercise for patellar tendinopathy',
      note: 'Sette studi su atleti: certezza bassa o molto bassa; l\'esercizio ha risultati simili a infiltrazione o chirurgia per dolore e funzione a fine trattamento.' },
    { pmid: '42713242', doi: '10.52082/jssm.2026.772', year: 2026, journal: 'J Sports Sci Med', title: 'Hop test performance, return to sport and reinjury after ACL reconstruction',
      note: 'Dopo la ricostruzione del crociato, un salto monopodalico ≥90% rispetto all\'altro lato si associa a più probabilità di tornare allo sport, ma da solo non basta per prevedere una nuova lesione.' },
    { pmid: '42312325', doi: '10.1080/15438627.2026.2690515', year: 2026, journal: 'Res Sports Med', title: 'Massage-based rehabilitation after ACL reconstruction for return to sport',
      note: 'Il ritorno allo sport avviene in genere in 6-12 mesi con progressione per fasi, test funzionali e valutazione della prontezza psicologica; il massaggio è solo un supporto.' },
    { pmid: '42676087', doi: '10.2519/jospt.2026.13477', year: 2026, journal: 'J Orthop Sports Phys Ther', title: 'Resistance exercise for knee osteoarthritis: dose-response meta-analysis',
      note: 'Gonartrosi: il rinforzo migliora dolore, funzione e forza (certezza bassa); intensità da molto leggera a moderata riducono il dolore, moderata migliora la funzione.' },
  ],
  anca: [
    { pmid: '42082318', doi: '10.1136/bjsports-2025-110986', year: 2026, journal: 'Br J Sports Med', title: 'Physiotherapist-led treatment for femoroacetabular impingement syndrome (PhysioFIRST)',
      note: 'Conflitto femoro-acetabolare (154 persone): rinforzo mirato e stretching migliorano entrambi la qualità di vita a 6 mesi; il rinforzo dà più forza e più miglioramento del dolore percepito.' },
    { pmid: '40223303', doi: '10.1177/02692155251327298', year: 2025, journal: 'Clin Rehabil', title: 'The efficacy of gluteal tendinopathy treatments: a systematic review',
      note: 'Tendinopatia glutea: esercizio ed educazione sono l\'approccio di base (evidenza moderata, effetto medio su dolore e funzione a breve termine).' },
    { pmid: '42381614', doi: '10.2519/jospt.2026.13775', year: 2026, journal: 'J Orthop Sports Phys Ther', title: '3-month rehabilitation program after hip arthroscopy for FAI syndrome',
      note: 'Dopo l\'artroscopia d\'anca: programma di 3 mesi con almeno 2 sedute a settimana; estensione, abduzione ed esercizi funzionali i più usati.' },
    { pmid: '37169370', doi: '10.1136/bjsports-2022-105754', year: 2023, journal: 'Br J Sports Med', title: 'Effect of resistance exercise dose components for tendinopathy management',
      note: 'Carico esterno crescente e frequenza non quotidiana valgono anche per le tendinopatie dei glutei.' },
  ],
  caviglia: [
    { pmid: '41678396', doi: '10.1177/10538127261419234', year: 2026, journal: 'J Back Musculoskelet Rehabil', title: 'Balance training in chronic ankle instability: umbrella review',
      note: 'Instabilità cronica: l\'allenamento dell\'equilibrio migliora il controllo posturale dinamico (certezza moderata); su dolore e forza i dati sono scarsi.' },
    { pmid: '41385332', doi: '10.1080/07853890.2025.2586334', year: 2025, journal: 'Ann Med', title: 'Return to sport after lateral ankle sprain: systematic review',
      note: 'Il ritorno allo sport dopo la distorsione è un percorso continuo; non esiste un criterio unico, quindi tempi e test vanno personalizzati.' },
    { pmid: '37169370', doi: '10.1136/bjsports-2022-105754', year: 2023, journal: 'Br J Sports Med', title: 'Effect of resistance exercise dose components for tendinopathy management',
      note: 'Per la tendinopatia achillea: carichi esterni aggiuntivi e frequenza non quotidiana.' },
  ],
  gomito: [
    { pmid: '35964498', doi: '10.1016/j.msksp.2022.102645', year: 2022, journal: 'Musculoskelet Sci Pract', title: 'Progressive therapeutic exercise in upper limb tendinopathies: systematic review and meta-analysis',
      note: 'Epicondilite laterale: l\'esercizio progressivo, anche eccentrico, migliora dolore e funzione (evidenza di qualità bassa); il dolore guida l\'avanzamento.' },
    { pmid: '37169370', doi: '10.1136/bjsports-2022-105754', year: 2023, journal: 'Br J Sports Med', title: 'Effect of resistance exercise dose components for tendinopathy management',
      note: 'Nel gomito laterale effetti migliori con carico esterno crescente e sedute non quotidiane.' },
  ],
  lombare: [
    { pmid: '42900415', doi: '10.1186/s10195-026-00972-0', year: 2026, journal: 'J Orthop Traumatol', title: 'Advances in physiotherapy for chronic low-back pain: level I systematic review',
      note: 'Su 150 studi: le cure non farmacologiche sono di prima scelta e gli approcci condividono elementi comuni; combinare gli elementi chiave (esercizio, educazione, approccio biopsicosociale).' },
    { pmid: '34847915', doi: '10.1186/s12891-021-04858-6', year: 2021, journal: 'BMC Musculoskelet Disord', title: 'Core stabilization versus strengthening exercise in subacute nonspecific low back pain',
      note: 'Lombalgia subacuta: entrambi riducono il dolore, ma la stabilizzazione del core migliora di più propriocezione, equilibrio, disabilità e paura del movimento (trial su 36 persone).' },
    { pmid: '42945153', doi: '10.1371/journal.pmed.1005273', year: 2026, journal: 'PLoS Med', title: 'Cost-effectiveness of recommended interventions for managing low back pain',
      note: 'Educazione, supporto psicologico ed esercizio risultano convenienti rispetto alle cure usuali.' },
    { pmid: '28436583', doi: '10.1002/14651858.CD011279.pub3', year: 2017, journal: 'Cochrane Database Syst Rev', title: 'Physical activity and exercise for chronic pain in adults: overview of Cochrane reviews',
      note: 'L\'esercizio ha pochi effetti avversi (di solito dolore muscolare transitorio) e migliora funzione e dolore con effetti piccoli o moderati; qualità delle prove bassa.' },
  ],
  toracica: [
    { pmid: '41196244', doi: '10.1016/j.jmpt.2025.10.040', year: 2025, journal: 'J Manipulative Physiol Ther', title: 'Thoracic spine manipulation for upper quadrant musculoskeletal disorders: systematic review',
      note: 'Evidenza di qualità da molto bassa a bassa a favore della manipolazione toracica rispetto a cure generali; per la spalla non meglio della manipolazione placebo. L\'esercizio di mobilità è il pilastro, la manipolazione una scelta clinica.' },
    { pmid: '28436583', doi: '10.1002/14651858.CD011279.pub3', year: 2017, journal: 'Cochrane Database Syst Rev', title: 'Physical activity and exercise for chronic pain in adults: overview of Cochrane reviews',
      note: 'Per il dolore cronico muscolo-scheletrico l\'attività fisica regolare è sicura e utile.' },
  ],
  cervicale: [
    { pmid: '33929540', doi: '10.1093/ptj/pzab120', year: 2021, journal: 'Phys Ther', title: 'Effects of sling exercise for neck pain: systematic review and meta-analysis',
      note: 'Esercizi sospesi (sling) nella cervicalgia: riducono il dolore a breve termine (evidenza da moderata a bassa); nessuna conclusione definitiva su disabilità.' },
    { pmid: '35698187', doi: '10.1186/s12891-022-05516-1', year: 2022, journal: 'BMC Musculoskelet Disord', title: 'Post-isometric relaxation versus myofascial release in non-specific neck pain',
      note: 'Nel dolore al collo aspecifico il rilassamento post-isometrico ha migliorato dolore, disabilità e movimento più del rilascio miofasciale in 2 settimane (60 persone).' },
    { pmid: '42946017', doi: '10.1002/14651858.CD014644.pub2', year: 2026, journal: 'Cochrane Database Syst Rev', title: 'Ergonomic interventions for work-related complaints of the arm, neck or shoulder',
      note: 'Interventi ergonomici da soli: poca o nessuna differenza su dolore e funzione. Meglio abbinare esercizio e pause attive.' },
  ],
};
