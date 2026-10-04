# Filtro dei client automatizzati sul funnel DB

Data: 2026-10-04. Scope: solo `funnel_events` scritto dal client (`trackFunnelEvent`).
Nessuna modifica SEO, redirect, SQL, backend o GA4.

## Problema

I crawler che eseguono JavaScript renderizzano le pagine e scatenano gli eventi di
esposizione. Ogni visita di un bot senza `localStorage` diventa un nuovo `visitor_id`
con un solo evento. Misura del 2026-10-04: tutti i 104 visitatori anonimi con
`pricing_viewed` da `source=review_gate` avevano esattamente 1 evento in 28 giorni,
mentre i click reali sullo stesso pulsante erano circa 7. Picco 30/09-02/10: circa
1,03 eventi per visitatore contro 1,5 nei giorni normali.

## Punti che emettono i quattro eventi

| Evento | Dove | Destinazione |
|---|---|---|
| `study_started` | `components/quiz/QuizEngine.tsx` (~997, 1009) | GA4 + DB |
| `study_started` | `features/labs/GuidedCertificationLab.tsx` (74) | solo GA4 |
| `assessment_started` | `components/quiz/QuizEngine.tsx` (~967, 972) | GA4 + DB |
| `paywall_viewed` | `components/quiz/QuizEngine.tsx` (~3327, ~3390) | GA4 + DB |
| `paywall_viewed` | `components/reviews/ReviewPremiumContent.tsx` (108, 121) | GA4 + DB |
| `paywall_viewed` | `components/guides/GuideAccessGate.tsx` (110, 120) | GA4 + DB |
| `paywall_viewed` | `features/labs/GuidedCertificationLab.tsx` (75) | solo GA4 |
| `pricing_viewed` | `app/(marketing)/pricing/PremiumComingSoonView.tsx` (631, 641) | GA4 + DB |

Tutte le scritture DB passano da `trackFunnelEvent` / `trackFunnelEventOnce`
(`src/lib/analytics.ts`): il filtro sta solo li'.

Fuori dal punto di filtro, per scelta di scope: `PwaInstallPrompt.tsx` scrive su
`/api/backend/admin/funnel-event` direttamente (eventi PWA, non esposizioni di funnel);
gli eventi GA4 (`trackEvent`) non cambiano.

## Logica del filtro (`src/lib/automated-client.ts`)

Un evento NON viene scritto se almeno una condizione e' vera:

1. `navigator.webdriver === true` (solo il booleano `true`).
2. `navigator.userAgent` contiene un token di bot o strumento noto, da un elenco
   esplicito nel file (Googlebot, bingbot, GPTBot, ClaudeBot, AhrefsBot, HeadlessChrome,
   Lighthouse, PageSpeed, python-requests, curl, ...).
3. `navigator.userAgent` ha la forma `<nome>bot/<cifra>` (es. `ExampleSearchbot/3.2`).
4. `navigator.userAgent` contiene `crawler`, `spider` o `scraper` **solo nella forma
   `<parola>/<cifra>`** (es. `Baiduspider/2.0`, `Sogou web spider/4.0`,
   `SomeCrawler/1.0`). Le parole nude non bastano: potrebbero comparire nel nome di un
   dispositivo o di un'app. Il token `sogou` da solo non e' nell'elenco: Sogou Mobile
   Browser (`SogouMobileBrowser/...`) e' un browser reale.
5. Client Hints: `navigator.userAgentData.brands` contiene un brand con "headless".

Un segnale mancante, vuoto o di tipo inatteso NON e' un bot: l'evento passa.
Nel dubbio si preferisce lasciar passare un bot piuttosto che perdere un utente.

Privacy: lo user agent viene solo confrontato nel browser. Non viene inviato, non viene
salvato nel DB, non entra nel payload ne' nei metadata.

## Limiti noti

- I dati storici restano contaminati: il filtro vale solo dal deploy in poi.
- Bot che si presentano come browser normali e non espongono `webdriver` non vengono
  riconosciuti. Crawler con user agent vuoto passano di proposito.
- Gli eventi GA4 e `PwaInstallPrompt` non passano da qui. Gli eventi server-side
  (webhook, `free_limit_reached`, `checkout_created`) non sono filtrati.
- `study_started`, `assessment_started`, `paywall_viewed` e `pricing_viewed` restano
  eventi di esposizione (scattano al caricamento) e non misurano interesse.

## Criterio di successo dopo il deploy

- Anonimi con un solo evento su `pricing_viewed` da `source=review_gate`: il numero
  deve scendere rispetto agli ultimi 28 giorni (104 al 2026-10-04).
- Piu' in generale, il rapporto tra eventi di esposizione e azioni reali
  (`premium_clicked*`, `post_gate_question_answered`, `checkout_created`,
  `purchase_completed`) da rileggere sul periodo successivo.
