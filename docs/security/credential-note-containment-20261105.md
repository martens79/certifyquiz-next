# Contenimento degli appunti di credenziali — 5 novembre 2026

## Ambito e stato

Verifica dei soli nomi, riferimenti nel codice e artefatti locali; nessun contenuto dei tre file sospetti o valore di configurazione letto, stampato o usato. Nessuna chiamata autenticata ai servizi, modifica di account, rotazione, merge o deploy. Cronologia Git invariata. I due branch originali e i commit `426bac790fa7dda604a7e437c8ea5ff90eb38d90` e `0b12874e50413dff3ac02aac76b469cb65e0f400` restano intatti.

Il controllo con percorsi Git delimitati NUL conferma tre file sotto `types/`, presenti in main `15b970a` e in entrambi i commit originali. La precedente classificazione di un file come appartenente alla radice dipendeva dalla rappresentazione quotata dei nomi Git ed è corretta da questa verifica. I nomi reali non sono riportati perché possono incorporare credenziali.

Sul branch di pulizia le tre voci sono eliminate dal nuovo albero Git. Aggiunte regole mirate a `.gitignore` e `.vercelignore` per appunti di login e configurazioni usate come nomi di file sotto `types/`. Nessuna esclusione generale dei `.txt` o delle dichiarazioni TypeScript. Il nuovo controllo CI esamina solo nomi tracciati delimitati NUL e stampa esclusivamente conteggi. Non è uno scanner del contenuto e non sostituisce la rotazione.

## Artefatti e differenza fra rischi

- Output Next locale landing: 1.239 file non di cache esaminati; nessuna copia dei tre file e nessun riferimento letterale ai loro nomi nei bundle browser, output server e altri output.
- Output Next locale base/main: 1.233 file non di cache esaminati; stessi esiti.
- Per ciascun output sono stati interpretati 202 manifest `.nft.json`, risolvendo i percorsi: zero inclusioni dei tre file. Nessuno dei tre si trova sotto `public/`.
- Si tratta degli output Next già disponibili con fixture di test, non di un pacchetto prodotto da Vercel e non di una verifica di deployment remoto. Nessun output del fix Annulla è stato compilato: i suoi file sospetti sono presenti nell'albero Git ma esclusi dal checkout locale; non gli viene attribuita la verifica dei bundle landing.
- Senza leggere le credenziali non è possibile cercarne i valori arbitrari negli output: i risultati provano assenza dei file e dei riferimenti identificati, non assenza assoluta di ogni segreto o dato equivalente.

Il rischio preesistente è l'accesso ai blob e ai nomi sensibili nella cronologia Git e nelle copie già distribuite. La cancellazione dal nuovo albero non revoca una credenziale e non elimina i blob storici.

Il rischio aggiuntivo di una preview è il trasferimento dei sorgenti a un altro servizio e la loro accessibilità tramite strumenti, log o viste sorgente secondo le protezioni del progetto. Non coincide automaticamente con la pubblicazione dei tre file sul sito. Nei bundle locali esaminati non emerge tale esposizione diretta; non sono state verificate le protezioni remote del progetto. La rimozione dal commit distribuibile e `.vercelignore` riducono il rischio aggiuntivo dei file, senza risolvere quello della cronologia.

Vercel documenta `.vercelignore` come esclusione dei file dal caricamento: https://vercel.com/docs/deployments/vercel-ignore . Le protezioni di accesso a sorgenti e log sono distinte: https://vercel.com/docs/builds/build-features . Non è stato invocato il comando di deploy, neppure per creare preview.

Le regole Git e Vercel sono state provate sui tre nomi reali senza mostrarli: tutti coperti. La verifica Vercel usa il parser locale di regole gitignore, non una simulazione ufficiale dell'intero pacchetto Vercel.

## Servizi e variabili identificate dal codice

| Servizio | Evidenza nel codice | Variabili | Azione sulle credenziali |
|---|---|---|---|
| Certifier | Backend `quiz_project/services/certifierClient.js`, richiamato da `services/badgeService.js` per `issueBadge`; `server.js` controlla la presenza della chiave | `CERTIFIER_API_KEY`; parametri non segreti `CERTIFIER_API_BASE`, `CERTIFIER_VERSION` | La chiave associata all'appunto va trattata come potenzialmente compromessa e sostituita/revocata. Non è stata confrontata con la configurazione attiva. |
| Sanity | Frontend `src/lib/sanity.server.ts` usa un token solo server; `src/lib/sanity.client.ts` usa parametri pubblici senza token | `SANITY_READ_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` | Il nome dell'appunto identifica `VITE_SANITY_API_VERSION`, che non è una credenziale. Non sono emersi usi di `VITE_SANITY_*` nel codice tracciato dei tre progetti esaminati. Se l'appunto contiene anche token, vanno revocati/sostituiti; la sola intestazione non permette di confermarlo. |
| Login non attribuito | Nome di appunto di login sotto `types/`; il codice non permette di collegarlo con certezza a un servizio/account | Nessun nome di variabile attribuibile con certezza | Occorre identificare privatamente l'account e sostituire la password o revocare gli eventuali token contenuti; non inviare i valori in chat. |

Ricerca limitata al codice tracciato di `certifyquiz-next`, `quiz_project` e `blog-certifyquiz`; configurazioni e valori non letti. Parametri di progetto, dataset e versione API non richiedono rotazione in quanto tali. Non viene estesa la lista delle credenziali da ruotare a servizi non collegati da evidenze.

## Coordinamento manuale indispensabile

1. Identificare privatamente nell'appunto login il servizio/account e nell'appunto Sanity gli eventuali token, senza esportarne valori o nomi sensibili in ticket o chat. Registrare solo servizio, tipo di credenziale e stato della revoca.
2. Per `CERTIFIER_API_KEY` e per gli eventuali token ancora usati: creare il sostituto con i permessi necessari; aggiornare tramite i gestori di segreti tutti i consumatori effettivi (backend per Certifier, server frontend per `SANITY_READ_TOKEN`, eventuali consumer esterni identificati manualmente); applicare l'aggiornamento con la procedura operativa del servizio e verificarne il funzionamento. Se il servizio consente sovrapposizione, revocare subito dopo la verifica la chiave precedente; altrimenti coordinare una breve interruzione e revocare/sostituire nello stesso intervento. Non lasciare la vecchia chiave valida come rollback. Controllare gli eventi di uso pertinenti, senza registrare valori.
3. Per password di login: cambiare la password dell'account identificato e invalidare le sessioni/token correlati secondo le possibilità del servizio. Se riutilizzata, sostituirla anche sugli account che la condividono.

La rimozione può essere revisionata indipendentemente dalla rotazione; non dimostra che questa sia avvenuta. Prima di consentire preview delle due modifiche, il commit effettivamente distribuibile deve includere la pulizia: i due branch originali, lasciati intatti, contengono ancora i file. È possibile applicare il commit di pulizia su nuovi branch derivati per preservare gli originali. Nessuna di queste operazioni remote è stata eseguita.

## Revisione senza esporre le eliminazioni

Il normale diff delle tre eliminazioni e il riepilogo dei loro nomi possono riproporre i segreti storici: non esportarli in report, patch, messaggi o log. La documentazione e i file aggiunti/modificati si possono revisionare separatamente dalle eliminazioni. Per queste ultime verificare soltanto tre voci rimosse e assenza dei tre percorsi nel nuovo albero mediante controlli a output sanitizzato. Nessuna riscrittura della cronologia è proposta.

Test eseguiti: due casi Node per distinguere nomi vietati da file legittimi; controllo sul nuovo indice senza nomi sospetti; verifica che tutti i tre nomi reali siano intercettati sia dalle regole Git sia dalle regole di esclusione Vercel e dalla guardia CI. Nessuna modifica al comportamento runtime: non serve ricompilare l'app per questi file di testo e controlli di repository.
