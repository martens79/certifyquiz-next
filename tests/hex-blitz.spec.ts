import { expect, test } from "@playwright/test";

for (const route of ["/games/hex-blitz", "/it/giochi/hex-blitz", "/fr/jeux/hex-blitz", "/es/juegos/hex-blitz"]) {
  test(`Hex Blitz renders: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Hex Blitz" })).toBeVisible();
  });
}

test("Hex Blitz starts with focused input", async ({ page }) => {
  await page.goto("/games/hex-blitz");
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByLabel("Your answer")).toBeFocused();
});
