import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'seo-404-sprint1.spec.ts',
  timeout: 90_000,
  expect: { timeout: 20_000 },
  retries: 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/seo-404-results.json' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3368',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    locale: 'it-IT',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
