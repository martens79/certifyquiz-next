import { expect, test, type Page } from "@playwright/test";

/**
 * Landing B2B con listino (/business, /it/aziende, /fr/entreprises, /es/empresas) nell'app Android.
 *
 * In TWA il contenuto commerciale non deve restare nel DOM sotto l'overlay del TwaGuard (prezzi,
 * ancore #plans, link "richiedi demo"): deve essere sostituito dall'avviso neutro. Sul web normale
 * e nell'HTML renderizzato dal server non cambia nulla (SEO, crawler, acquisti).
 *
 * Backend interamente simulato via page.route: nessuna chiamata reale, nessun pagamento.
 */

const TWA_REFERRER = "android-app://com.certifyquiz.app/";

// Il sito registra /sw.js in produzione: il service worker aggirerebbe page.route.
test.use({ serviceWorkers: "block" });

const PAGES = [
  { lang: "en", path: "/business" },
  { lang: "it", path: "/it/aziende" },
  { lang: "fr", path: "/fr/entreprises" },
  { lang: "es", path: "/es/empresas" },
] as const;

// "€49", "49 €", "49 €" (spazio sottile/non separabile in FR).
const PRICE_RE = /(€[\s  ]?\d|\d[\s  ]?€)/;
// Link "richiedi demo / preventivo" delle landing B2B: mailto con oggetto precompilato.
const DEMO_LINK = 'a[href^="mailto:"][href*="subject="]';
const PURCHASE_API_RE = /\/(billing\/create-checkout-session|billing\/create-portal-session|packages\/checkout|guides\/[^/]+\/checkout)(\?|$)/;

async function mockBackend(page: Page) {
  const purchaseCalls: string[] = [];
  await page.route("**/api/backend/**", (route) => {
    if (PURCHASE_API_RE.test(new URL(route.request().url()).pathname.replace(/^\/api\/backend/, ""))) {
      purchaseCalls.push(route.request().url());
    }
    return route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ error: "unauthorized" }) });
  });
  await page.route(/(^|\.)stripe\.com/, (route) => {
    purchaseCalls.push(route.request().url());
    return route.abort();
  });
  await page.addInitScript(() => {
    try {
      localStorage.setItem("cq_cookie_consent", JSON.stringify({ accepted: true }));
    } catch {}
  });
  return purchaseCalls;
}

async function emulateTwaLaunch(page: Page) {
  await page.addInitScript((ref) => {
    try {
      if (!sessionStorage.getItem("e2e_launched")) {
        sessionStorage.setItem("e2e_launched", "1");
        Object.defineProperty(document, "referrer", { get: () => ref, configurable: true });
      }
    } catch {}
  }, TWA_REFERRER);
}

for (const { lang, path } of PAGES) {
  test.describe(`landing B2B ${lang} (${path})`, () => {
    test("web normale: listino e richiesta demo restano visibili (controllo positivo)", async ({ page }) => {
      const purchaseCalls = await mockBackend(page);
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).not.toHaveAttribute("data-twa", /.*/);
      await expect(page.locator(DEMO_LINK).first()).toBeAttached();
      expect(await page.locator("body").innerText()).toMatch(PRICE_RE);
      expect(purchaseCalls).toEqual([]);
    });

    test("TWA: il contenuto commerciale non e' nel DOM (non solo coperto) e compare l'avviso neutro", async ({ page }) => {
      const purchaseCalls = await mockBackend(page);
      await emulateTwaLaunch(page);
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => document.documentElement.getAttribute("data-twa") === "1");
      await expect(page.getByRole("alert").first()).toBeVisible({ timeout: 15_000 });

      // Il DOM non deve contenere listino, ancore del listino ne' link "richiedi demo".
      // (il link di supporto nel footer del sito e' legittimo e non commerciale)
      expect(await page.locator(DEMO_LINK).evaluateAll((els) => els.filter((e) => !e.closest("footer")).length)).toBe(0);
      await expect(page.locator("#plans, #piani, #planes, #offres")).toHaveCount(0);
      // Testo del DOM montato: si escludono script/style (il payload RSC di Next contiene i dati della pagina)
      // e <title> (metadato SEO, deve restare).
      const mountedText = await page.evaluate(() => {
        const clone = document.body.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("script, style, noscript, title").forEach((n) => n.remove());
        return clone.textContent || "";
      });
      expect(mountedText).not.toMatch(PRICE_RE);

      // Nessun elemento interattivo "commerciale" dietro l'overlay: ogni link/pulsante visibile fuori
      // dall'avviso non porta a pagine di acquisto.
      const purchaseLinks = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")]
          .filter((a) => getComputedStyle(a).display !== "none")
          .map((a) => a.getAttribute("href") || "")
          .filter((h) => /\/(pricing|prezzi|prix|precios|business|aziende|entreprises|empresas|premium|packages)(\/|\?|#|$)/.test(h))
      );
      expect(purchaseLinks).toEqual([]);
      expect(purchaseCalls).toEqual([]);
    });

    test("HTML renderizzato dal server identico: il contenuto c'e' anche con referrer android-app", async ({ request }) => {
      const plain = await (await request.get(path)).text();
      const withTwaReferer = await (await request.get(path, { headers: { Referer: TWA_REFERRER } })).text();
      expect(plain).toContain("subject=");
      expect(withTwaReferer).toContain("subject=");
      expect(plain.length).toBe(withTwaReferer.length);
    });
  });
}
