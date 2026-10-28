import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  isCertificationIndexable,
  isRolloutNoindexCertification,
  ROLLOUT_NOINDEX_CERTIFICATION_SLUGS,
} from "../src/lib/seo/certification-indexability.ts";
import { isTopicIndexable } from "../src/lib/seo/topic-indexability.ts";

// A topic that passes every editorial quality rule (>= 300 words, >= 1,500 chars of guide, FAQ, questions).
const word = "practical";
const richTopic = {
  title: "Domain Controllers and FSMO Roles",
  description: Array.from({ length: 40 }, () => word).join(" "),
  intro: "x".repeat(200),
  content: Array.from({ length: 320 }, (_, i) => `${word}${i % 7}`).join(" ") + "a".repeat(2000),
  faq: [{ q: "q1", a: "a1" }, { q: "q2", a: "a2" }],
};

test("AZ-802 and PLC are published without rollout guards", () => {
  assert.deepEqual([...ROLLOUT_NOINDEX_CERTIFICATION_SLUGS], []);
  assert.equal(isRolloutNoindexCertification("az-802"), false);
  assert.equal(isRolloutNoindexCertification("ccna"), false);
  assert.equal(isRolloutNoindexCertification("plc-fundamentals"), false);
  assert.equal(isCertificationIndexable({ slug: "plc-fundamentals", questionCount: 274 }), true);
  assert.equal(isTopicIndexable({ ...richTopic, certificationSlug: "plc-fundamentals", questionCount: 15 }), true);
  assert.equal(isRolloutNoindexCertification(null), false);
});

test("AZ-802 landing stays noindex with 0 questions", () => {
  assert.equal(isCertificationIndexable({ slug: "az-802", questionCount: 0 }), false);
});

test("AZ-802 landing is indexable with a positive inventory in every language", () => {
  for (const questionCount of [175, 1]) {
    assert.equal(isCertificationIndexable({ slug: "az-802", questionCount }), true, String(questionCount));
  }
  for (const questionCount of [null, undefined]) {
    assert.equal(isCertificationIndexable({ slug: "az-802", questionCount }), false);
  }
  assert.equal(isCertificationIndexable("az-802"), true);
});

test("AZ-802 topics are indexable only with complete content and questions", () => {
  assert.equal(isTopicIndexable({ ...richTopic, certificationSlug: "az-802", questionCount: 15 }), true);
  assert.equal(isTopicIndexable({ ...richTopic, certificationSlug: "az-802", questionCount: 0 }), false);
});

test("a normal complete certification keeps its behavior", () => {
  assert.equal(isCertificationIndexable({ slug: "ccna", questionCount: 1358 }), true);
  assert.equal(isCertificationIndexable({ slug: "lfs101", questionCount: 356 }), true);
  assert.equal(isCertificationIndexable({ slug: "ccna", questionCount: 0 }), false);
  assert.equal(isCertificationIndexable("ccna"), true);
  assert.equal(isCertificationIndexable({ slug: "sap-successfactors", questionCount: 100 }), false);
});

test("a normal complete topic keeps its behavior", () => {
  assert.equal(isTopicIndexable({ ...richTopic, certificationSlug: "ccna", questionCount: 15 }), true);
  assert.equal(isTopicIndexable({ ...richTopic, certificationSlug: "ccna", questionCount: 0 }), false);
  assert.equal(isTopicIndexable({ ...richTopic, certificationSlug: null, questionCount: 15 }), true);
});

test("sitemap: landings require inventory and topic publication is limited to the verified Apple release", () => {
  const source = readFileSync(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
  assert.match(source, /canonicalCerts\.filter\(\(c\) => isCertificationIndexable\(\{\s*slug: c\.slug,\s*questionCount: c\.questionCountByLang\[lang\] \?\? null,\s*\}\)\)/);
  assert.match(source, /certs\.find\(c => c\.slug === "apple-device-support"\)/);
  assert.match(source, /apple\.questionCountByLang\[lang\] \?\? 0\) >= 45/);
  assert.match(source, /page\.questionCount >= 5 && isTopicIndexable/);
  assert.match(source, /checked\.every\(Boolean\)/);
  assert.match(source, /appleTopics\[lang\]\.map/);
  // The same predicate the sitemap applies, per language, with AZ-802 fully loaded vs a normal certification.
  const certs = [
    { slug: "az-802", questionCountByLang: { it: 175, en: 175, fr: 175, es: 175 } },
    { slug: "ccna", questionCountByLang: { it: 1358, en: 1358, fr: 1358, es: 1358 } },
  ];
  for (const lang of ["it", "en", "fr", "es"] as const) {
    const kept = certs.filter((c) => isCertificationIndexable({ slug: c.slug, questionCount: c.questionCountByLang[lang] ?? null })).map((c) => c.slug);
    assert.deepEqual(kept, ["az-802", "ccna"], lang);
  }
});

test("every topic page passes the certification slug to isTopicIndexable", () => {
  const pages = [
    "../src/app/certifications/[slug]/[topicSlug]/page.tsx",
    "../src/app/it/certificazioni/[slug]/[topicSlug]/page.tsx",
    "../src/app/fr/certifications/[slug]/[topicSlug]/page.tsx",
    "../src/app/es/certificaciones/[slug]/[topicSlug]/page.tsx",
    "../src/app/[lang]/certificazioni/[slug]/[topicSlug]/page.tsx",
  ];
  for (const p of pages) {
    const source = readFileSync(new URL(p, import.meta.url), "utf8");
    const calls = source.match(/isTopicIndexable\(\{[^}]*\}\)/g) ?? [];
    assert.ok(calls.length >= 1, `${p}: no isTopicIndexable call`);
    for (const call of calls) assert.match(call, /certificationSlug: slug/, `${p}: ${call}`);
  }
});
