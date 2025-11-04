// tests/seo.spec.ts
import { test, expect, type Page } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";

// Pagine campione per tipo
const PAGES = [
  { path: "/it/certificazioni", type: "list" as const },
  { path: "/it/certificazioni/aws-cloud-practitioner", type: "detail" as const },
  // { path: "/it/quiz/aws-cloud-practitioner", type: "quiz" }, // client-only
];

// hreflang attesi (locale completi)
const ALT_EXPECT = ["it-IT", "es-ES", "en-US", "fr-FR", "x-default"] as const;

// Mappa hreflang → prefix del percorso atteso
const HREFLANG_TO_PREFIX = {
  "it-IT": "/it/certificazioni",
  "en-US": "/en/certifications",
  "fr-FR": "/fr/certifications",
  "es-ES": "/es/certificaciones",
} as const;

// Mappa lingua → hreflang
const HREFLANG_BY_LANG = {
  it: "it-IT",
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
} as const;
const LANGS = ["it", "en", "fr", "es"] as const;

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

    // canonical
    const canonical = await getCanonical(page);
    expect(canonical, "canonical mancante").toBeTruthy();
    expect(String(canonical)).toMatch(/^https?:\/\//);

    // og:url
    const og = await getOgUrl(page);
    expect(og, "og:url mancante").toBeTruthy();
    expect(og).toBe(canonical);

    // alternates presenti e con URL assoluti
    const alts = await getHreflangs(page);
    for (const hre of ALT_EXPECT) {
      expect(alts[hre], `hreflang ${hre} mancante`).toBeTruthy();
      expect(alts[hre]).toMatch(/^https?:\/\//);
    }

    // Verifica path attesi per ogni alternate
    if (type === "list") {
      // la lista deve puntare esattamente al prefix di ogni lingua
      for (const hre of ALT_EXPECT) {
        if (hre === "x-default") continue;
        const expectedPrefix = HREFLANG_TO_PREFIX[hre as keyof typeof HREFLANG_TO_PREFIX];
        const url = alts[hre]!;
        expect(new URL(url).pathname).toBe(expectedPrefix);
      }
    } else if (type === "detail") {
      // il dettaglio deve puntare al prefix + slug
      const slug = "aws-cloud-practitioner";
      for (const hre of ALT_EXPECT) {
        if (hre === "x-default") continue;
        const expectedPrefix = HREFLANG_TO_PREFIX[hre as keyof typeof HREFLANG_TO_PREFIX];
        const url = alts[hre]!;
        expect(new URL(url).pathname).toBe(`${expectedPrefix}/${slug}`);
      }
    }

    // x-default: accettiamo IT o EN
    const xdef = alts["x-default"]!;
    const xdPath: string = new URL(xdef).pathname;
    const okXDefaultList: string[] = [
      HREFLANG_TO_PREFIX["it-IT"],
      HREFLANG_TO_PREFIX["en-US"],
    ];

    // helper: rimuove il /{slug} finale se presente (senza usare replace overload)
    function stripSlug(pathname: string, slug: string): string {
      const tail = `/${slug}`;
      return pathname.endsWith(tail) ? pathname.slice(0, pathname.length - tail.length) : pathname;
    }

    if (type === "list") {
      expect(okXDefaultList.includes(xdPath)).toBe(true);
    } else if (type === "detail") {
      const slug = "aws-cloud-practitioner";
      const base = stripSlug(xdPath, slug);
      expect(
        okXDefaultList.includes(base) ||
        xdPath === `${HREFLANG_TO_PREFIX["it-IT"]}/${slug}` ||
        xdPath === `${HREFLANG_TO_PREFIX["en-US"]}/${slug}`
      ).toBe(true);
    }
  });
}

/* -------- Canonical test per le altre lingue (lista) -------- */
// La route attuale per LISTA è /[lang]/certificazioni per tutte le lingue,
// ma il canonical può essere /en/certifications / fr/certifications / es/certificaciones
const LIST_EXPECTED_CANONICAL: Record<string, string> = {
  en: "/en/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
};

for (const [lang, expectedCanonicalPath] of Object.entries(LIST_EXPECTED_CANONICAL)) {
  const listPath = `/${lang}/certificazioni`;
  test(`SEO: canonical corretta nella lista ${lang.toUpperCase()}`, async ({ page }) => {
    await page.goto(`${BASE}${listPath}`, { waitUntil: "domcontentloaded" });
    const canonical = await getCanonical(page);
    expect(canonical).toBeTruthy();

    const canonicalPath = new URL(canonical!).pathname;
    // consentiamo canonical sia uguale al path reale, sia al path "bello" atteso
    const ok = canonicalPath === listPath || canonicalPath === expectedCanonicalPath;
    expect(ok).toBe(true);
  });
}
