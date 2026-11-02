# Registrazione del risultato in cronologia (/save-exam) — 2026-11-02

Seguito della PR #184 (nota «Rischi residui»: errore di `/save-exam` ingoiato). Va rilasciata **dopo** la PR backend
`fix/save-exam-reliability-be-20261102` (vedi «Ordine di rilascio»). Perimetro: nessuno Stripe/billing, nessun flag,
nessun contenuto, **CCST versionato non toccato**.

## Causa (evidenze su `origin/main` 2eaa599)

`QuizEngine.runFinish` dopo la valutazione riuscita imposta `finished`, poi `try { await onFinish(summary) } catch { /* ignore */ }`
e **subito** `clearProgress` + chiusura del progresso server. I tre chiamanti di `onFinish` ingoiavano a loro volta l'errore
(`catch {}` / `console.error`). Conseguenza: con `/save-exam` in errore il punteggio compare come definitivo, la cronologia
non viene aggiornata, nessun messaggio, nulla da ritentare, e dopo un reload non resta traccia. Inoltre `apiFetch` non ha
timeout (richiesta appesa all'infinito) e il topic exam usava un `fetch` grezzo senza refresh del token.

## Percorsi

| Percorso | Usa `/save-exam`? | Note |
|---|---|---|
| Mixed training | sì (`isExam:false`) | `mixed/page.tsx` |
| Mixed exam / Mock exam | sì (`isExam:true`) | `mixed/page.tsx`, `mock-exam/page.tsx` |
| Topic exam | sì (`isExam:true`, `topicId`) | `QuizTopicClient.tsx` (prima `fetch` grezzo, senza refresh 401) |
| Topic training | **no** (`mode !== "exam"` → return) | nessuna riga di cronologia per scelta storica, invariato |
| Assessment (topic/mixed) | **no** | invariato |
| Review-module (`ReviewModuleAssessment`) | **no** | callback locale, nessuna rete |
| CCST versionato | **no** (`if (!versionedTrainingRef.current)`) | motore e cronologia propri, invariato |

## Correzione

- `src/lib/save-exam-outbox.ts`: **write-ahead** in `localStorage` (`cq:quiz:pending-save:<attemptId>:user:<id>`) prima della richiesta,
  rimosso solo a 2xx; `attemptId` (UUID) stabile per risultato, riusato da ogni retry; timeout 20 s con `AbortController`;
  **una** richiesta + **un solo** retry automatico (rete/timeout/5xx, dopo 1,5 s); poi solo retry manuale con cooldown
  (3 s; 429 → 30 s; nessun retry automatico su 401/403/429/4xx). Classificazione: network, timeout, server, busy, rate, auth, rejected.
  Chiavi sotto `cq:quiz:` con suffisso `:user:<id>` → il logout le rimuove (PC condivisi) e non si inviano mai col token di un altro account.
  Voci corrotte o più vecchie di 30 giorni vengono scartate. Storage non disponibile → la voce resta in memoria e l'utente è avvisato di non chiudere la pagina.
- `src/lib/quiz-result-save.ts` (`recordQuizResult`): costruisce il payload (solo le chiavi che il backend legge), nessuna chiamata per utenti anonimi.
- `QuizEngine`: genera `summary.attemptId` una volta a valutazione riuscita; la registrazione parte subito ma non blocca `clearProgress`/chiusura progresso;
  errore non ingoiato (stato nello store). Il motore **non riapre** esami scaduti/consegnati e non chiede nuove risposte.
- `SaveResultBanner` (IT/EN/FR/ES): nella schermata finale distingue **valutazione completata** (punteggio) da **risultato registrato**
  («Salvataggio…», «✓ registrato», oppure avviso «NON è stato registrato» con «Riprova a salvare»). Nelle pagine quiz mostra anche i
  risultati rimasti da un caricamento precedente (reload/chiusura tab), con «Riprova» e «Scarta».
- `apiClient.saveExam` accetta `signal`; `SaveExamRequest.attemptId`.

## Test

- `tests/save-exam-outbox.test.ts` (17 unit): classificazione, write-ahead, 500, retry manuale/cooldown, 429, 401, 4xx, timeout, risposta persa dopo COMMIT,
  coalescenza, recupero dopo reload (solo stesso utente), logout, storage rotto, scarto, payload.
- `tests/save-exam-reliability.spec.ts` (12 e2e Chromium mobile, backend stubbato nel browser): A salvataggio, B 500 (mixed e topic exam), 429, 401,
  C connessione persa, D risposta persa dopo commit (retry deduplicato), doppio click, E reload (training e mock a tempo, esame non riaperto), E3 altro account, anonimo.
- La deduplicazione REALE è provata su MySQL 9.7.2 nella PR backend.

## Ordine di rilascio

1. Backend (accetta `attemptId`; senza, comportamento invariato).
2. Frontend.

Con il frontend nuovo e il backend vecchio: l'`attemptId` viene ignorato, i retry restano visibili all'utente ma possono duplicare (limite storico) —
per questo il backend va prima. Frontend vecchi in cache col backend nuovo: nessun `attemptId`, comportamento di prima.
Rollback FE: ripristinare il frontend precedente; le voci `cq:quiz:pending-save:*` restano nel browser degli utenti e vengono ignorate.

## Rischi residui

- Se la **valutazione** (non il salvataggio) fallisce a tempo scaduto e l'utente ricarica, le risposte non sono recuperabili (comportamento di #184, invariato).
- Il logout elimina i risultati non ancora registrati di quell'utente (scelta di privacy per dispositivi condivisi).
- Finestra di millisecondi fra `setFinished` e la scrittura write-ahead: se la scheda viene chiusa esattamente lì il risultato non è recuperabile.
- Il banner dei risultati residui compare solo sulle pagine quiz (topic/mixed/mock); non c'è un punto di ingresso globale.
