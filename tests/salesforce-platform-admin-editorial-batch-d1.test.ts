import assert from "node:assert/strict";
import test from "node:test";

import { SALESFORCE_PLATFORM_ADMIN_TOPIC_01_QUIZZES as topic1 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-01.en.ts";
import {
  SALESFORCE_PLATFORM_ADMIN_TOPIC_02_QUIZZES as topic2,
  SALESFORCE_PLATFORM_ADMIN_TOPIC_02_REVIEW as review2,
  SALESFORCE_PLATFORM_ADMIN_TOPIC_02_SOURCES as sources2,
} from "../src/certifications/editorial/salesforce-platform-administrator-topic-02.en.ts";
import {
  SALESFORCE_PLATFORM_ADMIN_TOPIC_03_QUIZZES as topic3,
  SALESFORCE_PLATFORM_ADMIN_TOPIC_03_REVIEW as review3,
  SALESFORCE_PLATFORM_ADMIN_TOPIC_03_SOURCES as sources3,
} from "../src/certifications/editorial/salesforce-platform-administrator-topic-03.en.ts";

function validateTopic(
  questions: typeof topic2 | typeof topic3,
  review: typeof review2 | typeof review3,
  expected: { count: number; slug: string; objectives: string[]; difficulty: Record<string, number> }
) {
  assert.equal(questions.length, expected.count);
  assert.equal(review.topicSlug, expected.slug);
  assert.deepEqual([...review.objectiveIds].sort(), [...expected.objectives].sort());
  assert.ok(review.content.split(/\s+/u).length >= 900);
  assert.equal(new Set(questions.map((question) => question.id)).size, expected.count);
  assert.deepEqual(
    Object.fromEntries(["easy", "medium", "hard"].map((difficulty) => [difficulty, questions.filter((question) => question.difficulty === difficulty).length])),
    expected.difficulty
  );
  for (const question of questions) {
    assert.equal(question.topicSlug, expected.slug);
    assert.ok(expected.objectives.includes(question.objectiveId));
    assert.equal(question.answers.length, 4);
    assert.equal(new Set(question.answers.map((answer) => answer.id)).size, 4);
    assert.ok(question.answers.some((answer) => answer.id === question.correctAnswerId));
    assert.equal(question.supportStatus, "SUPPORTED");
    assert.ok(review.content.includes(`## ${question.reviewSection}`));
    assert.ok(question.explanation.length >= 140);
  }
  for (const objective of expected.objectives) {
    assert.ok(questions.some((question) => question.objectiveId === objective));
  }
}

test("Topic 2 meets the frozen editorial allocation and support gate", () => {
  validateTopic(topic2, review2, {
    count: 20,
    slug: "users-authentication-access",
    objectives: ["CS-03", "CS-04"],
    difficulty: { easy: 5, medium: 10, hard: 5 },
  });
  assert.ok(sources2.every((source) => new URL(source.url).hostname.endsWith("salesforce.com")));
});

test("Topic 3 meets the frozen editorial allocation and support gate", () => {
  validateTopic(topic3, review3, {
    count: 24,
    slug: "permissions-record-sharing",
    objectives: ["CS-05", "CS-06"],
    difficulty: { easy: 5, medium: 13, hard: 6 },
  });
  assert.ok(sources3.every((source) => new URL(source.url).hostname.endsWith("salesforce.com")));
});

test("D1 and Topic 1 corpus have unique ids, prompts, and no near-duplicate prompts", () => {
  const corpus = [...topic1, ...topic2, ...topic3];
  assert.equal(corpus.length, 58);
  assert.equal(new Set(corpus.map((question) => question.id)).size, 58);
  const tokens = corpus.map((question) => new Set(question.prompt.toLowerCase().match(/[a-z0-9]+/g) ?? []));
  assert.equal(new Set(corpus.map((question) => question.prompt.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim())).size, 58);
  for (let left = 0; left < tokens.length; left += 1) {
    for (let right = left + 1; right < tokens.length; right += 1) {
      const intersection = [...tokens[left]].filter((token) => tokens[right].has(token)).length;
      const union = new Set([...tokens[left], ...tokens[right]]).size;
      assert.ok(intersection / union < 0.8, `near-duplicate prompts: ${corpus[left].id} / ${corpus[right].id}`);
    }
  }
});

test("D1 batch totals and answer-key distributions are non-degenerate", () => {
  const batch = [...topic2, ...topic3];
  assert.equal(batch.length, 44);
  for (const questions of [topic2, topic3, batch]) {
    const counts = ["A", "B", "C", "D"].map((id) => questions.filter((question) => question.correctAnswerId === id).length);
    assert.ok(Math.max(...counts) - Math.min(...counts) <= 3);
    assert.ok(counts.every((count) => count > 0));
  }
  const corpus = [...topic1, ...batch];
  const corpusCounts = ["A", "B", "C", "D"].map((id) => corpus.filter((question) => question.correctAnswerId === id).length);
  assert.ok(Math.max(...corpusCounts) - Math.min(...corpusCounts) <= 4);
});

test("Topic 2 and Topic 3 preserve the authentication/authorization boundary", () => {
  assert.ok(topic2.every((question) => !["CS-05", "CS-06"].includes(question.objectiveId)));
  assert.ok(topic3.every((question) => !["CS-03", "CS-04"].includes(question.objectiveId)));
  assert.match(review2.content, /Authentication answers \*\*who is attempting to enter\*\*/);
  assert.match(review3.content, /This topic owns \*\*CS-05\*\*/);
});
