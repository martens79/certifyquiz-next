import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { hasQuizInventory } from "../src/lib/quiz-availability.ts";
Object.assign(globalThis, { React });
import TopicContent from "../src/components/TopicContent.tsx";
for (const lang of ["en", "it", "fr", "es"] as const) {
  test(`${lang}: empty inventory keeps study content without a quiz action`, () => {
    for (const count of [0, null, undefined, -1, NaN]) {
      assert.equal(hasQuizInventory(count), false);
      const html = renderToStaticMarkup(React.createElement(TopicContent, {
        lang, content: "Useful study material", reviewRoute: "/review",
        quizRoute: hasQuizInventory(count) ? "/quiz/topic/123" : undefined,
      }));
      assert.match(html, /Useful study material/);
      assert.match(html, /href="\/review"/);
      assert.doesNotMatch(html, /href="\/quiz/);
    }
  });
  test(`${lang}: valid inventory retains the quiz action`, () => {
    assert.equal(hasQuizInventory(12), true);
    const html = renderToStaticMarkup(React.createElement(TopicContent, {
      lang, content: "Useful study material", quizRoute: "/quiz/topic/123",
    }));
    assert.match(html, /href="\/quiz\/topic\/123"/);
  });
}


import { isCertificationIndexable } from "../src/lib/seo/certification-indexability.ts";
test("certification metadata and sitemap require known positive inventory", () => {
  for (const count of [0, null, undefined, -1, NaN]) {
    assert.equal(isCertificationIndexable({ slug: "ccna", questionCount: count }), false);
  }
  assert.equal(isCertificationIndexable({ slug: "ccna", questionCount: 20 }), true);
  assert.equal(isCertificationIndexable("ccna"), true);
});
