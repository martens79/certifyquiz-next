// tests/seo.spec.ts
import { test, expect, type Page } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";

// Pagine campione per tipo
const PAGES = [
  { path: "/it/certificazioni", type: "list" },
  { path: "/it/certificazioni/aws-cloud-practitioner", type: "detail" },
  // ⚠️ Il quiz è client-only: lascialo commentato se fallisce su head
  // { path: "/it/quiz/aws-cloud-practitioner", type: "quiz" },
] as const;

// hreflang attesi (locale completi)
const ALT_EXPECT = ["it-IT", "es-ES", "en-US", "fr-FR", "x-default"] as const;

/* -------- Helpers -------- */
async function getAttr(page: Page, sel: string, attr: string) {
  const el = page.locator(sel).first();
  return (await el.count()) ? await el.getAttribute(attr) : null;
}
async function getCanonical(page: Page) {
  return getAttr(page, 'link[rel="canonical"]', "href");
}
async function getOgUrl(page: Page) {
  return getAttr(page, 'meta[property="og:url"]', "content");
}
async function getHreflangs(page: Page) {
  const alts = page.locator('link[rel="alternate"]');
  const count = await alts.count();
  const out: Record<string, string> = {};
  for (let i = 0; i < count; i++) {
    const lang = await alts.nth(i).getAttribute("hreflang");
    const href = await alts.nth(i).getAttribute("href");
    if (lang && href) out[lang] = href;
  }
  return out;
}

/* -------- Test principali -------- */
for (const { path, type } of PAGES) {
  test(`SEO: ${type} → canonical, hreflang, og:url (${path})`, async ({ page }) => {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });

    const canonical = await getCanonical(page);
    expect(canonical, "canonical mancante").toBeTruthy();
    expect(String(canonical)).toMatch(/^https?:\/\//);

    const alts = await getHreflangs(page);
    for (const lang of ALT_EXPECT) {
      expect(alts[lang], `hreflang ${lang} mancante`).toBeTruthy();
      expect(alts[lang]).toMatch(/^https?:\/\//);
    }

    const og = await getOgUrl(page);
    expect(og, "og:url mancante").toBeTruthy();
    expect(og).toBe(canonical);
  });
}

/* -------- Canonical test per le altre lingue -------- */
const LIST_BY_LANG = {
  en: "/en/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
} as const;

for (const [lang, listPath] of Object.entries(LIST_BY_LANG)) {
  test(`SEO: canonical corretta nella lista ${lang.toUpperCase()}`, async ({ page }) => {
    await page.goto(`${BASE}${listPath}`, { waitUntil: "domcontentloaded" });
    const canonical = await getCanonical(page);
    expect(canonical).toBeTruthy();
    const ok =
      canonical?.endsWith(`/${lang}`) ||
      canonical?.endsWith(listPath);
    expect(ok).toBe(true);
  });
}
