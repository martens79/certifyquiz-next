import assert from "node:assert/strict";
import test from "node:test";

const store = new Map<string, string>();
let uuidSequence = 0;
(globalThis as any).localStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
};
Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => {
      uuidSequence += 1;
      return `aaaaaaaa-aaaa-4aaa-8aaa-${String(uuidSequence).padStart(12, "0")}`;
    },
  },
  configurable: true,
});
const mod = import("../src/lib/post-gate-tracking.ts");

test("the same rendered gate survives rerender and refresh", async () => {
  const { getOrCreatePostGateCohort } = await mod;
  const first = getOrCreatePostGateCohort(7, 10);
  const second = getOrCreatePostGateCohort(7, 10);
  assert.equal(first.gateInstanceId, second.gateInstanceId);
});

test("later paywalls on other questions reuse the active gate instance", async () => {
  const { getOrCreatePostGateCohort } = await mod;
  const first = getOrCreatePostGateCohort(8, 10);
  const second = getOrCreatePostGateCohort(8, 11);
  assert.equal(first.gateInstanceId, second.gateInstanceId);
  assert.equal(second.gateQuestionId, "10");
});

test("cohorts are isolated between authenticated users", async () => {
  const { getOrCreatePostGateCohort } = await mod;
  const first = getOrCreatePostGateCohort(9, 10);
  const second = getOrCreatePostGateCohort(10, 10);
  assert.notEqual(first.gateInstanceId, second.gateInstanceId);
});

test("continued free is claimed once per gate instance", async () => {
  const { claimContinuedFree, getOrCreatePostGateCohort } = await mod;
  const cohort = getOrCreatePostGateCohort(11, 10);
  assert.equal(claimContinuedFree(cohort), true);
  assert.equal(claimContinuedFree(cohort), false);
});

test("deduplication survives unavailable localStorage within the page lifetime", async () => {
  const { claimContinuedFree, getOrCreatePostGateCohort } = await mod;
  const stableStorage = (globalThis as any).localStorage;
  (globalThis as any).localStorage = {
    getItem: () => { throw new Error("blocked"); },
    setItem: () => { throw new Error("blocked"); },
  };
  try {
    const first = getOrCreatePostGateCohort(12, 10);
    const second = getOrCreatePostGateCohort(12, 10);
    assert.equal(first.gateInstanceId, second.gateInstanceId);
    assert.equal(claimContinuedFree(first), true);
    assert.equal(claimContinuedFree(second), false);
  } finally {
    (globalThis as any).localStorage = stableStorage;
  }
});

test("one gate id spans continue, five answers, repeated paywalls, premium click and checkout", async () => {
  const { claimContinuedFree, getOrCreatePostGateCohort, readPostGateCohort } = await mod;
  const userId = 13;
  const entryGate = getOrCreatePostGateCohort(userId, 100);
  const emitted: Array<{ event: string; gateInstanceId: string }> = [];

  if (claimContinuedFree(entryGate)) {
    emitted.push({ event: "continued_free_after_gate", gateInstanceId: entryGate.gateInstanceId });
  }
  for (const questionId of [101, 102, 103, 104, 105]) {
    const active = readPostGateCohort(userId);
    assert.ok(active);
    emitted.push({ event: "post_gate_question_answered", gateInstanceId: active.gateInstanceId });
    const repeatedPaywall = getOrCreatePostGateCohort(userId, questionId);
    emitted.push({ event: "paywall_viewed", gateInstanceId: repeatedPaywall.gateInstanceId });
  }

  const premiumCohort = readPostGateCohort(userId);
  assert.ok(premiumCohort);
  emitted.push({ event: "premium_clicked_locked_explanation", gateInstanceId: premiumCohort.gateInstanceId });
  emitted.push({ event: "checkout_started", gateInstanceId: premiumCohort.gateInstanceId });

  assert.deepEqual(new Set(emitted.map((event) => event.gateInstanceId)), new Set([entryGate.gateInstanceId]));
  assert.equal(emitted.filter((event) => event.event === "continued_free_after_gate").length, 1);
  assert.equal(emitted.filter((event) => event.event === "post_gate_question_answered").length, 5);
  assert.equal(emitted.filter((event) => event.event === "paywall_viewed").length, 5);
  assert.notEqual(emitted.find((event) => event.event === "premium_clicked_locked_explanation")?.gateInstanceId, null);
});
