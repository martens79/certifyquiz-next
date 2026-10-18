import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import MicrosoftAI from "../src/certifications/data/MicrosoftAIFundamentals.ts";
import { getCertCardDesc } from "../src/lib/cert-descriptions.ts";

// Microsoft Learn: l'esame AI-900 e' stato ritirato il 2026-06-30 e sostituito da AI-901
// (certificazione "Azure AI Fundamentals" invariata). AI-900 puo' comparire solo come "ex/formerly".
const FORMER = /\((formerly|ex|anciennement|antes) AI-900\)/;
const langs = ["it", "en", "fr", "es"] as const;

function assertAi901(text: string, where: string) {
  assert.ok(text.includes("AI-901"), `${where}: missing AI-901`);
  const withoutFormer = text.replace(FORMER, "");
  assert.ok(!withoutFormer.includes("AI-900"), `${where}: stale AI-900 reference`);
}

test("Microsoft AI registry metadata names AI-901 in every language", () => {
  for (const l of langs) {
    assertAi901(MicrosoftAI.metaTitle[l]!, `metaTitle ${l}`);
    assertAi901(MicrosoftAI.metaDescription[l]!, `metaDescription ${l}`);
  }
});

test("Microsoft AI card descriptions name AI-901 for both slugs", () => {
  for (const slug of ["microsoft-ai", "microsoft-ai-fundamentals"]) {
    for (const l of langs) assertAi901(getCertCardDesc(slug, l), `${slug} ${l}`);
  }
});

test("English certification page metadata override for microsoft-ai names AI-901", () => {
  const src = readFileSync(new URL("../src/app/certifications/[slug]/page.tsx", import.meta.url), "utf8");
  const block = src.match(/"microsoft-ai":\s*\{[\s\S]*?\n  \},/);
  assert.ok(block, "microsoft-ai override not found");
  const title = block![0].match(/title:\s*"([^"]+)"/)![1];
  const description = block![0].match(/description:\s*\n?\s*"([^"]+)"/)![1];
  assertAi901(title, "override title");
  assertAi901(description, "override description");
  assert.ok(title.length <= 75 && description.length <= 165, "metadata within SEO length budget");
});
