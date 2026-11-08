# EIPASS Standard — Modulo 2: attivazione controllata (procedura)

Stato di questo repository: il Modulo 2 è predisposto ma **dormiente**. `EIPASS_STANDARD_MODULES[1].status` è `"coming_soon"`; lo stato `"available"` esiste ma nessun modulo lo usa. Nessun link, nessuna rotta, nessun quiz cambia finché non si esegue la procedura qui sotto. Nessun testo di domanda e nessun testo del programma ufficiale sono in questo repository.

## Garanzie già presenti (non da costruire)
- Backend: un topic con `is_active = 0` (o inesistente) risponde `404 TOPIC_NOT_AVAILABLE` su quiz di topic, assessment, controllo risposte, mock e conteggi, per qualsiasi utente (anonimo, FREE, Premium, admin) — `services/topicAvailability.js`, test `hiddenTopicGuard`.
- Backend (aggiunto con la PR del pacchetto M2): anche `GET /api/topics/meta/by-topic/:id` risponde 404 per un topic nascosto (prima restituiva titolo e nome della certificazione).
- Frontend: `/[lang]/quiz/topic/[id]` è `noindex`; se il backend risponde `TOPIC_NOT_AVAILABLE` mostra il pannello «non disponibile», non avvia nessun quiz. Un hard 404 della pagina richiederebbe una fetch SSR per ogni pagina quiz verso un endpoint fuori dalla allowlist del limiter globale: scelta non fatta (storico dei 429 SSR del 29/09 e 04/10).
- Un topic attivo senza domande attive risponde `200 { questions: [] }`: nessun quiz parte; l'attivazione è comunque rifiutata dallo script `m2_90_TOPIC_SWITCH.sql` se le 17 domande non sono già attive.

## Ordine di rilascio (ognuno con autorizzazione esplicita)
1. Backend: merge e deploy della PR del pacchetto M2 (regola del Gate per contenuti solo italiani, rotta meta). Nessun effetto sui dati.
2. Database (Lorenzo, MySQL Workbench, dopo backup): `01_PREFLIGHT_CREAZIONE.sql` → `02_CREATE_STANDARD_INACTIVE.sql` in COMMIT → `03_VERIFY_POST_CREATE.sql` → `m2_00_PREFLIGHT_IMPORT.sql` (0 FAIL, salvare I03 come baseline e leggere gli ID).
3. Convertitore e Quality Gate (pacchetti privati): `validate` → `bundle` → `rehearse` → decisione umana sul solo finding `NEW_CONTENT_REQUIRES_REVIEW` (revisore e nota: li scrive chi ha letto le 17 domande) → `seal` → `authorize`. Poi in Workbench: `01-precheck` → `02-apply` → `03-postcheck`; `m2_03_VERIFY_M2.sql` con `@phase = 'IMPORT'` da un'altra connessione. Domande e topic restano inattivi.
4. Frontend (questa PR e quella di attivazione): la PR di attivazione imposta solo `status: "available"` e `topicId` del Modulo 2 in `src/lib/eipass-standard.ts`: i testi «in arrivo» della landing, del catalogo, dei metadata e del richiamo in EIPASS User seguono la disponibilità dei moduli (`eipassStandardCopy`) e cambiano da soli; `publicationStatus` resta `coming_soon` (governa solo instradamento e indicizzazione). I test aggiornano le attese dello stato dormiente con un registro iniettato. Deploy con il topic ancora inattivo: il link porta al pannello «non disponibile» (fallisce chiuso).
5. Attivazione: pacchetto sigillato `activate` (17 domande `is_active = 1`, topic ancora nascosto), poi `m2_90_TOPIC_SWITCH.sql` (DRY_RUN, poi COMMIT con la frase di conferma), poi `m2_03_VERIFY_M2.sql` con `@phase = 'ACTIVE'`.
6. Smoke di produzione: anonimo, FREE e Premium (quiz di 17 domande, salvataggio, risultato), gli altri sei moduli 404/non disponibili, catalogo/home/EIPASS User invariati, sitemap.

## Rollback
`m2_90_TOPIC_SWITCH.sql` con `@action = 'DEACTIVATE'` (il topic torna nascosto subito), poi il rollback sigillato dell'attivazione e, se serve, dell'import. Dopo il primo utente reale non cancellare nulla: solo `is_active = 0`.

## Fuori perimetro
Autorizzazione CERTIPASS (R3), decisione di lancio (R1), validazione dei livelli (R7): restano aperte e separate. Il Modulo 2 è un'«esercitazione breve», mai una simulazione dell'esame ufficiale; CertifyQuiz non è partner autorizzato.
