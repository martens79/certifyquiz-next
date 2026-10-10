import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PMP from "../src/certifications/data/PMP.ts";
import Box from "../src/components/certifications/CertificationPracticeBox.tsx";
import { practiceTopicCoverage } from "../src/lib/practice-topic-coverage.ts";

for (const lang of ["it", "en", "fr", "es"] as const) {
  test(`PMP ${lang}: practice box follows available localized topics`, () => {
    // Current FR/ES have scheduling questions but no translated answer options;
    // they are excluded by the API's availability filter. IT/EN have all topics.
    const available = PMP.topics.filter((t) => !(lang === "fr" || lang === "es") || t.id !== 290);
    const titles = available.map((t) => t.title[lang]);
    const selected = practiceTopicCoverage("pmp", titles, PMP.topics.map((t) => t.title));
    const html = renderToStaticMarkup(createElement(Box, {
      lang, certificationTitle: PMP.title[lang], quizHref: `/${lang}/quiz/pmp`, topics: selected,
    }));
    const missingTitle = PMP.topics.find((t) => t.id === 290)!.title[lang];
    if (lang === "fr" || lang === "es") assert.ok(!html.includes(missingTitle));
    else assert.ok(html.includes(missingTitle));
    assert.equal(selected.length, available.length);
  });
}
test("unknown PMP inventory retains fallback; other certifications retain their registry", () => {
  const registry = [{ it: "A", en: "A", fr: "A", es: "A" }];
  assert.equal(practiceTopicCoverage("pmp", [], registry), registry);
  assert.equal(practiceTopicCoverage("pmp", [" "], registry), registry);
  assert.equal(practiceTopicCoverage("ccna", ["Database"], registry), registry);
});
