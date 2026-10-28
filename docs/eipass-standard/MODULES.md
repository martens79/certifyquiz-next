# EIPASS Standard — struttura dei 7 moduli

Data: 27/10/2026. Stato: **coming_soon** (solo la landing italiana è pubblica), solo Italia. Prodotto distinto da *EIPASS 7 Moduli User* (certificazione ID 3, slug `eipass`), che resta invariato.

## Fonte e limiti d'uso

Nomi e ordine dei moduli: *EIPASS Standard — Utente qualificato di computer in base al DigComp 2.2*, programma analitico rev. 02/2024 (Centro Studi CERTIPASS). Nel codice sono usati **solo i sette titoli di modulo e l'area DigComp**. Gli elenchi di argomenti e attività del programma **non sono riprodotti**: il documento condiziona il riutilizzo alla richiesta di autorizzazione a CERTIPASS (vedi `LAUNCH_REQUIREMENTS.md`, R3). I testi della landing sono originali.

Nota sull'ordine: nel PDF i moduli sono stampati per area (2, 3, 5, 6, 7, 4, 1); l'ordine adottato è quello **numerico ufficiale 1–7**.

## I sette moduli

| # | Titolo ufficiale | Area DigComp 2.2 | Topic User candidato al riuso (sola lettura) |
|---|---|---|---|
| 1 | I fondamenti dell'ICT | 5 Risolvere problemi | 17 Fondamenti del computer |
| 2 | Navigare e cercare informazioni sul Web | 1 Alfabetizzazione su informazioni e dati | 20 Navigazione e comunicazione |
| 3 | Comunicare e collaborare in Rete | 2 Comunicazione e collaborazione | 19 Collaborazione online |
| 4 | Sicurezza informatica | 4 Sicurezza | 18 Sicurezza informatica |
| 5 | Creare documenti elettronici | 3 Creazione di contenuti digitali | 23 Elaborazione testi |
| 6 | Creare e gestire fogli di lavoro | 3 Creazione di contenuti digitali | 22 Fogli di calcolo |
| 7 | Creare presentazioni multimediali | 3 Creazione di contenuti digitali | 21 Strumenti di presentazione |

Fonte unica nel codice: `src/lib/eipass-standard.ts` (`EIPASS_STANDARD_MODULES`). Nessuno slug di modulo esiste: gli slug definitivi nasceranno con i topic nel DB.

La colonna "topic User" è un riferimento di analisi (matrice DigComp v0, `reports/italy-certifications-2026-10-26/week1`), **non** un'associazione: nessuna domanda è collegata a Standard.

## Cosa dicono i dati sul riuso (da report precedenti, non rieseguiti qui)

| Modulo | Domande nel topic User | Con area coerente col modulo | Note |
|---|---:|---:|---|
| 1 | 142 | 57 (40%) | Il meno allineato: nello Standard è l'area "Risolvere problemi" |
| 2 | 188 | 139 (74%) | |
| 3 | 107 | 59 (55%) | 11 argomenti ufficiali su 22 dell'area senza domande |
| 4 | 191 | 125 (65%) | |
| 5 | 179 | 175 (98%) | Sprint 01: 0 domande preparate sul Word |
| 6 | 249 | 209 (84%) | |
| 7 | 192 | 184 (96%) | |

Esito della validazione R1 (settimana 2): 183 domande validate su 924 candidate, **NO-GO al riuso massivo** (mappatura errata ~12% nel campione, distrattori deboli nel 59% della coorte recente). Conseguenza di progetto: ogni collegamento nasce `proposed` e diventa visibile solo dopo approvazione esplicita (vedi `ARCHITECTURE.md`). Oggi i collegamenti approvati sono **zero**.

Il livello (Base / Intermedio / Avanzato / Altamente specializzato) non è identificabile nella banca attuale: nessuna simulazione può essere presentata come equivalente all'esame ufficiale.

## Pubblicazione
La landing italiana mostra i sette moduli come **elenco informativo, senza link**: non esistono pagine per modulo (404 in ogni lingua). Gli slug "demo" della bozza precedente non esistono più.
