import assert from "node:assert/strict";
import test from "node:test";
import { evaluateReviewIndexability } from "../src/lib/review-indexability.ts";

const substantialSection = Array.from(
  { length: 90 },
  (_, index) => `concept${index} is explained with a practical certification example`
).join(" ");

test("indexes only a substantial, structured and fully described review", () => {
  const result = evaluateReviewIndexability({
    topicTitle: "Network Fundamentals",
    title: "Network Fundamentals: exam review and key concepts",
    metaTitle: "Network Fundamentals Review for CCNA | CertifyQuiz",
    metaDescription:
      "Review the essential network fundamentals for CCNA with practical examples and exam-focused explanations.",
    intro:
      "A focused review of the network concepts you should understand before attempting the related CCNA quiz.",
    content: `## Core concepts\n\n${substantialSection}\n\n## Exam application\n\n${substantialSection}`,
  });

  assert.equal(result.indexable, true);
  assert.deepEqual(result.reasons, []);
});

test("keeps thin or placeholder reviews noindex and explains why", () => {
  const result = evaluateReviewIndexability({
    topicTitle: "Network Fundamentals",
    title: "Network Fundamentals",
    metaTitle: null,
    metaDescription: null,
    intro: "Full review coming soon.",
    content: "## Summary\n\nShort placeholder.",
  });

  assert.equal(result.indexable, false);
  assert.ok(result.reasons.includes("content_below_900_characters"));
  assert.ok(result.reasons.includes("content_below_150_words"));
  assert.ok(result.reasons.includes("fewer_than_two_h2_sections"));
  assert.ok(result.reasons.includes("missing_meta_title"));
  assert.ok(result.reasons.includes("generic_title_matches_topic"));
  assert.ok(result.reasons.includes("placeholder_language_detected"));
});
