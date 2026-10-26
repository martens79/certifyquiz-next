-- Prepared, NOT executed. Use a read-only account and a verified quiz_db target.
-- Backend evidence: routes/quizRoutes.js blob 5a06247a2a9b7d22ec97dd7738d6af5f55b641a2.
-- XML output is private editorial material: do not commit it to the public frontend.
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION WITH CONSISTENT SNAPSHOT, READ ONLY;
SELECT 'metadata' AS _entity, UTC_TIMESTAMP() AS exported_at_utc,
       DATABASE() AS database_name, VERSION() AS database_version;
SELECT 'schema' AS _entity, TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME IN ('questions','answers','topics')
ORDER BY TABLE_NAME, ORDINAL_POSITION;
SELECT 'question' AS _entity, q.* FROM questions q
WHERE q.id IN (1015,1050,1080,1169,13093,13110,25218,25228,25267,25367,25465,25508,25551,25634,25741,25753,25754,25828,25853)
ORDER BY q.id;
SELECT 'answer' AS _entity, a.* FROM answers a
WHERE a.question_id IN (1015,1050,1080,1169,13093,13110,25218,25228,25267,25367,25465,25508,25551,25634,25741,25753,25754,25828,25853)
ORDER BY a.question_id, a.id;
SELECT 'topic' AS _entity, t.* FROM topics t
WHERE t.id IN (17,18,20,21,22,23) ORDER BY t.id;
ROLLBACK;
