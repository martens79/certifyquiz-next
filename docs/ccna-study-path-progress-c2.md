# Study Path CCNA — Fase C2 (frontend)

Nel risultato del test, il componente chiede `GET /study-path/ccna/progress?lang=` (sola lettura, backend PR #187) all'apertura, al ritorno sulla scheda (`focus`/`visibilitychange`) e al cambio lingua/utente.

- Con dati: per topic mostra **test iniziale**, **allenamento recente** («Non ancora disponibile» sotto 3 risposte, mai una percentuale inventata), **domande affrontate/disponibili** e stato (da migliorare / da consolidare / evidenza insufficiente / punto forte). Il pulsante principale diventa «Continua dal prossimo argomento consigliato» (`next`).
- Il punteggio del test da 30 domande resta quello salvato (storico, mai sovrascritto); «Rifai il test» resta con conferma.
- Se l'endpoint risponde errore/404 o senza dati (`next: null`), si mostra la vista C1 invariata: il frontend può quindi essere rilasciato anche prima del backend.
- Limiti dei dati: vedi `docs/ccna-study-path-progress-c2.md` nel backend (solo prima risposta; nessuna sessione di allenamento salvata).
