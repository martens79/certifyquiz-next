import assert from "node:assert/strict";
import test from "node:test";

// Paywall Phase 1 / Opzione A: lo SCOPO del fetch lo decide la ROUTE. Questi
// test fissano il contratto del client:
//  - training: route /questions e /questions-mixed, `mode=training` esplicito
//    e nessun modo di chiedere exam/assessment da li';
//  - assessment: route /assessment/... senza alcun limit/shuffle/strict/mode;
//  - mock exam: route /mock-exam/... senza alcun limit/exam/mode;
//  - conteggi: route /question-pool/... (nessuna "sonda" sul question bank).
//
// getQuestionsByTopic & co. finiscono in apiFetch -> fetch reale: mockiamo
// fetch globale per catturare l'URL costruito, stesso pattern di
// tests/analytics-funnel-event.test.ts. Nessun `window` necessario: getToken()
// ritorna null senza browser (comportamento "guest").
const fetchCalls: string[] = [];
Object.defineProperty(globalThis, "fetch", {
  value: (input: string) => {
    fetchCalls.push(String(input));
    return Promise.resolve(
      new Response(JSON.stringify({ questions: [], poolTotal: 7 }), { status: 200 })
    );
  },
  configurable: true,
});

const apiClientModule = import("../src/lib/apiClient.ts");

function urlOf(call: string) {
  return new URL(call, "http://localhost");
}

test("getQuestionsByTopic: training -> /questions/:id with mode=training sent explicitly", async () => {
  const { getQuestionsByTopic } = await apiClientModule;
  fetchCalls.length = 0;
  await getQuestionsByTopic(1, "it", { limit: 5, mode: "training" });
  assert.equal(fetchCalls.length, 1);
  const url = urlOf(fetchCalls[0]);
  assert.match(url.pathname, /\/questions\/1$/);
  assert.equal(url.searchParams.get("mode"), "training");
});

test("getMixedQuestions: training -> /questions-mixed/:id with mode=training and no exam flag", async () => {
  const { getMixedQuestions } = await apiClientModule;
  fetchCalls.length = 0;
  await getMixedQuestions(1, "it", { limit: 5, mode: "training" });
  const url = urlOf(fetchCalls[0]);
  assert.match(url.pathname, /\/questions-mixed\/1$/);
  assert.equal(url.searchParams.get("mode"), "training");
  assert.equal(url.searchParams.has("exam"), false);
});

test("the training clients cannot express exam/assessment any more (types) and never send the exam flag", async () => {
  const { getQuestionsByTopic, getMixedQuestions } = await apiClientModule;
  fetchCalls.length = 0;
  // @ts-expect-error: "assessment" non e' piu' un mode valido sulle route di training
  await getQuestionsByTopic(1, "it", { limit: 5, mode: "assessment" });
  // @ts-expect-error: "exam" non e' piu' un mode valido sulle route di training
  await getMixedQuestions(1, "it", { limit: 5, mode: "exam" });
  // @ts-expect-error: l'opzione exam e' stata rimossa dal client di training
  await getMixedQuestions(1, "it", { limit: 5, exam: true });
  assert.equal(urlOf(fetchCalls[2]).searchParams.has("exam"), false);
});

test("getAssessmentQuestions: dedicated route, only lang, no client-decided shape", async () => {
  const { getAssessmentQuestions } = await apiClientModule;
  fetchCalls.length = 0;
  await getAssessmentQuestions(10, "en");
  const url = urlOf(fetchCalls[0]);
  assert.match(url.pathname, /\/assessment\/questions\/10$/);
  assert.deepEqual([...url.searchParams.keys()], ["lang"]);
  assert.equal(url.searchParams.get("lang"), "en");
});

test("getTopicAssessmentQuestions: dedicated topic route, only lang", async () => {
  const { getTopicAssessmentQuestions } = await apiClientModule;
  fetchCalls.length = 0;
  await getTopicAssessmentQuestions(338, "it");
  const url = urlOf(fetchCalls[0]);
  assert.match(url.pathname, /\/assessment\/topics\/338\/questions$/);
  assert.deepEqual([...url.searchParams.keys()], ["lang"]);
});

test("getMockExamQuestions: dedicated route, only lang (no limit/exam/mode/shuffle/strict)", async () => {
  const { getMockExamQuestions } = await apiClientModule;
  fetchCalls.length = 0;
  await getMockExamQuestions(10, "fr");
  const url = urlOf(fetchCalls[0]);
  assert.match(url.pathname, /\/mock-exam\/questions\/10$/);
  assert.deepEqual([...url.searchParams.keys()], ["lang"]);
});

test("pool counts use /question-pool/*, return a number and never touch the question bank routes", async () => {
  const { getCertificationPoolTotal, getTopicPoolTotal } = await apiClientModule;
  fetchCalls.length = 0;
  assert.equal(await getCertificationPoolTotal(10, "en", true), 7);
  assert.equal(await getTopicPoolTotal(338, "en"), 7);
  const cert = urlOf(fetchCalls[0]);
  const topic = urlOf(fetchCalls[1]);
  assert.match(cert.pathname, /\/question-pool\/certifications\/10$/);
  assert.equal(cert.searchParams.get("strict"), "1");
  assert.match(topic.pathname, /\/question-pool\/topics\/338$/);
  for (const call of fetchCalls) {
    assert.doesNotMatch(urlOf(call).pathname, /\/questions(-mixed)?\//);
  }
});
