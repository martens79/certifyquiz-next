# EIPASS Standard — requisiti mancanti per il lancio

Data: 27/10/2026. **La certificazione non è disponibile e non va dichiarata tale finché la pubblicazione non è autorizzata.** Ogni voce è un gate: finché è aperta, `publicationStatus: "planned"` e la guardia `ROLLOUT_NOINDEX_CERTIFICATION_SLUGS` restano.

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

## Passi di lancio (ciascuno in una modifica propria, dopo gli esiti sopra)

1. Rimuovere `publicationStatus: "planned"` da `src/certifications/data/eipass-standard.ts`.
2. Sostituire `getEipassStandardDemoTopicLinks/Page` con la lettura reale dei topic (e rimuovere il banner demo, il ramo senza backend in `CertificationDetailView`, il `notFound()` per Standard in `quiz/[slug]/layout.tsx` e la guardia di `topic-page.ts`).
3. Smoke di produzione in anonimo, FREE e Premium; solo dopo, rimuovere `eipass-standard` da `ROLLOUT_NOINDEX_CERTIFICATION_SLUGS`.
4. Verifica sitemap e Search Console. Nessun miglioramento di ranking è garantito.
5. Aggiornare le due pagine EIPASS con un rimando incrociato (User ↔ Standard) solo a lancio avvenuto.

## Cosa questa PR non fa

Non crea la certificazione né i topic nel DB; non collega domande; non modifica EIPASS 7 Moduli User né le sue route, domande, associazioni, copy o test; non tocca le 19 domande in revisione né le 34 coppie; non cambia sitemap, catalogo, home o categorie; non esegue migrazioni, import, merge o deploy.
