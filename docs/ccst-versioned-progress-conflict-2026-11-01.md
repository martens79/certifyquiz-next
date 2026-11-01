# CCST versioned training: `409 STALE_REVISION` / `PROGRESS_CONFLICT`

Stato: correzione nel solo client, PR in bozza. Nessuna modifica al backend, ai contenuti o ai flag.

## Sintomo (produzione, smoke del 2026-11-01, account di test 246)

- Dopo la prima risposta di un tentativo versionato, `PUT /ccst-versioned-training/attempts/:id/progress` risponde `409`.
- Da quel momento il client non salva più: su 100 risposte IT il server ne aveva registrate 4 (`POST .../answers`), e a ogni azione parte una `GET` del tentativo.
- "Vedi risultato" non invia `POST .../complete`; in console: `Versioned completion failed: PROGRESS_CONFLICT`.
- Al ricaricamento compare "La sessione è cambiata su un altro dispositivo", e il 409 si ripresenta alla prima risposta successiva.
- Osservato 4 volte su 2 tentativi (IT: 3 volte, di cui una dopo la ripresa; EN: 1 volta, su un tentativo nuovo senza ricaricamenti). Un tentativo ES, avviato dopo il rollback, non l'ha mostrato nelle prime risposte: il conflitto è intermittente.
- Il "completato" del 28/10 era un risultato calcolato solo in locale (`SMOKE-AGGREGATE`: 0 completati).

## Causa

Il backend (`services/ccstVersionedAttempts.js`, identico a `main`/Railway `5e6258e`) cambia la revisione in due punti diversi:

- `recordEvaluation` (`POST /answers`): `r.rev++` con compare-and-swap, e scrive anche `marked[q]`.
- `save` (`PUT /progress`): richiede `expectedRev === r.rev`, altrimenti `STALE_REVISION` (409).

La risposta di `POST /answers` non contiene la nuova revisione.

Il client (`src/lib/ccst-versioned-training.ts`, identico a `main` `c2706b9`):

1. `save()` era serializzato in una coda, ma `checkAnswer()` no. `QuizEngine` li avvia insieme a ogni click (handler di risposta e effetto di autosave).
2. Se il `PUT` parte con la revisione in cache mentre la `POST` la sta incrementando, il server risponde 409. `checkAnswer` azzera la cache solo a risposta ottenuta, troppo tardi per il `save` già accodato.
3. `save()` scrive `pending` in `localStorage` prima della richiesta e lo cancella solo a successo. Dopo il 409 `pending` resta, e:
   - ogni `save()` successivo lancia `UNSYNCED_PROGRESS` senza fare richieste;
   - `checkAnswer()` e `complete()` chiamano `open()`, che in `pendingResume` vede `rev !== baseRev` e lancia `PROGRESS_CONFLICT` prima di qualsiasi `POST`.
4. Il banner di recupero esiste solo al caricamento della pagina, non durante la sessione: l'utente continua a rispondere, ma i progressi restano solo in locale.

Non dipende dai contenuti W1: lo stesso trasporto serve R03/R04 (`CCST_VERSIONED_TRAINING_START=1`).

## Correzione (solo `src/lib/ccst-versioned-training.ts`)

- Tutte le operazioni che dipendono dalla revisione passano da un'unica coda (`run`): `open`, `save`, `checkAnswer`, `complete`, `restart`, `useServerProgress`. `PUT /progress` e `POST /answers` non si sovrappongono più.
- `checkAnswer` azzera la cache in `finally` (la valutazione può essere stata applicata anche se la risposta è andata persa).
- `save`: su `STALE_REVISION` rilegge il tentativo e ritenta **una sola volta**, solo se lo stato remoto è compatibile con quello locale (`rebasable`): non completato, stessa navigazione (`currentIndex`, `reviewLater`) della copia su cui si basava la scrittura, nessuna risposta in contrasto con quelle locali. Altrimenti `PROGRESS_CONFLICT` (409, con `server` e `pending`: stesso contratto che usa il banner di `QuizEngine`).
- `pending` ora conserva anche la copia di base (`base`, opzionale: i `pending` scritti dal client precedente restano validi e vengono trattati con la regola conservativa di prima).
- `pendingResume` applica la stessa regola: dopo un ricaricamento il tentativo si ripara da solo quando il server è avanzato solo per valutazioni compatibili.
- Un `save()` non resta più bloccato da un `pending` precedente: riconcilia (rilettura, controllo, replay) e prosegue.
- `complete()` attende i salvataggi precedenti (è sulla stessa coda) e, a completamento riuscito, scarta il `pending` residuo (il server rifiuta comunque ulteriori salvataggi di un tentativo completato).
- `restart()` non è più bloccato da un conflitto irrisolto: salva la copia non inviata in `...:conflict:<ts>` e riparte.

Non cambiano: `QuizEngine.tsx`, `QuizTopicClient.tsx`, il backend, il percorso legacy, i contenuti.

## Prove

`tests/ccst-versioned-training-progress.test.tsx` usa un modello in memoria del backend (stessa semantica di `ccstVersionedAttempts.js`: CAS su revisione, `POST /answers` che incrementa, `complete` che somma solo le valutazioni registrate) con latenze asincrone, cancelli (gate) per forzare gli interleaving e iniezione di scritture esterne.

Contro il client di `main` (`c2706b9`) **9 test su 13 falliscono**, a partire dal primo click (`STALE_REVISION`), quindi il conflitto è riprodotto in modo deterministico. Con la correzione passano tutti.

Casi coperti: risposte rapide e richieste concorrenti (5 semi di latenza casuale, 30 risposte), salvataggio, resume e completamento, recupero dopo 409 con una sola retry, conflitto incompatibile senza sovrascrittura, nessuna perdita o duplicazione di risposte (una `POST /answers` per risposta, doppio click idempotente), `complete()` dopo i salvataggi, compatibilità con contenuti R03, R04, W1 e fallback `legacy-v1`/`release-02-v2`, `pending` del client precedente, retry del trasporto (`GET` sì, `PUT`/`POST` no).

Suite unit: `main` 115 test, 106 passano (9 falliscono già su `main`: admin-funnel-events, eipass-*, google-analytics-consent, mock-complete-link, package-auth, package-success, selezione lingua). Con la PR 128 test, 119 passano: gli stessi 9 falliscono, +13 nuovi verdi. `tsc --noEmit` ed ESLint sui file modificati: OK.

## Limiti dichiarati

- La riproduzione controllata usa un modello fedele del backend, non il servizio reale. Il conflitto reale è stato osservato in produzione (4 volte, 409 sul `PUT` subito dopo il `POST /answers`).
- Non provato in un browser reale dopo la correzione: va ripetuto lo smoke completo (IT/EN/FR/ES, resume, complete, legacy, domanda 19865) prima di riattivare W1.
- I tentativi già bloccati dal client precedente (`pending` senza `base`) non si riparano da soli: all'apertura compare il banner "Usa la sessione salvata", oppure "Ricomincia" (ora sbloccato).
- Due schede sullo stesso tentativo con navigazione divergente producono ancora un conflitto esplicito (voluto: non si sovrascrive).
- `POST /answers` non restituisce la revisione: dopo ogni risposta resta una `GET` di rilettura (come prima). Un campo `rev` nella risposta eviterebbe la `GET` ma richiede una modifica backend, fuori da questa PR.

## Impatto di `CCST_VERSIONED_TRAINING_START=1` e mitigazione

- Il flag backend `CCST_VERSIONED_TRAINING_START` diventa `allowNewStarts`: con `0` un **nuovo** `POST /attempts` risponde `503 VERSIONED_NEW_STARTS_DISABLED`; i tentativi esistenti (resume, `GET`, `PUT /progress`, `POST /answers`, `POST /complete`, storico) restano serviti.
- Lato frontend l'opt-in ("Prova le domande migliorate") compare solo con `NEXT_PUBLIC_CCST_VERSIONED_TRAINING=1`. Il frontend non gestisce il `503`: un utente che spunta l'opt-in con il solo flag backend a 0 vedrebbe un errore di caricamento.
- Quindi l'esposizione al bug riguarda solo chi ha spuntato l'opt-in (R04 oggi), e chi ha già un tentativo in corso resta esposto finché non si distribuisce il client corretto.
- Mitigazione temporanea più sicura, da decidere separatamente: prima nascondere l'opt-in (frontend `NEXT_PUBLIC_CCST_VERSIONED_TRAINING=0` e redeploy Vercel, tenendo `..._READ=1` o i `handle` esistenti per i tentativi in corso), poi eventualmente `CCST_VERSIONED_TRAINING_START=0`. Con l'ordine inverso gli utenti vedrebbero un errore.
- Effetto sui tentativi esistenti: nessuno sulle sessioni già avviate (continuano con il percorso versionato); nessun dato modificato.
- Stima dell'esposizione reale: da una query di sola lettura aggregata (non eseguita): `reports/ccst-cybersecurity-reaudit-2026-10-25/phase2f/w1-precheck-readonly-2026-11-01/ESPOSIZIONE-TRAINING-READONLY.sql`.

## Rollout proposto (non eseguito)

1. Revisione e merge della PR (solo frontend). Nessun cambio backend.
2. Dopo il deploy: ripetere lo smoke completo con l'account di test (nuovo tentativo, nessun ricaricamento nel mezzo, poi un resume a parte).
3. Solo con smoke PASS e autorizzazione esplicita: riportare `CCST_W1_START` a 1.
