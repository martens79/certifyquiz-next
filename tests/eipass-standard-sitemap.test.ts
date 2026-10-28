import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";
import test from "node:test";

// Runtime check of the real sitemap() function with a stubbed backend and Sanity (same technique as
// sitemap-backend-calls.test.ts): the Standard landing must appear exactly once, Italian only.
const requireFromRoot = Module.createRequire(path.resolve(process.cwd(), "package.json"));
const stub = (file: string, exports: unknown) => {
  const abs = path.resolve(process.cwd(), file);
  requireFromRoot.cache[abs] = { id: abs, filename: abs, loaded: true, exports } as unknown as NodeJS.Module;
};
const serverOnlyPath = requireFromRoot.resolve("server-only");
requireFromRoot.cache[serverOnlyPath] = { id: serverOnlyPath, filename: serverOnlyPath, loaded: true, exports: {} } as NodeJS.Module;
stub("src/lib/sanity.server.ts", { sanityServerClient: { fetch: async () => [] } });

process.env.API_BASE_URL = "https://api.example.test/api";
process.env.NEXT_PUBLIC_SITE_URL = "https://www.example.test";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const certs = [{ id: 10, slug: "ccna" }, { id: 3, slug: "eipass" }];
globalThis.fetch = (async (input: RequestInfo | URL) => {
  const u = new URL(String(input));
  if (u.pathname.endsWith("/api/certifications")) return json(200, certs);
  if (/\/certifications\/by-slug\//.test(u.pathname)) return json(200, { questionCountByLang: { it: 10, en: 10, fr: 10, es: 10 } });
  if (u.pathname.endsWith("/api/topic-reviews")) return json(200, []);
  return json(404, {});
}) as typeof fetch;

test("sitemap runtime: the Standard landing is listed exactly once, Italian only, and nothing else of Standard", async () => {
  const { default: sitemap } = await import("../src/app/sitemap.ts");
  const urls = (await sitemap()).map((e) => e.url);
  const standard = urls.filter((u) => /eipass-standard/i.test(u));
  assert.deepEqual(standard, ["https://www.example.test/it/certificazioni/eipass-standard"]);
  // other languages and any Standard topic/quiz URL are absent
  assert.equal(urls.some((u) => /eipass-standard\/|quiz\/eipass-standard|ripass|scenari/i.test(u) && /eipass-standard/.test(u)), false);
  // existing certification URLs are still there (the sitemap is otherwise unchanged)
  assert.ok(urls.includes("https://www.example.test/it/certificazioni/ccna"));
  assert.ok(urls.includes("https://www.example.test/certifications/ccna"));
  assert.equal(new Set(urls).size, urls.length, "no duplicate URL");
});
