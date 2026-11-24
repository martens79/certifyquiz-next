# Study Path CCNA — Fase C1: dall'analisi all'allenamento

Solo frontend. Nessuna modifica a backend, diagnostico da 30 domande, Readiness, mock, FREE/Premium, Stripe, GA4 o consenso.

## Cosa fa
Nella schermata del risultato ogni argomento consigliato ha il pulsante «Allenati su questo argomento», un link alla route di training FREE già esistente:

`/{lang}/quiz/topic/{topicId}`  (l'inglese canonico è `/en/quiz/topic/{topicId}`)

`topicId` è l'ID reale (`questions.topic_id` / `topics.id`) già restituito dal risultato dello Study Path: nessuna mappatura nuova e nessun motore di quiz duplicato.

| Gruppo del risultato | Pulsante |
|---|---|
| Da migliorare (lacuna con almeno 3 risposte e 2 errori) | primario, e anche nella card «Da dove iniziare» se è il primo consigliato |
| Da approfondire (evidenza insufficiente) | secondario: resta un gruppo distinto con la sua nota |
| Da consolidare | secondario |
| Punti di forza | nessun pulsante |

L'ordine dei gruppi e dei topic è quello già calcolato dal server (lacune → evidenza insufficiente → da consolidare).

## Verifiche sui dati esistenti (nessuna ipotesi)
- Il training per topic carica il pool del topic tramite `GET /questions/:topicId` (backend: `ORDER BY q.id` con `shuffle=0`, o `RAND()` con `shuffle=1`) e il client costruisce la sessione. **Non esiste oggi una preferenza per le domande non ancora svolte** nel training. Il diagnostico invece la ha (prima mai viste, poi meno viste).
- **Correzione (Fase C2):** il training per topic **non salva sessioni**: non scrive `quiz_results` né aggiorna `user_question_stats`. Solo la modalità esame invia `POST /save-exam`. L'unica traccia per-risposta è `question_first_attempts` (prima risposta a ogni domanda, scritta da `POST /answers/check`), che il diagnostico legge per scegliere le domande.
- `user_question_stats.wrong_count` è un contatore degli errori consecutivi (torna a 0 alla prima risposta corretta): **non è un totale di errori** e non va usato come accuratezza del topic. L'accuratezza si calcola dalle prime risposte (vedi `docs/ccna-study-path-progress-c2.md` nel backend).
- `GET /me/weak-areas` esiste ma non è limitato a una certificazione e restituisce al massimo 10 topic su tutte le certificazioni: non è affidabile per aggiornare i consigli CCNA.

## Aggiornamento dei consigli oggi
Dopo l'allenamento l'utente può usare «Rifai il test»: il nuovo diagnostico preferisce domande mai viste e produce un'analisi aggiornata (invariato). Il testo sotto il pulsante lo dice in modo esplicito.

## Fase successiva
Implementata in Fase C2 (endpoint `GET /api/study-path/ccna/progress` + schede di progresso). Restano fuori: preferenza per le domande non ancora svolte nel training (tocca il motore comune a tutte le certificazioni, da valutare a parte con test) e livelli di difficoltà (nessuna classificazione affidabile).
