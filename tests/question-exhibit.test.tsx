import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import QuestionExhibit from "../src/components/quiz/QuestionExhibit";
import { MicroQuizCard, normalize } from "../src/components/reviews/module/ReviewMicroQuiz";
import type { Question as ApiQuestion } from "../src/lib/apiClient";

const CLI_OUTPUT = [
  "R1# show vrrp brief",
  "Interface  Grp  Pri  Time  Own  Pre  State   Master addr     Group addr",
  "Gi0/1       10  100  3210  -    Y    Backup  10.10.10.2       10.10.10.1",
  "",
  "R2# show vrrp brief",
  "Gi0/1       10   90  3210  -    Y    Master  10.10.10.2       10.10.10.1",
].join("\n");

const t = {
  cta: "Check yourself",
  loading: "Loading a question…",
  correct: "Correct!",
  wrong: "Not quite.",
  empty: "No question available for this topic right now.",
};

function apiQuestion(overrides: Partial<ApiQuestion> = {}): ApiQuestion {
  return {
    id: 9001,
    question: "Based on the output shown, which statement is correct?",
    explanation: null,
    question_type: "cli-output",
    exhibit: { title: "Exhibit", kind: "cli", content: CLI_OUTPUT },
    answers: [
      { id: 1, text: "R1 is Backup because its priority is higher", is_correct: 0 },
      { id: 2, text: "R2 is Master because R1 lost its virtual IP", is_correct: 1 },
    ],
    ...overrides,
  } as ApiQuestion;
}

const card = (question: ReturnType<typeof normalize>, selectedId: number | string | null = null) =>
  renderToStaticMarkup(createElement(MicroQuizCard, { question, selectedId, onSelect: () => {}, t }));

/* -------------------------------- QuestionExhibit ------------------------------- */

test("QuestionExhibit renders title and exact content in a figure/pre", () => {
  const html = renderToStaticMarkup(
    createElement(QuestionExhibit, { exhibit: { title: "Nmap scan output", kind: "cli", content: "22/tcp open  ssh" } })
  );
  assert.match(html, /<figure /);
  assert.match(html, /<figcaption[^>]*>Nmap scan output<\/figcaption>/);
  assert.match(html, /<pre [^>]*>22\/tcp open {2}ssh<\/pre>/);
});

test("QuestionExhibit uses the default title when none is stored", () => {
  const html = renderToStaticMarkup(createElement(QuestionExhibit, { exhibit: { content: "x" } }));
  assert.match(html, /<figcaption[^>]*>Exhibit<\/figcaption>/);
});

test("QuestionExhibit preserves newlines, blank lines and alignment spaces", () => {
  const html = renderToStaticMarkup(createElement(QuestionExhibit, { exhibit: { content: CLI_OUTPUT } }));
  assert.ok(html.includes(CLI_OUTPUT), "content must appear verbatim inside the markup");
  assert.match(html, /whitespace-pre/);
  assert.match(html, /overflow-x-auto/);
});

test("QuestionExhibit renders nothing for null / undefined / empty content", () => {
  for (const exhibit of [null, undefined, {}, { title: "T" }, { content: "" }]) {
    assert.equal(renderToStaticMarkup(createElement(QuestionExhibit, { exhibit })), "");
  }
});

test("QuestionExhibit escapes HTML in DB-provided content", () => {
  const html = renderToStaticMarkup(
    createElement(QuestionExhibit, { exhibit: { content: '<script>alert(1)</script> <img src=x onerror=alert(1)>' } })
  );
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /<img /);
  assert.match(html, /&lt;script&gt;/);
});

test("QuestionExhibit opts out of Tailwind Typography and never depends on a question type", () => {
  const html = renderToStaticMarkup(createElement(QuestionExhibit, { exhibit: { content: "x" } }));
  assert.match(html, /class="not-prose /);
});

/* ------------------------------ ReviewMicroQuiz mapper ------------------------------ */

test("ReviewMicroQuiz normalize preserves the exhibit exactly", () => {
  const q = normalize(apiQuestion());
  assert.deepEqual(q.exhibit, { title: "Exhibit", kind: "cli", content: CLI_OUTPUT });
});

test("ReviewMicroQuiz normalize keeps the exhibit whatever the question_type", () => {
  for (const question_type of ["cli-output", "exhibit", "scenario", "standard", null, undefined]) {
    const q = normalize(apiQuestion({ question_type } as Partial<ApiQuestion>));
    assert.equal(q.exhibit?.content, CLI_OUTPUT, `question_type=${String(question_type)}`);
  }
});

test("ReviewMicroQuiz normalize: exhibit null / missing stays null and the rest is unchanged", () => {
  for (const exhibit of [null, undefined]) {
    const q = normalize(apiQuestion({ exhibit } as Partial<ApiQuestion>));
    assert.equal(q.exhibit, null);
    assert.equal(q.question, "Based on the output shown, which statement is correct?");
    assert.deepEqual(
      q.answers.map((a) => a.isCorrect),
      [false, true]
    );
  }
});

/* ------------------------------ ReviewMicroQuiz card ------------------------------- */

test("MicroQuizCard shows the exhibit before the question text", () => {
  const html = card(normalize(apiQuestion()));
  const figureAt = html.indexOf("<figure");
  const questionAt = html.indexOf("Based on the output shown");
  assert.ok(figureAt >= 0, "exhibit must be rendered");
  assert.ok(questionAt > figureAt, "exhibit must come before the question text");
  assert.ok(html.includes(CLI_OUTPUT));
  assert.match(html, /R2 is Master because R1 lost its virtual IP/);
});

test("MicroQuizCard keeps the exhibit visible after an answer is selected", () => {
  const html = card(normalize(apiQuestion()), 1);
  assert.ok(html.includes(CLI_OUTPUT));
  assert.match(html, /role="status"/);
});

test("MicroQuizCard with null exhibit: no figure, question and answers still render (no regression)", () => {
  const html = card(normalize(apiQuestion({ exhibit: null })));
  assert.doesNotMatch(html, /<figure/);
  assert.match(html, /Based on the output shown/);
  assert.match(html, /R1 is Backup because its priority is higher/);
});

test("MicroQuizCard on mobile: the exhibit scrolls inside itself instead of widening the page", () => {
  const html = card(normalize(apiQuestion()));
  assert.match(html, /<figure [^>]*overflow-hidden/);
  assert.match(html, /<pre [^>]*overflow-x-auto/);
});
