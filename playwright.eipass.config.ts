import {defineConfig,devices} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'eipass-editorial.spec.ts',workers:1,retries:0,
  timeout:90000,expect:{timeout:20000},outputDir:'.tmp/eipass-browser',
  use:{channel:'chrome',baseURL:'http://127.0.0.1:3459',serviceWorkers:'block',trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},{name:'mobile',use:{...devices['Pixel 7']}}],
  reporter:[['list'],['json',{outputFile:'.tmp/eipass-browser-results.json'}]]});
