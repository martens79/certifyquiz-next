// Collaudo del recupero pagamento (account sintetico past_due). Solo mock locali: vedi tests/payment-recovery.spec.ts.
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /payment-recovery\.spec\.ts/,
  timeout: 60_000,
  retries: 1, // il server di sviluppo Next ha qualche timeout sporadico alla prima compilazione di una pagina
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3106",
    trace: "retain-on-failure",
    locale: "en-GB",
    // Solo per esecuzioni locali con un Chromium gia' installato (PW_CHROMIUM_PATH); in CI resta il browser di Playwright.
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
