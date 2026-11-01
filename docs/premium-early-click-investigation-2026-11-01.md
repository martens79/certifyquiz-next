# Click precoce perso prima dell'idratazione — indagine 2026-11-01

Contesto: nel collaudo `checkout-resume` il test "click subito dopo l'apertura, utente ancora in caricamento ma con token"
fallisce intermittentemente, anche su `main`. Questa nota documenta cosa accade davvero. **Nessuna modifica al codice
dell'app in questa indagine.**

## Cosa succede (causa accertata)

La pagina Premium e' un client component renderizzato anche lato server (SSR). L'HTML mostra pulsanti (piani, CTA) prima
che il JavaScript sia stato eseguito. Un click su un `<button onClick>` fatto **prima che React avvii l'idratazione** non ha
nessun handler: viene perso in silenzio, senza feedback. Dopo che `hydrateRoot` e' partito, React mette in coda i click
discreti e li **riproduce** a idratazione finita.

Non e' un ricaricamento: il "secondo NAV" visto nei test coincide con l'idratazione ed e' il `history.replaceState` che
l'App Router di Next esegue al mount (compare ~100 ms prima che `__reactProps` sia presente sul pulsante).

## Misure (build di produzione, commit bf6bc01, `next start`, mock del backend, nessun Stripe)

Sonda: `scripts/early-click-probe.cjs`. Effetto osservabile senza checkout: `aria-pressed` del piano annuale.

| Condizione | Click | Esito | Finestra DOM → idratazione |
|---|---|---|---|
| Desktop, nessuna limitazione | all'istante in cui il pulsante entra nel DOM | **perso 4/4** | 140–200 ms |
| Desktop, nessuna limitazione | 40–280 ms dopo il DOM | riprodotto 13/14 (1 caso isolato con idratazione a 10 s) | — |
| Mobile, CPU 4x + Slow 4G | all'istante in cui il pulsante entra nel DOM | **perso 3/3** | 1,3–1,4 s |
| Mobile, CPU 4x + Slow 4G | ~1 s dopo il DOM | riprodotto 4/4 | ~1,2 s |
| Mobile, CPU 6x + rete 3G | ~1,4 s dopo il DOM | riprodotto 3/3 | ~1,5 s |

Il JS della pagina pesa 141 kB (First Load JS, da build log).

## Perche' il test fallisce

In `next dev` i bundle non sono minificati: DOM e idratazione sono separati da 1–3 s. Il test clicca a ~1,6 s dall'apertura,
quindi prima dell'idratazione, e il click si perde. Su `main` succede lo stesso: non e' una regressione.

## Impatto sul percorso di acquisto

- Riguarda **qualunque** `<button onClick>` di una pagina SSR del sito (piani, CTA Premium, menu), non solo la CTA Premium.
  I link `<a href>` (login, pacchetti, guide) funzionano anche prima dell'idratazione.
- Su desktop la finestra (140–200 ms) e' sotto il tempo di reazione umano: impatto trascurabile.
- Su mobile lento la finestra supera 1 s: un tocco sulla CTA in quel periodo viene ignorato e l'utente deve ritoccare.
  Impatto reale ma limitato (un secondo tocco risolve), non misurabile oggi con i dati disponibili.
- La selezione del piano e il funnel non vengono corrotti: un click perso non produce eventi parziali.

## Decisione: nessuna modifica in questa PR

Una correzione vera non e' minima: serve catturare i click prima dell'idratazione e riprodurli (script inline nel layout o
nelle 4 pagine Premium) oppure dare feedback ("pending") finche' la pagina non e' interattiva. Entrambe toccano il punto
di ingresso del checkout e, per le pagine Premium, file su cui sta lavorando anche l'intervento SEO. Meglio una PR dedicata.

Proposta per la PR separata, in ordine di rischio crescente:

1. Spegnere visivamente (stato `pending`/`aria-disabled`) CTA e selettore piano finche' il componente non e' montato:
   nessun tocco "morto" senza feedback. Basso rischio, non recupera il click.
2. Cattura e replay: piccolo script inline che registra il primo click su `[data-cq-replay]` prima dell'idratazione e lo
   riproduce dopo il mount (TTL breve, deduplica con `inFlightRef`, nessun dato sensibile). Recupera il click.
3. In ogni caso, correggere il test: attendere un marcatore di idratazione invece del solo DOM, e usare questa sonda come
   regressione deterministica.

## Riproduzione

```bash
# build di produzione dello stato da misurare, poi:
npx next start -H 127.0.0.1 -p 3305
node scripts/early-click-probe.cjs http://127.0.0.1:3305 /pricing desktop 1 none 0 4
node scripts/early-click-probe.cjs http://127.0.0.1:3305 /pricing m4x 4 slow4g 1 3
```
