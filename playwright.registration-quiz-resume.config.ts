import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "registration-quiz-resume.spec.ts",
  timeout: 90_000,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3193" },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3193",
    url: "http://127.0.0.1:3193/en/quiz/ccna/mixed",
    timeout: 120_000,
    env: {
      API_BASE_URL: "http://127.0.0.1:9/api",
      API_BASE_URL_DEV: "http://127.0.0.1:9/api",
      NEXT_PUBLIC_SANITY_PROJECT_ID: "e2edummy",
      NEXT_PUBLIC_SANITY_DATASET: "test",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "fixture",
      NEXT_PUBLIC_GA_ID: "",
      NEXT_PUBLIC_META_PIXEL_ID: "",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
