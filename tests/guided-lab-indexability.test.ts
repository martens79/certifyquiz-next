import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { labSlugs } from "../src/features/labs/lab-config.ts";
import { guidedLabRobotsMetadata, isGuidedCertificationLab } from "../src/lib/seo/guided-lab-indexability.ts";

test("guided certification labs are noindex, follow, including all CCNA labs", () => {
  const guided = labSlugs.filter(isGuidedCertificationLab);
  assert.equal(guided.filter(s => s.startsWith("ccna-")).length, 18);
  assert.ok(guided.some(s => s.startsWith("ccst-networking-")));
  assert.ok(guided.some(s => s.startsWith("ccst-cybersecurity-")));
  assert.ok(guided.some(s => s.startsWith("ceh-")));
  for (const slug of guided) {
    assert.deepEqual(guidedLabRobotsMetadata(slug).robots, { index: false, follow: true }, slug);
  }
});

test("standalone public interactive lab details are not accidentally marked noindex", () => {
  const standalone = labSlugs.filter(s => !isGuidedCertificationLab(s));
  assert.ok(standalone.includes("spreadsheets"));
  assert.ok(standalone.includes("subnetting"));
  for (const slug of standalone) {
    assert.deepEqual(guidedLabRobotsMetadata(slug), {}, slug);
  }
});

test("both English and translated lab detail routes use the same metadata policy", () => {
  const routes = ["src/app/interactive-labs/[lab]/page.tsx", "src/app/[lang]/interactive-labs/[lab]/page.tsx"];
  for (const route of routes) {
    const source = readFileSync(route, "utf8");
    assert.match(source, /export function generateMetadata/);
    assert.match(source, /guidedLabRobotsMetadata\(lab as LabSlug\)/);
    assert.match(source, /InteractiveLabDetail/);
  }
});

test("SEO hub pages and sitemap are not modified by this change", () => {
  const enHub = readFileSync("src/app/interactive-labs/page.tsx", "utf8");
  assert.match(enHub, /alternates:/);
  assert.doesNotMatch(enHub, /robots:\s*\{\s*index:\s*false/);
});
