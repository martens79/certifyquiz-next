/*
 * Misura quante chiamate (backend + CMS) genera UNA rigenerazione della sitemap.
 *
 *   node --use-system-ca node_modules/tsx/dist/cli.mjs scripts/sitemap-backend-calls.ts [--dump=urls.txt] [--budget=200]
 *
 * Esce con codice 1 se le chiamate superano il budget (default 200). Usa le variabili
 * d'ambiente del progetto (API_BASE_URL, NEXT_PUBLIC_SANITY_*). Sola lettura.
 * Nota: Next mette ogni risposta in Data Cache, quindi in produzione queste chiamate
 * avvengono al massimo una volta per finestra di revalidate (1 h), non a ogni GET.
 */
import Module from "node:module";
import path from "node:path";
import fs from "node:fs";

// "server-only" lancia fuori da Next: modulo vuoto, come fa Next lato server.
const requireFromRoot = Module.createRequire(path.resolve(process.cwd(), "package.json"));
try {
  const serverOnlyPath = requireFromRoot.resolve("server-only");
  requireFromRoot.cache[serverOnlyPath] = { id: serverOnlyPath, filename: serverOnlyPath, loaded: true, exports: {} } as NodeJS.Module;
} catch {
  /* modulo non presente: nulla da neutralizzare */
}

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);

async function main() {
  const counts = new Map<string, number>();
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const u = new URL(url);
    const bucket = u.pathname
      .replace(/\/api\/certifications\/by-slug\/[^/]+/, "/api/certifications/by-slug/:slug")
      .replace(/\/api\/certifications\/[^/]+\/topics\/[^/]+\/review/, "/api/certifications/:slug/topics/:topic/review")
      .replace(/\/api\/topic-pages\/[^/]+\/[^/]+/, "/api/topic-pages/:cert/:topic")
      .replace(/\/api\/topics\/\d+/, "/api/topics/:id");
    const key = `${u.host}${bucket}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return realFetch(input, init);
  }) as typeof fetch;

  const started = Date.now();
  const mod = await import("../src/app/sitemap");
  const entries = await mod.default();
  const elapsedMs = Date.now() - started;

  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  console.log(`URL in sitemap: ${entries.length}`);
  console.log(`Tempo di generazione: ${elapsedMs} ms`);
  console.log(`Chiamate di rete totali: ${total}`);
  for (const [key, n] of [...counts.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(5)}  ${key}`);

  const dump = arg("dump");
  if (dump) fs.writeFileSync(dump, entries.map((e) => e.url).sort().join("\n") + "\n");

  const budget = Number(arg("budget") ?? 200);
  if (total > budget) {
    console.error(`\nFAIL: ${total} chiamate > budget ${budget}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
