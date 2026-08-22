import fs from "node:fs";

const dump = process.argv[2];
if (!dump) throw new Error("Usage: node scripts/audit-pl300-corpus.mjs <dump.sql>");

const sql = fs.readFileSync(dump, "utf8");

function rowsFor(table) {
  const marker = `INSERT INTO \`${table}\` VALUES `;
  const start = sql.indexOf(marker);
  if (start < 0) throw new Error(`Missing table ${table}`);
  const body = sql.slice(start + marker.length, sql.indexOf(";\n", start));
  const rows = [];
  let row = [], value = "", quoted = false, escaped = false, depth = 0;
  for (const ch of body) {
    if (escaped) { value += ch === "n" ? "\n" : ch; escaped = false; continue; }
    if (quoted && ch === "\\") { escaped = true; continue; }
    if (ch === "'") { quoted = !quoted; continue; }
    if (!quoted && ch === "(") { depth++; if (depth === 1) continue; }
    if (!quoted && ch === ")") {
      depth--;
      if (depth === 0) { row.push(value === "NULL" ? null : value); rows.push(row); row = []; value = ""; continue; }
    }
    if (!quoted && depth === 1 && ch === ",") { row.push(value === "NULL" ? null : value); value = ""; continue; }
    if (depth > 0) value += ch;
  }
  return rows;
}

const topics = rowsFor("topics").filter((r) => Number(r[1]) === 51);
const topicIds = new Set(topics.map((r) => Number(r[0])));
const questions = rowsFor("questions").filter((r) => topicIds.has(Number(r[3])));
const questionIds = new Set(questions.map((q) => Number(q[0])));
const answers = rowsFor("answers").filter((r) => questionIds.has(Number(r[1])));
const answersByQuestion = new Map();
for (const answer of answers) answersByQuestion.set(Number(answer[1]), [...(answersByQuestion.get(Number(answer[1])) ?? []), answer]);
const counts = Object.fromEntries(topics.map((t) => [t[2], questions.filter((q) => Number(q[3]) === Number(t[0])).length]));
const normalized = (s) => String(s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const exact = new Map();
for (const q of questions) exact.set(normalized(q[1]), [...(exact.get(normalized(q[1])) ?? []), Number(q[0])]);
const duplicates = [...exact.entries()].filter(([, ids]) => ids.length > 1);
console.log(JSON.stringify({ topics: topics.map((t) => ({ id: Number(t[0]), title: t[2] })), counts, total: questions.length,
  missingExplanation: questions.filter((q) => !String(q[4] ?? "").trim()).map((q) => Number(q[0])),
  invalidAnswers: questions.filter((q) => (answersByQuestion.get(Number(q[0])) ?? []).length !== 4 || (answersByQuestion.get(Number(q[0])) ?? []).filter((a) => Number(a[3]) === 1).length !== 1).map((q) => Number(q[0])),
  duplicates,
  questions: questions.map((q) => ({ id: Number(q[0]), topicId: Number(q[3]), question: q[1], explanation: q[4], answers: (answersByQuestion.get(Number(q[0])) ?? []).map((a) => ({ text: a[2], correct: Number(a[3]) === 1 })) }))
}, null, 2));
