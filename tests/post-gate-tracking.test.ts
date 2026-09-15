import assert from "node:assert/strict";
import test from "node:test";

const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
};
Object.defineProperty(globalThis, "crypto", { value: { randomUUID: () => "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" }, configurable: true });
const mod = import("../src/lib/post-gate-tracking.ts");

test("one stable cohort survives rerender/refresh", async () => {
  const { getOrCreatePostGateCohort } = await mod;
  const first = getOrCreatePostGateCohort(7, 10);
  const second = getOrCreatePostGateCohort(7, 11);
  assert.equal(first.gateInstanceId, second.gateInstanceId);
  assert.equal(second.gateQuestionId, "10");
});

test("continued free is claimed once per cohort", async () => {
  const { claimContinuedFree, getOrCreatePostGateCohort } = await mod;
  const cohort = getOrCreatePostGateCohort(7, 10);
  assert.equal(claimContinuedFree(cohort), true);
  assert.equal(claimContinuedFree(cohort), false);
});
