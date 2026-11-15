# Affidabilità del completamento quiz — 2026-11-02

Seguito dell'audit di sola lettura del motore `QuizEngine` (esclusa la CCST versionata della PR #180).
Questa PR corregge i 4 bug P1 confermati e i 2 P2 piccoli. Va rilasciata **dopo** la PR backend
`fix/quiz-finish-reliability-20261102` (vedi «Ordine di rilascio»).

## Cosa cambia

| # | Problema (riprodotto) | Correzione |
|---|---|---|
| P1-A | Training ripreso dopo un reload: le risposte date prima del reload e mai riviste contavano come errate (40/40 giuste → 37/40, salvato in `quiz_results`). | `doFinish` valuta in blocco (`/answers/evaluate`, max 200 per chiamata, senza spiegazioni né quota) le risposte senza verdetto. Non le fonde in `results`: la spiegazione resta richiesta dal re-check alla prima visita. |
| P1-B | `/mock-exam/evaluate` o `/answers/evaluate` in errore → 0% mostrato **e salvato**, progresso locale cancellato, nessun avviso. | Il quiz diventa `finished` solo a valutazione riuscita. In caso di errore: nessun `onFinish`, nessun `clearProgress`, attempt exam non chiuso, banner `role="alert"` con «Riprova». A tempo scaduto l'input resta bloccato e il timer non rilancia `doFinish` a ogni frame. |
| P1-C | La riga `quiz_progress` non veniva mai chiusa: un topic concluso «risorgeva» (Domanda 40/40, 40 risposte). | A fine quiz `POST /me/quiz-progress/:topicId/complete` (tombstone per seed, vedi sotto). Il load tratta `row.completed` come «nessuna sessione» e riparte da `rev + 1`. Se la chiusura fallisce resta un marker locale (`cq:quiz:closing:<scope>`) e la si ritenta al caricamento successivo. |
| P1-D | `QuizTopicClient` mandava `{question_id, selected_answer_id}` a `/save-exam`; il backend leggeva solo `{questionId, chosenAnswerId}` → 201 senza aggiornare `user_question_stats`. | Il client topic usa le chiavi del motore. Il backend accetta entrambe (PR backend). La correzione FE funziona anche col backend vecchio. |
| P2-1 | `revRef` veniva riallineato incondizionatamente al `rev` della risposta: una risposta lenta lo faceva scendere sotto il server e la PUT successiva veniva scartata. | `adoptServerRev` = `max(locale, server)`. |
| P2-2 | La PUT debounced (2,5 s) non partiva se il componente si smontava per navigazione client-side (nessun `pagehide`): 0 PUT al server. | Effect di smontaggio che invia la PUT armata (keepalive). |

## Chiusura del progresso: perché non un semplice `DELETE`

Sul client le PUT possono essere in volo (debounce, `pagehide`, `visibilitychange`, retry). Un `DELETE`
seguito da una PUT tardiva **ricrea la riga con lo stato del quiz concluso**, e il server non può
distinguerla da una PUT legittima di un nuovo tentativo. Soluzione:

1. **Client**: `completedRef` blocca ogni nuova PUT dal momento in cui la valutazione ha successo
   (anche timer già armati, `pagehide`, smontaggio).
2. **Server** (PR backend): la riga diventa un tombstone legato al *seed* del tentativo chiuso,
   dentro una transazione con `SELECT … FOR UPDATE`.
   - PUT con lo **stesso seed** del tombstone → ignorata (PUT tardiva).
   - PUT con **seed diverso** (nuovo tentativo, restart) → sempre accettata, anche con `rev` più basso.
   - `complete` su una riga con seed diverso → non tocca nulla (altro dispositivo ha già ripartito).
3. Un vecchio frontend (tab in cache) legge il tombstone come `marked: {}` a indice 0, cioè un quiz appena iniziato.

La semantica è stata verificata su **MySQL 9.7 reale** (container usa-e-getta, solo locale) con prove di
concorrenza: 15 round da 13 operazioni parallele (PUT/complete) → riga sempre chiusa, una sola riga; due
PUT iniziali concorrenti → nessun errore (deadlock/duplicato ritentati).

## Perimetro e CCST versionato

- Nessuna modifica a `src/lib/ccst-versioned-training.ts` né alla PR #180.
- Ogni ramo nuovo di `QuizEngine` è escluso con `versionedTrainingRef.current` / `isVersioned`; il prologo di `doFinish` per il percorso versionato è identico a prima.
- `QuizTopicClient`: la regola `if(saved.row)return legacy()` non è toccata. I tombstone sono righe come prima: chi ha già una riga resta sul motore legacy, come oggi.
- Nessun flag Vercel/Railway/CCST W1 modificato; nessun contenuto, nessuna configurazione Stripe.

## Test

Nuovi:
- `tests/quiz-progress-sync.test.tsx` (unit, 7): `adoptServerRev`, `chunk`, retry di `closeServerProgress`, marker locale (la chiave termina con lo scope utente → rimossa dal logout).
- `tests/quiz-finish-reliability.spec.ts` (e2e, 11): training interrotto e ripreso con punteggio corretto; training senza reload che non chiama il batch; fallimento batch + «Riprova»; mock exam completato; mock con 2 fallimenti consecutivi, reload e successivo tentativo; assessment; topic concluso che non ricompare (con background dopo la chiusura che non scrive); PUT tardiva ignorata; resume da altro dispositivo e riavvio pulito dopo la chiusura altrove; flush alla navigazione; chiavi `attempts`.

Il finto server di progresso dell'e2e replica le regole del tombstone; la semantica reale è coperta dal test di integrazione backend.

## Rischi residui (non corretti qui)

- Se `onFinish`/`/save-exam` fallisce, l'errore è ancora ingoiato (best-effort): il risultato non viene salvato in cronologia. Non è un caso di perdita di risposte, ma merita una PR separata.
- Esame scaduto con valutazione fallita e reload: l'attempt scaduto resta chiuso per progetto (test 5c esistente), le risposte non sono recuperabili dopo il reload.
- `/answers/evaluate` può restituire errori per singola domanda (es. topic premium); quelle domande restano senza verdetto e non contano come corrette.
- Righe `quiz_progress` già rimaste in produzione per quiz conclusi prima del rilascio non sono chiuse retroattivamente; si «chiudono» al primo completamento successivo o al restart. Una pulizia una tantum richiede un'operazione DB separata e autorizzata.
- Un dispositivo B con il tentativo già chiuso altrove non lo scopre finché non ricarica.

## Ordine di rilascio

1. Backend (aggiunge `/complete`; PUT/GET compatibili con i client attuali; nessuna migrazione).
2. Frontend. Se il backend non è ancora online, `closeServerProgress` riceve 404, non ritenta (4xx definitivo) e lascia il marker: nessun errore visibile, comportamento come oggi.

Rollback: ripristinare il frontend precedente; il backend nuovo resta compatibile.
