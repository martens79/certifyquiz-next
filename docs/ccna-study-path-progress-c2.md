# Study Path CCNA — Fase C2 (frontend)

Nel risultato del test, il componente chiede `GET /study-path/ccna/progress?lang=` (sola lettura, backend PR #187) all'apertura, al ritorno sulla scheda (`focus`/`visibilitychange`) e al cambio lingua/utente.

- Con dati, per topic tre misure distinte: **test iniziale da 30 domande** (riferimento storico), **ultime prime risposte registrate** («Non ancora disponibile» sotto 3 risposte) e **copertura** (domande affrontate / disponibili; barra grigia etichettata, mai confondibile con l'accuratezza). Diagnostico e allenamento non sono separabili nei dati: nulla è chiamato «allenamento recente».
- Nessuna promessa di miglioramento dopo ogni allenamento: rispondere di nuovo a una domanda già vista non cambia i dati; cambiano rispondendo a domande nuove. Dopo «Rifai il test» le risposte dei diagnostici precedenti non sono attribuite agli allenamenti.
- Il pulsante principale diventa «Continua dal prossimo argomento consigliato» (`next`, coerente con le misure sopra).
- Il punteggio del test da 30 domande resta quello salvato (storico, mai sovrascritto); «Rifai il test» resta con conferma.
- Se l'endpoint risponde errore/404 o senza dati (`next: null`), si mostra la vista C1 invariata: il frontend può quindi essere rilasciato anche prima del backend.
- Limiti dei dati: vedi `docs/ccna-study-path-progress-c2.md` nel backend (solo prima risposta; nessuna sessione di allenamento salvata).
