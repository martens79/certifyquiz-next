import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import CCNA from "../src/certifications/data/CCNA.ts";
import MicrosoftSQLServer from "../src/certifications/data/MicrosoftSQLServer.ts";
import ExamBlueprintCard from "../src/components/certification/ExamBlueprintCard";
import type { ExamBlueprint } from "../src/certifications/types";

const LANGS = ["it", "en", "fr", "es"] as const;
const EN_ARTICLE = "https://www.certifyquiz.com/blog/ccna-practice-questions-200-301";
const ES_ARTICLE = "https://www.certifyquiz.com/es/blog/preguntas-ccna-200-301-2026-test-de-practica";

const blueprint = CCNA.examBlueprint as unknown as ExamBlueprint;
const render = (lang: (typeof LANGS)[number]) =>
  renderToStaticMarkup(createElement(ExamBlueprintCard, { blueprint, lang }));

test("CCNA related article: ES uses its Spanish article, IT/FR declare the English fallback", () => {
  const es = render("es");
  assert.ok(es.includes(`href="${ES_ARTICLE}"`));
  assert.doesNotMatch(es, /en inglés/);

  assert.ok(render("it").includes(`href="${EN_ARTICLE}"`));
  assert.match(render("it"), /\(in inglese\)/);
  assert.ok(render("fr").includes(`href="${EN_ARTICLE}"`));
  assert.match(render("fr"), /\(en anglais\)/);

  const en = render("en");
  assert.ok(en.includes(`href="${EN_ARTICLE}"`));
  assert.doesNotMatch(en, /in English\)/);
});

test("a blueprint without a declared article language never invents a language note", () => {
  const html = renderToStaticMarkup(
    createElement(ExamBlueprintCard, {
      lang: "es",
      blueprint: { ...blueprint, relatedArticleLang: undefined, relatedArticleByLang: undefined },
    })
  );
  assert.ok(html.includes(`href="${EN_ARTICLE}"`));
  assert.doesNotMatch(html, /en inglés/);
});

test("CCNA quiz links point to the canonical /quiz/ccna route in every language", () => {
  for (const lang of LANGS) assert.equal(CCNA.quizRoute[lang], `/${lang}/quiz/ccna`);
});

test("CCNA FR/ES copy states the six official domains and live counts without SQL or stale numbers", () => {
  for (const lang of ["fr", "es"] as const) {
    for (const text of [CCNA.description[lang], CCNA.metaDescription[lang], CCNA.metaTitle[lang], CCNA.title[lang]]) {
      assert.doesNotMatch(text, /SQL/i, lang);
      assert.doesNotMatch(text, /1[,. ]?418/, lang);
    }
    assert.match(CCNA.description[lang], /\{questionCount\|1400\+\}/, lang);
    assert.ok(CCNA.metaDescription[lang].length <= 160, `${lang}: meta description length`);
    assert.match(CCNA.metaDescription[lang], /1[. ]400/, lang);
  }
  assert.equal(CCNA.examBlueprint.domains.length, 6);
  assert.equal(CCNA.examBlueprint.domains.reduce((sum, d) => sum + d.percentage, 0), 100);
  assert.equal(CCNA.topics.length, 10);
});

test("the SQL heading belongs to SQL Server only; the generic fallback is neutral", () => {
  const source = readFileSync("src/components/CertificationPage.tsx", "utf8");
  assert.doesNotMatch(source, /certification SQL|certificazione SQL|certificación SQL/i);
  for (const lang of LANGS) {
    assert.match(MicrosoftSQLServer.extraContent.currentCertificationHeading[lang], /SQL/);
  }
});

test("French study-material card counts topics as thèmes, not domaines", () => {
  const source = readFileSync("src/components/certification/StudyMaterialGrid.tsx", "utf8");
  assert.match(source, /\$\{n\} thèmes/);
  assert.doesNotMatch(source, /\$\{n\} domaines/);
});
