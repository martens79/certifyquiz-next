import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import ExamBlueprintCard from "../src/components/certification/ExamBlueprintCard";
import type { ExamBlueprint } from "../src/certifications/types";

const WITH_PERCENTAGES: ExamBlueprint = {
  examName: "Test Certification Exam",
  examCode: "TEST-101",
  examVersion: "v1",
  provider: "Test Provider",
  officialSourceName: "Official test source",
  officialSourceUrl: "https://example.com/official",
  officialExamPageUrl: "https://example.com/exam",
  lastVerifiedAt: "2026-08-01",
  domains: [
    { name: "Domain one", percentage: 60 },
    { name: "Domain two", percentage: 40 },
  ],
};

test("renders a verified blueprint with percentages and a safe external link", () => {
  const html = renderToStaticMarkup(
    createElement(ExamBlueprintCard, { blueprint: WITH_PERCENTAGES, lang: "en" })
  );

  assert.match(html, /Official exam blueprint/);
  assert.match(html, /Test Certification Exam/);
  assert.match(html, /Domain one/);
  assert.match(html, /60%/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /Official exam page/);
});

test("renders domains without inventing weights", () => {
  const html = renderToStaticMarkup(
    createElement(ExamBlueprintCard, {
      blueprint: {
        ...WITH_PERCENTAGES,
        domains: [{ name: "Published domain" }],
      },
      lang: "it",
    })
  );

  assert.match(html, /Published domain/);
  assert.match(html, /non indica un peso percentuale/);
  assert.doesNotMatch(html, /%/);
});

test("renders nothing when a certification has no blueprint", () => {
  assert.equal(
    renderToStaticMarkup(createElement(ExamBlueprintCard, { lang: "fr" })),
    ""
  );
});

test("supports all four interface languages", () => {
  const headings = {
    it: "Programma ufficiale dell’esame",
    en: "Official exam blueprint",
    fr: "Programme officiel de l’examen",
    es: "Programa oficial del examen",
  } as const;

  for (const lang of ["it", "en", "fr", "es"] as const) {
    const html = renderToStaticMarkup(
      createElement(ExamBlueprintCard, { blueprint: WITH_PERCENTAGES, lang })
    );
    assert.match(html, new RegExp(headings[lang]));
  }
});
