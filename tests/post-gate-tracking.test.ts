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

test("a gate on another question creates a new gate instance", async () => {
  const { getOrCreatePostGateCohort } = await mod;
  const first = getOrCreatePostGateCohort(8, 10);
  const second = getOrCreatePostGateCohort(8, 11);
  assert.notEqual(first.gateInstanceId, second.gateInstanceId);
  assert.equal(second.gateQuestionId, "11");
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
