// certifyquiz-next/scripts/dev-reward-preview.js
//
// SOLO PER VERIFICA MANUALE LOCALE. Avvia `next dev` su una porta dedicata
// (default 3101) puntato al backend di preview (default :8181, vedi
// quiz_project/scripts/dev-server-reward-preview.js) con la UI Rewarded Ads
// abilitata lato client. Non tocca .env.local: gli override vivono solo nel
// child process, così il dev server "vero" su :3000 di altre sessioni non è
// toccato.
//
// Uso: npm run dev:reward-preview   (da certifyquiz-next/)

const { spawnSync } = require("child_process");

const port = process.env.PORT || "3101";
const backendUrl = process.env.REWARD_PREVIEW_BACKEND_URL || "http://127.0.0.1:8181/api";

console.log(`⚠️  Reward preview frontend: NEXT_PUBLIC_REWARDED_ADS_UI_ENABLED=true, backend=${backendUrl} (porta ${port}). .env.local reale non modificato.`);

const result = spawnSync("npx", ["next", "dev", "-p", port], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    NEXT_PUBLIC_REWARDED_ADS_UI_ENABLED: "true",
    API_BASE_URL_DEV: backendUrl,
  },
});

process.exit(result.status ?? 1);
