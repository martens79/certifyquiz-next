import assert from "node:assert/strict";
import test from "node:test";

// getQuestionsByTopic/getMixedQuestions finiscono in apiFetch -> fetch reale:
// mockiamo fetch globale per catturare l'URL costruito, stesso pattern di
// tests/analytics-funnel-event.test.ts. Nessun `window` necessario qui:
// getToken() (chiamato da apiFetch per il bearer) ritorna null senza browser,
// che è esattamente il comportamento "guest" che vogliamo in questi test.
const fetchCalls: string[] = [];
Object.defineProperty(globalThis, "fetch", {
  value: (input: string) => {
    fetchCalls.push(String(input));
    return Promise.resolve(
      new Response(JSON.stringify({ questions: [], poolTotal: 0 }), { status: 200 })
    );
  },
  configurable: true,
});

const apiClientModule = import("../src/lib/apiClient.ts");

function queryOf(url: string) {
  return new URL(url, "http://localhost").searchParams;
}

test("12) getQuestionsByTopic: mode=training is sent explicitly when requested", async () => {
  const { getQuestionsByTopic } = await apiClientModule;
  fetchCalls.length = 0;
  await getQuestionsByTopic(1, "it", { limit: 5, mode: "training" });
  assert.equal(fetchCalls.length, 1);
  assert.equal(queryOf(fetchCalls[0]).get("mode"), "training");
});

test("13) getQuestionsByTopic: mode=assessment is sent explicitly when requested", async () => {
  const { getQuestionsByTopic } = await apiClientModule;
  fetchCalls.length = 0;
  await getQuestionsByTopic(1, "it", { limit: 5, mode: "assessment" });
  assert.equal(queryOf(fetchCalls[0]).get("mode"), "assessment");
});

test("14) getMixedQuestions: mode=exam is sent explicitly when requested, alongside the pre-existing exam flag", async () => {
  const { getMixedQuestions } = await apiClientModule;
  fetchCalls.length = 0;
  await getMixedQuestions(1, "it", { limit: 5, exam: true, mode: "exam" });
  const params = queryOf(fetchCalls[0]);
  assert.equal(params.get("mode"), "exam");
  assert.equal(params.get("exam"), "1", "il flag exam preesistente (selezione blueprint) deve restare intatto e separato da mode");
});

test("getMixedQuestions: mode=training is sent explicitly for a training-intent mixed quiz fetch", async () => {
  const { getMixedQuestions } = await apiClientModule;
  fetchCalls.length = 0;
  await getMixedQuestions(1, "it", { limit: 5, mode: "training" });
  assert.equal(queryOf(fetchCalls[0]).get("mode"), "training");
});

test("no `mode` passed -> the param is simply absent, never defaulted to a guessed value (legacy/standalone callers, e.g. ReviewMicroQuiz)", async () => {
  const { getQuestionsByTopic, getMixedQuestions } = await apiClientModule;
  fetchCalls.length = 0;
  await getQuestionsByTopic(1, "it", { limit: 1 });
  await getMixedQuestions(1, "it", { limit: 1 });
  assert.equal(queryOf(fetchCalls[0]).has("mode"), false);
  assert.equal(queryOf(fetchCalls[1]).has("mode"), false);
});
