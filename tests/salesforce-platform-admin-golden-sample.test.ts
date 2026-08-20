import assert from "node:assert/strict";
import test from "node:test";

import {
  SALESFORCE_PLATFORM_ADMIN_TOPIC_01_QUIZZES as quizzes,
  SALESFORCE_PLATFORM_ADMIN_TOPIC_01_REVIEW as review,
  SALESFORCE_PLATFORM_ADMIN_TOPIC_01_SOURCES as sources,
} from "../src/certifications/editorial/salesforce-platform-administrator-topic-01.en.ts";

test("golden sample has exactly one EN review backed by official Salesforce sources", () => {
  assert.equal(review.language, "en");
  assert.equal(review.topicSlug, "platform-foundations-org-setup");
  assert.deepEqual(review.objectiveIds, ["CS-01"]);
  assert.ok(review.content.split(/\s+/u).length >= 900);
  assert.ok(sources.length >= 3);
  assert.ok(sources.every((source) => new URL(source.url).hostname.endsWith("salesforce.com")));
});

test("golden quiz set has the required count, difficulty mix, and unique ids", () => {
  assert.equal(quizzes.length, 14);
  assert.equal(new Set(quizzes.map((question) => question.id)).size, 14);
  assert.deepEqual(
    Object.fromEntries(["easy", "medium", "hard"].map((difficulty) => [
      difficulty,
      quizzes.filter((question) => question.difficulty === difficulty).length,
    ])),
    { easy: 4, medium: 7, hard: 3 }
  );
});

test("every question has one valid answer and remains inside Topic 1 scope", () => {
  for (const question of quizzes) {
    assert.equal(question.topicSlug, "platform-foundations-org-setup");
    assert.equal(question.objectiveId, "CS-01");
    assert.equal(question.answers.length, 4);
    assert.equal(new Set(question.answers.map((answer) => answer.id)).size, 4);
    assert.ok(question.answers.some((answer) => answer.id === question.correctAnswerId));
    assert.ok(question.explanation.length >= 180);
  }
});

test("questions are semantically unique and fully supported by the review", () => {
  const normalizedPrompts = quizzes.map((question) =>
    question.prompt.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
  );
  assert.equal(new Set(normalizedPrompts).size, quizzes.length);
  assert.equal(quizzes.filter((question) => question.supportStatus === "SUPPORTED").length, 14);
  assert.ok(quizzes.every((question) => review.content.includes(`## ${question.reviewSection}`)));
});

test("correct-answer positions are balanced", () => {
  const counts = Object.fromEntries(
    ["A", "B", "C", "D"].map((id) => [
      id,
      quizzes.filter((question) => question.correctAnswerId === id).length,
    ])
  );
  assert.deepEqual(counts, { A: 4, B: 3, C: 4, D: 3 });
});
