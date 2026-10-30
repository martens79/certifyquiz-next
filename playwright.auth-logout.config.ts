import { defineConfig, devices } from '@playwright/test';
export default defineConfig({ testDir: './tests', testMatch: ['auth-logout.spec.ts'], workers: 1,
  timeout: 120000, expect: { timeout: 30000 }, outputDir: '.tmp/session-results',
  use: { baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:3347', serviceWorkers: 'block', trace: 'off' },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }], reporter: [['list'], ['json', { outputFile: '.tmp/session-results.json' }]] });
