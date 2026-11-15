import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ISC2CC from "../src/certifications/data/ISC2_CC.ts";
import Box from "../src/components/certifications/CertificationPracticeBox.tsx";
import { practiceTopicCoverage, practiceTopicLimit } from "../src/lib/practice-topic-coverage.ts";

// Topic attivi di ISC2 CC su api.certifyquiz.com/api/topics/8 (verificati il 2026-10-18).
const LIVE_EN = [
  [209, "Security Fundamentals", "security-fundamentals"],
  [210, "Risk Management", "risk-management"],
  [211, "Security Controls", "security-controls"],
  [212, "Compliance and Standards", "compliance-and-standards"],
  [213, "Incident Response", "incident-response"],
  [344, "Access Controls Concepts", "access-controls-concepts"],
  [345, "Network Security", "network-security"],
  [346, "Security Operations", "security-operations"],
  [508, "Cloud Security Concepts", "cloud-security-concepts"],
  [509, "Security Governance & GRC", "security-governance-grc"],
] as const;

test("ISC2 CC registry fallback lists the 10 live topics with the live English slugs, in API order", () => {
  assert.equal(ISC2CC.topics.length, LIVE_EN.length);
  assert.deepEqual(ISC2CC.topics.map((t) => t.slug.en), LIVE_EN.map((t) => t[2]));
  for (const t of ISC2CC.topics) for (const lang of ["it", "en", "fr", "es"] as const) {
    assert.ok(t.title[lang]?.trim(), `title ${lang}`);
    assert.ok(t.slug[lang]?.trim(), `slug ${lang}`);
  }
});

test("ISC2 CC practice box follows the live API topics and shows all of them", () => {
  const titles = LIVE_EN.map((t) => t[1]);
  const selected = practiceTopicCoverage("isc2-cc", titles, ISC2CC.topics.map((t) => t.title));
  assert.deepEqual(selected, titles);
  assert.equal(practiceTopicLimit("isc2-cc"), 10);
  const html = renderToStaticMarkup(createElement(Box, {
    lang: "en", certificationTitle: "ISC2 CC", quizHref: "/quiz/isc2-cc", topics: selected, maxTopics: practiceTopicLimit("isc2-cc"),
  }));
  for (const title of titles) assert.ok(html.includes(title.replace("&", "&amp;")), `missing ${title}`);
});

test("without API inventory ISC2 CC falls back to the registry; other certifications keep the 6-topic box", () => {
  const registry = ISC2CC.topics.map((t) => t.title);
  assert.equal(practiceTopicCoverage("isc2-cc", [], registry), registry);
  assert.equal(practiceTopicCoverage("ccna", ["x"], registry), registry);
  assert.equal(practiceTopicLimit("ccna"), 6);
  assert.equal(practiceTopicLimit("pmp"), 6);
  const many = Array.from({ length: 10 }, (_, i) => ({ it: `T${i}`, en: `T${i}`, fr: `T${i}`, es: `T${i}` }));
  const html = renderToStaticMarkup(createElement(Box, { lang: "en", certificationTitle: "X", quizHref: "/q", topics: many }));
  assert.equal((html.match(/<li /g) ?? []).length, 6);
});
