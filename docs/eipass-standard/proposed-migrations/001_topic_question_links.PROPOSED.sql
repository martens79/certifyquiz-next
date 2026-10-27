-- ============================================================================
-- PROPOSTA — NON ESEGUITA — NON APPLICARE SENZA REVISIONE E AUTORIZZAZIONE
-- EIPASS Standard: tabella di associazione domanda ↔ topic (additiva).
--
-- Stato: bozza di architettura. Non è in nessuna cartella di migrazioni, non è
-- stata eseguita su alcun database (né locale né Production) e non è stata
-- verificata contro lo schema reale di Production: confrontare i tipi di
-- topics.id e questions.id con INFORMATION_SCHEMA prima dell'uso.
--
-- Non tocca righe esistenti: crea una tabella e una vista. Nessuna UPDATE/DELETE
-- su questions, answers, topics, certifications.
-- Istruzioni indipendenti (MySQL Workbench): nessuna transazione, nessuna
-- variabile utente, nessun ROW_COUNT()/LAST_INSERT_ID() tra istruzioni.
-- ============================================================================

-- 1) Tabella di associazione -------------------------------------------------
CREATE TABLE IF NOT EXISTS topic_question_links (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  topic_id           INT NOT NULL,                 -- topic di destinazione (EIPASS Standard)
  question_id        INT NOT NULL,                 -- domanda esistente (mai duplicata)
  source_topic_id    INT NULL,                     -- topic nativo di provenienza (audit)
  digcomp_area       TINYINT UNSIGNED NULL,        -- 1..5
  digcomp_competence VARCHAR(8) NULL,              -- es. '1.1' .. '5.4'
  level              ENUM('base','intermedio','avanzato','alta_specializzazione') NULL,
  position           INT NULL,
  status             ENUM('proposed','approved','withdrawn') NOT NULL DEFAULT 'proposed',
  matrix_version     VARCHAR(32) NULL,
  reviewed_by        VARCHAR(64) NULL,
  reviewed_at        DATETIME NULL,
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_topic_question (topic_id, question_id),
  KEY ix_topic_status (topic_id, status),
  KEY ix_question (question_id),
  CONSTRAINT fk_tql_topic    FOREIGN KEY (topic_id)    REFERENCES topics(id)    ON DELETE CASCADE,
  CONSTRAINT fk_tql_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) Pool di domande per topic ----------------------------------------------
-- Identico a oggi per ogni topic senza collegamenti approvati.
CREATE OR REPLACE VIEW v_topic_question_pool AS
  SELECT q.topic_id AS topic_id, q.id AS question_id, 'native' AS origin
    FROM questions q
   WHERE q.topic_id IS NOT NULL
  UNION ALL
  SELECT l.topic_id, l.question_id, 'linked'
    FROM topic_question_links l
    JOIN questions q ON q.id = l.question_id
   WHERE l.status = 'approved'
     AND q.is_active = 1;

-- 3) Verifica di non regressione (SOLA LETTURA, da eseguire dopo l'applicazione)
-- Atteso: zero righe. Confronta, per ogni topic, il pool con le domande native.
-- SELECT t.id
--   FROM topics t
--   LEFT JOIN (SELECT topic_id, COUNT(*) n FROM questions GROUP BY topic_id) a ON a.topic_id = t.id
--   LEFT JOIN (SELECT topic_id, COUNT(*) n FROM v_topic_question_pool GROUP BY topic_id) b ON b.topic_id = t.id
--  WHERE COALESCE(a.n,0) <> COALESCE(b.n,0);
-- Prima del popolamento dei link la query deve restituire zero righe per TUTTI i topic.
-- Dopo il popolamento, l'unica differenza ammessa riguarda i topic Standard.
-- NB: la vista non filtra is_active sulle domande native, come oggi: le letture
--     reali applicano is_active nelle singole query (da preservare nel passaggio al pool).

-- 4) Rollback ----------------------------------------------------------------
-- DROP VIEW IF EXISTS v_topic_question_pool;
-- DROP TABLE IF EXISTS topic_question_links;

-- 5) Creazione di certificazione e topic Standard ----------------------------
-- NON inclusa: deve essere generata dagli strumenti di import contro lo schema
-- verificato (colonne slug_*, title_*, description_*, access_tier, is_active...).
-- Topic creati con is_active = 0 finché il lancio non è autorizzato.
