import { test, expect } from "@playwright/test";
import { packageFlow, login } from "./helpers/package-flow";
test.use({ serviceWorkers: "block" });

for (const slug of ["ccna", "cisco-ccst-cybersecurity"]) {
  for (const method of ["login", "register"] as const) {
    test(`guest mock → exact Complete → ${method} → one checkout: ${slug}`, async ({ page }) => {
      const consent = method === "login";
      const m = await packageFlow(page, consent);
      m.offerCode = `fixture-${slug}-complete`;
      m.withStudy = true; // A second offer must never become the selected purchase.
      await page.goto(`/es/quiz/${slug}/mock-exam`, { waitUntil: "domcontentloaded" });
      await expect(page.getByText(/Synthetic question #\d+/, { exact: true })).toBeVisible();
      await page.getByRole("button", { name: "Terminar", exact: true }).first().click();
      const link = page.getByRole("link", { name: "Elegir Complete para esta certificación" });
      await expect(link).toBeVisible();
      const href = new URL((await link.getAttribute("href"))!, page.url());
      expect(href.pathname).toBe(`/es/certificaciones/${slug}`);
      expect(href.searchParams.get("package_offer")).toBe(m.offerCode);
      expect(href.searchParams.get("certification_slug")).toBe(slug);
      expect(href.hash).toBe(`#package-offer-${m.offerCode}`);
      await link.click();
      const selected = page.locator("article").filter({ has: page.locator("#package-resume") });
      await expect(selected).toContainText("Complete");
      await expect(selected.locator(`[id="package-offer-${m.offerCode}"]`)).toBeAttached();
      await expect(selected.getByRole("status")).toContainText("Paquete seleccionado");
      await expect(selected).toHaveCSS("scroll-margin-top", "96px");
      expect(m.checkoutPosts).toHaveLength(0);
      await selected.getByRole("button", { name: "Obtener acceso" }).click();
      await page.waitForURL(/\/login/);
      const back = new URL(new URL(page.url()).searchParams.get("redirect")!, page.url());
      expect(back.pathname).toBe(`/es/certificaciones/${slug}`);
      expect(back.searchParams.get("package_offer")).toBe(m.offerCode);
      expect(back.searchParams.get("source")).toBe("mock_review");
      expect(back.searchParams.get("certification_slug")).toBe(slug);
      expect(m.checkoutPosts).toHaveLength(0);
      await expect(page.locator('form input[type="email"]').first()).toBeVisible();
      await page.reload({ waitUntil: "domcontentloaded" });
      if (method === "login") {
        await expect(page.locator('form input[type="email"]').first()).toBeVisible();
        await login(page);
      } else {
        await page.locator('a[href*="register"]').first().click();
        const form = page.locator("form", { has: page.locator('input[name="username"]') }).first();
        await form.locator('[name="username"]').fill("fixture-user");
        await form.locator('[name="email"]').fill("fixture@example.test");
        await form.locator('[name="password"]').fill("synthetic-password-123");
        await form.locator('[name="confirmPassword"]').fill("synthetic-password-123");
        await form.locator('button[type="submit"]').click();
      }
      await expect(selected.getByRole("status")).toBeVisible();
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(selected.getByRole("status")).toBeVisible();
      expect(new URL(page.url()).pathname).toBe(`/es/certificaciones/${slug}`);
      expect(m.checkoutPosts).toHaveLength(0);
      await selected.scrollIntoViewIfNeeded();
      await page.screenshot({ path: test.info().outputPath(`${slug}-${method}-resumed.png`) });
      await selected.getByRole("button", { name: "Obtener acceso" }).dblclick();
      await expect(page.getByRole("heading", { name: "Synthetic checkout" })).toBeVisible();
      expect(m.checkoutPosts).toHaveLength(1);
      expect(m.checkoutPosts[0]).toMatchObject({ offerCode: m.offerCode, lang: "es", paywall_type: "mock_review", analytics: { analytics_consent: consent } });
      expect(m.checkoutPosts[0].idempotencyKey).toBeTruthy();
      if (consent) {
        await expect.poll(() => m.funnel.filter(e => e.event === "checkout_attempted").length).toBe(1);
        const click = m.funnel.filter(e => e.event === "mock_review_cta_clicked");
        expect(click).toHaveLength(1);
        expect(click[0]).toMatchObject({ cert_slug: slug, lang: "es", paywall_type: "mock_review" });
        expect(JSON.stringify(m.funnel)).not.toContain("fixture@example.test");
      } else {
        expect(m.funnel).toHaveLength(0);
      }
    });
  }
}
