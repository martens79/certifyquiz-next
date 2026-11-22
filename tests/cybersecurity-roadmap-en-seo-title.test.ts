import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("EN cybersecurity roadmap title targets certification roadmap queries", () => {
  const source = readFileSync("src/app/roadmap-cybersecurity/page.tsx", "utf8");
  assert.match(source, /Cybersecurity Certification Roadmap 2026: Beginner to CISSP/);
  assert.match(source, /area: "cybersecurity"/);
  assert.match(source, /lang: "en"/);
});

test("other locale roadmap SEO remains untouched", () => {
  const source = readFileSync("src/app/[lang]/roadmap-cybersecurity/page.tsx", "utf8");
  for (const lang of ['it','es','fr']) assert.match(source, new RegExp(lang + ': \\{'));
});
