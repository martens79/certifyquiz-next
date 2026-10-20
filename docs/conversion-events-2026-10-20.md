# Eventi di conversione: proposta frontend

Baseline `b6cfb35`. Questa branch non autorizza merge o deploy di produzione.
Il contratto completo e il piano di rilascio sono in
`certifyquiz-backend/docs/conversion-events-2026-10-20.md`.

- Un solo assessment_started; diagnostic_quiz_started resta solo nello storico.
- quiz_loaded è il caricamento; study_started conserva la semantica storica.
- study_engaged è la prima risposta al quiz o il primo check di un lab con risposta.
  È deduplicato per scope/modalità/sessione browser: non è un conteggio di tentativi.
- registration_completed resta dopo risposta positiva; l'evento funnel è inviato
  dopo salvataggio del token quando presente, senza email nel payload aggiunto.
- checkout_attempted precede l'API; begin_checkout richiede il sessionId restituito.
- Una richiesta checkout riusa una chiave per 30 minuti nel tab: Premium/guide la
  passano a Stripe lato server; i pacchetti conservano anche il lock ordini esistente.
  I metadati opzionali sono congelati per richiesta, per evitare errori Stripe se
  Google/Meta diventano disponibili durante un retry. Un cambio consenso crea una nuova chiave.
  Un errore del tag non deve impedire studio o navigazione al checkout.
- Le conferme Premium non emettono Purchase e non stimano un importo da sessionStorage.
  Il helper Meta blocca Purchase client: gli incassi sono di competenza del backend.
- Le view certificazione sono collegate anche al funnel applicativo; le view prezzi
  vengono ritentate quando il consenso diventa noto, senza modificare l'offerta.
- Consenso unknown/denied: nessun identificativo prodotto o evento custom al funnel.
  I consensi legacy sono letti dalla stessa funzione del banner. Non cambia la
  raccolta page_view automatica del Google tag in Consent Mode.
- Gli eventi funnel one-shot ricevono event_id persistente prima della consegna,
  ma la conferma “done” viene salvata soltanto dopo risposta HTTP positiva. Una
  chiamata successiva può ritentare con lo stesso ID se la prima fallisce.
- Il riepilogo admin non somma tentativo checkout e sessione creata; i vecchi
  alias Premium non sono trattati come acquisti. Lo storico purchase_completed
  resta esplicitamente non riconciliato: usare le receipt per i ricavi.

Prerequisiti: backend compatibile, migration approvata e provata in MySQL sandbox,
build Preview completa, configurazione reale dei webhook verificata, validazione
GA4/Meta in test. Nessun segreto o parametro Sanity fittizio introdotto.
ads_conversion_PURCHASE_1 non è stato trovato nel repository e non è stato modificato.
