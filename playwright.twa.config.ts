// Collaudo della modalita' TWA (app Android "consumption-only"): richiede un build di produzione (`next start`),
// vedi .github/workflows/twa-guard.yml. Solo mock locali, nessun pagamento reale.
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /twa-(mode|parity|business-gate)\.spec\.ts/,
  timeout: 45_000,
  retries: 1,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:3118",
    trace: "retain-on-failure",
    locale: "en-GB",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
