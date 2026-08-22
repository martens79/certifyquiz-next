# CertifyQuiz — audit funnel conversione

Data audit: 2026-08-22. Scope: frontend `certifyquiz-next`, backend `quiz_project`, schema e migrazioni presenti nei repository. Nessuna verifica su dati o configurazione di produzione e nessuna modifica a prezzi, entitlement, Stripe, rate limit, SEO o advertising.

## 1. Current funnel

| Step | Cosa esiste | Route/componenti | Auth ed entitlement | Analytics | Friction / uscita |
|---|---|---|---|---|---|
| 1. Arrivo organico/social | Home, hub vendor/categoria, certification, topic, Review, blog, guide, mappe e Labs; canonical/hreflang/sitemap/noindex centralizzati e coperti da test | `src/app/page.tsx`, `src/app/[lang]/page.tsx`, `src/app/hub`, `src/app/[lang]/certificazioni`, pagine topic/review/blog | Pubblico | Home CTA, resource click, `certification_viewed`; manca un `landing_view` normalizzato sulle landing principali | Le CTA dipendono dal template; articoli e Review non sempre conducono a un assessment specifico |
| 2. Certification/topic/review | Pagina certificazione con Quiz, Reviews, Simulator, guide/mappe/scenari/Labs solo in base alle risorse aggregate; lead magnet contestuale | `CertificationPage`, `StudyMaterialGrid`, `ContextualLeadMagnetBox`, pagine topic e Review | Pubblico; card indicano risorse Premium | `certification_viewed`, `study_resource_clicked`, CTA Premium/guide/mappe | Prima del P0 le offerte precedevano l'assessment e il lead magnet chiedeva email prima del test; molte CTA concorrenti |
| 3. Assessment/quiz gratuito | Assessment da 10 domande via `?mode=assessment`; training fino a 40; guest può iniziare; gate registrazione dopo 5 domande presente nel motore | `/[lang]/quiz/[slug]/mixed?mode=assessment`, topic quiz, `QuizEngine`, `RegistrationGate` | Guest ammesso; salvataggio server solo autenticato; assessment non viene salvato come `quiz_result` | `assessment_started`, `assessment_completed`, milestone, abbandono, result viewed | Il risultato mostra score/livello ma non strong/weak areas reali per topic; assessment misto non salva attempts e quindi non alimenta readiness/weak areas dell'account |
| 4. Email/registrazione | Capture report dopo il risultato; registrazione email/Google e login con redirect; handoff di source/cert/topic/score verso lo studio | `assessment-report`, `/[lang]/register`, `/[lang]/login`, callback auth | Pubblico; account necessario per progressi | `email_captured`, `assessment_email_submitted`, `registration_started`, `registration_completed` con contesto assessment | Email e account restano identità separate, ma il percorso di registrazione conserva ora contesto e destinazione di studio |
| 5. Trial/free | Monthly Premium ha trial Stripe di 7 giorni; free ha quiz/review/preview e 10 spiegazioni errate; rewarded ads sono feature-flagged | Pricing, billing routes, `QuizEngine`, guide/map access gate, rewarded ads routes/service | Trial è risolto come Premium da middleware; package entitlement è per risorsa/certificazione | Eventi pricing/trial indiretti, explanation gate, rewarded-ad lifecycle lato server | Trial ha gli stessi privilegi Premium dove `req.user.premium` incorpora il trial; va verificata la protezione download per ogni materiale prima di cambiare policy |
| 6. Paywall | Gate spiegazioni dopo quota; gate guide/mappe/scenari; CTA contestuali con certificazione e score nel risultato assessment | `QuizEngine`, `GuideAccessGate`, `MapOverviewGrid`, `PremiumTeaserBox` | Backend verifica Premium/trial/package; guest/free distinti | `explanation_paywall_viewed`, gate server, CTA Premium | Naming frammentato (`premium_clicked*`, `premium_cta_clicked`, `wrong_explanation_gate_shown`); il paywall non mostra progress/weak areas account |
| 7. Pacchetto singolo | Dolphin/Octopus, offerte e prezzi caricati dal backend, ownership e upgrade; dark launch controllato | `CertificationPackageOffers`, `/packages/offers`, `/packages/checkout`, commerce service | Login obbligatorio; entitlement risolto per resource type; owner non può ricomprare lo stesso tier | `package_selected`, `checkout_created`, `purchase_completed`, upgrade/failure/refund | Il frontend non emette il funnel canonico `checkout_started` per package; gli eventi package vivono anche in una tabella commerce separata |
| 8. Premium | Monthly/annual, prezzo esistente, trial solo monthly, CTA in certification/result/gate/header | Pricing view e billing routes | Login obbligatorio; Premium/admin/trial centralizzati nei middleware | pricing viewed/selected, `checkout_started`, `checkout_created`, `purchase_completed` | Package vs Premium è spiegato, ma la scelta appare presto nella pagina certificazione e non usa numero di certificazioni studiate/acquistate |
| 9. Checkout | Stripe session per Premium, pacchetti, guide; webhook completa acquisto e aggiorna entitlement | billing/package/guide routes e webhook | Auth per avvio; webhook server-side | Presenti, ma `checkout_started` è GA per Premium/guide e non uniforme nel DB | Nessun correlation/session id comune tra landing, assessment, signup e purchase in `funnel_events` |
| 10. Dashboard/account | Profilo con quiz, accuracy, streak, package, trial, weak areas, readiness, exam goal | `/[lang]/profile`, `profile-client`, user/quiz routes | Auth | Progress quasi non tracciato come funnel | Molta informazione ma next-best-action non è gerarchizzata; readiness richiede selezione certificazione |
| 11. Studio successivo | Resume cross-device, quiz per topic/mixed, error review, Labs, simulator, recommended resources | Quiz engine/progress, profile, Labs, mock exam | Progress auth; risorse secondo entitlement | quiz events, resource clicks, Labs/game events | Manca un evento canonico `study_started`; assessment anonimo non trasferisce contesto a signup/dashboard |
| 12. Seconda certificazione | Roadmap e hub offrono percorsi; package/Premium supportano più cert | roadmap/hub/category | Pubblico o auth secondo risorsa | Nessun `second_certification_started` | Non esiste completion di certificazione come dominio: `quiz_results.passed` indica un singolo quiz/esame, non certificazione completata; nessuna relazione next-cert centralizzata |

## 2. Biggest conversion leaks

1. Il vecchio flusso certification → email → assessment chiedeva dati prima di erogare valore. Il P0 lo ha trasformato in certification → assessment → risultato → email.
2. L'assessment anonimo produce score e fascia sintetica, ma non strong/weak areas reali: le domande UI non espongono il topic e il risultato assessment non viene persistito in `quiz_results`/`user_question_stats`.
3. Email capture e account restano record separati; il P0 conserva però source, certificazione, topic, score e redirect durante signup/login senza introdurre una nuova identità anonima.
4. Il funnel è spezzato tra GA4, `funnel_events`, `package_commerce_events` e stato Stripe; manca un identificatore anonimo/correlation id nel DB.
5. `study_started`, `free_limit_reached` e `paywall_viewed` canonici sono stati completati nel P0 mantenendo gli eventi specifici storici; `second_certification_started` resta fuori dal P0.
6. Non esiste uno stato affidabile di “certificazione completata”; `passed` su `quiz_results` non basta per recommendation/cross-sell.
7. La dashboard possiede progress, weak areas, streak e readiness, ma non presenta una singola attività consigliata come CTA primaria.
8. Il package checkout è misurato in commerce, ma non è direttamente confrontabile con il funnel Premium senza normalizzazione analitica.

## 3. Existing assets we can exploit

- Assessment reale da 10 domande e risultato localizzato con score/fascia.
- Capture email post-risultato e invio report transazionale/Brevo.
- Quiz per topic/mixed, Exam Simulator, Reviews indicizzabili, guide/mappe con preview, scenari e Interactive Labs.
- `user_question_stats` e `/me/weak-areas` per errori reali; `user_question_seen` e `/readiness/:certificationId` per coverage/accuracy/consistency/confidence.
- Resume quiz, progressi, streak, leaderboard, exam goals e ripasso errori.
- Resolver entitlement per Premium/trial/package/resource type; pacchetti Dolphin/Octopus e checkout esistenti.
- Event helper GA4 con queue/dedupe e `sendBeacon`; `funnel_events` e commerce events backend.
- Registry certificazioni, hub e roadmap che possono ospitare in futuro relazioni next-cert centralizzate.
- SEO già strutturata con canonical, hreflang, sitemap, noindex e test di indexability.

## 4. Analytics gaps

| Funnel step | Evento esistente | Evento mancante | Dove implementarlo |
|---|---|---|---|
| Landing | `certification_viewed`, home/resource-specific views | `landing_view` uniforme | Wrapper analytics per home, hub, category, certification, topic/review con `landing_type` |
| Assessment start | Ora `assessment_started` GA + DB all'avvio reale | — | `QuizEngine` |
| Assessment complete | Ora `assessment_completed` GA + DB con score | — | `QuizEngine` |
| Email capture | `assessment_email_submitted`; ora anche `email_captured` DB | Identità anonima comune | Assessment report route + futuro `anonymous_session_id` |
| Signup | `registration_started`, `registration_completed` | Alias non necessario `signup_completed`; manca attribution persistita | Register client/backend registration con source/cert |
| Study start | `study_started` GA + DB al caricamento reale di quiz training/exam o Lab | — | `QuizEngine`, `GuidedCertificationLab` |
| Free limit | `gate_hit` storico + `free_limit_reached` canonico alla transizione quota 1→0 | — | Backend explanation quota; GA nel client |
| Paywall | Eventi specifici + `paywall_viewed` GA/DB per spiegazioni, guide e Lab | Estendere lo stesso contratto a eventuali nuovi gate | Gate esistenti |
| Checkout | `checkout_started` GA Premium/guide; `checkout_created` backend; package commerce | Evento DB uniforme con `purchase_type` | Route create-checkout dopo validazione, mantenendo gli eventi specifici |
| Purchase | `purchase_completed` in webhook Premium/guide/package commerce | Attribution end-to-end | Webhook + correlation id dalla sessione Stripe |
| Second cert | Visite certificazione senza sequenza utente | `second_certification_started` | Backend quando un utente con attività/acquisto sulla cert A inizia studio sulla B |

Eventi aggiuntivi già presenti: CTA Premium e pricing; explanation paywall e gate; rewarded ads intent/start/completed/failed/consume; trial status e checkout; assessment email/result; package select/checkout/fulfillment/refund; Labs view/start/complete; quiz/progress/streak/readiness. Il problema principale è la coerenza analitica, non l'assenza assoluta di telemetria.

## 5. P0 / P1 / P2 roadmap

| Priority | Feature/change | Expected impact | Effort | Risk | Files/components |
|---|---|---:|---:|---:|---|
| P0 | Assessment diretto prima dell'email e prima delle offerte | HIGH | LOW | LOW | `CertificationPage`, `ContextualLeadMagnetBox`, `CertificationPracticeBox` |
| P0 | Tracciare start/completion reali ed email capture con naming funnel | HIGH | LOW | LOW | `QuizEngine`, assessment report route |
| P0 (done) | Unificare `study_started`, `free_limit_reached`, `paywall_viewed` senza rimuovere eventi storici | HIGH | MEDIUM | MEDIUM | analytics helper, QuizEngine, gate backend/UI |
| P0 (done) | Conservare source/cert/assessment score nel redirect signup e tornare allo studio dopo login | HIGH | MEDIUM | MEDIUM | result CTA, register/login/callback |
| P1 | Next-best-action in dashboard da weak area/readiness, con fallback deterministico | HIGH | MEDIUM | MEDIUM | profile client, readiness/weak-area APIs |
| P1 | Assessment topic-aware e persistenza consensuale dopo signup | HIGH | MEDIUM | MEDIUM | question DTO, assessment session, quiz result/stats |
| P1 | Paywall contestuale con progress/score/weak areas e package + Premium dal backend | HIGH | MEDIUM | MEDIUM | gate condiviso, offers/access APIs |
| P1 | Attribution DB end-to-end con anonymous session/correlation id e purchase type | HIGH | MEDIUM | MEDIUM | analytics, funnel schema/routes, Stripe metadata/webhooks |
| P1 | Sopprimere ogni CTA duplicata per owner e dare priorità a Continue studying | MEDIUM | LOW | LOW | certification offers/CTA, profile/study pages |
| P2 | Modello `certification_completion` con criteri verificabili | MEDIUM | HIGH | HIGH | schema, progress service, profile |
| P2 | Relazioni next-cert centralizzate nel registry/config, non nei componenti | MEDIUM | MEDIUM | LOW | certification registry/data |
| P2 | Recommendation e lifecycle email basati su completion/second cert | HIGH | HIGH | HIGH | backend jobs/Brevo, preference/consent model |
| P2 | Evoluzione sobria di streak/mastery/Labs completion | MEDIUM | MEDIUM | LOW | profile/readiness/Labs progress |

## 6. Implemented P0

**Stato: tutti i P0 completati.** Signup handoff ed eventi canonici P0 sono implementati; nessuna attività P1 è stata avviata.

- Le CTA “Scopri il tuo livello” aprono direttamente l'assessment da 10 domande; il form email pre-test non è più nel percorso primario.
- Il lead assessment è stato spostato sopra pacchetti e Premium nella pagina certificazione.
- `assessment_started` viene emesso quando le domande sono caricate, non al click sulla CTA.
- `assessment_completed` viene scritto nel funnel DB con score al termine effettivo.
- `email_captured` viene scritto server-side quando il report assessment viene salvato.
- Il risultato assessment offre “Salva il risultato e continua a studiare”; signup/login mantengono source, cert, topic, score e redirect interno, poi riportano allo studio.
- `study_started`, `free_limit_reached` e `paywall_viewed` sono disponibili come eventi canonici mantenendo i nomi specifici preesistenti per compatibilità storica.
- Nessuna modifica a localizzazioni disponibili, URL canonici, sitemap, entitlement, limiti, prezzi o checkout.

### Production smoke checklist

- Scenario A — anonimo: aprire una certification page, avviare e completare l'assessment, salvare il report, registrarsi dalla CTA del risultato e verificare ritorno a certification/topic con source/cert/topic/score; iniziare il training.
- Scenario B — free: consumare realmente l'ultima spiegazione gratuita, verificare l'evento alla transizione a zero e aprire il gate spiegazioni; controllare anche gli eventi legacy.
- Scenario C — altri gate: aprire una guida in preview e un Interactive Lab limitato; verificare `paywall_viewed` con `paywall_type`/metadata corretti.
- Scenario D — redirect: provare URL esterno, protocol-relative, encoded/backslash, malformato e parametri incompleti; devono essere scartati a favore di una route interna sicura.

### Analytics verification notes

| Evento | Trigger reale | Client/server | Protezione doppio firing | Verifica produzione |
|---|---|---|---|---|
| `assessment_started` | Domande assessment caricate | Client GA + server funnel API | Ref per mount/Strict Mode | GA DebugView e `funnel_events` dopo l'avvio |
| `assessment_completed` | Calcolo finale del risultato | Client GA + server funnel API | Stesso ref del completamento | Score GA/DB uguale al risultato UI |
| `email_captured` | Report assessment salvato con successo | Server | UI blocca reinvii dopo il successo | Un record per singolo invio riuscito |
| `study_started` | Quiz training/exam o Lab realmente caricato | Client GA + server funnel API | Ref per scope/mount | Verificare cert/topic e contesto post-signup |
| `free_limit_reached` | Quota spiegazioni passa da 1 a 0 | Server + conferma client GA | Condizione sulla transizione backend | Consumare l'ultima quota e controllare un solo evento per richiesta |
| `paywall_viewed` | Gate spiegazione, guida o Lab realmente mostrato | Client GA + server funnel API | Ref per mount; guide attende auth | Controllare `paywall_type` e metadata del gate |

## 7. Test results

- `npm run typecheck`: PASS.
- `npm run lint`: PASS; restano due warning non bloccanti già estranei al P0 (`setAdUnlockedQuestionIds` inutilizzato e dipendenza `blockSize`) oltre alla deprecazione di `next lint` in Next 16.
- Test frontend mirati (`conversion-context`, `quiz-explanation-access`, `quiz-blocks`, `quiz-block-review-tracking`, `review-indexability`): 19/19 PASS con il loader TypeScript nativo; il runner `tsx` ha incontrato un errore ambientale `uv_os_get_passwd ENOMEM` prima di eseguire le assertion.
- `npm test` backend: 57/57 PASS, inclusi entitlement, package commerce, Labs e rewarded ads.
- `node --check routes/assessmentReportRoutes.js`: PASS.
- `npm run build`: NON COMPLETABILE nell'ambiente offline; webpack fallisce esclusivamente sul download Google Fonts (`Inter`, `Space Grotesk`) con `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, dopo un typecheck riuscito.

## 8. Remaining risks

- Le migrazioni descrivono lo schema, ma senza interrogare produzione non si può confermare feature flag, offerte attive, quantità di traffico o qualità reale degli eventi.
- Il trial è trattato come Premium dai middleware: l'audit non certifica che ogni endpoint di download applichi una policy trial-specifica.
- `funnel_events` non ha nel codice osservato un id anonimo condiviso, perciò i tassi individuali cross-device/cross-signup non sono ricostruibili con affidabilità.
- `assessment_started` affianca `diagnostic_quiz_started`, che resta emesso per continuità storica.
- La route `/free-test` resta disponibile per campagne legacy, ma non è più il percorso primario dalle certification page.
- AdSense nel frontend osservato è limitato alla verifica account; rewarded ads sono implementati e feature-flagged. Non è stata trovata una matrice UI di display ads per anonymous/free/trial/package/Premium.

## 9. Next best action

Osservare i dati reali in produzione prima di iniziare P1 attribution end-to-end. L'attribution con `anonymous_session_id` e Stripe rimane P1 e non è stata avviata.
