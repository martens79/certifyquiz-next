// Utente gia' Premium (attivo o in prova) che prova ad avviare un nuovo abbonamento dalla pagina prezzi.
// SOLO locale e mock: il backend reale risponde 400 { code: "SUBSCRIPTION_ALREADY_ACTIVE" } (routes/billingRoutes.js),
// qui lo stesso contratto e' simulato nel browser. Nessuna sessione Stripe, nessun pagamento, nessun dato in produzione.
//
//   npx next dev -p 3105     (server dev appena avviato, con le route gia' compilate)
//   E2E_BASE_URL=http://localhost:3105 npx playwright test -c playwright.already-premium.config.ts
import { expect, test, type Page, type Route } from "@playwright/test";

const TOKEN = "test-token-not-real";
const STRIPE_URL = "https://checkout.stripe.test/c/pay/cs_test_stub";
const PAGES = { en: "/pricing", it: "/it/prezzi", fr: "/fr/prix", es: "/es/precios" } as const;
const TITLES = { en: "You already have Premium", it: "Hai già Premium", fr: "Vous avez déjà Premium", es: "Ya tienes Premium" } as const;
const PROFILE = { en: "/profile", it: "/it/profile", fr: "/fr/profile", es: "/es/profile" } as const;
const CTA = /start premium|inizia premium|commencer premium|empezar premium/i;
type Lang = keyof typeof PAGES;

type Account = "free" | "trial" | "premium" | "server_error";

async function setup(page: Page, account: Account) {
  const state = { posts: [] as any[], funnel: [] as any[], dialogs: [] as string[], stripeVisits: 0 };
  const premium = account === "premium" || account === "trial";
  const user = { id: 4242, username: "e2e", email: "e2e@example.test", role: "user", premium, trial: account === "trial" };

  await page.addInitScript((token) => {
    try {
      // Il sito scarta gli eventi dei browser automatizzati: qui ci si dichiara "browser normale".
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
      localStorage.setItem("cq_cookie_consent", JSON.stringify({ accepted: true }));
      localStorage.setItem("cq:access", token);
    } catch {}
  }, TOKEN);

  page.on("dialog", async (d) => {
    state.dialogs.push(d.message());
    await d.dismiss();
  });
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
    if (path === "/funnel-event") return json(route, 200, { ok: true });
    if (path === "/auth/me") return json(route, 200, { user });
    if (path === "/billing/create-checkout-session" && req.method() === "POST") {
      state.posts.push(JSON.parse(req.postData() || "null"));
      if (account === "free") return json(route, 200, { url: STRIPE_URL, sessionId: "cs_test_stub" });
      if (account === "server_error") return json(route, 500, { error: "boom" });
      // Contratto reale del backend per abbonamento attivo o in prova.
      return json(route, 400, { error: "Premium subscription already exists", code: "SUBSCRIPTION_ALREADY_ACTIVE" });
    }
    if (path === "/me/explanation-status") return json(route, 200, { used: 0, limit: 10, unlimited: premium });
    return json(route, 200, {});
  });
  await page.route("https://checkout.stripe.test/**", (route) => {
    state.stripeVisits += 1;
    return route.fulfill({ status: 200, contentType: "text/html", body: "<html><body><h1 id='stripe-stub'>Stripe stub</h1></body></html>" });
  });
  await page.route(/https:\/\/(www\.googletagmanager|connect\.facebook|www\.google-analytics|challenges\.cloudflare)/, (route) => route.abort());
  return state;
}

// Il click parte solo dopo che la pagina e' idratata e l'utente e' stato letto: il test verifica la risposta al
// rifiuto del backend, non la gara di idratazione (che e' un'indagine a parte).
async function openAndClick(page: Page, lang: Lang) {
  const me = page.waitForResponse((r) => new URL(r.url()).pathname === "/api/backend/auth/me" && r.status() === 200);
  await page.goto(`${PAGES[lang]}?source=guide_preview&certification_slug=ccna&cta=guide_gate`);
  await me;
  const cta = page.getByRole("button", { name: CTA }).first();
  await expect(cta).toBeEnabled();
  await page.waitForTimeout(500); // lascia terminare l'idratazione dopo la lettura dell'utente
  await cta.click();
}

for (const account of ["premium", "trial"] as const) {
  for (const lang of ["en", "it", "fr", "es"] as Lang[]) {
    test(`${account} (${lang}): rifiuto atteso, messaggio chiaro e link al profilo, nessuna sessione Stripe, nessun errore generico`, async ({ page }) => {
      const m = await setup(page, account);
      await openAndClick(page, lang);

      const notice = page.getByTestId("already-premium");
      await expect(notice).toBeVisible();
      await expect(notice).toContainText(TITLES[lang]);
      await expect(notice.getByRole("link")).toHaveAttribute("href", PROFILE[lang]);
      await expect(notice.getByRole("button")).toHaveCount(0);

      await page.waitForTimeout(800);
      expect(m.posts, "un solo tentativo, nessun duplicato").toHaveLength(1);
      expect(m.stripeVisits, "nessuna sessione Stripe aperta").toBe(0);
      expect(page.url()).not.toContain("checkout.stripe.test");
      expect(m.dialogs, "nessun alert generico").toEqual([]);
      const events = m.funnel.map((e) => e?.event);
      expect(events).toContain("checkout_attempted");
      expect(events, "il rifiuto atteso non e' un fallimento").not.toContain("checkout_failed");
      const wire = JSON.stringify(m.funnel) + JSON.stringify(m.posts);
      expect(wire).not.toContain("example.test");
      expect(wire).not.toContain("SUBSCRIPTION_ALREADY_ACTIVE");
      // Il pulsante e' di nuovo utilizzabile: l'utente non resta bloccato.
      await expect(page.getByRole("button", { name: CTA }).first()).toBeEnabled();
    });
  }
}

test("free: il checkout parte normalmente verso Stripe, senza avviso 'gia Premium'", async ({ page }) => {
  const m = await setup(page, "free");
  await openAndClick(page, "en");
  await page.waitForURL(STRIPE_URL);
  expect(m.posts).toHaveLength(1);
  expect(m.posts[0]).toMatchObject({ plan: "premium_monthly", skipTrial: false, origin_cert_slug: "ccna", lang: "en" });
  expect(m.dialogs).toEqual([]);
  expect(m.funnel.map((e) => e?.event)).not.toContain("checkout_failed");
});

test("errore generico del server: resta il messaggio generico e l'evento checkout_failed della #179", async ({ page }) => {
  const m = await setup(page, "server_error");
  await openAndClick(page, "en");
  await expect.poll(() => m.dialogs.length).toBe(1);
  expect(m.dialogs[0]).toMatch(/error while opening checkout/i);
  await expect(page.getByTestId("already-premium")).toHaveCount(0);
  await expect.poll(() => m.funnel.filter((e) => e?.event === "checkout_failed").length).toBe(1);
  expect(m.stripeVisits).toBe(0);
});
