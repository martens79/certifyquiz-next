# PR #165 — Chiusura del difetto di copy nel quiz misto

Il follow-up di `792180f` modifica esclusivamente la presentazione EIPASS del quiz misto. L’introduzione descrive domande miste dai moduli disponibili del percorso di sette moduli, precisando che la disponibilità varia per lingua. Non attribuisce equivalenza con struttura, difficoltà, durata o quantità di quesiti dell’esame ufficiale.

Il bullet condiviso con il richiamo all’ufficiale non viene renderizzato per EIPASS. Il conteggio dell’esercitazione conserva la specifica attuale, ma ha un’etichetta di esercitazione a tempo. Le stringhe e il comportamento delle altre certificazioni rimangono invariati, inclusa l’esclusione Apple già presente. Nessun motore, ID, slug, URL, domanda, associazione, entitlement o database viene modificato.

## Regressioni specifiche

`tests/eipass-mixed-copy.test.tsx` renderizza il vero componente del quiz misto con boundary sintetici in IT/EN/FR/ES: verifica introduzione EIPASS e assenza dei claim, conservazione della specifica attuale, copy non EIPASS e precedente esclusione Apple. Sono 12 casi, aggiunti ai 141 contratti/regressioni precedenti.

Lo smoke SSR include ora anche mixed e mock nelle quattro lingue: 44 route complessive. Il controllo del mixed opera sul testo senza script per evitare che stringhe legacy non renderizzate nel bundle siano confuse con il testo visibile.

## Browser isolato, senza preview pubblica o deploy

Il job `browser` del workflow EIPASS usa Google Chrome già presente nel runner GitHub Actions Ubuntu 24.04, ne registra la versione, avvia Next e il backend di fixture nello stesso runner e usa `playwright.eipass.config.ts`. I progetti sono Chrome desktop 1440×1000 e Chrome con emulazione Pixel 7. Non vengono esposti servizi, porte, tunnel, credenziali o dati privati. Per riprodurre il browser localmente serve Google Chrome installato; non è previsto un download implicito di browser.

Le 32 prove previste coprono, per ciascuna lingua e ciascun dispositivo:

- Landing, sette topic e ritorno alla landing, canonical, assenza JSON/ripassi non disponibili, disponibilità dei link quiz e ordine dei moduli.
- Quiz topic con risposta e spiegazione, quiz misto senza claim, esercitazione a tempo con avvertenza, controllo dell’overflow.
- Login sintetico FREE con ritorno al mixed e gate spiegazioni a quota esaurita.
- Login sintetico Premium con ritorno al mixed e spiegazione resa disponibile dalla fixture.

Il trasporto API è intercettato nel contesto di test; richieste esterne vengono bloccate. Le identità e le credenziali sono fittizie e non autenticano contro un servizio reale. Ogni richiesta di pagamento è rifiutata e contata. Nessun acquisto reale o scrittura al database è possibile attraverso questo test.

Questi sono test browser dell’applicazione con backend sintetico: non costituiscono verifica del backend di autenticazione o di account reali. Nessun account non produttivo reale è stato fornito. Gli esiti effettivi e l’HEAD verificato sono riportati nella descrizione della PR e nei risultati del workflow, senza anticipare PASS prima dell’esecuzione.

## Riproduzione

Usare la configurazione isolata descritta nel README della release. Per il job browser il backend origine è `http://127.0.0.1:8459`; per la build locale priva di backend può essere `http://127.0.0.1:9`. Non usare variabili o token di produzione.

```sh
TSX_TSCONFIG_PATH=tsconfig.test.json node --import tsx --test tests/eipass-user-release.test.tsx tests/eipass-mixed-copy.test.tsx tests/quiz-explanation-access.test.ts tests/topic-premium-required.test.tsx tests/topic-indexability-language.test.ts tests/mock-complete-link.test.tsx tests/premium-click-origin.test.ts tests/checkout-intent.test.ts tests/auth-logout.test.ts tests/isc2-practice-coverage.test.ts tests/pmp-practice-coverage.test.ts
```

Dopo build isolata, `node scripts/run-eipass-editorial-ssr.mjs` esegue lo smoke HTTP senza browser. Per il browser, con fixture e Next già avviati come nel workflow: `npx --no-install playwright test -c playwright.eipass.config.ts`. L’artifact `eipass-browser-evidence` contiene risultati, screenshot e trace degli eventuali fallimenti.

La protezione dal deploy automatico del branch resta attiva. Il follow-up non autorizza merge o deploy.
