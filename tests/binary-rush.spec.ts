import { expect, test } from "@playwright/test";

const routes = ["/games", "/it/giochi", "/fr/jeux", "/es/juegos"];

for (const route of routes) {
  test(`games index renders: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Binary Rush", { exact: true })).toBeVisible();
  });
}

test("Binary Rush accepts keyboard input and starts a game", async ({ page }) => {
  await page.goto("/games/binary-rush");
  await page.getByRole("button", { name: "Start" }).click();
  const input = page.getByLabel("Your answer");
  await expect(input).toBeFocused();
  await input.fill("1");
  await input.press("Enter");
  await expect(page.getByText(/Correct|Not quite/).first()).toBeVisible();
});
