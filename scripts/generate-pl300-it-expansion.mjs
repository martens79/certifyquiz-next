import fs from "node:fs";
import { blueprint, questions } from "./data/pl300-it-expansion.mjs";

const esc = (value) => value.replaceAll("\\", "\\\\").replaceAll("'", "\\'");
const payload = esc(JSON.stringify(questions));
const sql = `-- PL-300: espansione del solo corpus italiano da 120 a 240 domande.
-- Blueprint finale: ${Object.entries(blueprint).map(([k,v]) => `${k}=${v}`).join(", ")}.
START TRANSACTION;
SET @pl300_cert_id := (SELECT id FROM certifications WHERE slug='pl-300-power-bi-data-analyst' LIMIT 1);
SET @pl300_payload := '${payload}';

DROP TEMPORARY TABLE IF EXISTS tmp_pl300_it_questions;
CREATE TEMPORARY TABLE tmp_pl300_it_questions (
  topic_title VARCHAR(255) NOT NULL, question_text TEXT NOT NULL, correct_text TEXT NOT NULL,
  explanation_text TEXT NOT NULL, options_json JSON NOT NULL
);
INSERT INTO tmp_pl300_it_questions
SELECT topic, question, correct_answer, explanation, options
FROM JSON_TABLE(@pl300_payload, '$[*]' COLUMNS(
  topic VARCHAR(255) PATH '$.topic', question TEXT PATH '$.question',
  correct_answer TEXT PATH '$.correct', explanation TEXT PATH '$.explanation',
  options JSON PATH '$.options'
)) src;

INSERT INTO questions (question, correct_answer, topic_id, explanation, is_premium, question_type)
SELECT src.question_text, src.correct_text, t.id, src.explanation_text, 0, 'standard'
FROM tmp_pl300_it_questions src
JOIN topics t ON t.certification_id=@pl300_cert_id AND t.title=src.topic_title
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.topic_id=t.id AND LOWER(TRIM(q.question))=LOWER(TRIM(src.question_text))
);

INSERT INTO answers (question_id, answer_text, is_correct)
SELECT q.id, option_rows.option_text, option_rows.option_text=src.correct_text
FROM tmp_pl300_it_questions src
JOIN topics t ON t.certification_id=@pl300_cert_id AND t.title=src.topic_title
JOIN questions q ON q.topic_id=t.id AND LOWER(TRIM(q.question))=LOWER(TRIM(src.question_text))
JOIN JSON_TABLE(src.options_json, '$[*]' COLUMNS(option_text TEXT PATH '$')) option_rows
WHERE NOT EXISTS (SELECT 1 FROM answers a WHERE a.question_id=q.id);

-- Le SIGNAL seguenti impediscono il commit se il corpus non rispetta i vincoli richiesti.
SET @pl300_total := (SELECT COUNT(*) FROM questions q JOIN topics t ON t.id=q.topic_id WHERE t.certification_id=@pl300_cert_id);
SET @pl300_bad := (SELECT COUNT(*) FROM (
  SELECT q.id FROM questions q JOIN topics t ON t.id=q.topic_id LEFT JOIN answers a ON a.question_id=q.id
  WHERE t.certification_id=@pl300_cert_id GROUP BY q.id, q.explanation
  HAVING COUNT(a.id)<>4 OR SUM(a.is_correct)<>1 OR q.explanation IS NULL OR TRIM(q.explanation)=''
) invalid);
SET @pl300_assert := IF(@pl300_total=240 AND @pl300_bad=0, 1, 0);
SELECT IF(@pl300_assert=1, 'PL-300 corpus valido: 240 domande IT', CONCAT('ERRORE: total=',@pl300_total,', invalid=',@pl300_bad)) AS validation_result;
COMMIT;
`;

fs.writeFileSync(new URL("../../quiz_project_salesforce/migrations/2026-08-22-expand-pl300-it-to-240.sql", import.meta.url), sql);
console.log(`Generated ${questions.length} PL-300 Italian questions.`);
