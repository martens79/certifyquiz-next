# EIPASS User — Fase 2, pacchetto parziale bloccato

**NO-GO dati: 0/19 pronti per approvazione.** Questa è una bozza di revisione e raccolta evidenze; non una migrazione né una correzione già verificata contro produzione. Release 1 non modificata: nessun file applicativo cambia.

## Provenienza e stato

- Documento `docs/eipass-release1/QUESTION_REVIEW_19.md` letto integralmente su main `a9155fcdf017bb33ba22da96c2d2e7e9c44ab5ec`.
- Railway `list_projects` ha restituito `UNAUTHORIZED`, richiedendo riautenticazione. Nessun target DB è stato collegato o interrogato. Nessuna credenziale DB o copia di export è presente nell'ambiente di lavoro.
- Schema contenuti verificato nel codice backend `routes/quizRoutes.js`, blob `5a06247a2a9b7d22ec97dd7738d6af5f55b641a2`: `questions.question[_en/_fr/_es]`, `questions.explanation[_en/_fr/_es]`, `answers.answer_text[_en/_fr/_es]`, `answers.is_correct`, relazione `answers.question_id`, `questions.topic_id`, `topics.certification_id`. Lo schema live non è ancora verificato.
- I BEFORE italiani vengono dall'audit, non da una lettura DB corrente. Nessuna chiave corretta DB, spiegazione attuale o traduzione è disponibile: i relativi campi JSON sono null/non verificati, non valori ricostruiti.
- I 76 answer ID dell'audit restano invariati nei candidati. `candidate_semantic_answer_id` è un'ipotesi editoriale esplicita, mai presentata come chiave esistente.
- Fonte tecnica consultata non equivale a prova della UI: versione/build e screenshot Office restano da produrre per i cinque quesiti di interfaccia.

## Contenuto

- `candidates.json`: 19 proposte IT con domanda, quattro alternative, spiegazione, ID e fonti primarie; nessuna approvazione automatica.
- `BEFORE_AFTER.md`: tabella 19 × 4 lingue e scheda completa IT per ID. EN/FR/ES attendono gli originali, non sono traduzioni inventate del BEFORE.
- `../../scripts/eipass-phase2/export_readonly.sql`: estrazione selettiva preparata ma non eseguita, transazione READ ONLY e rollback; nessun writer.
- `../../scripts/eipass-phase2/snapshot.py`: conversione offline dell'XML MySQL, hash, controlli di identità e confronto chiavi. Non si connette a DB e non emette SQL di scrittura.
- `../../tests/eipass-phase2/test_snapshot.py`: 14 test sintetici. Non certificano le chiavi reali né la correttezza semantica di tutte le proposte.

## Estrazione dopo ripristino dell'accesso

Occorre ricollegare l'app Railway oppure usare un canale read-only già autorizzato, con target `quiz_db` verificato e account di sola lettura. Non creare privilegi, proxy, credenziali o servizi. Non inviare password in chat.

Esaminare prima lo schema e i permessi effettivi. Il file SQL contiene solo SELECT, impostazione della transazione e ROLLBACK. Non filtrare attivi/inattivi o applicare fallback linguistici. Conservare ordine degli answer ID, NULL, stringhe vuote, campi di stato e associazioni.

Esempio da eseguire solo con configurazione di connessione locale protetta già disponibile (nessun valore di credenziale nei comandi):

```sh
mysql --defaults-extra-file=/percorso/protetto/readonly.cnf --database=quiz_db --xml \
  < scripts/eipass-phase2/export_readonly.sql > /percorso/privato/eipass19.xml
python scripts/eipass-phase2/snapshot.py convert /percorso/privato/eipass19.xml \
  > /percorso/privato/eipass19-baseline.json
python scripts/eipass-phase2/snapshot.py assess /percorso/privato/eipass19-baseline.json \
  > /percorso/privato/eipass19-key-review.json
```

**Non committare gli export o le chiavi reali:** il repository frontend è pubblico. Conservare la baseline e le evidenze complete in un canale privato approvato. I dati attualmente committati provengono dal documento di audit già pubblico, con riscritture originali proposte dall'autore; nessuna domanda ufficiale protetta è stata copiata.

L'hash dell'audit è distinto dall'hash di baseline DB. La conversione preserva NULL e stringhe vuote senza normalizzazione Unicode o trim. L'hash dell'intero snapshot e quelli per item devono essere archiviati con timestamp e provenienza. Una corrispondenza fra answer ID non approva la semantica.

## Gate editoriali e futuri script reversibili

1. Recuperare le 19 righe, tutte le alternative e le lingue effettivamente presenti; confrontare integralmente con l'audit. Verificare correttezza sia prima sia dopo, per ogni alternativa.
2. Per ciascun ID confrontare la chiave DB con la scelta candidata. Zero chiavi, più chiavi o ID diverso generano una decisione separata, mai una correzione automatica. Anche un ID uguale richiede revisione umana.
3. **8 decisioni editoriali aggiuntive:** 13110 (scenario relativo/assoluto), 25218, 25228, 25753, 25754, 25853 (sostituzione compiti UI), 25551 (nuovo Outlook), 25741 (differenziazione sincronizzazione/copia indipendente). Per gli altri 11 la proposta è una precisazione tecnica, non un'approvazione.
4. Completare BEFORE/AFTER di domande, quattro alternative e spiegazioni nelle lingue presenti, con revisore tecnico e linguistico, e versione/build delle prove.
5. Solo dopo baseline, diff definitivo e approvazioni produrre script forward/rollback: preflight dell'intero pacchetto prima di ogni scrittura, transazione unica, confronto byte-esatto di righe originali sotto lock, sole colonne testuali approvate, conteggio righe, verifica degli hash AFTER e rollback. Non aggiornare ID, topic, associazioni, stato, ordine o `is_correct`. Rollback applicabile solo se ogni riga coincide con AFTER; drift o errore comportano rollback dell'intera transazione. Ripetere su clone DB isolato prima di qualsiasi autorizzazione futura alla produzione.

Non viene generato ora un UPDATE generico o un hash BEFORE fittizio: sarebbe applicabile senza le evidenze richieste. Il piano reversibile non autorizza l'esecuzione di scritture.

## Verifiche eseguite

```sh
python -m unittest discover -s tests/eipass-phase2 -v
```

14/14 PASS locali: guardie di identità, chiavi discrepanti/multiple, hash alterati, NULL/Unicode/whitespace, assenza fallback, XML e casi formule. Prima esecuzione ha rilevato una conversione incoerente del flag `is_active` nella fixture sintetica; conversione corretta e suite rieseguita con successo. Nessuna prova DB, round-trip di migrazione o prova UI Office eseguita.

Il nuovo branch ha deploy Vercel disabilitato nella propria configurazione. Nessun merge/deploy/import/cancellazione/scrittura di produzione autorizzato o eseguito.
