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
- Il completamento di un training invia `POST /save-exam` con `topicId` e `attempts[]`: scrive `quiz_results` (con `topic_id`) e aggiorna `user_question_stats` e le prime risposte, cioè le stesse tabelle che il diagnostico legge per scegliere le domande.
- `user_question_stats.wrong_count` è un contatore degli errori consecutivi (torna a 0 alla prima risposta corretta): **non è un totale di errori** e non va usato come accuratezza del topic. Per l'accuratezza storica per topic servono `quiz_results` (per sessione) o le risposte delle sessioni.
- `GET /me/weak-areas` esiste ma non è limitato a una certificazione e restituisce al massimo 10 topic su tutte le certificazioni: non è affidabile per aggiornare i consigli CCNA.

## Aggiornamento dei consigli oggi
Dopo l'allenamento l'utente può usare «Rifai il test»: il nuovo diagnostico preferisce domande mai viste e produce un'analisi aggiornata (invariato). Il testo sotto il pulsante lo dice in modo esplicito.

## Proposta per la fase successiva (richiede autorizzazione, NON implementata)
1. Endpoint backend di sola lettura `GET /api/study-path/ccna/progress?lang=` che, per i topic CCNA, restituisce: domande distinte affrontate / domande disponibili, domande attualmente da ripassare (`wrong_count > 0`) e accuratezza recente da `quiz_results` dei training, con le stesse soglie di evidenza del diagnostico (almeno 3 risposte, almeno 2 errori, sotto il 70%).
2. Nel frontend, un blocco «Dopo l'allenamento» che aggiorna lo stato dei topic senza rifare le 30 domande.
3. Preferenza per le domande non ancora svolte nel training: richiede una modifica al motore/alla route di training; da valutare a parte, con test, perché tocca il percorso di tutte le certificazioni.
4. Nessun livello di difficoltà finché non esiste una classificazione affidabile delle domande.
