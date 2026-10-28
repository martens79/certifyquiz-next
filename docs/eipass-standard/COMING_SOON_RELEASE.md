# EIPASS Standard — release "coming soon": rapporto di collaudo

Data: 28/10/2026. Autorizzazione del proprietario: pubblicare **la sola landing** `/it/certificazioni/eipass-standard`; non il sistema quiz né le migrazioni backend. Base: `origin/main` a9155fc (nessuna modifica intervenuta su main dalla PR #169 originale).

## Cosa è pubblico e cosa no

| Superficie | Esito atteso | Come è garantito |
|---|---|---|
| `/it/certificazioni/eipass-standard` | **200**, `index, follow`, canonical autoreferenziale, nessun hreflang | `publicationStatus: "coming_soon"` + `eipassStandardMetadata` |
| Stessa landing in EN/FR/ES (`/certifications/…`, `/fr/…`, `/es/…`) | 404 | `launchScope.languages = ["it"]` |
| Pagine topic/modulo, ripassi per topic, scenari, indice ripassi, quiz, quiz misto, esercitazione a tempo, hub | 404 (stato HTTP vero, non pagina "soft") | `topic-page.ts`, `TopicReviewPageShell`, `ReviewsCertificationIndexPage`, 4 pagine scenari, `quiz/[slug]/layout.tsx` |
| Sitemap | **una sola** voce Standard: la landing italiana | voce statica, solo `lang === "it"`, mai dal backend |
| Catalogo, home, categorie | assenti | `isPubliclyListed` esclude `planned` e `coming_soon` |
| Landing EIPASS 7 Moduli User (solo italiano) | un link contestuale "In preparazione" | `EipassStandardPointer` |

Stato `coming_soon` ≠ `planned`: `planned` resta 404 ovunque; `coming_soon` pubblica solo la landing. Nessuna certificazione né riga DB, nessun backend, nessun import, nessuna dipendenza dalla PR backend #149.

## Contenuto (originale, nessuna dichiarazione di disponibilità)
- Messaggio "Quiz di preparazione in arrivo" (blocco in testa, badge, descrizione, FAQ).
- Che cos'è EIPASS Standard; rapporto con il DigComp 2.2 (cinque aree; i tre moduli Office all'area della creazione di contenuti); **differenze rispetto a EIPASS 7 Moduli User**; che cosa sta preparando CertifyQuiz; FAQ (4).
- Sette moduli come **elenco informativo senza link** (nomi e ordine ufficiali). Il programma ufficiale **non** è riprodotto (nessun elenco di argomenti/attività). Nessun logo o marchio EIPASS: illustrazione SVG originale.
- Link: pagina ufficiale EIPASS Standard (nuova scheda, `noopener noreferrer`) e EIPASS 7 Moduli User, con la dicitura "percorso distinto".
- Rimossi per Standard (blocchi lato client che prometterebbero ciò che non esiste): griglia "Materiale di studio", offerte pacchetto, CTA Premium ("Preparazione completa"). Il blocco Premium appariva **solo dopo l'idratazione**: lo ha scoperto il controllo nel browser, non lo smoke SSR; ora c'è un test Playwright che lo impedisce.
- **Free/Premium**: nessuna divisione dei moduli o delle domande e nessun limite toccato. Un test verifica che i file della release non contengano logica Premium/Free.

## SEO
- `index, follow`; canonical `https://www.certifyquiz.com/it/certificazioni/eipass-standard`; nessun `rel=alternate hreflang` (nessuna altra lingua esiste); title 56 caratteri, description 160; Open Graph/Twitter con immagine generata da `/api/og` (nessun logo EIPASS).
- Le regole di indicizzazione delle altre certificazioni **non cambiano** (`isCertificationIndexable`, `ROLLOUT_NOINDEX…` invariati; due test esistenti riportati al valore originale dopo la bozza #169).
- Sitemap: runtime verificato con la funzione reale `sitemap()` e backend/Sanity simulati: la landing compare **una volta**, nessun altro URL Standard, gli URL delle altre certificazioni restano.

## Analytics
GA4 registra le visualizzazioni (consenso, `anonymize_ip`, niente segnali Google); verificato in Chrome (vedi tabella). In più l'evento già esistente `certification_viewed` parte con `certification_slug = eipass-standard`. Evento `eipass_standard_link_click` (`link_target`, `source_page`) sui soli link reali, nessun form o raccolta email. Report e ricette in [ANALYTICS_REPORT.md](ANALYTICS_REPORT.md).

## Verifiche eseguite (locale, nessun deploy) — HEAD verificato alla chiusura nel messaggio finale
| Controllo | Esito |
|---|---|
| `tsc --noEmit` | PASS |
| Test unitari (intera suite, `node --import tsx --test`) | **673/673** |
| Lint dei file toccati | PASS |
| Build di produzione isolata | PASS |
| Smoke di routing/SEO in produzione isolata (`run-eipass-standard-coming-soon.mjs`) | **85/85**: landing 200 con meta/canonical/link/contenuto; ogni altra URL Standard 404 in 4 lingue; catalogo, home, robots puliti; link contestuale presente |
| Regressione EIPASS 7 Moduli User (`run-eipass-editorial-ssr.mjs`) | **44/44** |
| Browser Chrome desktop 1440×1000 e mobile Pixel 7 (Playwright, 5 test × 2) | **10/10**: DOM idratato senza CTA Premium/quiz/pacchetti, nessun link a moduli, nessuno scroll orizzontale, nessun evento senza consenso, evento con consenso, link contestuale funzionante, 404 reali |
| Sitemap runtime (funzione reale con backend simulato) | PASS (test) |
| GA4 con ID di prova e `gtag.js` simulato (Chrome) | **PASS**: con consenso `dataLayer` riceve `consent update: granted`, `config` con `page_location` = landing (da cui `page_view`) e l'evento esistente `certification_viewed` con `certification_slug = eipass-standard`; senza consenso: nessun `gtag`, nessun evento, nessuna richiesta esterna |

## Limiti
- Il browser verifica il rendering e gli eventi con analytics simulato: i dati reali di GA4 e Search Console si vedono solo in produzione, dopo il consenso degli utenti.
- Il collaudo "live" è una fase separata, dopo il rilascio (stato nel messaggio di consegna).
- Nessun test su Safari/Firefox.

## Rollback
Revert della PR (la landing torna 404 e sparisce dalla sitemap alla rigenerazione, fino a un'ora). Nessun dato da ripristinare.
