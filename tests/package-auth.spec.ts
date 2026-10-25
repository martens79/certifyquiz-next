import { test, expect } from "@playwright/test";
import { packageFlow, login } from "./helpers/package-flow";
test.use({ serviceWorkers: "block" });
const landing = "/es/certificaciones/ccna?source=mock_review&cta=mock_review&certification_slug=ccna";
test("guest login, refresh and explicit confirmation preserve exact offer; double click creates one checkout", async ({ page }) => {
  const m = await packageFlow(page);
  await page.goto(landing, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Obtener acceso" }).click();
  await page.waitForURL(/\/login/);
  expect(decodeURIComponent(page.url())).toContain("package_offer=fixture-complete");
  expect(m.checkoutPosts).toHaveLength(0);
  await page.reload({ waitUntil: "domcontentloaded" }); await login(page);
  await expect(page.getByRole("status").filter({ hasText: /Paquete seleccionado/ })).toBeVisible();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("status").filter({ hasText: /Paquete seleccionado/ })).toBeVisible();
  expect(m.checkoutPosts).toHaveLength(0);
  await page.screenshot({ path: test.info().outputPath("resumed-package.png"), fullPage: false });
  await page.getByRole("button", { name: "Obtener acceso" }).dblclick();
  await expect(page.getByRole("heading", { name: "Synthetic checkout" })).toBeVisible();
  expect(m.checkoutPosts).toHaveLength(1);
  expect(m.checkoutPosts[0]).toMatchObject({ offerCode: "fixture-complete", lang: "es", paywall_type: "mock_review", analytics: { analytics_consent: false } });
  expect(m.funnel).toHaveLength(0);
});
test("new registration retains offer and waits for manual confirmation", async ({ page }) => {
  const m = await packageFlow(page);
  await page.goto(landing, { waitUntil: "domcontentloaded" }); await page.getByRole("button", { name: "Obtener acceso" }).click();
  await page.waitForURL(/\/login/); await page.locator('a[href*="register"]').first().click();
  await page.waitForURL(/register/);
  const f = page.locator("form", { has: page.locator('input[name="username"]') }).first();
  await f.locator('[name="username"]').fill("fixture-user");
  await f.locator('[name="email"]').fill("fixture@example.test");
  await f.locator('[name="password"]').fill("synthetic-password-123");
  await f.locator('[name="confirmPassword"]').fill("synthetic-password-123");
  await f.locator('button[type="submit"]').click();
  await expect(page.getByRole("status").filter({ hasText: /Paquete seleccionado/ })).toBeVisible();
  expect(m.checkoutPosts).toHaveLength(0);
});
test("checkout error is retryable; consented attempt has one event per request", async ({ page }) => {
  const m = await packageFlow(page, true); m.authenticated = true; m.checkoutStatus = 500;
  await page.addInitScript(() => localStorage.setItem("cq:access", "synthetic"));
  await page.goto(landing, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Obtener acceso" }).click();
  await expect(page.locator("#packages").getByRole("alert")).toBeVisible();
  m.checkoutStatus = 200;
  await page.getByRole("button", { name: "Obtener acceso" }).click();
  await expect(page.getByRole("heading", { name: "Synthetic checkout" })).toBeVisible();
  expect(m.checkoutPosts).toHaveLength(2);
  expect(m.checkoutPosts[0].idempotencyKey).toBe(m.checkoutPosts[1].idempotencyKey);
  await expect.poll(() => m.funnel.filter(e => e.event === "checkout_attempted").length).toBe(2);
});
test("owned Complete cannot create another checkout even on a copied return URL", async ({ page }) => {
  const m = await packageFlow(page); m.authenticated = true; m.blocked = true;
  await page.addInitScript(() => localStorage.setItem("cq:access", "synthetic"));
  await page.goto(`${landing}&package_offer=fixture-complete#package-resume`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("button", { name: "Ya activo" })).toBeDisabled();
  expect(m.checkoutPosts).toHaveLength(0);
});

