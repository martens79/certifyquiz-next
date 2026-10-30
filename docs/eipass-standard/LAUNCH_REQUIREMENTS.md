# EIPASS Standard — requisiti mancanti per il lancio dei quiz

Data: 28/10/2026. La **landing "coming soon"** è pubblicata (autorizzazione del proprietario); **la preparazione non è disponibile e non va dichiarata tale** finché i quiz non sono autorizzati. Ogni voce sotto è un gate per i quiz: finché è aperta, lo stato resta `coming_soon` e le route quiz/topic restano 404.

## Bloccanti

| # | Requisito | Stato | Chi |
|---|---|---|---|
| R1 | **Decisione di Lorenzo di avviare il lancio** (priorità, capacità, regime IVA/offerta) | Aperta | Lorenzo |
| R2 | **Backend**: tabella `topic_question_links` + vista pool + passaggio delle letture al pool, con test di identità su tutti i topic esistenti (PR backend separata) | Non iniziata; bozza SQL in `proposed-migrations/` | Claude (PR), Lorenzo (applicazione) |
| R3 | **Autorizzazione CERTIPASS** al riuso del programma: il documento ufficiale condiziona il riutilizzo alla richiesta di autorizzazione, alla citazione e all'indicazione delle modifiche. Serve prima di pubblicare elenchi di argomenti/attività o testo derivato. Oggi il codice usa solo titoli di modulo e area | Non richiesta | Lorenzo |
| R4 | **Creazione certificazione + 7 topic** nel DB (`is_active = 0`), generata dagli strumenti di import e verificata su schema reale; assegnazione dell'ID e aggiunta a `IDS_BY_SLUG` | Non fatta | Claude + Lorenzo |
| R5 | **Domande con collegamento approvato in ogni modulo**. Oggi: 0 collegamenti approvati; validazione R1 = 183 su 924 (NO-GO al riuso massivo); 30 domande dello Sprint 01 in attesa di seconda revisione (0 approvate), M5 Word a 0 | Aperta | Revisione indipendente + Lorenzo |
| R6 | **Copertura degli argomenti ufficiali**: 28 su 69 senza domande e 15 deboli. Stima MVP 185 nuove domande (pieno 416) | Aperta | Scrittura + revisione |
| R7 | **Livello**: nessun item è etichettato Base/Intermedio/Avanzato/Altamente specializzato. Serve etichettatura umana (due revisori su campione) prima di qualunque esame a livelli | Aperta | Revisori |
| R8 | **Traduzione**: oggi solo italiano, mercato IT. Nessuna route EN/FR/ES (404 per costruzione) | Per scelta | — |

## Da verificare prima del copy di lancio

| # | Verifica | Nota |
|---|---|---|
| V1 | Regolamento di erogazione EIPASS Standard (soglie, durata, sorveglianza) | Non recuperabile dal sito (protezione anti-bot, non aggirata); recuperare a mano |
| V2 | Claim su graduatorie/GPS/CIAD | Fatti verificati il 26/10 su fonte MIM (O.M. 27/2026). Il copy attuale **non** contiene claim: se se ne vuole uno, citare la fonte e dire che dipende dal bando |
| V3 | Prezzo del programma ufficiale (260 €) e dei rinnovi | Non mostrato nel copy; decidere se mostrarlo, con data di verifica |
| V4 | Nome del prodotto ufficiale e uso del marchio EIPASS | Il logo EIPASS è di proprietà di CERTIPASS: la landing usa l'immagine già in uso per EIPASS User (`/images/certifications/eipass.png`); decidere se serve un asset dedicato o un permesso |
| V5 | Gate FREE (10 spiegazioni poi 5 domande) e livello Premium per i topic Standard | Da definire in `topics.access_tier` |
| V6 | Mock / esercitazione a tempo | Nessuna route: non va introdotta una "simulazione" finché il livello non è modellato; vietata la dicitura "replica dell'esame ufficiale" |

## Passi di lancio dei quiz (ciascuno in una modifica propria, dopo gli esiti sopra)

1. Backend (PR #149 e successive): migrazione approvata e applicata da Lorenzo, certificazione e topic creati inattivi, collegamenti approvati per modulo.
2. Frontend: passare da `coming_soon` a `published`; sostituire il ramo "solo registry" di `CertificationDetailView` con la lettura reale di topic e inventario; rimuovere il `notFound()` per Standard in `quiz/[slug]/layout.tsx`, nelle quattro pagine scenari e in `topic-page.ts`; aggiungere i moduli come link; aggiornare sitemap (topic indexabili solo con contenuto reale) e rimuovere il banner "in arrivo".
3. Free/Premium: i quiz Standard usano il normale meccanismo di allenamento (spiegazione gratuita sulle risposte corrette, quota sugli errori, gate attuale, Premium/trial/pacchetti): **nessuna divisione in Free/Premium dei moduli o delle domande**.
4. Smoke di produzione (anonimo, FREE, Premium) prima di annunciare. Nessun miglioramento di ranking è garantito.

## Cosa questa PR fa e non fa

Pubblica la sola landing italiana "coming soon". Non crea la certificazione né i topic nel DB; non collega domande; non modifica il backend né EIPASS 7 Moduli User (salvo il link contestuale "In preparazione" sulla sua landing italiana); non tocca le 19 domande in revisione né le 34 coppie; non cambia le regole di indicizzazione delle altre certificazioni; non esegue migrazioni, import o altri deploy.
