# EIPASS Standard v1 — verifiche

Data: 27/10/2026. Base: `origin/main` a9155fc (PR #165 mergiata). Nessun accesso a Production né a database; nessun import, merge o deploy.

| Controllo | Esito | Perimetro |
|---|---|---|
| Typecheck (`tsc --noEmit`, incluso in `prebuild`) | PASS | Intero progetto |
| Build di produzione isolata (Next.js 15.5.9) | PASS | Backend su loopback, analytics/segreti vuoti, progetto Sanity sintetico, `CCST_E2E_CONFIG` isolato. Eseguita due volte (prima e dopo l'ultima modifica a `CertificationPage`) |
| Test unitari | **669/669 PASS** | Intera suite `tests/*.test.ts(x)`; di cui 10 nuovi in `eipass-standard-planned-guard.test.ts` |
| Lint mirato | PASS | File toccati/nuovi; nessun lint globale dichiarato |
| `git diff --check` | PASS | |
| **Routing/isolamento in produzione** (`run-eipass-standard-isolation.mjs`) | **51/51 PASS** | In build di produzione: landing, 7 topic e 3 route quiz di Standard = 404 in it/en/fr/es; home, liste certificazioni (4 lingue) e robots non citano Standard; zero scritture sul backend di fixture |
| **Regressione EIPASS 7 Moduli User** (`run-eipass-editorial-ssr.mjs`, preesistente) | **44/44 PASS** | Quattro lingue, canonical e alternate, ordine moduli, nessun JSON visibile, nessun ripasso non verificato |
| Anteprima locale (`next dev` con `CERTIFYQUIZ_PLANNED_PREVIEW=1`) | PASS | Landing e topic in IT = 200, `noindex, follow`, banner "dati dimostrativi", 7 moduli con link, zero domande, nessun CTA al quiz e nessuna griglia "Materiale di studio"; fr/es/en = 404; route quiz = 404 |
| Verifica visiva | Parziale | Screenshot desktop dell'anteprima in browser integrato. **Non** eseguiti: mobile, browser di produzione, E2E interattivo |

## Regressione SEO e isolamento dei dati — cosa è dimostrato

- Nessun file di EIPASS 7 Moduli User è modificato (`EIPASS.ts`, `eipass-user-release.ts`, test e fixture `eipass-user`): verificabile con `git diff --stat`. ID 3, slug `eipass`, topic 17–23, ordine `[17,20,19,18,23,22,21]` sono asseriti anche da test.
- Nessun file di domande, backend, importatore, checkout o entitlement è modificato. Nessuna connessione a DB.
- URL, canonical, hreflang e robots delle pagine esistenti: invariati (smoke User 44/44). L'unica modifica con effetto trasversale è il nuovo `quiz/[slug]/layout.tsx`, che restituisce 404 solo per Standard o per una certificazione `planned` fuori anteprima (oggi nessun'altra); per tutte le altre restituisce i figli senza cambiamenti.
- Sitemap: costruita dall'inventario del backend, mai dal registry (asserito da test); Standard non ha riga DB, quindi non può entrarvi, e la guardia di rollout lo escluderebbe comunque.

## Limiti

- La sitemap **non** è stata generata in runtime nello smoke (il fixture non espone l'inventario completo e produce 500, come sul codice di base): la garanzia è il contratto unitario + l'assenza della riga DB.
- Il browser di produzione, login/FREE/Premium e checkout non sono stati esercitati: Standard non ha né quiz né paywall in questa PR.
- CI GitHub da leggere sull'HEAD della PR. Nessuno dei workflow esistenti esegue i test nuovi per path filter; `npm run test:unit` (glob `tests/*.test.tsx`) non include i `.test.ts`: i test vanno lanciati con `node --import tsx --test`.
- Il preview Vercel del branch è disabilitato in `vercel.json` (stessa regola usata per la release EIPASS User); controllare nello stato della PR che non sia nata una preview.
