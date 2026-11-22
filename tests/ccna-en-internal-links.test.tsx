import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import CCNA from "../src/certifications/data/CCNA.ts";
import {
  CCNA_EN_RELATED_RESOURCES,
  CCNA_EN_REVIEWS_LINK,
} from "../src/lib/ccna-en-related-resources.ts";

const LANGS = ["it", "en", "fr", "es"] as const;
const PAGE = readFileSync("src/components/CertificationPage.tsx", "utf8");

test("related resources: 3-4 unique, canonical, relative EN articles plus /reviews/ccna", () => {
  assert.ok(CCNA_EN_RELATED_RESOURCES.length >= 3 && CCNA_EN_RELATED_RESOURCES.length <= 4);
  const hrefs = [...CCNA_EN_RELATED_RESOURCES, CCNA_EN_REVIEWS_LINK].map((r) => r.href);
  assert.equal(new Set(hrefs).size, hrefs.length, "nessun duplicato");
  assert.ok(hrefs.includes("/blog/ccna-practice-test-free-2026"));
  assert.ok(hrefs.includes("/reviews/ccna"));
  for (const h of hrefs) {
    assert.match(h, /^\/(blog|reviews)\/[a-z0-9-]+$/, h);
    assert.doesNotMatch(h, /^\/(it|fr|es)\//, h);
  }
  for (const r of [...CCNA_EN_RELATED_RESOURCES, CCNA_EN_REVIEWS_LINK]) {
    assert.ok(r.label.length > 10 && r.description.length > 10);
  }
});

test("related resources do not duplicate links already on the landing", () => {
  // Link gia' presenti: articolo del blueprint, roadmap, mock exam, quiz, guida, lab, scenari, review globali.
  const existing = [
    "/blog/ccna-practice-questions-200-301",
    "/roadmap-networking",
    "/en/quiz/ccna/mock-exam",
    "/en/quiz/ccna",
    "/guide/ccna",
    "/reviews",
    "/certifications/ccna/scenarios",
  ];
  for (const r of [...CCNA_EN_RELATED_RESOURCES, CCNA_EN_REVIEWS_LINK]) {
    assert.ok(!existing.includes(r.href), r.href);
  }
});

test("the block renders only for CCNA in English: IT/FR/ES pages are untouched", () => {
  assert.match(PAGE, /data\.slug === "ccna" && lang === "en" && \(/);
  assert.equal(PAGE.match(/CCNA_EN_RELATED_RESOURCES\b/g)!.length, 2); // import + uso nel blocco
  // Nessun testo del blocco compare nel registry CCNA (IT/FR/ES invariati).
  const registry = JSON.stringify(CCNA);
  for (const r of CCNA_EN_RELATED_RESOURCES) assert.ok(!registry.includes(r.href), r.href);
});

test("CCNA title, description, FAQ and counts are unchanged in every language", () => {
  assert.equal(CCNA.title.en, "CCNA 200-301 Practice Test: {questionCount|1,400+} Questions and 18 Labs");
  assert.equal(CCNA.metaTitle!.en, "CCNA 200-301 Practice Test 2026: 1,400+ Exam Questions & Labs | CertifyQuiz");
  assert.equal(
    CCNA.metaDescription!.en,
    "Practice CCNA 200-301 exam questions: 1,400+ questions with explanations, a full CCNA mock test and 18 interactive labs. Start free."
  );
  assert.equal(CCNA.extraContent!.faq!.en.length, 6);
  for (const lang of ["it", "fr", "es"] as const) {
    assert.equal(CCNA.extraContent!.faq![lang].length, 3, lang);
    assert.match(CCNA.title[lang], /1400\+|Quiz/, lang);
  }
  for (const lang of LANGS) assert.ok(CCNA.metaTitle![lang] && CCNA.metaDescription![lang], lang);
});

test("the page does not touch canonical or hreflang for CCNA", () => {
  const meta = readFileSync("src/app/certifications/[slug]/page.tsx", "utf8");
  assert.match(meta, /"ccna": \{\s*title: "CCNA 200-301 Practice Test 2026: 1,400\+ Exam Questions & Labs \| CertifyQuiz"/);
});

test("lab detail pages are unchanged: no metadata or indexing change for any lab", () => {
  const lab = readFileSync("src/app/interactive-labs/[lab]/page.tsx", "utf8");
  assert.doesNotMatch(lab, /generateMetadata|robots|canonical/);
});
