import { defineConfig, devices } from "@playwright/test";
export default defineConfig({ testDir: "./tests", testMatch: ["mock-complete.spec.ts", "mock-exam-premium.spec.ts"], timeout: 120000, expect: { timeout: 30000 }, workers: 1,
  use: { baseURL: process.env.E2E_BASE_URL || "http://localhost:3116", trace: "retain-on-failure" },
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }, { name: "mobile", use: { ...devices["Pixel 7"] } }], reporter: "list" });
