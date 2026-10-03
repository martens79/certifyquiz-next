import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { CERTS_BY_SLUG } from "../src/certifications/data/index.ts";
import { CAT_KEY_TO_SLUG, CAT_SLUG_TO_KEY } from "../src/lib/paths.ts";
import {
  INDUSTRIAL_AUTOMATION_CERT_SLUG,
  INDUSTRIAL_AUTOMATION_LANGS,
  isIndustrialAutomationPublic,
} from "../src/lib/industrial-automation.ts";
import { CERT_CATEGORY_BY_SLUG } from "../src/lib/certs.ts";
import { PRIMARY_CERT_SLUG_BY_CATEGORY } from "../src/lib/primary-cert-by-category.ts";

const LANGS = ["it", "en", "fr", "es"] as const;
const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");

test("area is hidden in every language while PLC Fundamentals is planned (the current state)", () => {
  assert.equal(CERTS_BY_SLUG[INDUSTRIAL_AUTOMATION_CERT_SLUG].publicationStatus, "planned");
  for (const lang of LANGS) assert.equal(isIndustrialAutomationPublic(lang), false, lang);
});

test("launching the registry entry turns the area on in EN/IT only, never FR/ES", () => {
  const cert = CERTS_BY_SLUG[INDUSTRIAL_AUTOMATION_CERT_SLUG] as { publicationStatus?: string };
  const previous = cert.publicationStatus;
  try {
    delete cert.publicationStatus;
    assert.deepEqual(LANGS.filter((l) => isIndustrialAutomationPublic(l)), ["it", "en"]);
    assert.deepEqual([...INDUSTRIAL_AUTOMATION_LANGS], ["it", "en"]);
    assert.equal(isIndustrialAutomationPublic("de"), false);
  } finally {
    cert.publicationStatus = previous;
  }
  assert.equal(isIndustrialAutomationPublic("en"), false);
});

test("developer preview shows the area in EN/IT only, and never in production", () => {
  const env = process.env as Record<string, string | undefined>;
  const saved = { p: env.CERTIFYQUIZ_PLANNED_PREVIEW, n: env.NODE_ENV, v: env.VERCEL_ENV };
  try {
    env.CERTIFYQUIZ_PLANNED_PREVIEW = "1";
    delete env.VERCEL_ENV;
    env.NODE_ENV = "development";
    assert.deepEqual(LANGS.filter((l) => isIndustrialAutomationPublic(l)), ["it", "en"]);
    env.NODE_ENV = "production";
    assert.deepEqual(LANGS.filter((l) => isIndustrialAutomationPublic(l)), []);
    env.NODE_ENV = "development";
    env.VERCEL_ENV = "production";
    assert.deepEqual(LANGS.filter((l) => isIndustrialAutomationPublic(l)), []);
  } finally {
    for (const [k, v] of [["CERTIFYQUIZ_PLANNED_PREVIEW", saved.p], ["NODE_ENV", saved.n], ["VERCEL_ENV", saved.v]] as const) {
      if (v === undefined) delete env[k]; else env[k] = v;
    }
  }
});

test("category plumbing: slugs resolve in both directions in all four languages", () => {
  const expected = { it: "automazione-industriale", en: "industrial-automation", fr: "automatisation-industrielle", es: "automatizacion-industrial" } as const;
  for (const lang of LANGS) {
    assert.equal(CAT_KEY_TO_SLUG[lang]["industrial-automation"], expected[lang]);
    assert.equal(CAT_SLUG_TO_KEY[lang][expected[lang]], "industrial-automation");
  }
  assert.equal(CERT_CATEGORY_BY_SLUG["plc-fundamentals"], "industrial-automation");
  assert.equal(PRIMARY_CERT_SLUG_BY_CATEGORY["industrial-automation"], "plc-fundamentals");
});

test("home: the card is rendered only when the server says the area is public", () => {
  const home = read("../src/components/home/Home.tsx");
  assert.match(home, /showIndustrialAutomation = false/);
  assert.match(home, /\(cat\.key === "industrial-automation" && showIndustrialAutomation\)/);
  assert.match(home, /cat\.key !== "industrial-automation"/, "never in the top grid");
  const auth = read("../src/components/home/HomeWithAuth.tsx");
  assert.match(auth, /showIndustrialAutomation=\{showIndustrialAutomation\}/);
  const en = read("../src/app/page.tsx");
  assert.match(en, /showIndustrialAutomation=\{isIndustrialAutomationPublic\("en"\)\}/);
  const localized = read("../src/app/[lang]/page.tsx");
  assert.match(localized, /showIndustrialAutomation=\{isIndustrialAutomationPublic\(lang\)\}/);
});

test("home JSON-LD category list and quiz-home search list never contain the area before launch", () => {
  const localized = read("../src/app/[lang]/page.tsx");
  assert.doesNotMatch(localized, /key: "industrial-automation"/);
  const quizHome = read("../src/components/QuizHome.tsx");
  assert.match(quizHome, /"industrial-automation": \[\],/);
});

test("category page: 404 and noindex when the area is not public", () => {
  const page = read("../src/app/[lang]/categorie/[cat]/page.tsx");
  assert.match(page, /key === "industrial-automation" && !isIndustrialAutomationPublic\(lang\)\) notFound\(\)/);
  assert.match(page, /robots: hiddenArea \? \{ index: false, follow: false \}/);
});

test("quiz topics page: planned and FR/ES are 404, the unmapped-slug list hides planned slugs", () => {
  const page = read("../src/app/[lang]/quiz/[slug]/page.tsx");
  assert.match(page, /isPlannedCertification\(registryCert\) && !isPlannedPreviewEnabled\(\)\) notFound\(\)/);
  assert.match(page, /INDUSTRIAL_AUTOMATION_LANGS\.includes\(L\)\) notFound\(\)/);
  assert.match(page, /\.filter\(\(s\) => !isPlannedCertification\(getRegistryCertBySlug\(s\)\)\)/);
  assert.match(page, /<TopicAccessBadge certId=\{certId\} topicId=\{t\.id\} tier=\{t\.access_tier\} lang=\{L\} \/>/);
});

test("certification landing: FR/ES are 404 for PLC Fundamentals", () => {
  const view = read("../src/app/_views/CertificationDetailView.tsx");
  assert.match(view, /reg\?\.slug === INDUSTRIAL_AUTOMATION_CERT_SLUG && !INDUSTRIAL_AUTOMATION_LANGS\.includes\(lang\)\) return notFound\(\)/);
});

test("topic access badge: no request for ordinary certifications, Premium upsell only when locked", () => {
  const badge = read("../src/components/topics/TopicAccessBadge.tsx");
  assert.match(badge, /if \(tier !== "free" && tier !== "premium"\) return;/);
  assert.match(badge, /if \(tier !== "free" && tier !== "premium"\) return null;/);
  assert.match(badge, /`\/topics\/\$\{certId\}\/access`/);
  assert.match(badge, /effective === "locked" \?/);
  for (const lang of ["it", "en", "fr", "es"]) assert.match(badge, new RegExp(`${lang}: \\{ free:`));
});

test("landing content: honest, EN/IT, consistent with the 68 free / 206 premium split", () => {
  const reg = CERTS_BY_SLUG[INDUSTRIAL_AUTOMATION_CERT_SLUG];
  const faq = reg.extraContent?.faq;
  assert.ok(faq && faq.en.length === 4 && faq.it.length === 4);
  assert.match(faq.en[0].a, /^No\./);
  assert.match(faq.it[0].a, /^No\./);
  assert.match(faq.en[1].a, /68 questions/);
  assert.match(faq.en[1].a, /206 questions/);
  assert.match(faq.it[1].a, /68 domande/);
  assert.match(faq.it[1].a, /206 domande/);
  assert.equal(reg.extraContent?.learn?.en.length, 6);
  assert.equal(reg.extraContent?.learn?.it.length, 6);
  assert.doesNotMatch(JSON.stringify(reg.extraContent), /get certified|exam pass|guaranteed/i);
});

test("home 'coming soon' card: EN/IT only, shown only while the area is not public, and never a link", () => {
  const home = read("../src/components/home/Home.tsx");
  const start = home.indexOf("{!showIndustrialAutomation && (");
  assert.ok(start > 0, "placeholder present");
  const block = home.slice(start, home.indexOf("</div>\n    )}", start) + 20);
  assert.match(block, /safeLang === "it" \|\| safeLang === "en"/);
  assert.doesNotMatch(block, /<Link|href=/, "must not link to the hidden landing or category");
  assert.match(block, /Non è una certificazione ufficiale/);
  assert.match(block, /not an official certification/);
});
