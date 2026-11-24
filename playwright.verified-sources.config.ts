import { defineConfig, devices } from "@playwright/test";

// Pulsante «Consulta le fonti»: API intercettata, nessun backend, nessun database, nessun retry.
export default defineConfig({
  testDir: "./tests",
  testMatch: "verified-sources-button.spec.ts",
  timeout: 120_000,
  expect: { timeout: 30_000 },
  workers: 1,
  retries: 0,
  use: { baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:3117", trace: "retain-on-failure", locale: "it-IT" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  reporter: "list",
});
