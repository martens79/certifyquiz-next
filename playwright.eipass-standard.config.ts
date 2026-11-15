import {defineConfig,devices} from '@playwright/test';
// Hydrated-DOM check of the EIPASS Standard coming-soon landing against a local production build (no deployment).
export default defineConfig({testDir:'./tests',testMatch:'eipass-standard-coming-soon.spec.ts',workers:1,retries:0,
  timeout:90000,expect:{timeout:20000},outputDir:'.tmp/eipass-standard-browser',
  use:{channel:'chrome',baseURL:process.env.EIPASS_STANDARD_BASE_URL||'http://127.0.0.1:3460',serviceWorkers:'block',trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},{name:'mobile',use:{...devices['Pixel 7']}}],
  reporter:[['list']]});
