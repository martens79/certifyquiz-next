import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Module from "node:module";
import path from "node:path";
import test from "node:test";
import AI103 from "../src/certifications/data/azure-ai-102.ts";

const LANGS = ["it", "en", "fr", "es"] as const;

// Isola solo I/O backend e vista (come tests/lfs101-en-metadata.test.tsx).
const requireFromRoot = Module.createRequire(path.resolve(process.cwd(), "package.json"));
function stub(relativePath: string, exports: object) {
  const filename = path.resolve(process.cwd(), relativePath);
  requireFromRoot.cache[filename] = { id: filename, filename, loaded: true, exports } as NodeJS.Module;
}
const inventory = { it: 180, en: 180, fr: 180, es: 180 };
stub("src/lib/server/certs.ts", {
  getCertificationDetailResult: async (slug: string) => ({
    kind: "ok",
    data: {
      slug,
      questionCountByLang: inventory,
      name_en: "Microsoft Azure AI-102 AI Engineer Associate",
      description_en: "Backend copy.",
    },
  }),
});
stub("src/lib/data.ts", { getCertBySlug: async () => ({ questionCountByLang: inventory }) });
stub("src/app/_views/CertificationDetailView.tsx", { CertificationDetailView: () => null });

const PROMISES = /exam-style|realistic|simulat|simulaz|simulacro|tipo examen|in stile esame|stile esame|complete|completa|complète|completo|\bcovers?\b|\bcopre\b|couvre|\bcubre\b|inizia gratis.*prepar/i;

test("AI-103 notice is present, non-empty and translated in all four languages", () => {
  assert.equal(AI103.lifecycleStatus, "needs-review");
  const n = AI103.lifecycleNotice!;
  for (const lang of LANGS) assert.ok(n[lang] && n[lang].length > 120, `${lang} notice`);
  assert.match(n.it, /^AI-102 è stato ritirato\. AI-103 segue un programma aggiornato\./);
  assert.match(n.it, /Alcuni contenuti potrebbero ancora riferirsi al programma precedente\.$/);
  assert.match(n.en, /^AI-102 has been retired\. AI-103 follows an updated syllabus\./);
  assert.match(n.fr, /^L'examen AI-102 a été retiré\./);
  assert.match(n.es, /^AI-102 ha sido retirado\./);
  // Le quattro lingue devono differire (nessun fallback copiato).
  assert.equal(new Set(LANGS.map((l) => n[l])).size, 4);
});

test("technical status string is never rendered for needs-review", () => {
  const src = readFileSync("src/components/CertificationPage.tsx", "utf8");
  assert.match(src, /NEEDS_REVIEW_NOTICE_LABEL/);
  assert.match(src, /lifecycleStatus === "needs-review" \?/);
  // Il ramo needs-review non stampa lo stato grezzo; gli altri stati restano invariati.
  const branch = src.slice(src.indexOf('lifecycleStatus === "needs-review" ?'));
  assert.match(branch.slice(0, 400), /NEEDS_REVIEW_NOTICE_LABEL\[lang\]/);
  assert.match(src, /<strong className="mr-1 uppercase">\{lifecycleStatus\}:<\/strong>/);
  for (const lang of LANGS) assert.match(src, new RegExp(`${lang}: "[^"]+"`));
  assert.doesNotMatch(src.match(/NEEDS_REVIEW_NOTICE_LABEL[\s\S]*?\};/)![0], /needs-review/i);
});

test("other certifications keep their lifecycle behaviour", () => {
  const src = readFileSync("src/components/CertificationPage.tsx", "utf8");
  assert.match(src, /lifecycleStatus && lifecycleStatus !== "active" && lifecycleNotice/);
});

test("AI-103 title, description and meta make no complete-preparation promise", () => {
  for (const lang of LANGS) {
    for (const [field, text] of [
      ["title", AI103.title[lang]],
      ["description", AI103.description[lang]],
      ["metaTitle", AI103.metaTitle![lang]],
      ["metaDescription", AI103.metaDescription![lang]],
    ] as const) {
      assert.doesNotMatch(text, PROMISES, `${lang}.${field}: ${text}`);
      assert.doesNotMatch(text, /agent(s|i|es)?\b.*Foundry|Foundry.*agent/i, `${lang}.${field} claims agents/Foundry coverage`);
    }
    assert.ok(AI103.metaTitle![lang].length <= 60, `${lang} metaTitle ${AI103.metaTitle![lang].length}`);
    const md = AI103.metaDescription![lang].length;
    assert.ok(md >= 100 && md <= 160, `${lang} metaDescription ${md}`);
    assert.match(AI103.description[lang], /AI-103/);
  }
});

test("EN route emits the AI-103 registry title and description, not the AI-102 backend copy", async () => {
  const { generateMetadata } = await import("../src/app/certifications/[slug]/page.tsx");
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: "azure-ai-102-ai-engineer-associate" }) });
  assert.equal(metadata.title, AI103.metaTitle!.en);
  assert.equal(metadata.description, AI103.metaDescription!.en);
  assert.equal(metadata.openGraph?.title, metadata.title);
  assert.doesNotMatch(String(metadata.title), /AI-102 AI Engineer|practice exam and quiz preparation/);
});

test("AI-103 slug, quiz routes and blueprint domains are unchanged", () => {
  assert.equal(AI103.slug, "azure-ai-102-ai-engineer-associate");
  for (const lang of LANGS) assert.match(AI103.quizRoute[lang], /azure-ai-102-ai-engineer-associate$/);
  assert.equal(AI103.examBlueprint.domains.length, 5);
});
