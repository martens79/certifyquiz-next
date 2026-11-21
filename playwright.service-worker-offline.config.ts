import { defineConfig, devices } from "@playwright/test";

// Fallback offline (sw.js + offline.html) in Chrome reale contro un server statico locale.
// Nessun backend, nessuna produzione. Opzionale: CHROME_PATH per usare un Chrome già installato.
export default defineConfig({
  testDir: "./tests",
  testMatch: "service-worker-offline.spec.ts",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        serviceWorkers: "allow",
        launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
      },
    },
  ],
});
