import assert from "node:assert/strict";
import test from "node:test";
import { businessStepCounts, eventCategory } from "../src/lib/admin-analytics.ts";

const event = (id: number, name: string, seconds = 0) => ({
  id,
  email: null,
  event: name,
  cert_slug: "ccna",
  topic_slug: null,
  lang: "it",
  score: 70,
  created_at: new Date(1_700_000_000_000 + seconds * 1000).toISOString(),
});

test("does not double count paired canonical and legacy events", () => {
  const counts = businessStepCounts([
    event(1, "assessment_completed"),
    event(2, "quiz_result_viewed", 1),
    event(3, "purchase_completed"),
    event(4, "premium_converted", 1),
  ]);

  assert.equal(counts.assessment_completed, 1);
  assert.equal(counts.purchase_completed, 1);
});

test("keeps unpaired historical legacy events", () => {
  const counts = businessStepCounts([
    event(1, "result_viewed"),
    event(2, "assessment_completed", 60),
  ]);

  assert.equal(counts.assessment_completed, 2);
});

test("classifies technical and business events centrally", () => {
  assert.equal(eventCategory("assessment_started"), "CORE KPI");
  assert.equal(eventCategory("checkout_created"), "COMMERCE");
  assert.equal(eventCategory("gate_hit"), "LEGACY");
  assert.equal(eventCategory("unknown_retry"), "DEBUG/TECHNICAL");
});
