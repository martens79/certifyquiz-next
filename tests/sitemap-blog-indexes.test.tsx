import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";
import test from "node:test";

const requireFromRoot = Module.createRequire(path.resolve(process.cwd(), "package.json"));
const stub = (file: string, exports: unknown) => {
  const abs = path.resolve(process.cwd(), file);
  requireFromRoot.cache[abs] = { id: abs, filename: abs, loaded: true, exports } as unknown as NodeJS.Module;
};
const serverOnlyPath = requireFromRoot.resolve("server-only");
requireFromRoot.cache[serverOnlyPath] = { id: serverOnlyPath, filename: serverOnlyPath, loaded: true, exports: {} } as NodeJS.Module;

const words = (n: number) => [{ _type: "block", children: [{ _type: "span", text: Array.from({ length: n }, (_, i) => `w${i}`).join(" ") }] }];
const article = (slug: string, lang: string, extra: Record<string, unknown> = {}) =>
  ({ slug, lang, publishedAt: "2026-01-01", title: "T", excerpt: "E", body: words(600), ...extra });
const docs = [
  article("en-ok", "en"), article("it-ok", "it"), article("fr-ok", "fr"), article("es-ok", "es"),
  article("hidden", "en", { noindex: true }), article("short", "it", { body: words(100) }),
];
stub("src/lib/sanity.server.ts", { sanityServerClient: { fetch: async () => docs } });
process.env.API_BASE_URL = "https://api.example.test/api";
process.env.NEXT_PUBLIC_SITE_URL = "https://www.example.test";
globalThis.fetch = (async (input: RequestInfo | URL) => {
  const u = new URL(String(input));
  const body = u.pathname.endsWith("/api/certifications") || u.pathname.endsWith("/api/topic-reviews") ? [] : {};
  return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
}) as typeof fetch;

const SITE = "https://www.example.test";
const run = async () => (await (await import("../src/app/sitemap")).default());

test("i quattro indici blog sono presenti una sola volta, con URL canonici", async () => {
  const entries = await run();
  for (const p of ["/blog", "/it/blog", "/fr/blog", "/es/blog"]) {
    const hits = entries.filter((e) => e.url === `${SITE}${p}`);
    assert.equal(hits.length, 1, p);
    assert.equal(hits[0].changeFrequency, "weekly", p);
    assert.equal(hits[0].priority, 0.75, p);
  }
});

test("nessun URL alternativo o paginato degli indici blog", async () => {
  const urls = (await run()).map((e) => e.url);
  assert.ok(!urls.includes(`${SITE}/en/blog`));
  assert.ok(!urls.some((u) => u.includes("?page=")), "nessun ?page=N");
  assert.ok(!urls.some((u) => /\/blog\/?$/.test(u) && !["/blog", "/it/blog", "/fr/blog", "/es/blog"].includes(u.replace(SITE, ""))));
  assert.equal(new Set(urls).size, urls.length, "nessun URL duplicato in sitemap");
});

test("articoli multilingua e regole noindex (PR #221) restano valide", async () => {
  const urls = (await run()).map((e) => e.url);
  for (const u of ["/blog/en-ok", "/it/blog/it-ok", "/fr/blog/fr-ok", "/es/blog/es-ok"]) assert.ok(urls.includes(`${SITE}${u}`), u);
  assert.ok(!urls.includes(`${SITE}/blog/hidden`), "noindex fuori");
  assert.ok(!urls.includes(`${SITE}/it/blog/short`), "sotto soglia fuori");
});

test("la sitemap resta valida: tutte le voci hanno URL assoluto sotto il sito", async () => {
  for (const e of await run()) assert.ok(e.url.startsWith(`${SITE}`) && !e.url.includes("undefined"), e.url);
});
