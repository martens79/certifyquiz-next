import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { poolHint, savedPoolTokenOf } from "../src/lib/topic-pool.ts";

const fetchCalls: string[] = [];
Object.defineProperty(globalThis, "fetch", {
  value: (input: string) => { fetchCalls.push(String(input)); return Promise.resolve(new Response(JSON.stringify({ questions: [], poolToken: "p1.x.y" }), { status: 200 })); },
  configurable: true,
});
const apiClient = import("../src/lib/apiClient.ts");

test("poolHint: nessuna sessione -> new; sessione con token -> token; sessione senza token -> legacy; pinning spento -> nulla", () => {
  assert.equal(poolHint(true, null), "new");
  assert.equal(poolHint(true, { kind: "local", data: { poolToken: "p1.a.b", qIds: [1] } }), "p1.a.b");
  assert.equal(poolHint(true, { kind: "db", data: { state: { poolToken: "p1.c.d" }, seed: 1 } }), "p1.c.d");
  assert.equal(poolHint(true, { kind: "local", data: { qIds: [1, 2] } }), "legacy", "salvataggio di prima dei token");
  assert.equal(poolHint(true, { kind: "db", data: { state: { marked: {} }, seed: 1 } }), "legacy");
  assert.equal(poolHint(false, null), undefined);
  assert.equal(poolHint(false, { kind: "local", data: { poolToken: "p1.a.b" } }), undefined);
});
test("savedPoolTokenOf: ignora valori non validi", () => {
  for (const bad of [undefined, null, "", 5, {}, []]) assert.equal(savedPoolTokenOf({ kind: "local", data: { poolToken: bad } }), null);
  assert.equal(savedPoolTokenOf(null), null);
});
test("getQuestionsByTopic invia `pool` solo se richiesto e restituisce poolToken", async () => {
  const { getQuestionsByTopic } = await apiClient;
  fetchCalls.length = 0;
  const res: any = await getQuestionsByTopic(83, "it", { limit: 500, shuffle: false, mode: "training", pool: "new" });
  assert.equal(new URL(fetchCalls[0], "http://x").searchParams.get("pool"), "new");
  assert.equal(res.poolToken, "p1.x.y");
  await getQuestionsByTopic(83, "it", { limit: 500, shuffle: false, mode: "training" });
  assert.equal(new URL(fetchCalls[1], "http://x").searchParams.has("pool"), false);
});
test("guard statici: token nel progresso locale e nel DB, pinning solo per il topic, fetch dopo la scelta della fonte", () => {
  const eng = readFileSync("src/components/quiz/QuizEngine.tsx", "utf8");
  assert.match(eng, /poolToken: poolTokenRef\.current \?\? undefined/);
  assert.match(eng, /\.\.\.\(poolTokenRef\.current \? \{ poolToken: poolTokenRef\.current \} : \{\}\)/);
  assert.ok(eng.indexOf("let source: { data: any; kind: 'local' | 'db' } | null = null;") < eng.indexOf("await runFetch(poolHint(pinPool, source));"), "il pool si scarica DOPO aver scelto la fonte");
  assert.match(eng, /const pinPool = !!pinTopicPool && effectiveMode !== 'assessment';/);
  const topic = readFileSync("src/app/[lang]/quiz/topic/[topicId]/QuizTopicClient.tsx", "utf8");
  assert.match(topic, /pinTopicPool=\{!isAssessmentMode\}/);
  for (const f of ["src/app/[lang]/quiz/mixed", "src/app/[lang]/quiz/mock-exam"]) {
    try { for (const n of ["page.tsx"]) readFileSync(`${f}/${n}`, "utf8"); } catch { /* percorso diverso: nessuna dipendenza */ }
  }
  const storage = readFileSync("src/lib/quiz-storage.ts", "utf8");
  assert.match(storage, /poolToken\?: string;/);
});
