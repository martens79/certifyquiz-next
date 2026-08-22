import fs from "node:fs";

const sourceUrl = new URL("./data/pl300-en-translations.py", import.meta.url);
const outputUrl = new URL("../../quiz_project_salesforce/migrations/2026-08-22-complete-pl300-english.sql", import.meta.url);
const source = fs.readFileSync(sourceUrl, "utf8");

const translations = [...source.matchAll(/add\("(\d+)",\s*'''([\s\S]*?)''',\s*'''([\s\S]*?)'''\s*\)/g)].map(
  ([, id, question, explanation]) => ({ id: Number(id), question, explanation }),
);

if (translations.length !== 120) {
  throw new Error(`Expected 120 translations, found ${translations.length}`);
}

const ids = translations.map(({ id }) => id);
if (new Set(ids).size !== 120 || Math.min(...ids) !== 21563 || Math.max(...ids) !== 21682) {
  throw new Error("Expected 120 unique, contiguous question IDs from 21563 through 21682");
}

const sqlString = (value) => `'${value.replaceAll("'", "''")}'`;
const rows = translations
  .map(({ id, question, explanation }) => `(${id},${sqlString(question)},${sqlString(explanation)})`)
  .join(",\n");

const sql = `-- Completa le traduzioni inglesi delle 120 nuove domande PL-300 italiane.
-- Idempotente: rieseguirla reimposta gli stessi testi inglesi senza creare righe.
START TRANSACTION;

DROP TEMPORARY TABLE IF EXISTS tmp_pl300_en_translations;
CREATE TEMPORARY TABLE tmp_pl300_en_translations (
  question_id INT PRIMARY KEY,
  question_en TEXT NOT NULL,
  explanation_en TEXT NOT NULL
);

INSERT INTO tmp_pl300_en_translations (question_id, question_en, explanation_en) VALUES
${rows};

UPDATE questions q
JOIN topics t ON t.id = q.topic_id
JOIN certifications c ON c.id = t.certification_id
JOIN tmp_pl300_en_translations tr ON tr.question_id = q.id
SET q.question_en = tr.question_en,
    q.explanation_en = tr.explanation_en
WHERE c.slug = 'pl-300-power-bi-data-analyst';

SELECT
  COUNT(*) AS expected_translations,
  SUM(c.id IS NOT NULL) AS matching_pl300_questions,
  SUM(c.id IS NOT NULL AND q.question_en = tr.question_en AND q.explanation_en = tr.explanation_en) AS translations_applied
FROM tmp_pl300_en_translations tr
LEFT JOIN questions q ON q.id = tr.question_id
LEFT JOIN topics t ON t.id = q.topic_id
LEFT JOIN certifications c
  ON c.id = t.certification_id
 AND c.slug = 'pl-300-power-bi-data-analyst';

COMMIT;
`;

fs.writeFileSync(outputUrl, sql, "utf8");
console.log(`Generated ${translations.length} PL-300 English translations at ${outputUrl.pathname}`);
