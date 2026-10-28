# SEO 404 remediation — Sprint 1

La PR ripara il redirect che trasformava le modalità quiz `mixed` e `mock-exam` di Data Analytics Foundations in topic SEO inesistenti. I vecchi URL di topic continuano a ricevere il 301 esistente, conservando le query. La regola difettosa è attribuita da `git blame` a `fbe8ad73` (18/06/2026); non è una regressione introdotta da questo sprint.

Base di lavoro: `origin/main`, `d98a3a2`. Il checkout usato dall’audit era un vecchio branch Apple: questo intervento parte dal main aggiornato e non ne copia le differenze.

## Redirect

25 mapping esatti aggiunti. Le 43 decisioni individuali, con HTTP e metadata live, sono in `redirect-review.csv`; `redirect-destinations.json` conserva le risposte metadata delle 34 destinazioni proposte.

18 esclusi: 15 destinazioni ancora noindex; 2 passaggi fra Google Cloud (certificazione 31) e Google Cloud Digital Leader (35) senza prova della migrazione; 1 hub Oracle senza canonical. Nessuna modifica per rendere indicizzabili destinazioni escluse e nessun redirect a homepage/catalogo.

Le destinazioni accettate sono 200 diretti con canonical esatto e `index, follow`. Gli argomenti senza hreflang pubblicati conservano questa policy: non sono stati creati cluster nuovi né inventate traduzioni. Per EIPASS le quattro landing del cluster sono state lette pubblicamente: 200, canonical localizzati e hreflang reciproci; EIPASS 7 Moduli User resta distinto da EIPASS Standard.

Le equivalenze tematiche sono confrontate con registry e topic pubblici: stessi argomenti PM, sicurezza/dati/trasformazione Digital Leader, AI generativa/etica e servizi/casi d’uso AWS. Il mapping EIPASS è esclusivamente l’alias storico della certificazione ID 3. Non vengono rinominati slug validi o modificati ID/associazioni.

## Casi editoriali

`editorial-deferred.csv` contiene tutti i 31 URL P1 provvisori, certificazione, causa documentata, assenza di equivalente univoco e decisione recupero/dismissione ancora richiesta. Nessun contenuto è stato cambiato. I dati Performance non disponibili sono dichiarati tali: non significano zero traffico. Periodo storico disponibile nell’audit: 09/09–06/10/2026; l’export Coverage del 26/10 non contiene metriche di traffico.

## Verifica funzionale e isolamento

Le API pubbliche anonime confermano 120 domande IT disponibili; GET training limit=2 restituisce 2 domande e GET assessment 10, tutte con quattro risposte. Nessuna POST è stata inviata al backend live.

I test browser eseguono le pagine Next reali su una build locale e intercettano tutte le chiamate API client, incluse le verifiche delle risposte. Controllano risposta/spiegazione/avanzamento in training, CTA assessment e endpoint certificazione 50, modalità mock-exam, routing HTTP dei 25 redirect, metadata delle landing prioritarie e sitemap. La fixture SSR è solo loopback/read-only; il CMS fittizio è isolato da un preload di test con controllo delle env.

Le destinazioni topic non sono inventate nella fixture SSR: il test HTTP locale ammette il 404 della fixture solo per verificare l’assenza di ulteriori redirect; il loro 200 indicizzabile è provato separatamente dalla verifica live e dal contratto sul relativo snapshot. Non presentare la fixture come collaudo live end-to-end delle domande o degli abbonamenti.

Workflow riproducibile: `.github/workflows/seo-404-sprint1.yml`. Contratti: `node --import tsx --test tests/legacy-redirects.test.ts tests/certification-indexability.test.ts tests/topic-indexability-language.test.ts tests/sitemap-backend-calls.test.ts tests/certifications-list-metadata.test.ts tests/ccst-cybersecurity-metadata.test.ts tests/microsoft-ai-metadata.test.ts tests/eipass-standard-sitemap.test.ts` con `TSX_TSCONFIG_PATH=tsconfig.test.json`. Browser: `npx playwright test -c playwright.seo404.config.ts` dopo la build isolata descritta nel workflow.

## Checklist prima del merge/rilascio

- [ ] CI dell’HEAD della PR verde; nessun risultato di un commit precedente usato come approvazione.
- [ ] Preview, se disponibile: training mixed, risposta e avanzamento; CTA assessment e mock-exam senza redirect verso certificazioni.
- [ ] I 25 URL danno un solo 301 e le destinazioni rimangono 200, indicizzabili, self-canonical e nella stessa lingua.
- [ ] EIPASS mantiene il cluster reciproco; assenza di nuovi hreflang incoerenti.
- [ ] Nessuna sorgente obsoleta o route quiz aggiunta alla sitemap; nessuna variazione a noindex o ai generatori SEO.
- [ ] I 18 esclusi e i 31 casi editoriali restano fuori dalla patch.
- [ ] Nessuna modifica a backend, database, domande, pagamenti o autenticazione.
- [ ] Autorizzazione esplicita dell’utente per il rilascio. Nessun merge/deploy manuale eseguito da questa attività.
