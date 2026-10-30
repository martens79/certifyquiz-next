import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import AIFoundations from "../src/certifications/data/ai-foundations.ts";
import { awsAiHub } from "../src/content/hubs/vendor-domains/aws-ai.ts";
import { microsoftAiHub } from "../src/content/hubs/vendor-domains/microsoft-ai.ts";

// Microsoft ha ritirato AI-900 il 2026-06-30: l'esame attuale e' AI-901 (stessa certificazione).
// Questi testi non devono rimandare gli utenti a un exam code ritirato.
const langs = ["it", "en", "fr", "es"] as const;

test("roadmap-ai metadata names AI-901 in every language", () => {
  const source = readFileSync(new URL("../src/app/[lang]/roadmap-ai/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /AI-900/);
  assert.equal((source.match(/Azure AI-901/g) ?? []).length, 4);
});

test("AI Foundations points to AI-901, not to the retired AI-900", () => {
  const strings = langs.flatMap((l) => [
    ...AIFoundations.extraContent.whyChoose[l],
    ...AIFoundations.extraContent.faq[l].flatMap((f: { q: string; a: string }) => [f.q, f.a]),
  ]);
  for (const s of strings) assert.doesNotMatch(s, /AI-900/, s);
  assert.ok(strings.some((s) => s.includes("AI-901")), "the AI-901 reference must be present");
});

test("hubs show the same exam code for the Microsoft AI certification", () => {
  const code = (hub: { certs: ReadonlyArray<{ slug: string; examCode?: string }> }) =>
    hub.certs.find((c) => c.slug === "microsoft-ai")?.examCode;
  assert.equal(code(awsAiHub), "AI-901");
  assert.equal(code(microsoftAiHub), "AI-901");
});
