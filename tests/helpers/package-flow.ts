import type { Page } from "@playwright/test";

export const complete = { code: "fixture-complete", productCode: "octopus-complete", name: "Complete", amountMinor: 2490,
  currency: "EUR", status: "active", checkoutAvailable: true, blockedReason: null, accessDurationDays: 90 };
export async function packageFlow(page: Page, consent = false) {
  const state = { authenticated: false, checkoutStatus: 200, checkoutPosts: [] as Record<string, unknown>[], funnel: [] as Record<string, unknown>[], blocked: false, loginOk: true,
    offerCode: complete.code, withStudy: false };
  await page.addInitScript(({ consent }) => {
    localStorage.setItem("cq_cookie_consent", JSON.stringify({ accepted: consent, ts: Date.now() }));
    localStorage.setItem("lang_banner_dismissed", "1");
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
  }, { consent });
  // Observe beacon intent at request creation, including navigations that cancel delivery.
  page.on("request", request => {
    if (request.method() === "POST" && new URL(request.url()).pathname === "/api/backend/funnel-event") {
      state.funnel.push(request.postDataJSON());
    }
  });
  await page.route("**/*", async route => {
    const req = route.request(), url = new URL(req.url());
    if (url.hostname === "challenges.cloudflare.com") return route.fulfill({ contentType: "application/javascript", body: "window.turnstile={render:(_e,o)=>{setTimeout(()=>o.callback('synthetic'),20);return 'w'},reset:()=>{},remove:()=>{},getResponse:()=> 'synthetic',isExpired:()=>false};if(window.onloadTurnstileCallback)window.onloadTurnstileCallback();" });
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) return route.abort();
    if (!url.pathname.startsWith("/api/backend/")) return route.continue();
    const p = url.pathname.replace("/api/backend", "");
    const json = (body: unknown, status = 200) => route.fulfill({ status, json: body });
    if (p === "/funnel-event") return json({ ok: true });
    if (p === "/auth/me") return state.authenticated ? json({ user: { id: 90001, username: "fixture", email: "fixture@example.test", premium: false, role: "user" } }) : json({}, 401);
    if (p === "/auth/refresh") return state.authenticated ? json({ token: "synthetic" }) : json({}, 401);
    if (p === "/auth/login" || p === "/auth/register") {
      if (!state.loginOk) return json({ error: "invalid" }, 401);
      state.authenticated = true;
      return json({ token: "synthetic", user: { id: 90001, username: "fixture", email: "fixture@example.test", role: "user", premium: false } });
    }
    if (p.startsWith("/certifications/by-slug/")) return json({ id: 34, slug: p.split("/").pop(), name: "Fixture certification" });
    if (p.startsWith("/question-pool/certifications/")) return json({ poolTotal: 100 });
    if (p.startsWith("/mock-exam/questions/")) return json({
      poolTotal: 100, purpose: "mock_exam", spec: { questions: 2, served: 2, durationSec: 3600 },
      questions: [1, 2].map(id => ({ id, question: `Synthetic question #${id}`, answers: [1, 2, 3, 4].map(n => ({ id: id * 10 + n, text: `Answer ${n} of ${id}` })) })),
    });
    if (p.startsWith("/mock-exam/evaluate/")) return json({
      summary: { total: 2, answered: 0, correct: 0, wrong: 0, percentage: 0, passed: false }, reviewAvailable: false, details: [],
    });
    if (p.startsWith("/packages/offers/")) return json({ offers: [
      ...(state.withStudy ? [{ ...complete, code: "fixture-study", productCode: "dolphin-study", amountMinor: 1290 }] : []),
      { ...complete, code: state.offerCode, blockedReason: state.blocked ? "already_owned" : null },
    ], owned: state.blocked ? { tier: "octopus-complete" } : null });
    if (p === "/packages/checkout") {
      state.checkoutPosts.push(req.postDataJSON());
      if (!state.authenticated) return json({}, 401);
      return json(state.checkoutStatus === 200 ? { url: "/__stripe_fixture", sessionId: "cs_synthetic" } : { error: "CHECKOUT_FAILED" }, state.checkoutStatus);
    }
    return json({});
  });
  await page.route("**/__stripe_fixture", r => r.fulfill({ contentType: "text/html", body: "<h1>Synthetic checkout</h1>" }));
  return state;
}
export async function login(page: Page) {
  const form = page.locator("form", { has: page.locator('input[type="password"]') }).first();
  await form.locator('input[type="email"]').fill("fixture@example.test");
  await form.locator('input[type="password"]').first().fill("synthetic-password-123");
  await form.locator('button[type="submit"]').click();
}
