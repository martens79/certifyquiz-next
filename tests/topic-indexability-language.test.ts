import assert from "node:assert/strict";
import test from "node:test";
import { isTopicIndexable } from "../src/lib/seo/topic-indexability.ts";

const word = "practical";
const rich = {
  title: "Database Fundamentals",
  description: Array.from({ length: 40 }, () => word).join(" "),
  intro: "x".repeat(200),
  content: Array.from({ length: 320 }, (_, i) => `${word}${i % 7}`).join(" ") + " ".repeat(2000).replace(/ /g, "a"),
  faq: [{ q: "q1", a: "a1" }, { q: "q2", a: "a2" }],
};

test("a fully written topic is indexable only when the requested language has questions", () => {
  // /api/topic-pages now returns the count for the requested language: an EN page whose
  // only questions are Italian must arrive here with 0 and stay noindex.
  assert.equal(isTopicIndexable({ ...rich, questionCount: 0 }), false);
  assert.equal(isTopicIndexable({ ...rich, questionCount: null }), false);
  assert.equal(isTopicIndexable({ ...rich, questionCount: 12 }), true);
});
