import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: 'weekly-pricing.spec.ts', workers: 1,
  use: { baseURL:'http://127.0.0.1:3101', headless:true,
    launchOptions: { executablePath:process.env.CQ_CHROMIUM_PATH || undefined, args:['--no-sandbox'] } },
  webServer: {command:'npm run dev -- --hostname 127.0.0.1 --port 3101',url:'http://127.0.0.1:3101/it/prezzi',reuseExistingServer:process.env.CQ_USE_EXISTING_SERVER === "1",timeout:120000,
    env:{NEXT_PUBLIC_PREMIUM_WEEKLY_ENABLED:'1',API_BASE_URL:'http://127.0.0.1:9/api',API_BASE_URL_DEV:'http://127.0.0.1:9/api',NEXT_PUBLIC_GA_ID:'',NEXT_PUBLIC_META_PIXEL_ID:''}},
});
