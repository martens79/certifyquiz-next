# CCNA Study Path — frontend MVP A/B

Nuova pagina `/{it|en|fr|es}/study-path/ccna`, collegata dalla pagina CCNA.
Diagnostico gratuito di 30 domande, autenticazione esistente, salvataggio esplicito
a ogni “Salva e continua”, ripristino dal server, punteggio e priorità per topic.
La selezione corrente non ancora salvata può andare persa chiudendo la scheda.
La pagina è noindex e distingue il risultato diagnostico dalla Readiness e dal mock.

L’interfaccia non valuta né decide accessi commerciali. Consuma esclusivamente
`/study-path/ccna` tramite `apiFetch`, con refresh/sessione esistenti. API 404/503
producono un messaggio di indisponibilità: nessun fallback verso il vecchio
assessment da 10 domande. Il backend deve essere rilasciato prima del frontend.
Il branch di questa PR è escluso dai deploy automatici in `vercel.json`.

Account o lingua diversi azzerano immediatamente la vista; risposte di richieste
obsolete non vengono mostrate alla nuova identità. Errori di rete preservano le
selezioni locali e consentono retry; un nuovo diagnostico è un’azione esplicita.
Il server protegge i tentativi con UUID e mantiene il risultato idempotente.

Il risultato indica chiaramente il primo argomento, corrette/totale, campione
insufficiente o area da rafforzare. La Fase C è soltanto descritta come futura:
nessun piano giornaliero, ripasso mirato o sblocco Premium viene implementato.
Domande FREE e Readiness rimangono disponibili secondo le regole esistenti.

Verifiche: TypeScript e lint sui nuovi file; 5 test Chromium (suite + quattro
lingue) sul componente reale, viewport mobile 390×844, con API/autenticazione
simulate: 30 risposte, ripristino dopo reload, risultato server, persistenza
della vista risultato, indisponibilità 503 e link login del guest.
Eseguire `node --test tests/ccna-study-path.browser.cjs` con Chromium Playwright
installato. Il bundle di test usa esbuild fornito dalle dipendenze di sviluppo.
La CI dedicata installa il browser. Questo non è un test end-to-end dell’intera
app Next con login/backend reali; il backend companion verifica separatamente
HTTP/MySQL e valutatore reale nelle quattro lingue.

Per algoritmo, contratto, protezione del namespace JSON senza migration,
regressioni e rischi residui: `docs/ccna-study-path-mvp.md` nella PR backend.
Nessun merge, deploy o accesso ai dati Production effettuato.

Prossima azione consigliata: collaudo integrato delle due PR su ambiente isolato
con login reale, ripresa cross-device e copertura del catalogo, prima del rilascio.
