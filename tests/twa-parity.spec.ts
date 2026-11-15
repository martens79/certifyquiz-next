import { expect, test, type Browser, type Page, type Route } from "@playwright/test";

/**
 * TWA v1 - parita' funzionale web vs app Android, percorsi commerciali web e
 * robustezza del parametro cq_twa. Backend interamente simulato (page.route):
 * nessuna chiamata di scrittura verso /api/backend reale, nessun pagamento.
 * Complementare a tests/twa-mode.spec.ts.
 */

const TWA_REFERRER = "android-app://com.certifyquiz.app/";

// Il sito registra /sw.js in produzione: le richieste fatte dal service worker bypassano page.route
// e raggiungerebbero l'API reale. Nei test il SW va bloccato.
test.use({ serviceWorkers: "block" });
const PURCHASE_PATH_RE =
  /^\/(?:(?:it|en|fr|es)\/)?(?:pricing|prezzi|prix|precios|business|aziende|entreprises|empresas|premium|packages)(?:\/|$)/i;
const PURCHASE_API_RE =
  /\/(billing\/create-checkout-session|billing\/create-portal-session|packages\/checkout|guides\/[^/]+\/checkout)(\?|$)/;
const NOTICE_TITLE_RE =
  /non disponibile nell'app|Not available in the app|indisponible dans l'application|no disponible en la app/i;

const QUESTION = "Which layer of the OSI model handles routing?";
const QUESTIONS = {
  poolTotal: 100,
  questions: [
    {
      id: 7001,
      topic_id: 85,
      certification_id: 10,
      question: QUESTION,
      explanation: null,
      question_type: "standard",
      answers: [
        { id: 1, text: "Network", is_correct: 1 },
        { id: 2, text: "Transport", is_correct: 0 },
        { id: 3, text: "Session", is_correct: 0 },
        { id: 4, text: "Physical", is_correct: 0 },
      ],
    },
  ],
};

type Opts = {
  loggedIn?: boolean;
  premium?: boolean;
  guideAccess?: boolean;
  errorReview?: { status: number; body: unknown };
};
type Mock = { calls: string[]; stripe: string[] };
const registry: Mock[] = [];
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    for (const m of registry) console.log("DIAG", testInfo.title, JSON.stringify(m.calls.filter((c) => !c.includes("inbox")).slice(0, 30)), JSON.stringify(m.stripe));
  }
  registry.length = 0;
});

const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

async function installMock(page: Page, opts: Opts = {}): Promise<Mock> {
  const mock: Mock = { calls: [], stripe: [] };
  registry.push(mock);
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
    const path = new URL(route.request().url()).pathname.replace(/^\/api\/backend/, "");
    mock.calls.push(`${route.request().method()} ${path}`);

    if (PURCHASE_API_RE.test(path)) return json(route, { url: "https://checkout.stripe.com/c/pay/cs_test_e2e" });
    if (path === "/auth/refresh")
      return opts.loggedIn ? json(route, { token: "e2e-test-token" }) : json(route, { error: "NO_REFRESH" }, 401);
    if (path === "/auth/me") {
      if (!opts.loggedIn) return json(route, { error: "NO_TOKEN" }, 401);
      return json(route, {
        user: { id: 4242, username: "e2e", email: "e2e@example.test", role: "user", premium: !!opts.premium },
      });
    }
    if (path === "/billing/subscription-status")
      return json(route, {
        status: opts.premium ? "active" : "none",
        cancelAtPeriodEnd: false,
        currentPeriodEnd: "2027-01-01T00:00:00.000Z",
      });
    if (path.startsWith("/packages/offers/"))
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
    if (/^\/guides\/[^/]+\/download$/.test(path))
      return route.fulfill({ status: 200, contentType: "application/pdf", body: Buffer.from("%PDF-1.4\n%e2e\n") });
    if (/^\/guides\/[^/]+$/.test(path))
      return json(route, {
        guide: { hasAccess: !!opts.guideAccess, accessReason: opts.guideAccess ? "purchased" : null },
      });
    if (/^\/(questions|questions-mixed|assessment|mock-exam|question-pool)\//.test(path)) return json(route, QUESTIONS);
    if (path.startsWith("/user/error-review") && opts.errorReview)
      return json(route, opts.errorReview.body, opts.errorReview.status);
    if (path.startsWith("/labs") || path.startsWith("/job-tracks")) return json(route, path.startsWith("/labs/completed") ? {} : []);
    return json(route, {});
  });
  await page.route(/https?:\/\/[^/]*stripe\.com\//, (route) => {
    mock.stripe.push(route.request().url());
    return route.abort();
  });
  return mock;
}

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

async function openTwa(page: Page, path: string) {
  await emulateTwaLaunch(page);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.documentElement.getAttribute("data-twa") === "1");
}

async function waitForGuard(page: Page) {
  await page.waitForFunction(() => document.querySelector("a[data-twa-hide]") !== null, undefined, { timeout: 20_000 });
}

async function visiblePurchaseLinks(page: Page): Promise<string[]> {
  return page.evaluate((src) => {
    const re = new RegExp(src, "i");
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

const purchaseCalls = (m: Mock) => m.calls.filter((c) => PURCHASE_API_RE.test(c.split(" ")[1] || ""));
const noticeTitle = (page: Page) => page.locator("h2", { hasText: NOTICE_TITLE_RE });

async function pair(browser: Browser, opts: Opts) {
  const webCtx = await browser.newContext();
  const web = await webCtx.newPage();
  const webMock = await installMock(web, opts);
  const twaCtx = await browser.newContext();
  const twa = await twaCtx.newPage();
  const twaMock = await installMock(twa, opts);
  return { web, twa, webMock, twaMock, close: async () => { await webCtx.close(); await twaCtx.close(); } };
}

/* ------------------------------------------------------------------ */
/* 1. Percorsi di acquisto del WEB: devono restare tutti funzionanti    */
/* ------------------------------------------------------------------ */
test.describe("web: i percorsi di acquisto restano attivi (controllo positivo)", () => {
  test("pricing -> create-checkout-session -> redirect a Stripe", async ({ page }) => {
    const mock = await installMock(page, { loggedIn: true, premium: false });
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).not.toHaveAttribute("data-twa", /.*/);
    const cta = page.getByRole("button", { name: /Start Premium/i }).first();
    await expect(cta).toBeVisible({ timeout: 20_000 });
    await cta.click();
    await expect.poll(() => purchaseCalls(mock).length, { timeout: 15_000 }).toBeGreaterThan(0);
    await expect.poll(() => mock.stripe.length, { timeout: 15_000 }).toBeGreaterThan(0);
  });

  test("guida singola -> checkout", async ({ page }) => {
    const mock = await installMock(page, { loggedIn: true, premium: false, guideAccess: false });
    await page.goto("/guide/ccna", { waitUntil: "domcontentloaded" });
    const buy = page.getByRole("button", { name: /Buy this guide/i });
    await expect(buy).toBeVisible({ timeout: 20_000 });
    await buy.click();
    await expect.poll(() => purchaseCalls(mock).some((c) => /guides\/.*\/checkout/.test(c)), { timeout: 15_000 }).toBe(true);
  });

  test("offerta pacchetto -> /packages/checkout", async ({ page }) => {
    const mock = await installMock(page, { loggedIn: true, premium: false });
    await page.goto("/it/certificazioni/ccna", { waitUntil: "domcontentloaded" });
    const buy = page.locator("section#packages").getByRole("button", { name: /Ottieni l'accesso|Acquista|Get access/i }).first();
    await expect(buy).toBeVisible({ timeout: 25_000 });
    await buy.click();
    await expect.poll(() => purchaseCalls(mock).some((c) => c.includes("/packages/checkout")), { timeout: 15_000 }).toBe(true);
  });

  test("profilo abbonato -> portale Stripe", async ({ page }) => {
    const mock = await installMock(page, { loggedIn: true, premium: true });
    await page.goto("/it/profile", { waitUntil: "domcontentloaded" });
    const manage = page.getByRole("button", { name: /Gestisci abbonamento/i });
    await expect(manage).toBeVisible({ timeout: 25_000 });
    await manage.click();
    await expect.poll(() => purchaseCalls(mock).some((c) => c.includes("create-portal-session")), { timeout: 15_000 }).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/* 2. TWA: contenuti gia' acquistati accessibili                        */
/* ------------------------------------------------------------------ */
test.describe("TWA: accesso ai contenuti gia' acquistati", () => {
  test("guida con accesso: pulsante di download disponibile e funzionante", async ({ page }) => {
    const mock = await installMock(page, { loggedIn: true, premium: false, guideAccess: true });
    await openTwa(page, "/guide/ccna");
    const dl = page.getByRole("button", { name: /Download PDF/i });
    await expect(dl).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/Restricted guide/)).toHaveCount(0);
    await dl.click();
    await expect.poll(() => mock.calls.some((c) => /GET \/guides\/ccna\/download/.test(c)), { timeout: 15_000 }).toBe(true);
    expect(purchaseCalls(mock)).toEqual([]);
    expect(mock.stripe).toEqual([]);
  });

  test("ripasso errori Premium (200): contenuto mostrato come sul web", async ({ page }) => {
    await installMock(page, {
      loggedIn: true,
      premium: true,
      errorReview: {
        status: 200,
        body: {
          items: [
            {
              id: 1,
              question: "Domanda sintetica di ripasso?",
              explanation: "Spiegazione sintetica",
              answers: [
                { id: 11, answer_text: "Giusta", is_correct: 1 },
                { id: 12, answer_text: "Sbagliata", is_correct: 0 },
              ],
            },
          ],
          meta: { total: 1 },
        },
      },
    });
    await openTwa(page, "/review/errors");
    await expect(page.getByText("Domanda sintetica di ripasso?")).toBeVisible({ timeout: 25_000 });
  });

  test("CONTROLLO web: ripasso errori Premium (200) con lo stesso mock", async ({ page }) => {
    await installMock(page, {
      loggedIn: true,
      premium: true,
      errorReview: {
        status: 200,
        body: {
          items: [
            {
              id: 1,
              question: "Domanda sintetica di ripasso?",
              explanation: "Spiegazione sintetica",
              answers: [
                { id: 11, answer_text: "Giusta", is_correct: 1 },
                { id: 12, answer_text: "Sbagliata", is_correct: 0 },
              ],
            },
          ],
          meta: { total: 1 },
        },
      },
    });
    await page.goto("/review/errors", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Domanda sintetica di ripasso?")).toBeVisible({ timeout: 25_000 });
  });

  test("ripasso errori FREE (403): gate presente ma senza CTA verso pricing", async ({ page }) => {
    const mock = await installMock(page, {
      loggedIn: true,
      premium: false,
      errorReview: { status: 403, body: { error: "ERROR_REVIEW_PREMIUM_REQUIRED" } },
    });
    await openTwa(page, "/review/errors");
    await expect(page.getByText("Error review is included in Premium")).toBeVisible({ timeout: 25_000 });
    await waitForGuard(page);
    await expect(page.getByRole("link", { name: "Explore Premium" })).toBeHidden();
    expect(await visiblePurchaseLinks(page)).toEqual([]);
    expect(purchaseCalls(mock)).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* 3. Parita' web vs TWA su quiz, ripassi, Interactive Labs             */
/* ------------------------------------------------------------------ */
test.describe("parita' funzionale web vs TWA", () => {
  test.describe.configure({ timeout: 150_000 });
  for (const path of ["/en/quiz/ccna/mock-exam", "/en/quiz/ccna/mixed?mode=assessment", "/it/quiz/ccna/mixed"]) {
    test(`quiz ${path}: domanda e risposte identiche, nessun acquisto`, async ({ browser }) => {
      const { web, twa, twaMock, close } = await pair(browser, { loggedIn: false });
      try {
        await web.goto(path, { waitUntil: "domcontentloaded" });
        await expect(web.getByText(QUESTION)).toBeVisible({ timeout: 40_000 });
        await openTwa(twa, path);
        await expect(twa.getByText(QUESTION)).toBeVisible({ timeout: 40_000 });
        for (const answer of ["Network", "Transport", "Session", "Physical"]) {
          await expect(web.getByText(answer, { exact: true }).first()).toBeVisible();
          await expect(twa.getByText(answer, { exact: true }).first()).toBeVisible();
        }
        const before = twa.url();
        await twa.getByText("Network", { exact: true }).first().click();
        await twa.waitForTimeout(1200);
        expect(twa.url()).toBe(before);
        await expect(noticeTitle(twa)).toHaveCount(0);
        expect(purchaseCalls(twaMock)).toEqual([]);
      } finally {
        await close();
      }
    });
  }

  for (const path of ["/it/ripassi", "/reviews"]) {
    test(`ripassi ${path}: stessi contenuti e link`, async ({ browser }) => {
      const { web, twa, twaMock, close } = await pair(browser, { loggedIn: false });
      try {
        await web.goto(path, { waitUntil: "domcontentloaded" });
        await openTwa(twa, path);
        await waitForGuard(twa).catch(() => {});
        const scrape = (p: Page) =>
          p.evaluate((re) => {
            const r = new RegExp(re, "i");
            const vis = (el: Element) => {
              const s = getComputedStyle(el);
              const b = el.getBoundingClientRect();
              return s.display !== "none" && b.width > 0 && b.height > 0;
            };
            const links = [...document.querySelectorAll<HTMLAnchorElement>("main a[href]")]
              .filter((a) => vis(a) && !r.test(new URL(a.href).pathname))
              .map((a) => new URL(a.href).pathname)
              .sort();
            return { h1: document.querySelector("h1")?.textContent?.trim() ?? null, links };
          }, PURCHASE_PATH_RE.source);
        await expect.poll(async () => (await scrape(web)).h1, { timeout: 20_000 }).not.toBeNull();
        await expect.poll(async () => JSON.stringify(await scrape(twa)), { timeout: 20_000 }).toBe(JSON.stringify(await scrape(web)));
        await expect(noticeTitle(twa)).toHaveCount(0);
        expect(purchaseCalls(twaMock)).toEqual([]);
      } finally {
        await close();
      }
    });
  }

  for (const path of ["/interactive-labs", "/it/interactive-labs"]) {
    test(`Interactive Labs ${path}: pagina disponibile come sul web`, async ({ browser }) => {
      const { web, twa, twaMock, close } = await pair(browser, { loggedIn: true, premium: false });
      try {
        await web.goto(path, { waitUntil: "domcontentloaded" });
        await openTwa(twa, path);
        await expect.poll(async () => (await web.locator("h1").first().textContent())?.trim() || "", { timeout: 25_000 }).not.toBe("");
        const webH1 = (await web.locator("h1").first().textContent())?.trim();
        await expect(twa.locator("h1").first()).toHaveText(webH1 as string, { timeout: 25_000 });
        await expect(noticeTitle(twa)).toHaveCount(0);
        await twa.waitForTimeout(1500);
        expect(await visiblePurchaseLinks(twa)).toEqual([]);
        expect(purchaseCalls(twaMock)).toEqual([]);
      } finally {
        await close();
      }
    });
  }
});

/* ------------------------------------------------------------------ */
/* 4. Quattro lingue in TWA                                             */
/* ------------------------------------------------------------------ */
test.describe("TWA: quattro lingue", () => {
  for (const [path, label] of [
    ["/", "EN"],
    ["/it", "IT"],
    ["/fr", "FR"],
    ["/es", "ES"],
  ] as const) {
    test(`home ${label} (${path}): carica, nessun avviso, nessun link di acquisto`, async ({ page }) => {
      const mock = await installMock(page, { loggedIn: false });
      await openTwa(page, path);
      await expect(page.locator("header").first()).toBeVisible({ timeout: 20_000 });
      await expect(noticeTitle(page)).toHaveCount(0);
      await expect.poll(async () => (await visiblePurchaseLinks(page)).length, { timeout: 12_000 }).toBe(0);
      expect(purchaseCalls(mock)).toEqual([]);
    });
  }

  test("selettore lingua: cambia lingua e la modalita' TWA persiste", async ({ page }) => {
    await installMock(page, { loggedIn: false });
    await openTwa(page, "/it");
    const select = page.getByRole("combobox", { name: /Language|Lingua/i }).first();
    await expect(select).toBeVisible({ timeout: 20_000 });
    for (const code of ["EN", "FR", "ES", "IT"]) {
      await select.selectOption({ label: code });
      await page.waitForLoadState("domcontentloaded");
      await expect(page.locator("html")).toHaveAttribute("data-twa", "1");
      await expect(noticeTitle(page)).toHaveCount(0);
    }
  });
});

/* ------------------------------------------------------------------ */
/* 5. Navigazione e tasto Indietro                                      */
/* ------------------------------------------------------------------ */
test.describe("TWA: navigazione e Indietro", () => {
  test("pagina interna e ritorno: Back riporta alla pagina precedente", async ({ page }) => {
    test.setTimeout(120_000);
    await installMock(page, { loggedIn: false });
    await openTwa(page, "/it");
    await page.goto("/it/certificazioni", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-twa", "1");
    await page.goBack({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/it\/?$/);
    await expect(noticeTitle(page)).toHaveCount(0);
  });

  test("deep link a pricing: avviso e 'Torna alla home' funziona", async ({ page }) => {
    await installMock(page, { loggedIn: false });
    await openTwa(page, "/it/prezzi");
    await expect(noticeTitle(page).first()).toBeVisible({ timeout: 20_000 });
    await page.getByRole("link", { name: /Torna alla home/i }).first().click();
    await expect(page).toHaveURL(/\/it\/?$/, { timeout: 15_000 });
    await expect(noticeTitle(page)).toHaveCount(0);
  });

  test("navigazione verso pricing e Back: nessuna trappola nella cronologia", async ({ page }) => {
    await installMock(page, { loggedIn: false });
    await openTwa(page, "/it");
    await page.goto("/it/prezzi", { waitUntil: "domcontentloaded" });
    await expect(noticeTitle(page).first()).toBeVisible({ timeout: 20_000 });
    await page.goBack({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/it\/?$/);
    await expect(noticeTitle(page)).toHaveCount(0);
  });
});

/* ------------------------------------------------------------------ */
/* 6. Parametro cq_twa                                                  */
/* ------------------------------------------------------------------ */
test.describe("parametro cq_twa", () => {
  test("valori non validi non attivano la modalita' e non vengono riflessi", async ({ page }) => {
    await installMock(page, { loggedIn: false });
    let dialogs = 0;
    page.on("dialog", async (d) => {
      dialogs++;
      await d.dismiss();
    });
    for (const v of ["true", "yes", "2", "%31", "1x", "<script>alert(1)</script>", "\"onload=alert(1)"]) {
      await page.goto(`/it?cq_twa=${encodeURIComponent(v)}`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => sessionStorage.clear());
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).not.toHaveAttribute("data-twa", /.*/);
      const html = await page.content();
      expect(html.includes("<script>alert(1)</script>")).toBe(false);
    }
    expect(dialogs).toBe(0);
  });

  test("?cq_twa=1 sul web nasconde solo l'interfaccia: non sblocca contenuti ne' cambia canonical/robots", async ({ request, page }) => {
    const plain = await (await request.get("/it/prezzi")).text();
    const flagged = await (await request.get("/it/prezzi?cq_twa=1")).text();
    const pick = (h: string, re: RegExp) => (re.exec(h) || [])[0] ?? null;
    expect(pick(flagged, /<link[^>]*rel="canonical"[^>]*>/i)).toBe(pick(plain, /<link[^>]*rel="canonical"[^>]*>/i));
    expect(pick(flagged, /<meta[^>]*name="robots"[^>]*>/i)).toBe(pick(plain, /<meta[^>]*name="robots"[^>]*>/i));
    // il server non usa il flag: stessi title/description/H1 (il solo scarto e' la query nel payload RSC di Next)
    const titleRe = /<title[^>]*>[\s\S]*?<\/title>/i;
    const descRe = /<meta[^>]*name="description"[^>]*>/i;
    const h1Re = /<h1\b[^>]*>[\s\S]*?<\/h1>/i;
    for (const re of [titleRe, descRe, h1Re]) {
      expect(pick(flagged, re)).toBe(pick(plain, re));
    }
    // il valore del parametro compare solo nelle chiavi di route del payload RSC (serializzate/escapate da Next)
    expect(flagged).not.toMatch(/<[^>]*cq_twa[^>]*>/);

    await installMock(page, { loggedIn: true, premium: false, guideAccess: false });
    await page.goto("/guide/ccna?cq_twa=1", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/Restricted guide/)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("button", { name: /Download PDF/i })).toHaveCount(0);
  });

  // Regression: a native session remains locked even on a later override URL.
  test("in TWA ?cq_twa=0 NON deve disattivare la guardia", async ({ page }) => {
    await installMock(page, { loggedIn: false });
    await openTwa(page, "/it");
    await page.goto("/it/prezzi?cq_twa=0", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-twa", "1");
    await expect(noticeTitle(page).first()).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("TWA: prima dell'idratazione", () => {
  for (const path of ["/", "/it", "/fr", "/es", "/it/quiz-home"]) {
    // SSR links are marked by the bootstrap observer before React can hydrate.
    test(`pre-idratazione ${path}: nessun link di acquisto visibile (script bloccati)`, async ({ page }) => {
      await installMock(page, { loggedIn: false });
      await page.route("**/_next/static/chunks/**", (route) => route.abort());
      await emulateTwaLaunch(page);
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => document.documentElement.getAttribute("data-twa") === "1");
      expect(await visiblePurchaseLinks(page)).toEqual([]);
      await page.evaluate(() => {
        const a=document.createElement("a");a.id="early-legitimate";a.href="/it/blog/pricing-strategy";a.textContent="Legitimate";document.body.prepend(a);
      });
      await expect(page.locator("#early-legitimate")).toBeVisible();
      await expect(page.locator("#early-legitimate")).not.toHaveAttribute("data-twa-hide", "1");
    });
  }
});
