import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";
import test from "node:test";

// "server-only" lancia fuori da Next: modulo vuoto, come fa Next lato server.
const requireFromRoot = Module.createRequire(path.resolve(process.cwd(), "package.json"));
const stub = (file: string, exports: unknown) => {
  const abs = path.resolve(process.cwd(), file);
  requireFromRoot.cache[abs] = { id: abs, filename: abs, loaded: true, exports } as unknown as NodeJS.Module;
};
const serverOnlyPath = requireFromRoot.resolve("server-only");
requireFromRoot.cache[serverOnlyPath] = { id: serverOnlyPath, filename: serverOnlyPath, loaded: true, exports: {} } as NodeJS.Module;

// Articoli "in Sanity": la query della sitemap applica da sola il filtro seo.noindex != true; qui il mock lo IGNORA
// di proposito, per provare anche la difesa aggiuntiva (isArticleIndexable) sulla stessa decisione della pagina.
type Doc = { slug: string; lang: string; title?: string; excerpt?: string; body?: unknown; noindex?: boolean | null };
const words = (n: number) => [{ _type: "block", children: [{ _type: "span", text: Array.from({ length: n }, (_, i) => `w${i}`).join(" ") }] }];
const docs: Record<string, Doc> = {
  noindexLong: { slug: "noindex-long", lang: "en", title: "T", excerpt: "E", body: words(600), noindex: true },
  falseLong: { slug: "false-long", lang: "en", title: "T", excerpt: "E", body: words(600), noindex: false },
  missingLong: { slug: "missing-long", lang: "en", title: "T", excerpt: "E", body: words(600) },
  nullLong: { slug: "null-long", lang: "en", title: "T", excerpt: "E", body: words(600), noindex: null },
  short: { slug: "short", lang: "en", title: "T", excerpt: "E", body: words(120) },
  noExcerpt: { slug: "no-excerpt", lang: "en", title: "T", body: words(600) },
  noTitle: { slug: "no-title", lang: "en", excerpt: "E", body: words(600) },
};
const fetchLog: Array<{ query: string; params?: Record<string, string> }> = [];
stub("src/lib/sanity.server.ts", {
  sanityServerClient: {
    fetch: async (query: string, params?: Record<string, string>) => {
      fetchLog.push({ query, params });
      if (params?.slug) {
        const doc = Object.values(docs).find((d) => d.slug === params.slug && d.lang === params.lang);
        return doc ? { id: doc.slug, publishedAt: "2026-01-01", ...doc } : null;
      }
      return Object.values(docs).map((d) => ({ publishedAt: "2026-01-01", ...d }));
    },
  },
});
process.env.API_BASE_URL = "https://api.example.test/api";
process.env.NEXT_PUBLIC_SITE_URL = "https://www.example.test";
globalThis.fetch = (async () => new Response("[]", { status: 200, headers: { "content-type": "application/json" } })) as typeof fetch;

import { isArticleIndexable } from "../src/lib/seo/article-indexability.ts";
import { articleBySlugLang } from "../src/lib/sanity.queries.ts";

const pageMetadata = async (slug: string) => {
  const mod = await import("../src/app/[lang]/blog/[slug]/page");
  return mod.generateMetadata({ params: Promise.resolve({ lang: "en", slug }) });
};
const robotsIndex = (m: Awaited<ReturnType<typeof pageMetadata>>) => (m.robots as { index?: boolean; follow?: boolean });

test("isArticleIndexable: noindex true vince su tutto, le altre regole restano", () => {
  assert.equal(isArticleIndexable(docs.noindexLong), false);
  assert.equal(isArticleIndexable(docs.falseLong), true);
  assert.equal(isArticleIndexable(docs.missingLong), true);
  assert.equal(isArticleIndexable(docs.nullLong), true);
  assert.equal(isArticleIndexable(docs.short), false);
  assert.equal(isArticleIndexable(docs.noExcerpt), false);
  assert.equal(isArticleIndexable(docs.noTitle), false);
  assert.equal(isArticleIndexable({ ...docs.short, noindex: true }), false);
});

test("pagina articolo: robots.index dalla stessa funzione, follow sempre true", async () => {
  const expected: Record<string, boolean> = {
    "noindex-long": false, "false-long": true, "missing-long": true, "null-long": true,
    short: false, "no-excerpt": false, "no-title": false,
  };
  for (const [slug, index] of Object.entries(expected)) {
    const robots = robotsIndex(await pageMetadata(slug));
    assert.equal(robots.index, index, slug);
    assert.equal(robots.follow, true, slug);
  }
});

test("un articolo noindex resta raggiungibile: la query della pagina non lo filtra e proietta seo.noindex", () => {
  assert.match(articleBySlugLang, /"noindex": seo\.noindex/);
  assert.doesNotMatch(articleBySlugLang, /seo\.noindex\s*!=\s*true/);
});

test("sitemap: gli articoli noindex non compaiono, anche se la query li restituisse", async () => {
  const mod = await import("../src/app/sitemap");
  const urls = (await mod.default()).map((e) => e.url);
  assert.ok(!urls.some((u) => u.endsWith("/blog/noindex-long")), "noindex fuori");
  for (const slug of ["false-long", "missing-long", "null-long"]) {
    assert.ok(urls.includes(`https://www.example.test/blog/${slug}`), slug);
  }
  for (const slug of ["short", "no-excerpt", "no-title"]) {
    assert.ok(!urls.some((u) => u.endsWith(`/blog/${slug}`)), slug);
  }
  const sitemapQuery = fetchLog.find((c) => !c.params)?.query ?? "";
  assert.match(sitemapQuery, /seo\.noindex != true/, "filtro esistente mantenuto");
  assert.match(sitemapQuery, /"noindex": seo\.noindex/);
});

test("pagina e sitemap prendono la stessa decisione sullo stesso articolo", async () => {
  const mod = await import("../src/app/sitemap");
  const urls = (await mod.default()).map((e) => e.url);
  for (const d of Object.values(docs)) {
    const inSitemap = urls.includes(`https://www.example.test/blog/${d.slug}`);
    const pageIndex = robotsIndex(await pageMetadata(d.slug)).index;
    assert.equal(inSitemap, pageIndex, d.slug);
  }
});
