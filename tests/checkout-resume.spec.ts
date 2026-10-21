// Collaudo del percorso Premium: visitatore anonimo -> login/registrazione/Google -> checkout ripreso.
// SOLO locale e mock: ogni chiamata a /api/backend, a Google OAuth, a Turnstile e a Stripe e' intercettata
// dal browser di prova. Nessun backend reale, nessun pagamento, nessun dato scritto in produzione.
//
//   npx next dev -p 3105     (con NEXT_PUBLIC_TURNSTILE_SITE_KEY impostata a un valore qualsiasi)
//   E2E_BASE_URL=http://localhost:3105 npx playwright test -c playwright.checkout-resume.config.ts
import { expect, test, type Page, type Route } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL || "http://localhost:3105";
const TOKEN = "test-token-not-real";
const USER = { id: 4242, username: "e2e", email: "e2e@example.test", role: "user", premium: false, trial: false };
const STRIPE_URL = "https://checkout.stripe.test/c/pay/cs_test_stub";

type Mock = {
  checkoutPosts: any[];
  funnel: any[];
  unmocked: string[];
  checkoutStatus: 200 | 401 | 500;
  loginOk: boolean;
  anonMeDelayMs: number; // ritardo della risposta 401 di /auth/me senza token (bootstrap anonimo che arriva "tardi")
  googleSetsCookie: boolean;
  meDelayMs: number; // ritardo di /auth/me con token valido (utente non ancora caricato al primo click)
  meAlways401: boolean; // sessione realmente scaduta: nemmeno il token valido viene accettato
  refreshCookie: boolean; // come il cookie HttpOnly del backend: dopo un accesso la sessione si recupera con /auth/refresh
};

async function setup(
  page: Page,
  { authed = false, checkoutStatus = 200 as Mock["checkoutStatus"], anonMeDelayMs = 0, googleSetsCookie = true } = {}
): Promise<Mock> {
  const state: Mock = { checkoutPosts: [], funnel: [], unmocked: [], checkoutStatus, loginOk: true, refreshCookie: false, anonMeDelayMs, googleSetsCookie, meAlways401: false, meDelayMs: 0 };

  await page.addInitScript(
    ({ authed, token }) => {
      // Il sito scarta gli eventi dei browser automatizzati (automated-client.ts): nel collaudo si
      // dichiara "browser normale" per poter verificare gli eventi che un utente vero produrrebbe.
      try {
        Object.defineProperty(navigator, "webdriver", { get: () => false });
        Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
      } catch {}
      try {
        localStorage.setItem("cq_cookie_consent", JSON.stringify({ accepted: true }));
        if (authed && !sessionStorage.getItem("__e2e_init")) {
          localStorage.setItem("cq:access", token);
          sessionStorage.setItem("__e2e_init", "1");
        }
      } catch {}
    },
    { authed, token: TOKEN }
  );

  // Gli eventi anonimi partono con sendBeacon proprio mentre la pagina cambia: si leggono alla
  // creazione della richiesta, cosi' si contano anche se la navigazione la interrompe.
  page.on("request", (r) => {
    if (r.method() === "POST" && new URL(r.url()).pathname === "/api/backend/funnel-event") {
      try {
        state.funnel.push(JSON.parse(r.postData() || "null"));
      } catch {}
    }
  });

  const json = (route: Route, status: number, body: unknown) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

  await page.route("**/api/backend/**", async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname.replace(/^\/api\/backend/, "");
    const method = req.method();
    const body = (() => {
      try {
        return req.postData() ? JSON.parse(req.postData()!) : null;
      } catch {
        return null;
      }
    })();
    if (path === "/funnel-event") return json(route, 200, { ok: true }); // registrato da page.on("request")
    if (path === "/auth/me") {
      if (!state.meAlways401 && (req.headers()["authorization"] || "").includes(TOKEN)) {
        if (state.meDelayMs) await new Promise((r) => setTimeout(r, state.meDelayMs));
        return json(route, 200, { user: USER });
      }
      if (state.anonMeDelayMs) await new Promise((r) => setTimeout(r, state.anonMeDelayMs));
      return json(route, 401, { error: "unauthorized" });
    }
    if (path === "/auth/refresh") return state.refreshCookie ? json(route, 200, { ok: true, token: TOKEN }) : json(route, 401, { error: "no refresh cookie" });
    if (path === "/auth/login" && method === "POST") { if (state.loginOk) state.refreshCookie = true; return state.loginOk ? json(route, 200, { token: TOKEN }) : json(route, 401, { error: "bad" }); }
    if (path === "/auth/register" && method === "POST") { state.refreshCookie = true; return json(route, 201, { token: TOKEN, user: USER }); }
    if (path === "/billing/create-checkout-session" && method === "POST") {
      state.checkoutPosts.push(body);
      if (state.checkoutStatus !== 200) return json(route, state.checkoutStatus, { error: "mock" });
      return json(route, 200, { url: STRIPE_URL, sessionId: "cs_test_stub" });
    }
    if (method === "GET" && path === "/packages/certifications") return json(route, 200, []);
    if (path === "/me/explanation-status") return json(route, 200, { used: 0, limit: 10, unlimited: false });
    if (method === "GET" && /^\/(notifications|push|analytics)/.test(path)) return json(route, 200, {});
    state.unmocked.push(`${method} ${path}`);
    return json(route, 404, { error: "mocked-404" });
  });

  // Stripe: pagina segnaposto; nessun dominio reale.
  await page.route("https://checkout.stripe.test/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<html><body><h1 id='stripe-stub'>Stripe stub</h1></body></html>" })
  );
  // Google OAuth: il "provider" rimanda subito al callback del sito con un token finto.
  await page.route("https://api.certifyquiz.com/api/auth/google**", async (route) => {
    const u = new URL(route.request().url());
    const redirect = u.searchParams.get("redirect") || "/";
    if (state.googleSetsCookie) state.refreshCookie = true; // il callback Google imposta il cookie di sessione
    await route.fulfill({
      status: 302,
      headers: { location: `${BASE}/auth/callback?token=${TOKEN}&remember=1&redirect=${encodeURIComponent(redirect)}` },
    });
  });
  // Turnstile: widget finto che consegna subito un token.
  await page.route("https://challenges.cloudflare.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: `window.turnstile={render:function(_e,o){setTimeout(function(){o.callback&&o.callback('e2e-token')},20);return 'w1'},reset:function(){},remove:function(){},getResponse:function(){return 'e2e-token'},isExpired:function(){return false},execute:function(){}};
             if(window.onloadTurnstileCallback){window.onloadTurnstileCallback()}`,
    })
  );
  // Qualsiasi altro host esterno non necessario resta fuori dal test.
  await page.route(/https:\/\/(www\.googletagmanager|connect\.facebook|www\.google-analytics)\./, (route) => route.abort());
  return state;
}

const loginForm = (page: Page) => page.locator("form", { has: page.locator('input[type="password"]') }).first();
async function submitLogin(page: Page) {
  const form = loginForm(page);
  await form.locator('input[type="email"]').fill("e2e@example.test");
  await form.locator('input[type="password"]').first().fill("password-di-prova");
  await form.locator('button[type="submit"]').click();
}
const events = (m: Mock, name: string) => m.funnel.filter((e) => e?.event === name);
const PRICING = "/pricing?source=guide_preview&certification_slug=ccna&cta=guide_gate";

test.describe("visitatore anonimo", () => {
  test("il pulsante dice che serve un account, non crea checkout e porta al login con ritorno", async ({ page }) => {
    const m = await setup(page);
    await page.goto(PRICING);
    const cta = page.getByRole("button", { name: /log in or sign up to continue/i }).first();
    await expect(cta).toBeVisible();
    await expect(page.getByText(/free account is required/i).first()).toBeVisible();

    await cta.click();
    await page.waitForURL(/\/login/);
    const url = new URL(page.url());
    const redirect = url.searchParams.get("redirect")!;
    expect(url.searchParams.get("source")).toBe("premium_checkout");
    expect(redirect.startsWith("/")).toBe(true);
    expect(redirect.startsWith("//")).toBe(false);
    const back = new URL(redirect, BASE);
    expect(back.pathname).toBe("/pricing");
    expect(Object.fromEntries(back.searchParams)).toEqual({
      source: "guide_preview", certification_slug: "ccna", cta: "guide_gate", plan: "premium_monthly", resume: "1",
    });
    await expect(page.getByTestId("checkout-auth-banner")).toBeVisible();

    expect(m.checkoutPosts, "nessun checkout prima dell'autenticazione").toHaveLength(0);
    expect(events(m, "checkout_auth_required")).toHaveLength(1);
    expect(events(m, "checkout_attempted"), "nessun tentativo di checkout da anonimo").toHaveLength(0);
    expect(m.unmocked).toEqual([]);
  });

  test("login con email: ritorno alla pricing e checkout creato UNA volta, poi Stripe", async ({ page }) => {
    const m = await setup(page);
    await page.goto(PRICING);
    await page.getByRole("button", { name: /log in or sign up to continue/i }).first().click();
    await page.waitForURL(/\/login/);
    await submitLogin(page);

    await page.waitForURL(STRIPE_URL);
    expect(m.checkoutPosts).toHaveLength(1);
    expect(m.checkoutPosts[0]).toMatchObject({ plan: "premium_monthly", skipTrial: false, origin_cert_slug: "ccna", lang: "en" });
    expect(m.checkoutPosts[0].checkout_request_id).toBeTruthy();
    expect(events(m, "checkout_attempted")).toHaveLength(1);
    expect(m.unmocked).toEqual([]);
    // Nessun dato personale negli eventi del percorso (l'utente di prova ha email e username riconoscibili).
    const wire = JSON.stringify(m.funnel) + JSON.stringify(m.checkoutPosts);
    expect(wire).not.toContain("example.test");
    expect(wire).not.toContain("e2e-user");
    for (const e of m.funnel) expect(Object.keys(e)).not.toContain("email");

    // Indietro da Stripe: la pricing torna senza parametri di ripresa e senza rilanciare il checkout.
    await page.goBack();
    await page.waitForURL(/\/pricing/);
    expect(new URL(page.url()).searchParams.get("resume")).toBeNull();
    expect(new URL(page.url()).searchParams.get("plan")).toBeNull();
    await page.waitForTimeout(1200);
    expect(m.checkoutPosts, "nessun secondo checkout").toHaveLength(1);
    await expect(page.getByRole("button", { name: /start premium/i }).first()).toBeEnabled();
  });

  test("login con Google: stesso percorso, un solo checkout", async ({ page }) => {
    const m = await setup(page);
    await page.goto(PRICING);
    await page.getByRole("button", { name: /log in or sign up to continue/i }).first().click();
    await page.waitForURL(/\/login/);
    await page.getByRole("link", { name: /continue with google/i }).click();
    await page.waitForURL(STRIPE_URL);
    expect(m.checkoutPosts).toHaveLength(1);
    expect(m.checkoutPosts[0].plan).toBe("premium_monthly");
    expect(m.unmocked).toEqual([]);
  });

  // Gara sul callback Google: il bootstrap anonimo di AuthProvider (/auth/me senza token) puo' ricevere
  // il suo 401 DOPO che il callback ha salvato il token. In produzione la sessione si salva col cookie
  // di refresh; senza cookie (Preview su dominio diverso, cookie bloccati) il vecchio codice cancellava il token.
  for (const [label, googleSetsCookie] of [["con cookie di refresh", true], ["senza cookie di refresh", false]] as const) {
    test(`login con Google, 401 anonimo in ritardo, ${label}: la sessione sopravvive e il checkout riparte una volta`, async ({ page }) => {
      const m = await setup(page, { anonMeDelayMs: 2500, googleSetsCookie });
      await page.goto(PRICING);
      await page.getByRole("button", { name: /log in or sign up to continue/i }).first().click();
      await page.waitForURL(/\/login/);
      await page.getByRole("link", { name: /continue with google/i }).click();
      await page.waitForURL(STRIPE_URL);
      expect(m.checkoutPosts).toHaveLength(1);
      expect(m.unmocked).toEqual([]);
    });
  }

  test("registrazione: il contesto resta nel giro login -> registrazione e il checkout riparte", async ({ page }) => {
    const m = await setup(page);
    await page.goto(PRICING);
    await page.getByRole("button", { name: /log in or sign up to continue/i }).first().click();
    await page.waitForURL(/\/login/);
    await page.locator('a[href*="register"]').first().click();
    await page.waitForURL(/register/);
    await expect(page.getByTestId("checkout-auth-banner")).toBeVisible();

    const regForm = page.locator("form", { has: page.locator('input[name="username"]') }).first();
    await regForm.locator('input[name="username"]').fill("e2e-user");
    await regForm.locator('input[name="email"]').fill("e2e@example.test");
    await regForm.locator('input[name="password"]').fill("password-di-prova-1");
    await regForm.locator('input[name="confirmPassword"]').fill("password-di-prova-1");
    await page.waitForTimeout(600); // il widget Turnstile finto consegna il token dopo pochi ms
    await regForm.locator('button[type="submit"]').click();

    await page.waitForURL(STRIPE_URL);
    expect(m.checkoutPosts).toHaveLength(1);
    expect(m.unmocked).toEqual([]);
  });

  test("piano annuale e link promo: piano e promo sopravvivono al login", async ({ page }) => {
    const m = await setup(page);
    await page.goto("/pricing?promo=thanks1month");
    await page.getByRole("button", { name: /annual/i }).first().click();
    await page.getByRole("button", { name: /log in or sign up to continue/i }).first().click();
    await page.waitForURL(/\/login/);
    const back = new URL(new URL(page.url()).searchParams.get("redirect")!, BASE);
    expect(back.searchParams.get("plan")).toBe("premium_annual");
    expect(back.searchParams.get("promo")).toBe("thanks1month");
    await submitLogin(page);
    await page.waitForURL(STRIPE_URL);
    expect(m.checkoutPosts).toHaveLength(1);
    expect(m.checkoutPosts[0]).toMatchObject({ plan: "premium_annual", skipTrial: true });
  });
});

test.describe("utente autenticato", () => {
  test("pulsante normale, doppio click = un solo checkout", async ({ page }) => {
    const m = await setup(page, { authed: true });
    await page.goto(PRICING);
    const cta = page.getByRole("button", { name: /start premium/i }).first();
    await expect(cta).toBeVisible();
    await expect(page.getByRole("button", { name: /log in or sign up/i })).toHaveCount(0);
    await cta.dblclick();
    await page.waitForURL(STRIPE_URL);
    expect(m.checkoutPosts).toHaveLength(1);
    expect(events(m, "checkout_auth_required")).toHaveLength(0);
  });

  test("click subito dopo l'apertura, utente ancora in caricamento ma con token: nessun giro sul login", async ({ page }) => {
    const m = await setup(page, { authed: true });
    m.meDelayMs = 1500;
    await page.goto(PRICING, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /start premium|log in or sign up/i }).first().dblclick();
    await page.waitForURL(STRIPE_URL);
    expect(m.checkoutPosts).toHaveLength(1);
    expect(events(m, "checkout_auth_required")).toHaveLength(0);
  });

  test("anonimo: doppio click = un solo giro sul login e un solo evento", async ({ page }) => {
    const m = await setup(page);
    await page.goto(PRICING);
    await page.getByRole("button", { name: /log in or sign up to continue/i }).first().dblclick();
    await page.waitForURL(/\/login/);
    expect(events(m, "checkout_auth_required")).toHaveLength(1);
    expect(m.checkoutPosts).toHaveLength(0);
  });

  test("host di prova (Preview/altro host): nessuna sessione di pagamento, avviso chiaro", async ({ page }) => {
    const m = await setup(page, { authed: true });
    const previewLike = BASE.replace("localhost", "127.0.0.2"); // non e' tra gli host abilitati al checkout
    await page.goto(`${previewLike}/pricing?source=guide_preview&certification_slug=ccna`);
    await page.getByRole("button", { name: /start premium/i }).first().click();
    await expect(page.getByRole("alert").filter({ hasText: /checkout disabled on preview/i })).toBeVisible();
    await page.waitForTimeout(800);
    expect(m.checkoutPosts, "nessuna richiesta di checkout da un host di prova").toHaveLength(0);
  });

  test("?resume=1 senza intenzione salvata (altra scheda / link copiato): nessun avvio automatico", async ({ page }) => {
    const m = await setup(page, { authed: true });
    await page.goto("/pricing?resume=1&plan=premium_annual");
    await expect(page.getByRole("alert").filter({ hasText: /signed in/i })).toBeVisible();
    await page.waitForTimeout(1500);
    expect(m.checkoutPosts).toHaveLength(0);
    expect(new URL(page.url()).search).toBe("");
  });

  test("parametri di ripresa manipolati (piano ignoto, valore sbagliato) non avviano nulla", async ({ page }) => {
    const m = await setup(page, { authed: true });
    for (const q of ["?resume=1&plan=gratis", "?resume=yes&plan=premium_monthly", "?plan=premium_monthly"]) {
      await page.goto(`/pricing${q}`);
      await page.waitForTimeout(800);
    }
    expect(m.checkoutPosts).toHaveLength(0);
  });

  test("sessione scaduta durante la ripresa: avviso, nessun giro infinito sul login", async ({ page }) => {
    const m = await setup(page, { checkoutStatus: 401 });
    await page.goto(PRICING);
    await page.getByRole("button", { name: /log in or sign up to continue/i }).first().click();
    await page.waitForURL(/\/login/);
    await submitLogin(page);
    await expect(page.getByRole("alert").filter({ hasText: /session expired/i })).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/pricing");
    await page.waitForTimeout(1200);
    expect(m.checkoutPosts, "un solo tentativo, nessun ciclo").toHaveLength(1);
    await expect(page.getByRole("button", { name: /start premium/i }).first()).toBeEnabled();
  });

  test("sessione realmente scaduta: il token viene ancora cancellato (nessuna regressione del logout)", async ({ page }) => {
    const m = await setup(page, { authed: true });
    m.meAlways401 = true;
    await page.goto(PRICING);
    await expect.poll(() => page.evaluate(() => localStorage.getItem("cq:access")), { timeout: 15000 }).toBeNull();
    await expect(page.getByRole("button", { name: /log in or sign up to continue/i }).first()).toBeVisible();
    expect(m.checkoutPosts).toHaveLength(0);
  });

  test("errore del server sul checkout: il pulsante si sblocca e si puo' riprovare", async ({ page }) => {
    const m = await setup(page, { authed: true, checkoutStatus: 500 });
    page.on("dialog", (d) => d.dismiss());
    await page.goto(PRICING);
    const cta = page.getByRole("button", { name: /start premium/i }).first();
    await cta.click();
    await expect.poll(() => m.checkoutPosts.length).toBe(1);
    await expect(cta).toBeEnabled();
    m.checkoutStatus = 200;
    await cta.click();
    await page.waitForURL(STRIPE_URL);
    expect(m.checkoutPosts).toHaveLength(2);
  });
});

test.describe("redirect e parametri ostili", () => {
  for (const evil of ["//evil.example", "/\\evil.example", "/%5Cevil.example", "https://evil.example", "/%2F%2Fevil.example"]) {
    test(`callback Google con redirect ${evil} resta sul sito`, async ({ page }) => {
      await setup(page);
      await page.goto(`/auth/callback?token=${TOKEN}&remember=1&redirect=${encodeURIComponent(evil)}`);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1200);
      expect(new URL(page.url()).origin).toBe(new URL(BASE).origin);
    });
    test(`login con ?redirect=${evil} non esce dal sito`, async ({ page }) => {
      await setup(page);
      await page.goto(`/login?redirect=${encodeURIComponent(evil)}`);
      await submitLogin(page);
      await page.waitForTimeout(1500);
      expect(new URL(page.url()).origin).toBe(new URL(BASE).origin);
    });
  }
});
