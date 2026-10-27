# EIPASS Standard — landing e topic v1 (anteprima, non pubblicata)

Stato: **PR Draft isolata, solo frontend, nessuna pubblicazione.** EIPASS Standard (DigComp 2.2) è un prodotto distinto da EIPASS 7 Moduli User (ID 3, slug `eipass`), che non è toccato.

| Documento | Contenuto |
|---|---|
| [MODULES.md](MODULES.md) | I 7 moduli (nomi e ordine ufficiali), area DigComp, topic User candidati, anteprima locale |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Associazione domanda ↔ certificazione ↔ topic: opzioni, scelta, effetti sui dati condivisi, fasi, rollback |
| [proposed-migrations/001_topic_question_links.PROPOSED.sql](proposed-migrations/001_topic_question_links.PROPOSED.sql) | Migrazione proposta, **non eseguita** |
| [LAUNCH_REQUIREMENTS.md](LAUNCH_REQUIREMENTS.md) | Requisiti mancanti per il lancio |
| [TEST_REPORT.md](TEST_REPORT.md) | Verifiche eseguite e limiti |

## Cosa contiene la PR

- `src/certifications/data/eipass-standard.ts`: voce di registry `planned`, solo italiano e mercato IT (`launchScope`), senza ID DB.
- `src/lib/eipass-standard.ts`: contratto dei 7 moduli e dati dimostrativi (testi marcati `[DEMO]`, ID negativi, zero domande).
- Guardie: `CertificationDetailView` (404 se non in anteprima o fuori da IT), `topic-page.ts` (nessuna chiamata al backend), `quiz/[slug]/layout.tsx` (quiz sempre 404), `ROLLOUT_NOINDEX_CERTIFICATION_SLUGS`.
- `CertificationPage`: nessuna griglia "Materiale di studio" per Standard (non esiste materiale).
- Test: `tests/eipass-standard-planned-guard.test.ts` (10) e due asserzioni aggiornate (`plc-fundamentals-planned-guard`, `az802-rollout-noindex`) che prima presumevano zero voci `planned`/guardate.
- Script di smoke: `scripts/run-eipass-standard-isolation.mjs` + `scripts/verify-eipass-standard-isolation.mjs`.

## Anteprima locale

```powershell
$env:CERTIFYQUIZ_PLANNED_PREVIEW = "1"; npm run dev
# http://localhost:3000/it/certificazioni/eipass-standard
```

Funziona solo con `NODE_ENV` ≠ `production` e `VERCEL_ENV` ≠ `production`. In produzione ogni URL di Standard è 404.
