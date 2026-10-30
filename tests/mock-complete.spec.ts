import { test, expect } from "@playwright/test";
import { FakeBackend, dismissCookieBanner } from "./helpers/quiz-session-backend";
test.use({ serviceWorkers: "block" });
for (const slug of ["ccna", "cisco-ccst-cybersecurity"]) {
  test(`mock result goes directly to ${slug} Complete, preserving context`, async ({ page }) => {
    const be = new FakeBackend(); await be.install(page);
    await page.route(/^http:\/\/127\.0\.0\.1:\d+\/(?!api\/backend)/, r => r.continue());
    await page.addInitScript(() => { localStorage.setItem("cq_cookie_consent", JSON.stringify({ accepted: false })); });
    await page.route("**/api/backend/packages/offers/**", r => r.fulfill({ json: { offers: [{ code: "fixture-complete", productCode: "octopus-complete", checkoutAvailable: true, amountMinor: 2490, currency: "EUR" }] } }));
    await page.route("**/api/backend/mock-exam/questions/**", r => r.fulfill({ json: {
      poolTotal: 100, purpose: "mock_exam", spec: { questions: 2, served: 2, durationSec: 3600 },
      questions: [1,2].map(id => ({ id, question: `Synthetic question #${id}`, answers: [1,2,3,4].map(n => ({ id: id*10+n, text: `Answer ${n} of ${id}` })) })),
    } }));
    await page.route("**/api/backend/mock-exam/evaluate/**", r => r.fulfill({ json: {
      summary: { total: 2, answered: 0, correct: 0, wrong: 0, percentage: 0, passed: false }, reviewAvailable: false, details: [],
    } }));
    await page.goto(`/en/quiz/${slug}/mock-exam`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/Synthetic question #\d+/, { exact: true })).toBeVisible();
    await dismissCookieBanner(page);
    await page.getByRole("button", { name: /^Next/ }).first().click();
    await page.getByRole("button", { name: /Finish|Submit|End exam/i }).first().click();
    const cta = page.getByRole("link", { name: "Choose Complete for this certification" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", `/certifications/${slug}?source=mock_review&cta=mock_review&certification_slug=${slug}&package_offer=fixture-complete#package-offer-fixture-complete`);
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeInViewport();
    await page.screenshot({ path: test.info().outputPath(`${slug}-mock-complete.png`) });
    await cta.click();
    await expect(page.locator("#package-offer-fixture-complete")).toBeAttached({ timeout: 30000 });
    await expect(page.locator("article").filter({ has: page.locator("#package-offer-fixture-complete") }).getByRole("button", { name: "Get access" })).toBeVisible();
    expect(new URL(page.url()).searchParams.get("certification_slug")).toBe(slug);
    const top = await page.locator("#package-offer-fixture-complete").evaluate(el => el.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(0); expect(top).toBeLessThan(250);
    await page.screenshot({ path: test.info().outputPath(`${slug}-complete-offer.png`) });
  });
}
