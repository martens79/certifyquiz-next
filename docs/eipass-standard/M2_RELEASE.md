# EIPASS Standard — Modulo 2: attivazione controllata (procedura)

Stato con questa PR (attivazione frontend): nel registro `EIPASS_STANDARD_MODULES` il Modulo 2 è `status: "available"` con `topicId: 570`; gli altri sei moduli restano `coming_soon`. Il link `/it/quiz/topic/570` esiste appena questa PR è in produzione: per questo il deploy va per ULTIMO, dopo l'attivazione del topic (vedi «Ordine di rilascio»). Senza topic attivo il link porta al pannello «non disponibile» (fallisce chiuso). Nessun testo di domanda e nessun testo del programma ufficiale sono in questo repository.

## Garanzie già presenti (non da costruire)
- Backend: un topic con `is_active = 0` (o inesistente) risponde `404 TOPIC_NOT_AVAILABLE` su quiz di topic, assessment, controllo risposte, mock e conteggi, per qualsiasi utente (anonimo, FREE, Premium, admin) — `services/topicAvailability.js`, test `hiddenTopicGuard`.
- Backend (aggiunto con la PR del pacchetto M2): anche `GET /api/topics/meta/by-topic/:id` risponde 404 per un topic nascosto (prima restituiva titolo e nome della certificazione).
- Frontend: `/[lang]/quiz/topic/[id]` è `noindex`; se il backend risponde `TOPIC_NOT_AVAILABLE` mostra il pannello «non disponibile», non avvia nessun quiz. Un hard 404 della pagina richiederebbe una fetch SSR per ogni pagina quiz verso un endpoint fuori dalla allowlist del limiter globale: scelta non fatta (storico dei 429 SSR del 29/09 e 04/10).
- Un topic attivo senza domande attive risponde `200 { questions: [] }`: nessun quiz parte; l'attivazione è comunque rifiutata dallo script `m2_90_TOPIC_SWITCH.sql` se le 17 domande non sono già attive.

## Ordine di rilascio (ognuno con autorizzazione esplicita)
1. Backend: merge e deploy della PR del pacchetto M2 (regola del Gate per contenuti solo italiani, rotta meta). Nessun effetto sui dati.
2. Database (Lorenzo, MySQL Workbench, dopo backup): `01_PREFLIGHT_CREAZIONE.sql` → `02_CREATE_STANDARD_INACTIVE.sql` in COMMIT → `03_VERIFY_POST_CREATE.sql` → `m2_00_PREFLIGHT_IMPORT.sql` (0 FAIL, salvare I03 come baseline e leggere gli ID).
3. Convertitore e Quality Gate (pacchetti privati): `validate` → `bundle` → `rehearse` → decisione umana sul solo finding `NEW_CONTENT_REQUIRES_REVIEW` (revisore e nota: li scrive chi ha letto le 17 domande) → `seal` → `authorize`. Poi in Workbench: `01-precheck` → `02-apply` → `03-postcheck`; `m2_03_VERIFY_M2.sql` con `@phase = 'IMPORT'` da un'altra connessione. Domande e topic restano inattivi.
4. Attivazione del database, senza link pubblici: pacchetto sigillato `activate` (17 domande `is_active = 1`, topic ancora nascosto: invisibile), poi `m2_90_TOPIC_SWITCH.sql` (DRY_RUN, poi COMMIT con la frase di conferma), poi `m2_03_VERIFY_M2.sql` con `@phase = 'ACTIVE'` e `m2_post_activation_public_check.cjs` (backend).
5. Smoke del quiz da URL diretto (`/it/quiz/topic/570`, ancora nessun link che lo raggiunga): anonimo, FREE e Premium (quiz di 17 domande, salvataggio, risultato), gli altri sei moduli 404/non disponibili. Se qualcosa non va: `m2_90 DEACTIVATE`, il pubblico non ha visto nulla.
6. Frontend (questa PR), per ultimo: merge e deploy. I testi «in arrivo» della landing, del catalogo, dei metadata e del richiamo in EIPASS User seguono la disponibilità dei moduli (`eipassStandardCopy`) e cambiano da soli; `publicationStatus` resta `coming_soon` (governa solo instradamento e indicizzazione). Verifica pubblica con `m2_post_activation_public_check.cjs --frontend` (cache ISR 30-60 minuti): catalogo/home/EIPASS User invariati, sitemap.

## Rollback
`m2_90_TOPIC_SWITCH.sql` con `@action = 'DEACTIVATE'` (il topic torna nascosto subito), poi il rollback sigillato dell'attivazione e, se serve, dell'import. Dopo il primo utente reale non cancellare nulla: solo `is_active = 0`. Per togliere il link dal frontend: Instant Rollback del deploy Vercel precedente, oppure revert della PR; il solo `DEACTIVATE` del topic basta a rendere il link innocuo.

## Fuori perimetro
Autorizzazione CERTIPASS (R3), decisione di lancio (R1), validazione dei livelli (R7): restano aperte e separate. Il Modulo 2 è un'«esercitazione breve», mai una simulazione dell'esame ufficiale; CertifyQuiz non è partner autorizzato.

## Controlli automatici (production-routing)
Lo smoke di routing/SEO (`scripts/verify-eipass-standard-coming-soon.mjs`) e lo spec Playwright (`tests/eipass-standard-coming-soon.spec.ts`) derivano le attese dal registro (`tests/helpers/eipass-standard-expectation.ts`) e le verificano per davvero in entrambi gli stati: dormiente (tutti «Prossimamente», nessun link ai quiz, nessuna dichiarazione di disponibilità) e con Modulo 2 disponibile (un solo link a `/it/quiz/topic/570`, gli altri sei disabilitati, «esercitazione breve», nessuna simulazione ufficiale né promessa di superamento). Nessun controllo è disabilitato.
