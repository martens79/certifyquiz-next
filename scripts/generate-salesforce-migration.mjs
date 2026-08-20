import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const editorial=path.resolve("src/certifications/editorial");
const backend=path.resolve("../quiz_project_salesforce/migrations/2026-08-20-add-salesforce-platform-administrator.sql");
const esc=(v)=>`'${String(v).replaceAll("'","''")}'`;
const modules=[];
for(let n=1;n<=11;n++) modules.push(await import(pathToFileURL(path.join(editorial,`salesforce-platform-administrator-topic-${String(n).padStart(2,"0")}.en.ts`))));
const slugs=["platform-foundations-org-setup","users-authentication-access","permissions-record-sharing","objects-relationships-lightning-app-builder","sales-marketing","service-support","productivity-collaboration","data-quality-governance","reports-dashboards","validation-flow-automation","agentforce-fundamentals"];
const titles=["Platform Foundations and Org Setup","Users, Authentication, and Access Foundations","Permissions and Record Sharing","Objects, Relationships, and Lightning App Builder","Sales and Marketing Applications","Service and Support Applications","Productivity and Collaboration","Data Quality and Governance","Reports and Dashboards","Validation, Flow, and Automation","Agentforce Administration Fundamentals"];
const questions=modules.flatMap((m,i)=>m[`SALESFORCE_PLATFORM_ADMIN_TOPIC_${String(i+1).padStart(2,"0")}_QUIZZES`]);
const reviews=modules.map((m,i)=>m[`SALESFORCE_PLATFORM_ADMIN_TOPIC_${String(i+1).padStart(2,"0")}_REVIEW`]);
const questionRows=questions.map(q=>{const a=["A","B","C","D"].map(id=>q.answers.find(x=>x.id===id).text);return `(${esc(q.topicSlug)},${esc(q.id)},${esc(q.prompt)},${esc(q.explanation)},${a.map(esc).join(",")},${["A","B","C","D"].indexOf(q.correctAnswerId)+1})`;}).join(",\n");
const topicRows=slugs.map((slug,i)=>`(${i+1},${esc(slug)},${esc(titles[i])})`).join(",\n");
const reviewStatements=reviews.map((r,i)=>`INSERT INTO topic_review_pages (topic_id,slug_en,title_en,meta_title_en,meta_description_en,intro_en,content_en,faq_en,is_published)\nSELECT t.id,'review',${esc(r.title)},${esc(r.title+" | CertifyQuiz")},${esc(`Review for ${r.title} with concepts, decision rules, exam traps, scenarios, and checklist.`)},${esc(`Focused exam review for ${titles[i]}.`)},${esc(r.content)},'[]',1 FROM topics t WHERE t.certification_id=@cert_id AND t.slug_en=${esc(slugs[i])}\nON DUPLICATE KEY UPDATE title_en=VALUES(title_en),meta_title_en=VALUES(meta_title_en),meta_description_en=VALUES(meta_description_en),intro_en=VALUES(intro_en),content_en=VALUES(content_en),faq_en=VALUES(faq_en),is_published=VALUES(is_published);`).join("\n\n");
const sql=`/* Salesforce Certified Platform Administrator: 11 topics, 200 EN questions, 800 answers, 11 EN reviews. */
/* Idempotent seed. English is the canonical editorial language and base-column fallback. */
SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO categories (name,name_en,name_fr,name_es,quizTaken,totalQuestions)
SELECT 'Business Applications','Business Applications','Business Applications','Business Applications',0,0
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name='Business Applications');

INSERT INTO certifications (name,name_en,name_fr,name_es,slug,category_id,is_free)
SELECT 'Salesforce Certified Platform Administrator','Salesforce Certified Platform Administrator','Salesforce Certified Platform Administrator','Salesforce Certified Platform Administrator','salesforce-platform-administrator',c.id,0
FROM categories c WHERE c.name='Business Applications'
AND NOT EXISTS (SELECT 1 FROM certifications WHERE slug='salesforce-platform-administrator');
SET @cert_id=(SELECT id FROM certifications WHERE slug='salesforce-platform-administrator' LIMIT 1);

DROP TEMPORARY TABLE IF EXISTS sf_topic_seed;
CREATE TEMPORARY TABLE sf_topic_seed (sort_order INT,slug VARCHAR(191),title VARCHAR(255));
INSERT INTO sf_topic_seed VALUES
${topicRows};
INSERT INTO topics (certification_id,title,description,title_en,description_en,slug_it,slug_en,slug_fr,slug_es)
SELECT @cert_id,s.title,CONCAT('Salesforce Platform Administrator exam preparation: ',s.title),s.title,CONCAT('Salesforce Platform Administrator exam preparation: ',s.title),s.slug,s.slug,s.slug,s.slug
FROM sf_topic_seed s WHERE NOT EXISTS (SELECT 1 FROM topics t WHERE t.certification_id=@cert_id AND t.slug_en=s.slug);

DROP TEMPORARY TABLE IF EXISTS sf_question_seed;
CREATE TEMPORARY TABLE sf_question_seed (topic_slug VARCHAR(191),editorial_id VARCHAR(40),question LONGTEXT,explanation LONGTEXT,a LONGTEXT,b LONGTEXT,c LONGTEXT,d LONGTEXT,correct_pos TINYINT);
INSERT INTO sf_question_seed VALUES
${questionRows};

INSERT INTO questions (question,question_en,correct_answer,topic_id,explanation,explanation_en,is_premium)
SELECT s.question,s.question,CASE s.correct_pos WHEN 1 THEN s.a WHEN 2 THEN s.b WHEN 3 THEN s.c ELSE s.d END,t.id,s.explanation,s.explanation,0
FROM sf_question_seed s JOIN topics t ON t.certification_id=@cert_id AND t.slug_en=s.topic_slug
WHERE NOT EXISTS (SELECT 1 FROM questions q WHERE q.topic_id=t.id AND q.question_en=s.question);

DROP TEMPORARY TABLE IF EXISTS sf_answer_seed;
CREATE TEMPORARY TABLE sf_answer_seed AS SELECT s.topic_slug,s.question,
CASE p.pos WHEN 1 THEN s.a WHEN 2 THEN s.b WHEN 3 THEN s.c ELSE s.d END answer_text,(p.pos=s.correct_pos) is_correct
FROM sf_question_seed s CROSS JOIN (SELECT 1 pos UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) p;
INSERT INTO answers (question_id,answer_text,answer_text_en,is_correct)
SELECT q.id,s.answer_text,s.answer_text,s.is_correct FROM sf_answer_seed s
JOIN topics t ON t.certification_id=@cert_id AND t.slug_en=s.topic_slug
JOIN questions q ON q.topic_id=t.id AND q.question_en=s.question
WHERE NOT EXISTS (SELECT 1 FROM answers a WHERE a.question_id=q.id AND a.answer_text_en=s.answer_text);

${reviewStatements}

DROP TEMPORARY TABLE sf_answer_seed;
DROP TEMPORARY TABLE sf_question_seed;
DROP TEMPORARY TABLE sf_topic_seed;
COMMIT;

SELECT COUNT(DISTINCT t.id) topics,COUNT(DISTINCT q.id) questions,COUNT(a.id) answers,SUM(a.is_correct) correct_answers
FROM topics t LEFT JOIN questions q ON q.topic_id=t.id LEFT JOIN answers a ON a.question_id=q.id WHERE t.certification_id=@cert_id;
SELECT COUNT(*) reviews FROM topic_review_pages r JOIN topics t ON t.id=r.topic_id WHERE t.certification_id=@cert_id AND r.is_published=1;
`;
fs.writeFileSync(backend,sql);
console.log(`${questions.length} questions, ${reviews.length} reviews -> ${backend}`);
