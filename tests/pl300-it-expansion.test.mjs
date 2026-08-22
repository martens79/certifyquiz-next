import test from "node:test";
import assert from "node:assert/strict";
import { blueprint, questions } from "../scripts/data/pl300-it-expansion.mjs";

const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

test("PL-300 expansion contains exactly 120 valid Italian questions", () => {
  assert.equal(questions.length, 120);
  for (const item of questions) {
    assert.ok(item.question.length >= 35);
    assert.equal(item.options.length, 4);
    assert.equal(new Set(item.options).size, 4);
    assert.equal(item.options.filter((o) => o === item.correct).length, 1);
    assert.ok(item.explanation.length >= 80);
    assert.ok(Object.hasOwn(blueprint, item.topic));
  }
  assert.equal(new Set(questions.map((item) => normalize(item.question))).size, 120);
});

test("PL-300 projected topic allocation follows the repository blueprint", () => {
  const initial = Object.fromEntries(Object.keys(blueprint).map((topic) => [topic, 30]));
  for (const [topic, target] of Object.entries(blueprint)) {
    const added = questions.filter((item) => item.topic === topic).length;
    assert.equal(initial[topic] + added, target);
  }
  assert.equal(Object.values(blueprint).reduce((a, b) => a + b, 0), 240);
});
