import { expect, test, type Page, type Route } from "@playwright/test";

/**
 * Modalita' TWA (app Android) - verifica end-to-end contro un build di produzione
 * (`next start`). Il backend e' interamente simulato via page.route: nessuna
 * chiamata reale a /api/backend, nessun pagamento, nessun dato di produzione scritto.
 *
 * Il segnale TWA reale e' document.referrer = "android-app://com.certifyquiz.app/":
 * qui lo si emula con un init-script sul primo caricamento.
 */

const TWA_REFERRER = "android-app://com.certifyquiz.app/";

// Il sito registra /sw.js in produzione: le richieste fatte dal service worker bypassano page.route
// e raggiungerebbero l'API reale. Nei test il SW va bloccato.
test.use({ serviceWorkers: "block" });
const PURCHASE_PATH_RE =
  /^\/(?:(?:it|en|fr|es)\/)?(?:pricing|prezzi|prix|precios|business|aziende|entreprises|empresas|premium|packages)(?:\/|$)/i;
const PURCHASE_API_RE =
  /\/(billing\/create-checkout-session|billing\/create-portal-session|packages\/checkout|guides\/[^/]+\/checkout)(\?|$)/;
const STRIPE_HOST_RE = /(^|\.)stripe\.com$/i;

type Mock = { calls: string[]; stripe: string[] };

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function installBackendMock(
  page: Page,
  opts: { loggedIn: boolean; premium: boolean; guideAccess?: boolean }
): Promise<Mock> {
  const mock: Mock = { calls: [], stripe: [] };

  if (opts.loggedIn) {
    await page.addInitScript(() => {
      try {
        localStorage.setItem("cq:access", "e2e-test-token");
      } catch {}
    });
  }

  // Le immagini ottimizzate (_next/image) non sono oggetto di questi test e, con la macchina carica,
  // accodano le navigazioni (limite di connessioni per host): le sostituiamo con un pixel.
  await page.route("**/_next/image**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "image/gif",
      body: Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"),
    })
  );
  await page.route("**/api/backend/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace(/^\/api\/backend/, "");
    mock.calls.push(`${route.request().method()} ${path}`);

    if (PURCHASE_API_RE.test(path)) {
      // Se la UI arrivasse fin qui, restituiamo un URL Stripe: il test lo intercetta e fallisce.
      return json(route, { url: "https://checkout.stripe.com/c/pay/cs_test_e2e" });
    }
    if (path === "/auth/refresh") {
      // Contratto reale: { token } se il refresh cookie e' valido, 401 altrimenti.
      return opts.loggedIn ? json(route, { token: "e2e-test-token" }) : json(route, { error: "NO_REFRESH" }, 401);
    }
    if (path === "/auth/me") {
      if (!opts.loggedIn) return json(route, { error: "NO_TOKEN" }, 401);
      return json(route, {
        user: { id: 4242, username: "e2e", email: "e2e@example.test", role: "user", premium: opts.premium },
      });
    }
    if (path === "/billing/subscription-status") {
      return json(route, {
        status: opts.premium ? "active" : "none",
        cancelAtPeriodEnd: false,
        currentPeriodEnd: "2027-01-01T00:00:00.000Z",
      });
    }
    if (path.startsWith("/packages/offers/")) {
      return json(route, {
        offers: [
          {
            code: "e2e-pass",
            productCode: "dolphin-study",
            name: "E2E Pass",
            amountMinor: 2490,
            effectiveAmountMinor: 2490,
            creditMinor: 0,
            purchaseType: "purchase",
            blockedReason: null,
            currency: "EUR",
            status: "active",
            checkoutAvailable: true,
            accessDurationDays: 90,
          },
        ],
        owned: null,
        premium: false,
        darkLaunch: false,
        certificationId: 1,
      });
    }
    if (/^\/guides\/[^/]+$/.test(path)) {
      return json(route, { guide: { hasAccess: !!opts.guideAccess, accessReason: opts.guideAccess ? "premium" : null } });
    }
    return json(route, {});
  });

  // Qualunque richiesta verso Stripe e' un errore: la registriamo e la blocchiamo.
  await page.route(/https?:\/\/[^/]*stripe\.com\//, (route) => {
    mock.stripe.push(route.request().url());
    return route.abort();
  });
  page.on("framenavigated", (frame) => {
    try {
      if (STRIPE_HOST_RE.test(new URL(frame.url()).hostname)) mock.stripe.push(frame.url());
    } catch {}
  });

  return mock;
}

/**
 * Emula l'avvio da TWA: Chrome valorizza document.referrer con "android-app://<package>"
 * solo sul primo caricamento. L'opzione `referer` di Playwright imposta l'header ma NON
 * document.referrer, quindi il segnale viene fornito con un init-script applicato una
 * sola volta per scheda (la persistenza successiva deve venire da sessionStorage).
 */
async function emulateTwaLaunch(page: Page, referrer = TWA_REFERRER) {
  await page.addInitScript((ref) => {
    try {
      if (!sessionStorage.getItem("e2e_launched")) {
        sessionStorage.setItem("e2e_launched", "1");
        Object.defineProperty(document, "referrer", { get: () => ref, configurable: true });
      }
    } catch {}
  }, referrer);
}

async function gotoAsTwa(page: Page, path: string) {
  await emulateTwaLaunch(page);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.documentElement.getAttribute("data-twa") === "1");
}

/** Attende l'idratazione: la guardia ha marcato almeno un link di acquisto (presenti in header sul sito). */
async function waitForGuard(page: Page) {
  await page.waitForFunction(() => document.querySelector("a[data-twa-hide]") !== null, undefined, { timeout: 20_000 });
}

const NOTICE_TITLE_RE =
  /non disponibile nell'app|Not available in the app|indisponible dans l'application|no disponible en la app/i;
const noticeCard = (page: Page) => page.locator("h2", { hasText: NOTICE_TITLE_RE }).locator("xpath=..");

async function visiblePurchaseLinks(page: Page): Promise<string[]> {
  return page.evaluate((reSource) => {
    const re = new RegExp(reSource, "i");
    return [...document.querySelectorAll<HTMLAnchorElement>("a[href]")]
      .filter((a) => {
        try {
          return re.test(new URL(a.href).pathname);
        } catch {
          return false;
        }
      })
      .filter((a) => {
        const s = getComputedStyle(a);
        const r = a.getBoundingClientRect();
        return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
      })
      .map((a) => a.getAttribute("href") || "");
  }, PURCHASE_PATH_RE.source);
}

function expectNoPurchase(mock: Mock) {
  const purchaseCalls = mock.calls.filter((c) => PURCHASE_API_RE.test(c.split(" ")[1] || ""));
  expect(purchaseCalls, `chiamate di acquisto: ${purchaseCalls.join(", ")}`).toEqual([]);
  expect(mock.stripe, `richieste/navigazioni verso Stripe: ${mock.stripe.join(", ")}`).toEqual([]);
}

test.describe("web normale (controllo: nessuna modifica)", () => {
  test("pricing mostra prezzi e il sito espone i link a Premium", async ({ page }) => {
    const mock = await installBackendMock(page, { loggedIn: false, premium: false });
    await page.goto("/it/prezzi", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).not.toHaveAttribute("data-twa", /.*/);
    await expect(page.locator("body")).toContainText("€", { timeout: 15_000 });
    await expect(page.locator("h2", { hasText: NOTICE_TITLE_RE })).toHaveCount(0);
    await expect.poll(async () => (await visiblePurchaseLinks(page)).length, { timeout: 10_000 }).toBeGreaterThan(0);
    expectNoPurchase(mock);
  });

  test("sessionStorage non resta sporco dopo ?cq_twa=0", async ({ page }) => {
    await installBackendMock(page, { loggedIn: false, premium: false });
    await page.goto("/it?cq_twa=1", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-twa", "1");
    await page.goto("/it?cq_twa=0", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).not.toHaveAttribute("data-twa", /.*/);
    await expect.poll(async () => (await visiblePurchaseLinks(page)).length, { timeout: 10_000 }).toBeGreaterThan(0);
  });

  test("offerte pacchetti presenti sulla pagina certificazione (controllo positivo)", async ({ page }) => {
    const mock = await installBackendMock(page, { loggedIn: true, premium: false });
    await page.goto("/it/certificazioni/ccna", { waitUntil: "domcontentloaded" });
    await expect(page.locator("section#packages")).toBeVisible({ timeout: 20_000 });
    expect(mock.calls.some((c) => c.startsWith("GET /packages/offers/"))).toBe(true);
  });
});

test.describe("modalita' TWA", () => {
  test("il referrer android-app imposta la modalita' e persiste nella navigazione", async ({ page }) => {
    await installBackendMock(page, { loggedIn: false, premium: false });
    await gotoAsTwa(page, "/it");
    expect(await page.evaluate(() => sessionStorage.getItem("cq_twa"))).toBe("1");
    await expect.poll(async () => (await visiblePurchaseLinks(page)).length, { timeout: 10_000 }).toBe(0);
    // navigazione interna senza referrer android-app
    await page.goto("/it/certificazioni", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-twa", "1");
  });

  test("referrer di un'altra app o package simile NON attiva la modalita'", async ({ browser }) => {
    for (const referrer of ["android-app://com.altra.app/", "android-app://com.certifyquiz.app.evil/", "https://www.google.com/", ""]) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await installBackendMock(page, { loggedIn: false, premium: false });
      await emulateTwaLaunch(page, referrer);
      await page.goto("/it", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1200);
      await expect(page.locator("html")).not.toHaveAttribute("data-twa", /.*/);
      expect(await page.evaluate(() => sessionStorage.getItem("cq_twa"))).toBeNull();
      await ctx.close();
    }
  });

  test("login resta disponibile (email e Google)", async ({ page }) => {
    await installBackendMock(page, { loggedIn: false, premium: false });
    await gotoAsTwa(page, "/it/login");
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    const google = page.locator('a[href*="/api/auth/google"]');
    await expect(google).toBeVisible();
    await expect(page.locator("h2", { hasText: NOTICE_TITLE_RE })).toHaveCount(0);
  });

  for (const path of [
    "/pricing",
    "/it/prezzi",
    "/fr/prix",
    "/es/precios",
    "/en/pricing",
    "/business",
    "/it/aziende",
    "/fr/entreprises",
    "/es/empresas",
    "/it/premium/success?session_id=cs_test_e2e&plan=premium_monthly",
    "/premium/cancel",
    "/packages/success",
  ]) {
    test(`pagina di acquisto ${path} -> avviso neutro, nessun checkout`, async ({ page }) => {
      const mock = await installBackendMock(page, { loggedIn: true, premium: false });
      await gotoAsTwa(page, path);
      const card = noticeCard(page);
      await expect(card.first()).toBeVisible({ timeout: 20_000 });
      await expect(card.first()).not.toContainText(/€|\$|stripe|checkout|acquista|buy|prix|precio/i);
      await page.waitForTimeout(1500);
      expectNoPurchase(mock);
    });
  }

  // DIFETTO NOTO (non bloccante, nessun acquisto): durante l'idratazione useTwa() vale false, quindi
  // CertificationPackageOffersInner monta e lancia GET /packages/offers/<slug> prima che il wrapper
  // lo smonti. La UI non compare mai. Da correggere saltando l'effect con detectTwa(); quando
  // Regression: effects must check TWA before fetching commercial data.
  test("pagina certificazione: nessuna richiesta read-only a /packages/offers", async ({ page }) => {
    const mock = await installBackendMock(page, { loggedIn: true, premium: false });
    await gotoAsTwa(page, "/it/certificazioni/ccna");
    await waitForGuard(page);
    await page.waitForTimeout(2500);
    expect(mock.calls.filter((c) => c.includes("/packages/offers/"))).toEqual([]);
  });

  test("pagina certificazione: nessuna offerta visibile ne' link di acquisto", async ({ page }) => {
    const mock = await installBackendMock(page, { loggedIn: true, premium: false });
    await gotoAsTwa(page, "/it/certificazioni/ccna");
    await waitForGuard(page);
    await page.waitForTimeout(2500);
    await expect(page.locator("section#packages")).toHaveCount(0);
    await expect.poll(async () => (await visiblePurchaseLinks(page)).join(","), { timeout: 10_000 }).toBe("");
    expectNoPurchase(mock);
  });

  test("profilo di un abbonato Premium: niente portale, push o pacchetti", async ({ page }) => {
    const mock = await installBackendMock(page, { loggedIn: true, premium: true });
    await gotoAsTwa(page, "/it/profile");
    await page.waitForFunction(() => document.body.innerText.length > 200, undefined, { timeout: 20_000 });
    await page.waitForTimeout(2500);
    await expect(page.getByRole("button", { name: /Gestisci abbonamento/i })).toHaveCount(0);
    await expect(page.locator("#my-packages")).toHaveCount(0);
    expect(await visiblePurchaseLinks(page)).toEqual([]);
    expectNoPurchase(mock);
  });

  test("guide: elenco senza link di acquisto e gate neutro senza checkout", async ({ page }) => {
    const mock = await installBackendMock(page, { loggedIn: true, premium: false, guideAccess: false });
    await gotoAsTwa(page, "/it/guide");
    const href = await page
      .locator('a[href^="/it/guide/"]')
      .evaluateAll((els) =>
        (els as HTMLAnchorElement[]).map((a) => a.getAttribute("href") || "").find((h) => /^\/it\/guide\/[^/?#]+$/.test(h)) || null
      );
    test.skip(!href, "nessuna guida trovata nell'elenco");
    await page.goto(href as string, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-twa", "1");
    await page.waitForTimeout(3000);
    await expect(page.getByText(/Guida riservata/)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: /€|Acquista/i })).toHaveCount(0);
    expect(await visiblePurchaseLinks(page)).toEqual([]);
    expectNoPurchase(mock);
  });

  test("link verso pricing aggiunti dinamicamente sono nascosti e il click non naviga", async ({ page }) => {
    const mock = await installBackendMock(page, { loggedIn: false, premium: false });
    await gotoAsTwa(page, "/it");
    await waitForGuard(page);
    await page.evaluate(() => {
      const a = document.createElement("a");
      a.id = "e2e-dyn-link";
      a.href = "/it/prezzi?source=e2e";
      a.textContent = "Passa a Premium";
      a.style.display = "block";
      document.body.prepend(a);
      const b = document.createElement("a");
      b.id = "e2e-abs-link";
      b.href = "https://www.certifyquiz.com/pricing";
      b.textContent = "Pricing";
      document.body.prepend(b);
    });
    await expect(page.locator("#e2e-dyn-link")).toBeHidden();
    await expect(page.locator("#e2e-abs-link")).toBeHidden();
    const before = page.url();
    await page.evaluate(() => (document.getElementById("e2e-dyn-link") as HTMLAnchorElement).click());
    await page.waitForTimeout(800);
    expect(page.url()).toBe(before);
    expectNoPurchase(mock);
  });

  test("navigazione client (router) verso pricing viene coperta dall'avviso", async ({ page }) => {
    const mock = await installBackendMock(page, { loggedIn: true, premium: false });
    await gotoAsTwa(page, "/it");
    await waitForGuard(page);
    const pushed = await page.evaluate(() => {
      const r = (window as any).next?.router;
      if (!r?.push) return false;
      r.push("/it/prezzi");
      return true;
    });
    test.skip(!pushed, "window.next.router non disponibile in questa build");
    await expect(page).toHaveURL(/\/it\/prezzi/);
    await expect(noticeCard(page).first()).toBeVisible({ timeout: 15_000 });
    expectNoPurchase(mock);
  });

  test("campione di pagine: nessun link di acquisto visibile", async ({ page }) => {
    test.setTimeout(180_000);
    const mock = await installBackendMock(page, { loggedIn: true, premium: false });
    await gotoAsTwa(page, "/it");
    for (const p of ["/it", "/", "/it/quiz-home", "/it/mappe", "/it/percorsi", "/it/ripassi", "/blog", "/it/certificazioni"]) {
      await page.goto(p, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2500);
      const links = await visiblePurchaseLinks(page);
      expect(links, `${p}: ${links.join(", ")}`).toEqual([]);
    }
    expectNoPurchase(mock);
  });
});


test("TWA pricing never loads commercial data during hydration", async ({page}) => {
  const mock = await installBackendMock(page, {loggedIn: true, premium: false});
  await gotoAsTwa(page, "/it/prezzi");
  await expect(noticeCard(page).first()).toBeVisible();
  await page.waitForTimeout(1500);
  expect(mock.calls.filter(c => /GET \/packages\/(offers|certifications)/.test(c))).toEqual([]);
  expectNoPurchase(mock);
});

test("TWA launch with cq_twa=0 cannot enable purchases", async ({page}) => {
  const mock = await installBackendMock(page, {loggedIn: false, premium: false});
  await gotoAsTwa(page, "/it/prezzi?cq_twa=0");
  await expect(noticeCard(page).first()).toBeVisible();
  expectNoPurchase(mock);
});

test("guard preserves legitimate links and unhides changed hrefs", async ({page}) => {
  await installBackendMock(page, {loggedIn: false, premium: false});
  await gotoAsTwa(page, "/it");
  await waitForGuard(page);
  await page.evaluate(() => {
    for (const [id,href] of Object.entries({keepBlog:"/it/blog/pricing-strategy",keepPrefix:"/pricing-tools",keepExternal:"https://example.com/pricing",keepCategory:"/categories/business-applications/sap",keepHash:"#packages",changing:"/it/prezzi"})) {
      const a=document.createElement("a");a.id=id;a.href=href;a.textContent=id;document.body.prepend(a);
    }
  });
  for (const id of ["keepBlog","keepPrefix","keepExternal","keepCategory","keepHash"]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
    await expect(page.locator(`#${id}`)).not.toHaveAttribute("data-twa-hide", "1");
  }
  await expect(page.locator("#changing")).toBeHidden();
  await page.locator("#changing").evaluate(a => a.setAttribute("href", "/it/certificazioni"));
  await expect(page.locator("#changing")).toBeVisible();
});
