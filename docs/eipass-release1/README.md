# EIPASS 7 Moduli User — Release 1 correttiva

Data: 26/10/2026. Stato: preparazione PR Draft, nessun merge o deploy. Base verificata: `e5fd99b9e2047f6a914fa9dc1bb104e79dd54023`.

Riferimento: [Piano EIPASS Scuola Italia approvato](https://chatgpt.com/library?file_id=libfile_26e69249c0988191bba19ad0f6712625&account_id=personal).

## Comportamento risultante

Il percorso pubblico esistente è identificato come **EIPASS 7 Moduli User** nelle quattro lingue. Restano certification ID 3, slug `eipass`, i sette topic, tutti gli slug localizzati, le route quiz e le associazioni delle domande. L’ordine visuale è `[17,20,19,18,23,22,21]`. I link proposti non puntano più all’erroneo EIPASS Basic; gli alias legacy di routing restano nel codice per compatibilità.

Un adattatore di presentazione circoscritto a EIPASS risolve nomi, descrizioni e JSON localizzato, preservando il contenuto esteso dei topic e i dati delle domande. Landing, lista catalogo, quiz misto, quiz topic, esercitazione a tempo e metadati usano l’identità User. La copertura mostrata sulla landing include tutti e sette i moduli. Non vengono creati percorsi Standard o Edu.

Il mock mantiene URL, motore, timer, scoring e accesso attuali, ma si presenta come **esercitazione a tempo indipendente**, non replica verificata dei sette esami ufficiali. Non viene introdotto in questa PR un nuovo motore di simulazione modulare. I messaggi Premium descrivono i quiz e le spiegazioni disponibili e segnalano la revisione della copertura e delle traduzioni; non promettono preparazione completa, guide, mappe o scenari EIPASS non verificati. I richiami ai ripassi dedicati sono nascosti nei topic EIPASS: l’inventario verificato è zero; per attivarli in futuro va aggiornato il controllo di disponibilità.

## Integrità e dati

- Nessun codice backend, importatore, mutatore di domande, autenticazione, checkout o entitlement modificato.
- Nessuna scrittura o connessione diretta al database di produzione; nessuna nuova certificazione.
- I 1.248 ID italiani raccolti nell’audit sono registrati in `catalogue-integrity.json`, con topic e hash del payload pubblico. Le chiavi corrette e le spiegazioni persistite non sono state verificate. Il manifest è un’evidenza dell’audit, non un export SQL né una prova dello stato degli inattivi.
- L’immutabilità delle identità e dei payload è verificata nello scope del diff, dell’adattatore e delle fixture; non è stata dichiarata una riconciliazione SQL LIVE.
- L’API e il DB continuano a conservare i valori storici. **Non serve una migrazione DB per questa release**, perché la correzione è interamente di presentazione. Non è stato preparato SQL arbitrario su una struttura non verificata. Un eventuale allineamento persistito di nomi e descrizioni richiede una proposta separata con snapshot read-only autorevole, whitelist delle colonne e rollback protetto da hash.
- Rollback applicativo: revert della PR o ripristino della build precedente; nessun rollback dati necessario.

## Domande: piano separato, nessuna applicazione

[Revisione dei 19 item](QUESTION_REVIEW_19.md): rilievi, testo attuale, proposta, risposta semantica da verificare, alternative con ID e gate per chiave, spiegazioni, traduzioni e fonti. Gli item non sono modificati dalla release editoriale.

[Analisi delle 34 coppie](DUPLICATE_REVIEW_34.md): confronto testo e alternative di ciascuna coppia. Una coppia (1081/12888) condivide anche le quattro alternative normalizzate; 33 hanno alternative differenti. Stato di tutte: mantenere entrambi gli ID in attesa di revisione completa. Nessuna cancellazione, disattivazione o deduplica applicata.

## Verifiche eseguite

| Controllo | Esito | Perimetro |
|---|---|---|
| Typecheck | PASS | Intero progetto, incluso nella build |
| Build produzione isolata Next.js 15.5.9 | PASS | `.next/BUILD_ID` generato; API e rewrite instradati su loopback indisponibile, analytics/segreti vuoti |
| Test automatici | **141/141 PASS** | 53 contratti EIPASS e 88 regressioni: quattro lingue, JSON, ID/slug, contenuti estesi, indexability, Premium anonimo/FREE/Premium/loading, eventi, spiegazioni, checkout intent e logout |
| Smoke HTTP SSR | **36/36 PASS** | Quattro landing, quattro liste quiz, 28 pagine topic; canonical e alternate landing, ordine dei moduli, nessun JSON visibile, nessun link a ripassi non verificati; backend di fixture con zero richieste di scrittura |
| Lint mirato | PASS | Configurazione EIPASS, registry, adattatori server, componente Premium e test dedicato; nessun lint globale dichiarato |
| Integrità diff | PASS | `git diff --check`; nessun file di domande o route di scrittura modificato |
| Browser visuale / E2E interattivo | **BLOCCATO dall’ambiente** | Download Chromium non disponibile. Lo smoke SSR non sostituisce verifica visiva o interazioni browser |
| Login, Premium e checkout reali | **NON ESEGUITI** | Nessun account o pagamento LIVE impiegato. I test di accesso/navigation usano fixture e mock |
| CI GitHub | Da leggere sull’HEAD della PR | Workflow aggiunto `eipass-user-release.yml`; la build isolata esistente continua a eseguire il progetto |

I warning da analytics con ID vuoti e la deprecazione di react-test-renderer nei test non sono errori dell’applicazione. Il primo avvio di `tsx` CLI era bloccato dai socket Unix: i test sono eseguiti correttamente con `node --import tsx`. Le esecuzioni intermedie con errori di test o lint sono state corrette; gli esiti sopra riguardano il risultato finale.

## Riproduzione locale

Usare le dipendenze bloccate da package-lock. Test:

```sh
TSX_TSCONFIG_PATH=tsconfig.test.json node --import tsx --test tests/eipass-user-release.test.tsx tests/quiz-explanation-access.test.ts tests/topic-premium-required.test.tsx tests/topic-indexability-language.test.ts tests/mock-complete-link.test.tsx tests/premium-click-origin.test.ts tests/checkout-intent.test.ts tests/auth-logout.test.ts tests/isc2-practice-coverage.test.ts tests/pmp-practice-coverage.test.ts
```

Per la build, creare fuori repository una configurazione isolata compatibile con `CCST_E2E_CONFIG`, ad esempio `{"testRunId":"ccst-r02-eipassrelease120261026","backendOrigin":"http://127.0.0.1:9"}`. Eseguire `npm run build` con quel file, `API_BASE_URL` e `API_BASE_URL_DEV` su `http://127.0.0.1:9/api`, `NEXT_PUBLIC_SITE_URL=https://www.certifyquiz.com`, progetto Sanity sintetico `e2edummy`/dataset `test`, token e ID analytics vuoti. Non usare env di produzione.

Dopo la build isolata:

```sh
node scripts/run-eipass-editorial-ssr.mjs
```

Il runner avvia nello stesso ambiente il backend di sole fixture e Next, esegue lo smoke e chiude i processi figli. Nessun browser e nessuna credenziale sono necessari.

## Rischi residui e condizioni di rilascio

1. CI verde sull’HEAD esatto e revisione del diff da parte del maintainer. Verificare eventuale avanzamento di main prima di autorizzare merge.
2. Collaudo visuale desktop/mobile e interattivo in ambiente isolato per anonimo, utente FREE e Premium; controllare CTA, ritorno dopo login e paywall senza transazioni reali. Il collaudo browser resta gate aperto, non PASS.
3. Ripetere le letture dell’inventario pubblico prima del rilascio se nel frattempo cambia il catalogo; validare con il proprietario che ID 3 e topic 17–23 restino il percorso User. Le traduzioni parziali non diventano complete per effetto di questa PR.
4. Il mock attuale resta un allenamento generico: vietato presentarlo come replica ufficiale o come Standard/CIAD. Validazione di domande, chiavi e spiegazioni è una release separata.
5. Nessuna migrazione DB necessaria; i consumer API esterni al frontend mantengono i nomi storici. Verificare questa scelta di architettura in revisione.
6. Gli URL e le regole robots sono preservati; dopo un futuro rilascio autorizzato verificare le URL in Search Console senza aspettarsi un miglioramento di ranking garantito.

**Verdetto: GO alla PR Draft; NO-GO al rilascio produttivo finché sono aperti CI/revisione e collaudo browser.** Nessun merge o deploy fa parte di questo incarico.

## Protezione dai deploy automatici

`vercel.json` disabilita la distribuzione automatica soltanto per il branch `fix/eipass-user-release1-20261026`; non disabilita main o altre release. La regola usa la configurazione [git.deploymentEnabled documentata da Vercel](https://vercel.com/docs/project-configuration/git-configuration). Non viene invocato alcun comando di deploy. Controllare lo stato Vercel della PR per confermare che non sia nata una preview automatica.

## File modificati / aggiunti

- `.github/workflows/eipass-user-release.yml`
- `docs/eipass-release1/DUPLICATE_REVIEW_34.md`
- `docs/eipass-release1/QUESTION_REVIEW_19.md`
- `docs/eipass-release1/catalogue-integrity.json`
- `scripts/run-eipass-editorial-ssr.mjs`
- `scripts/verify-eipass-editorial-ssr.mjs`
- `src/app/[lang]/quiz-suggeriti/page.tsx`
- `src/app/[lang]/quiz/[slug]/mixed/page.tsx`
- `src/app/[lang]/quiz/[slug]/mock-exam/layout.tsx`
- `src/app/[lang]/quiz/[slug]/mock-exam/page.tsx`
- `src/app/[lang]/quiz/[slug]/page.tsx`
- `src/app/[lang]/quiz/topic/[topicId]/QuizTopicClient.tsx`
- `src/app/certifications/[slug]/[topicSlug]/page.tsx`
- `src/app/es/certificaciones/[slug]/[topicSlug]/page.tsx`
- `src/app/fr/certifications/[slug]/[topicSlug]/page.tsx`
- `src/app/it/certificazioni/[slug]/[topicSlug]/page.tsx`
- `src/certifications/data/EIPASS.ts`
- `src/components/CertificationPage.tsx`
- `src/components/QuizHome.tsx`
- `src/components/certification/PremiumResourcesCta.tsx`
- `src/lib/cert-descriptions.ts`
- `src/lib/data.ts`
- `src/lib/eipass-user-release.ts`
- `src/lib/practice-topic-coverage.ts`
- `src/lib/server/certs.ts`
- `src/lib/server/topic-page.ts`
- `tests/eipass-user-release.test.tsx`
- `tests/fixtures/eipass-user/certification-before.json`
- `tests/fixtures/eipass-user/page-17-before.json`
- `tests/fixtures/eipass-user/page-18-before.json`
- `tests/fixtures/eipass-user/page-19-before.json`
- `tests/fixtures/eipass-user/page-20-before.json`
- `tests/fixtures/eipass-user/page-21-before.json`
- `tests/fixtures/eipass-user/page-22-before.json`
- `tests/fixtures/eipass-user/page-23-before.json`
- `tests/fixtures/eipass-user/resources-before.json`
- `tests/fixtures/eipass-user/topics-before.json`
- `tests/helpers/eipass-editorial-backend.mjs`
- `vercel.json`
- `docs/eipass-release1/README.md`
