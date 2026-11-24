import {defineConfig,devices} from '@playwright/test';
// Direct-route check of EIPASS Standard Module 6 (topic 574) in the four languages against a local production build; the backend is mocked in the browser.
export default defineConfig({testDir:'./tests',testMatch:'eipass-standard-m6-routes.spec.ts',workers:1,retries:0,
  timeout:90000,expect:{timeout:20000},outputDir:'.tmp/eipass-standard-m6-browser',
  use:{channel:'chrome',baseURL:process.env.EIPASS_STANDARD_BASE_URL||'http://127.0.0.1:3460',serviceWorkers:'block',trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}}],
  reporter:[['list']]});
