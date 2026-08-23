import assert from "node:assert/strict";
import test from "node:test";

// node:test non ha localStorage (a differenza del browser): stub minimo
// in-memory prima di importare il modulo sotto test, stesso principio già
// necessario per qualunque helper client-side testato fuori da un browser.
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}
(globalThis as unknown as { localStorage: MemoryStorage }).localStorage = new MemoryStorage();

// Import statico: le funzioni sotto test toccano localStorage solo quando
// vengono chiamate (mai a livello di modulo), quindi lo stub sopra è già
// pronto in tempo per ogni test.
import {
  loadLocalProgress,
  saveLocalProgress,
  summarizeModuleProgress,
  EMPTY_PROGRESS,
} from "../src/lib/review-module-progress.ts";

test("loadLocalProgress returns null when nothing was saved yet", () => {
  assert.equal(loadLocalProgress(999), null);
});

test("saveLocalProgress / loadLocalProgress round-trip", () => {
  const state = {
    completedSectionIds: ["intro", "lesson-1"],
    currentSectionId: "lesson-1",
    completed: false,
    assessmentScore: null,
    assessmentTotal: null,
  };
  saveLocalProgress(30, state);
  assert.deepEqual(loadLocalProgress(30), state);
});

test("loadLocalProgress fails safe on malformed JSON", () => {
  localStorage.setItem("cq:review-progress:31", "{not json");
  assert.equal(loadLocalProgress(31), null);
});

test("loadLocalProgress fails safe on a shape without completedSectionIds", () => {
  localStorage.setItem("cq:review-progress:32", JSON.stringify({ foo: "bar" }));
  assert.equal(loadLocalProgress(32), null);
});

test("loadLocalProgress backfills missing fields from EMPTY_PROGRESS (forward compat)", () => {
  localStorage.setItem("cq:review-progress:33", JSON.stringify({ completedSectionIds: ["intro"] }));
  assert.deepEqual(loadLocalProgress(33), { ...EMPTY_PROGRESS, completedSectionIds: ["intro"] });
});

test("summarizeModuleProgress computes completed/total/percent", () => {
  const sectionIds = ["intro", "lesson-1", "lesson-2", "assessment"];
  assert.deepEqual(summarizeModuleProgress(sectionIds, []), { completed: 0, total: 4, percent: 0 });
  assert.deepEqual(summarizeModuleProgress(sectionIds, ["intro", "lesson-1"]), { completed: 2, total: 4, percent: 50 });
  assert.deepEqual(summarizeModuleProgress(sectionIds, sectionIds), { completed: 4, total: 4, percent: 100 });
});

test("summarizeModuleProgress ignores stale ids no longer present in the structure", () => {
  const sectionIds = ["intro", "lesson-1"];
  const result = summarizeModuleProgress(sectionIds, ["intro", "removed-section", "another-ghost"]);
  assert.deepEqual(result, { completed: 1, total: 2, percent: 50 });
});

test("summarizeModuleProgress never divides by zero for an empty structure", () => {
  assert.deepEqual(summarizeModuleProgress([], []), { completed: 0, total: 0, percent: 0 });
});
