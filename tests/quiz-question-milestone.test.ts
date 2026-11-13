import assert from "node:assert/strict";
import test from "node:test";
import { observeQuizQuestionMilestone } from "../src/lib/quiz-question-milestone";

test("counts a quiz milestone only while its question intersects the visible page", t => {
  t.after(() => Reflect.deleteProperty(globalThis, "IntersectionObserver"));
  let onIntersection!: IntersectionObserverCallback;
  const observers: Array<{ disconnect(): void }> = [];
  Object.defineProperty(globalThis, "IntersectionObserver", { configurable: true, value: class {
    constructor(callback: IntersectionObserverCallback) {
      onIntersection = callback;
      observers.push(this);
    }
    observe() {}
    disconnect() {}
  } });
  const document = Object.assign(new EventTarget(), { visibilityState: "hidden" });
  const question = { ownerDocument: document, isConnected: true } as unknown as HTMLElement;
  const tracked = new Set<number>();
  const events: number[] = [];
  const emit = (milestone: number) => events.push(milestone);
  const deliver = (ratio: number) => onIntersection([
    { target: question, isIntersecting: ratio > 0, intersectionRatio: ratio } as IntersectionObserverEntry,
  ], observers.at(-1) as IntersectionObserver);

  assert.equal(observeQuizQuestionMilestone(question, 4, tracked, emit), undefined);
  const detach = observeQuizQuestionMilestone(question, 1, tracked, emit)!;
  deliver(1);
  assert.deepEqual(events, []);
  deliver(0);
  document.visibilityState = "visible";
  document.dispatchEvent(new Event("visibilitychange"));
  assert.deepEqual(events, []);
  deliver(0.5);
  assert.deepEqual(events, [1]);
  assert.equal(observeQuizQuestionMilestone(question, 1, tracked, emit), undefined);
  detach();

  const stale = observeQuizQuestionMilestone(question, 5, tracked, emit)!;
  stale();
  deliver(1);
  assert.deepEqual(events, [1]);
  observeQuizQuestionMilestone(question, 5, tracked, emit);
  deliver(1);
  assert.deepEqual(events, [1, 5]);
});
