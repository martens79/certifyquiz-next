# EIPASS Standard — architettura domanda ↔ certificazione ↔ topic

Stato: **proposta**. Nulla di questo documento è implementato nel backend né eseguito su alcun database.

## Vincolo da cui si parte

Nel backend `questions.topic_id` è una FK singola e `topics.certification_id` lega il topic a una sola certificazione. Almeno una ventina di query dipendono da `q.topic_id` (`quiz_project/routes/quizRoutes.js`: estrazione per topic, quiz misto, mock, conteggi, sessioni; `certificationRoutes.js`: conteggi per lingua; `topicPageRoutes.js`: conteggi di pagina). Una domanda quindi appartiene oggi a **un** solo topic. Le domande di EIPASS 7 Moduli User (cert. 3, topic 17–23) non possono comparire in Standard senza una struttura nuova.

## Opzioni valutate

| Opzione | Esito | Motivo |
|---|---|---|
| A. Copiare le domande in nuove righe `questions` per Standard | **Scartata** | Duplica contenuto, traduzioni e correzioni (drift tra due copie); viola "senza duplicare"; nuovi ID senza storia; rischio di shift multilingua (il tema dell'Import Quality Gate) |
| B. Sostituire `questions.topic_id` con una relazione molti-a-molti | **Scartata** | Tocca tutte le letture di User e di ogni altra certificazione: rischio di regressione senza beneficio |
| C. Tabella di associazione additiva + vista del "pool" del topic | **Raccomandata** | Nessuna riga originale modificata; User invariato per costruzione; reversibile (si svuota/rimuove la tabella) |

## Opzione C

### 1. Tabella `topic_question_links`

Una riga = "la domanda Q compare nel topic T (di Standard)". Campi: `topic_id` (topic Standard), `question_id`, `source_topic_id` (topic di provenienza, per audit), `digcomp_area`, `digcomp_competence`, `level` (nullable), `position`, `status` (`proposed` → `approved` → `withdrawn`), `matrix_version`, `reviewed_by/at`. Unicità `(topic_id, question_id)`. Bozza completa: `proposed-migrations/001_topic_question_links.PROPOSED.sql`.

Regole:
- **Default `proposed`**: una riga `proposed` non è mai servita. Solo `approved` entra nel pool.
- L'approvazione è un'operazione esplicita per modulo, da script con allowlist e dry-run, mai un effetto collaterale della creazione del collegamento.
- Esclusioni obbligatorie: le **19 domande in revisione**, le **34 coppie duplicate** (finché non decise), le righe non validate dalla revisione R1, le domande con `is_active = 0`.

### 2. Vista `v_topic_question_pool(topic_id, question_id, origin)`

```
nativi:     SELECT q.topic_id, q.id, 'native' FROM questions q            -- identica a oggi
collegati:  SELECT l.topic_id, l.question_id, 'linked' FROM topic_question_links l WHERE l.status = 'approved'
```

Le letture passano da `WHERE q.topic_id = ?` a `JOIN v_topic_question_pool p ON p.question_id = q.id AND p.topic_id = ?`. Per ogni topic che non ha collegamenti (tutti gli attuali) il risultato è identico a prima: questa proprietà è il **test di non regressione** della fase backend (confronto dei set di ID per tutti i topic esistenti prima/dopo; atteso: nessuna differenza).

Domande **nuove** scritte per Standard: inserite direttamente in `questions` con `topic_id` = topic Standard (native), senza righe di link. Servono solo per gli argomenti ufficiali senza copertura (28 su 69).

### 3. Effetti su dati condivisi

| Tema | Decisione proposta |
|---|---|
| Testo/chiave/spiegazione | Una sola riga: una correzione vale per entrambe le certificazioni. Correzioni che cambiano il significato (es. le 3 chiavi dello Sprint 01) richiedono approvazione didattica prima, perché cambiano anche User |
| `topic_id` nel payload | Il pool restituisce il topic **richiesto** (quello di Standard), non quello nativo, così progressi, sessioni e feedback si attribuiscono al contesto in cui l'utente sta rispondendo |
| Progresso/statistiche per domanda | Chiave `question_id`: la padronanza è condivisa tra le certificazioni (scelta da confermare: alternativa = chiave `(question_id, certification_id)`) |
| Accesso Free/Premium | Governato da `topics.access_tier` del topic Standard, non da quello di provenienza |
| Conteggi per lingua | Calcolati sul pool; una domanda senza traduzione completa non conta nella lingua |
| Lingua e paese | Standard ha `launchScope` = lingua `it`, paese `IT`. Le altre lingue non hanno route (404). Il paese non guida mai il routing |
| Import Quality Gate | I link referenziano ID esistenti: nessun rischio di shift. Lo script di link deve rifiutare ID inattivi o in blocklist e produrre un hash prima/dopo |
| Modifica di una domanda collegata | Va tracciata come evento su entrambe le certificazioni (revisione di User inclusa) |

### 4. Livelli

Nessun campo di difficoltà esiste oggi e la banca non identifica Avanzato/Altamente specializzato. `level` nel link è nullable e **non** deve essere popolato da euristiche: serve etichettatura umana su campione con due revisori prima di costruire qualunque esame a livelli.

## Fasi (oltre alla landing "coming soon", nessuna è autorizzata)

0. **Landing coming soon (questa PR)** — solo frontend: stato `coming_soon`, sola landing italiana pubblica, quiz/topic 404. Nessun DB.
1. Backend, PR separata — migrazione additiva (tabella vuota + vista) e passaggio delle letture al pool, con test di identità sui topic esistenti. Applicazione al DB solo da Lorenzo, via Workbench.
2. Creazione della certificazione e dei 7 topic Standard con `is_active = 0`, generata dagli strumenti di import (non scritta a mano).
3. Popolamento dei link `proposed` dalla matrice; revisione indipendente per modulo; approvazione per modulo.
4. Nuove domande native per gli argomenti scoperti (MVP stimato 185).
5. Lancio dei quiz: passaggio da `coming_soon` a `published` e attivazione dei topic, ciascuno in una modifica propria dopo smoke di produzione.

## Rollback

Fase 0: revert della PR. Fasi successive: portare a `withdrawn` i link (le domande originali non sono mai state toccate) e, in ultima istanza, `DROP VIEW` + `DROP TABLE`. User non richiede rollback.
