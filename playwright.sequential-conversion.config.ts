import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: ["mock-complete.spec.ts", "package-auth.spec.ts", "mock-package-flow.spec.ts"],
  timeout: 120000, expect: { timeout: 30000 }, workers: 1,
  use: { baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:3317", serviceWorkers: "block", trace: "retain-on-failure" },
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }, { name: "mobile", use: { ...devices["Pixel 7"] } }],
  reporter: "list",
});
