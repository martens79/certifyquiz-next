// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure",
    locale: "it-IT",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // se vuoi aggiungere firefox/webkit, aggiungili qui
  ],
});
