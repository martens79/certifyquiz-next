// Recupero di un pagamento fallito con un account SINTETICO past_due.
// SOLO locale e mock: ogni chiamata a /api/backend e a Stripe e' intercettata dal browser di prova.
// Nessun backend reale, nessun addebito, nessun abbonamento creato, nessun dato scritto.
//
//   NEXT_PUBLIC_TURNSTILE_SITE_KEY=x NEXT_PUBLIC_SANITY_PROJECT_ID=e2edummy npx next dev -p 3106
//   E2E_BASE_URL=http://localhost:3106 npx playwright test -c playwright.payment-recovery.config.ts
import { expect, test, type Page, type Route } from "@playwright/test";

const TOKEN = "test-token-not-real";
const PORTAL_URL = "https://billing.stripe.com/p/session/test_stub";
const EVIL_URL = "https://evil.example/phish";

type Portal = "ok" | "untrusted" | "error";
type Sub = { premium: 0 | 1; status: string | null; needsPaymentUpdate?: boolean; trialEnd?: string | null; currentPeriodEnd?: string | null; cancelAtPeriodEnd?: boolean };
type Mock = { checkoutPosts: unknown[]; portalPosts: number; evilRequests: number; dialogs: string[]; unmocked: string[]; portal: Portal };

const PAST_DUE: Sub = { premium: 0, status: "past_due", needsPaymentUpdate: true, currentPeriodEnd: "2030-01-01T00:00:00.000Z", cancelAtPeriodEnd: false };
const ACTIVE: Sub = { premium: 1, status: "active", needsPaymentUpdate: false, currentPeriodEnd: "2030-01-01T00:00:00.000Z", cancelAtPeriodEnd: false };

async function setup(page: Page, { sub, portal = "ok" as Portal, premiumUser = false }: { sub: Sub; portal?: Portal; premiumUser?: boolean }): Promise<Mock> {
  const state: Mock = { checkoutPosts: [], portalPosts: 0, evilRequests: 0, dialogs: [], unmocked: [], portal };
  const user = { id: 4242, username: "e2e", email: "e2e@example.test", role: "user", premium: premiumUser, trial: false, premium_status: sub.status };

  await page.addInitScript((token) => {
    try {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
    } catch {}
    try {
      localStorage.setItem("cq_cookie_consent", JSON.stringify({ accepted: true }));
      localStorage.setItem("cq:access", token);
    } catch {}
  }, TOKEN);

  page.on("dialog", async (d) => { state.dialogs.push(d.message()); await d.dismiss(); }); // un alert() generico sarebbe un difetto

  const json = (route: Route, status: number, body: unknown) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
  await page.route("**/api/backend/**", async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname.replace(/^\/api\/backend/, "");
    const method = req.method();
    if (path === "/funnel-event") return json(route, 200, { ok: true });
    if (path === "/auth/me") return (req.headers()["authorization"] || "").includes(TOKEN) ? json(route, 200, { user }) : json(route, 401, { error: "unauthorized" });
    if (path === "/auth/refresh") return json(route, 401, { error: "no refresh cookie" });
    if (path === "/billing/subscription-status") return json(route, 200, sub);
    if (path === "/billing/create-checkout-session" && method === "POST") {
      state.checkoutPosts.push(JSON.parse(req.postData() || "null"));
      // Stesso 400/messaggio di sempre + il codice che permette di guidare l'utente
      return json(route, 400, { error: "Premium subscription already exists", code: "SUBSCRIPTION_PAYMENT_ISSUE", status: "past_due", portal: true });
    }
    if (path === "/billing/create-portal-session" && method === "POST") {
      state.portalPosts++;
      if (state.portal === "error") return json(route, 500, { error: "Failed to create portal session", code: "PORTAL_UNAVAILABLE" });
      return json(route, 200, { url: state.portal === "ok" ? PORTAL_URL : EVIL_URL });
    }
    if (method === "GET" && path === "/packages/certifications") return json(route, 200, []);
    if (path === "/me/explanation-status") return json(route, 200, { used: 0, limit: 10, unlimited: false });
    if (method === "GET" && /^\/(notifications|push|analytics)/.test(path)) return json(route, 200, {});
    if (method === "GET") { state.unmocked.push(`GET ${path}`); return json(route, 200, []); } // la pagina profilo legge molti elenchi: vuoti
    state.unmocked.push(`${method} ${path}`);
    return json(route, 404, { error: "mocked-404" });
  });
  await page.route("https://billing.stripe.com/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<html><body><h1 id='portal-stub'>Stripe portal stub</h1></body></html>" }));
  await page.route("https://evil.example/**", (route) => { state.evilRequests++; return route.abort(); });
  await page.route(/https:\/\/(www\.googletagmanager|connect\.facebook|www\.google-analytics|challenges\.cloudflare)\./, (route) => route.abort());
  return state;
}

test.describe("profilo con abbonamento past_due", () => {
  test("mostra l'avviso e il pulsante, non concede Premium e apre il portale Stripe (nessun nuovo checkout)", async ({ page }) => {
    const m = await setup(page, { sub: PAST_DUE });
    await page.goto("/profile");
    const notice = page.getByTestId("payment-recovery");
    await expect(notice).toBeVisible();
    await expect(notice).toContainText("Payment failed");
    await expect(page.getByText("Subscription active")).toHaveCount(0);
    const button = page.getByRole("button", { name: /update payment method/i });
    await expect(button).toBeVisible();
    await button.click();
    await page.waitForURL(PORTAL_URL);
    await expect(page.locator("#portal-stub")).toBeVisible();
    expect(m.portalPosts).toBe(1);
    expect(m.checkoutPosts, "nessun checkout e quindi nessun secondo abbonamento").toHaveLength(0);
  });

  test("un URL del portale non Stripe viene rifiutato: nessuna navigazione, errore visibile", async ({ page }) => {
    const m = await setup(page, { sub: PAST_DUE, portal: "untrusted" });
    await page.goto("/profile");
    await page.getByRole("button", { name: /update payment method/i }).click();
    await expect(page.getByText(/could not open the payment portal/i)).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/profile");
    expect(m.evilRequests).toBe(0);
  });

  test("errore del portale: messaggio chiaro e il pulsante torna utilizzabile", async ({ page }) => {
    const m = await setup(page, { sub: PAST_DUE, portal: "error" });
    await page.goto("/profile");
    const button = page.getByRole("button", { name: /update payment method/i });
    await button.click();
    await expect(page.getByText(/could not open the payment portal/i)).toBeVisible();
    await expect(button).toBeEnabled();
    expect(m.portalPosts).toBe(1);
  });

  test("abbonamento attivo: nessun avviso di pagamento, resta 'Manage subscription'", async ({ page }) => {
    await setup(page, { sub: ACTIVE, premiumUser: true });
    await page.goto("/profile");
    await expect(page.getByText("Subscription active")).toBeVisible();
    await expect(page.getByTestId("payment-recovery")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /manage subscription/i })).toBeVisible();
  });

  test("app Android (TWA): nessun avviso di pagamento, nessun invito al portale/Stripe/sito, nessuna richiesta di portale", async ({ page }) => {
    const m = await setup(page, { sub: PAST_DUE });
    // All'avvio da TWA Chrome imposta document.referrer = "android-app://<package>" (vedi src/lib/twa.ts).
    await page.addInitScript(() => Object.defineProperty(document, "referrer", { get: () => "android-app://com.certifyquiz.app" }));
    await page.goto("/profile");
    await expect(page.locator("html[data-twa]")).toHaveCount(1); // la TWA e' stata riconosciuta (referrer android-app://)
    await page.waitForTimeout(1500);
    await expect(page.getByTestId("payment-recovery")).toHaveCount(0);
    await expect(page.getByText(/stripe|payment method|website/i)).toHaveCount(0);
    expect(m.portalPosts).toBe(0);
  });
});

test.describe("pricing con abbonamento past_due", () => {
  test("il checkout rifiutato mostra l'avviso (non un alert), una sola richiesta, poi il portale", async ({ page }) => {
    const m = await setup(page, { sub: PAST_DUE });
    await page.goto("/pricing?source=guide_preview&certification_slug=ccna&cta=guide_gate");
    await page.getByRole("button", { name: /start premium/i }).first().click();
    const notice = page.getByTestId("payment-recovery");
    await expect(notice).toBeVisible();
    await expect(notice).toContainText("Payment failed");
    await expect(notice).toContainText(/no need to create another one/i);
    expect(m.dialogs, "nessun alert() generico").toEqual([]);
    expect(m.checkoutPosts).toHaveLength(1);
    await notice.getByRole("button", { name: /update payment method/i }).click();
    await page.waitForURL(PORTAL_URL);
    expect(m.checkoutPosts, "il portale non crea un altro checkout").toHaveLength(1);
    expect(m.portalPosts).toBe(1);
  });

  test("un secondo tentativo ripresenta l'avviso senza creare altre sessioni oltre a quella rifiutata", async ({ page }) => {
    const m = await setup(page, { sub: PAST_DUE });
    await page.goto("/pricing");
    const cta = page.getByRole("button", { name: /start premium/i }).first();
    await cta.click();
    await expect(page.getByTestId("payment-recovery")).toBeVisible();
    await cta.click();
    await expect(page.getByTestId("payment-recovery")).toBeVisible();
    expect(m.checkoutPosts.length).toBeLessThanOrEqual(2);
    expect(m.dialogs).toEqual([]);
    expect(m.portalPosts).toBe(0);
  });
});
