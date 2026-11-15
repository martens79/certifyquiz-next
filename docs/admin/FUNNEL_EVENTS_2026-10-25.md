# Admin: Funnel Events come vista iniziale

## Scope e riferimenti

Frontend di partenza: `c99aa823cb218130a29180b477f72e57b0cb9723` (`main`, checkout inizialmente pulito). Nessun `AGENTS.md` nel repository o nelle directory interessate; lette le convenzioni di `CLAUDE.md`.
Backend ispezionato in sola lettura: `a7e337f035c4ce35d742d50e88a4231d663a1299`, `routes/adminRoutes.js`. Nessun accesso Railway necessario.

`/admin` apre direttamente Funnel Events. Panoramiche e lead (inclusi Hot Leads e i vecchi export), Feedback, Abbonamenti, Aziende e Notifiche push restano nel menu secondario, montati solo quando selezionati. La vecchia dashboard è stata estratta in `AdminOverviewClient.tsx`, mantenendone le funzioni. Il suo caricamento legacy rimane aggregato; un suo errore non può bloccare la nuova vista eventi.

## Contratto verificato

La schermata eventi usa esclusivamente `GET /api/backend/admin/funnel-events` con `page`, `limit=50`, `q`, `event`, `cert`, `lang`, `date`. Il backend ordina `created_at DESC, id DESC`, limita e pagina sul server. Il client usa la pagina effettiva restituita dal backend, anche quando la pagina richiesta non esiste più.

Nessuna chiamata a summary, overview, leads, Hot Leads o paywall serve per visualizzare o filtrare gli eventi. L'export è un'azione esplicita che riusa `fetchFunnelExportCsv` e `/funnel-events/export`, con i filtri correnti, snapshot e modalità pseudonima predefinita; la modalità con email resta separata.

Ogni modifica dei filtri azzera la pagina nella stessa operazione di stato. Cleanup e AbortController annullano la richiesta precedente; una chiave della richiesta impedisce di mostrare dati di un filtro/token precedente anche prima del cleanup. Un export completato dopo cambio filtri o smontaggio non genera un download obsoleto.

## Limiti esistenti, senza ampliamento backend

- La tabella può mostrare l'email storica o recuperata da `users`. La ricerca `q` SQL interroga solo `funnel_events.email`, oltre a cert/topic/event/lang; non cerca nome, user ID o email recuperata da `users`. Limite dichiarato nell'interfaccia, senza promettere ricerca utente completa.
- L'endpoint lista non espone un catalogo globale di eventi/certificazioni. I filtri consentono inserimento libero del valore tecnico esatto con suggerimenti dai nomi noti e dalla pagina corrente. Non viene chiamato summary per popolare i suggerimenti.
- Senza email l'API non consente di distinguere con certezza visitatori anonimi e account non risolti: etichetta «Anonimo / non identificato», senza identità inventate. Session ID e payload non vengono mostrati.
- Dettagli limitati a topic, score e ID evento tramite proiezione esplicita. Nessun rendering generico di metadata, payload, token o campi aggiunti in futuro.
- Orari con offset convertiti in `Europe/Rome`; timestamp senza offset conservati con avviso «fuso non specificato». I periodi (`today`, `7d`, `30d`) seguono il clock del backend, come prima.
- La voce acquisto è etichettata come evento registrato: questa pagina non attesta riconciliazione o incasso Stripe.

## Verifiche

- Typecheck e build Next.js in ambiente isolato: PASS; rewrite production puntato a loopback non operativo, ID Analytics vuoti.
- Test unit/component e contratti export/analytics pertinenti: 24/24 PASS.
- ESLint dei file interessati: nessun errore; due warning già presenti nel codice della vecchia dashboard (dipendenza effect e funzione inutilizzata), conservati nell'estrazione.
- `npm run lint` generale: FAIL preesistente in `src/components/quiz/QuizEngine.tsx:973` (`prefer-const`, `canRestore`); file estraneo non modificato.
- Verifica visiva desktop 1440×1000 e mobile 390×844: PASS, ispezione screenshot e nessun overflow orizzontale; tabella trasformata in schede su mobile.
- Test browser: 8/8 PASS. I test in `tests/admin-funnel-events.spec.ts` usano auth e dati sintetici e rifiutano richieste esterne. Verificano viewport desktop/mobile, assenza API accessorie, ricerca/paginazione, stati vuoti/401/403/500, ruolo non-admin e ritorno dalle panoramiche fallite.

Nessuna modifica a tracking, consenso, pagamenti, Stripe, DB, migrazioni o privilegi. Nessun merge o deploy eseguito. Prima dell'eventuale rilascio resta lo smoke autenticato con eventi reali, dopo approvazione separata del merge.

## Riproduzione locale

```sh
npx eslint src/app/admin/AdminClient.tsx src/app/admin/FunnelEventsClient.tsx src/app/admin/AdminOverviewClient.tsx tests/admin-funnel-events.test.tsx tests/admin-funnel-events.spec.ts
TSX_TSCONFIG_PATH=tsconfig.test.json node --import tsx --test tests/admin-funnel-events.test.tsx tests/funnel-export.test.ts tests/admin-analytics.test.ts
# Avviare il server locale con rewrite isolato come nella CI frontend-build.
E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/admin-funnel-events.spec.ts --project=chromium
```

La CI dedicata `Admin Funnel Events` esegue typecheck, lint dei file interessati e i 24 test. La CI esistente `Isolated frontend build` controlla la build completa.
