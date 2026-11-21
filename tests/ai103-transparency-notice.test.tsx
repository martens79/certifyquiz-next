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

/* ---------- Audit messaggi pubblici AI-103 (PR #213, secondo passaggio) ---------- */
import {
  AI103_MOCK_COPY,
  AI103_MOCK_META,
  AI103_PREMIUM_TITLE,
  AI103_SLUG,
  isAi103Slug,
} from "../src/lib/ai103-public-copy.ts";

const COMPLETE_PROMISE =
  /complet[ae]?\b|complète|completa|completo|complete preparation|replic|reproduc|official exam simulation|conditions? (r[eé]elles?|of the real|reales)|condizioni reali/i;

test("AI-103 Premium CTA title and mock-exam copy never promise complete preparation or real exam conditions", () => {
  for (const lang of LANGS) {
    assert.doesNotMatch(AI103_PREMIUM_TITLE[lang]("AI-103"), COMPLETE_PROMISE, `premium ${lang}`);
    const m = AI103_MOCK_COPY[lang];
    for (const text of [m.badge, m.title("AI-103"), m.desc]) assert.doesNotMatch(text, COMPLETE_PROMISE, `mock ${lang}: ${text}`);
    // La nota può solo NEGARE la replica dell'esame reale.
    assert.match(m.note, /AI-103/);
    assert.match(m.note, /non|not|ne |no /i);
    for (const text of [AI103_MOCK_META[lang].title, AI103_MOCK_META[lang].description]) {
      assert.doesNotMatch(text, COMPLETE_PROMISE, `mock meta ${lang}`);
      assert.doesNotMatch(text, /AI-102/);
    }
  }
  assert.equal(AI103_SLUG, AI103.slug);
  assert.ok(isAi103Slug(AI103_SLUG));
  assert.ok(!isAi103Slug("ccna") && !isAi103Slug("microsoft-ai") && !isAi103Slug(undefined));
});

test("Premium CTA and CertificationPage branch on the AI-103 slug only; other certifications keep their copy and tracking", () => {
  const cta = readFileSync("src/components/certification/PremiumResourcesCta.tsx", "utf8");
  assert.match(cta, /isAi103Slug\(certificationSlug\) \? AI103_PREMIUM_TITLE\[lang\]\(certificationName\) : t\.title\(certificationName\)/);
  assert.match(cta, /title: \(n: string\) => `Complete preparation for \$\{n\}`/); // invariato per le altre
  assert.match(cta, /trackEvent\("certification_premium_card_clicked"/);
  assert.match(cta, /event: "premium_clicked"/);
  const page = readFileSync("src/components/CertificationPage.tsx", "utf8");
  assert.match(page, /data\.slug === "eipass" \|\| isAi103Slug\(data\.slug\) \? pageTitle : resources\?\.certificationName \|\| pageTitle/);
});

test("mock-exam metadata: AI-103 gets the neutral copy, other certifications are unchanged", async () => {
  const { generateMetadata: mockMeta } = await import("../src/app/[lang]/quiz/[slug]/mock-exam/layout.tsx");
  for (const lang of LANGS) {
    const m = await mockMeta({ params: Promise.resolve({ lang, slug: AI103_SLUG }) });
    assert.equal(m.title, AI103_MOCK_META[lang].title);
    assert.equal(m.description, AI103_MOCK_META[lang].description);
    assert.equal((m.robots as { index: boolean }).index, false);
  }
  const ccna = await mockMeta({ params: Promise.resolve({ lang: "en", slug: "ccna" }) });
  assert.equal(ccna.title, "CCNA 200-301 Mock Test — Timed Practice Exam | CertifyQuiz");
  assert.equal(ccna.description, "Take a complete CCNA 200-301 mock test with a timer, final score and answer review.");
  const it = await mockMeta({ params: Promise.resolve({ lang: "it", slug: "isc2-cc" }) });
  assert.equal(it.title, "Simulazione esame ISC2 CC | CertifyQuiz");
});

test("mock-exam page uses the AI-103 copy only for the AI-103 slug", () => {
  const src = readFileSync("src/app/[lang]/quiz/[slug]/mock-exam/page.tsx", "utf8");
  assert.match(src, /isAi103Slug\(currentSlug\) \? AI103_MOCK_COPY\[currentLang\]/);
  assert.match(src, /note: "This simulation replicates the real conditions of the official exam\."/); // altre cert invariate
});

test("whyChoose and FAQ describe the exam, add a transparent coverage FAQ, and no longer say the bank 'covers' skills", () => {
  const why = (AI103 as any).extraContent.whyChoose;
  for (const lang of LANGS) {
    const joined = why[lang].join(" ");
    assert.doesNotMatch(joined, /\bCovers\b|\bCopre\b|\bCouvre\b|\bCubre\b/, `${lang} whyChoose`);
    const faqs = (AI103 as any).extraContent.faq[lang] as { q: string; a: string }[];
    const coverage = faqs.find((f) => /CertifyQuiz/.test(f.q));
    assert.ok(coverage, `${lang} coverage FAQ`);
    assert.match(coverage!.a, /AI-103/);
    assert.match(coverage!.a, /AI-102/);
    assert.doesNotMatch(coverage!.a, /^(Sì|Yes|Oui|Sí)/);
    assert.equal(faqs.length, 5, `${lang} FAQ count`);
  }
});

test("home card and roadmap metadata no longer name the retired AI-102 as the current exam", () => {
  const home = readFileSync("src/components/QuizHome.tsx", "utf8");
  assert.doesNotMatch(home, /Microsoft Azure AI-102 AI Engineer Associate/);
  assert.match(home, /certPath\(lang, "azure-ai-102-ai-engineer-associate"\)/); // link invariato
  const roadmap = readFileSync("src/app/roadmap-ai/page.tsx", "utf8");
  assert.doesNotMatch(roadmap, /Azure AI-102/);
  assert.match(roadmap, /Azure AI-103/);
});

test("no other certification registry file was given an AI-103 notice or copy", () => {
  for (const f of ["lfs101", "az-802", "ccna", "microsoft-ai"]) {
    let src = "";
    try { src = readFileSync(`src/certifications/data/${f}.ts`, "utf8"); } catch { continue; }
    assert.doesNotMatch(src, /AI-103/, f);
  }
});
