# EIPASS Standard — pubblicazione frontend Modulo 6 (Excel)

Stato DB (già in Production, non toccato da questa PR): certificazione 79, topic 569–575 attivi; topic 574 con 50 domande IT attive / 200 risposte; pool M6: IT 50, EN/FR/ES 0.

## Cosa cambia
- `src/lib/eipass-standard.ts`: M6 passa a `status: "available"`, `topicId: 574` → link `/it/quiz/topic/574`. Con tutti e sette i moduli disponibili il testo derivato non dice più "gli altri moduli sono in preparazione" (`eipassStandardCopy`).
- Test aggiornati allo stato "tutti disponibili" + nuovo spec browser `tests/eipass-standard-m6-routes.spec.ts` (`playwright.eipass-standard-m6.config.ts`).

## Lingue
`EIPASS_STANDARD_LANGS = ["it"]` invariato. `/{en,fr,es}/quiz/topic/574`: pool 0 con richiesta strict → box "coming soon", nessuna domanda vuota né fallback italiano. Le route slug Standard fuori da IT restano 404.

## Pubblicazione
Nessun ordine di rilascio vincolante (DB già pronto). Dopo il deploy la cache Vercel impiega 30–60 minuti.
