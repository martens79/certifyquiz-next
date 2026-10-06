import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import ISC2CC from "../src/certifications/data/ISC2_CC.ts";
import ExamBlueprintCard from "../src/components/certification/ExamBlueprintCard.tsx";

// Fonte: ISC2 CC Exam Outline v01/2026, effective 2026-09-01
// (isc2.org/certifications/cc/cc-certification-exam-outline).
const OFFICIAL_2026 = [
  ["Security Principles", 24],
  ["Security Governance", 17.3],
  ["Identity And Access Management (IAM) Concepts", 20],
  ["Networking and Cloud Security Concepts", 21.3],
  ["Security Operations and Incident Response", 17.3],
] as const;

const LANGS = ["it", "en", "fr", "es"] as const;
const blueprint = ISC2CC.examBlueprint;

test("ISC2 CC blueprint matches the exam outline effective 2026-09-01", () => {
  assert.deepEqual(
    blueprint.domains.map((d) => [d.name, d.percentage]),
    OFFICIAL_2026.map(([name, pct]) => [name, pct])
  );
  const total = blueprint.domains.reduce((sum, d) => sum + (d.percentage ?? 0), 0);
  assert.ok(Math.abs(total - 100) < 0.2, `weights sum to ${total}`);
  assert.match(blueprint.officialSourceName, /effective 2026-09-01/);
  assert.match(blueprint.officialSourceUrl, /\/exam-outlines\/2026\//);
  assert.ok(blueprint.lastVerifiedAt! >= "2026-09-01", "verified after the outline took effect");
});

test("the superseded 2025-10-01 outline cannot be republished", () => {
  const serialized = JSON.stringify(ISC2CC);
  for (const stale of [
    "2025-10-01",
    "10012025",
    "MAR-EXAMS-CC",
    "Business Continuity (BC), Disaster Recovery (DR) & Incident Response Concepts",
    "Access Controls Concepts",
    "Dal 1° settembre 2026",
    "passerà a un nuovo programma",
  ]) {
    assert.ok(!serialized.includes(stale), `stale outline reference: ${stale}`);
  }
  assert.equal("note" in blueprint, false, "the blueprint note was a single-language string");
});

test("ISC2 CC landing shows the same blueprint in every language, with no leftover Italian note", () => {
  for (const lang of LANGS) {
    const html = renderToStaticMarkup(createElement(ExamBlueprintCard, { blueprint, lang }));
    for (const [name, pct] of OFFICIAL_2026) {
      assert.ok(html.includes(name), `${lang}: domain ${name}`);
      assert.ok(html.includes(`${pct}%`), `${lang}: weight ${pct}%`);
    }
    assert.doesNotMatch(html, /Dal 1°|passerà|2025/, `${lang}: stale note`);
  }
});

test("ISC2 CC FAQ describes the five official domains in every language", () => {
  for (const lang of LANGS) {
    const topics = ISC2CC.extraContent.faq[lang][1];
    assert.match(topics.a, /Security Principles/, lang);
    assert.match(topics.a, /Security Governance/, lang);
    assert.match(topics.a, /Identity and Access Management/, lang);
    assert.match(topics.a, /Networking and Cloud Security/, lang);
    assert.match(topics.a, /Security Operations/, lang);
    assert.doesNotMatch(topics.a, /compliance and standards|conformità e standard|conformité et les normes|cumplimiento y estándares/i, lang);
  }
});
