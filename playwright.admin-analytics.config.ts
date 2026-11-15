import { defineConfig, devices } from "@playwright/test";

// Fixture-only browser tests for the /admin dashboard: run against a local production build.
// All API calls are answered by the stubs in tests/admin-analytics.spec.ts; external hosts are aborted.
export default defineConfig({
  testDir: "./tests",
  testMatch: ["admin-analytics.spec.ts", "admin-funnel-events.spec.ts"],
  timeout: 60000,
  expect: { timeout: 20000 },
  workers: 1,
  retries: 0,
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:3117",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  reporter: "list",
});
