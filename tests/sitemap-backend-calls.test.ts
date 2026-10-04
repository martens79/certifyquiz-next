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

let sanityFails = false;
stub("src/lib/sanity.server.ts", {
  sanityServerClient: {
    fetch: async () => {
      if (sanityFails) throw new Error("sanity down");
      return [];
    },
  },
});

process.env.API_BASE_URL = "https://api.example.test/api";
process.env.NEXT_PUBLIC_SITE_URL = "https://www.example.test";

const LANGS = ["it", "es", "en", "fr"] as const;
type Call = { url: string; init?: RequestInit };
const calls: Call[] = [];
let failPath: RegExp | null = null;
let reviewItemCount = 60;
let missingLangForCluster: string | null = null; // "ccna:81" senza la versione fr

const certSlugs = Array.from({ length: 12 }, (_, i) => `cert-${i}`);
const goodReview = (slug: string, topicId: number) => ({
  certificationSlug: slug,
  topicId,
  access: "free",
  topicTitle: "Topic",
  title: "Title",
  metaTitle: "Meta title",
  metaDescription: "Meta description",
  intro: "Intro paragraph that is long enough.",
  content: `## One\n\n${"word ".repeat(260)}\n\n## Two\n\n${"text ".repeat(200)}`,
});

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input);
  calls.push({ url, init });
  const u = new URL(url);
  if (failPath && failPath.test(u.pathname)) return json(503, {});
  if (u.pathname.endsWith("/api/certifications")) return json(200, certSlugs.map((slug, i) => ({ id: i + 1, slug })));
  if (/\/certifications\/by-slug\//.test(u.pathname)) {
    return json(200, { questionCountByLang: { it: 10, en: 10, fr: 10, es: 10 } });
  }
  if (u.pathname.endsWith("/api/topic-reviews")) {
    const items = Array.from({ length: reviewItemCount }, (_, i) => ({
      certSlug: `cert-${i % 12}`,
      topicSlug: `topic-${i}`,
      topicId: 5000 + i,
      href: `/${u.searchParams.get("lang")}/ripassi/cert-${i % 12}/topic-${i}`,
    }));
    // un cluster classificato "distinct" (ccna:81) in tutte e quattro le lingue
    items.push({ certSlug: "ccna", topicSlug: "ip-addressing", topicId: 81, href: `/${u.searchParams.get("lang")}/ripassi/ccna/ip-addressing` });
    return json(200, items);
  }
  if (/\/topics\/[^/]+\/review$/.test(u.pathname)) {
    const cert = u.pathname.split("/")[3];
    const lang = u.searchParams.get("lang")!;
    if (cert === "ccna" && missingLangForCluster === "ccna:81" && lang === "fr") return json(404, {});
    return json(200, goodReview(cert, cert === "ccna" ? 81 : 9999));
  }
  return json(404, {});
}) as typeof fetch;

const run = async () => {
  calls.length = 0;
  const mod = await import("../src/app/sitemap");
  const entries = await mod.default();
  return { entries, calls: calls.length };
};

const BUDGET = 150;

test("sitemap: poche decine di chiamate, indipendenti dal numero di ripassi", async () => {
  reviewItemCount = 60;
  const small = await run();
  reviewItemCount = 1100;
  const large = await run();
  assert.ok(small.calls <= BUDGET, `budget superato: ${small.calls}`);
  assert.equal(large.calls, small.calls, "il numero di chiamate non deve crescere con i ripassi non classificati");
  // 1 elenco cert + 12 by-slug + 4 elenchi ripassi + 4 dettagli del solo cluster candidato
  assert.equal(small.calls, 1 + certSlugs.length + 4 + 4);
});

test("sitemap: ogni fetch e' in Data Cache (revalidate), nessun no-store", async () => {
  await run();
  assert.ok(calls.length > 0);
  for (const call of calls) {
    assert.notEqual(call.init?.cache, "no-store", call.url);
    const revalidate = (call.init as { next?: { revalidate?: number } } | undefined)?.next?.revalidate;
    assert.ok(typeof revalidate === "number" && revalidate >= 60, `revalidate mancante: ${call.url}`);
  }
});

test("sitemap: il cluster classificato 'distinct' completo e' incluso, quello incompleto no", async () => {
  missingLangForCluster = null;
  let r = await run();
  for (const lang of LANGS) assert.ok(r.entries.some((e) => e.url.endsWith(`/${lang}/ripassi/ccna/ip-addressing`)), lang);
  missingLangForCluster = "ccna:81";
  r = await run();
  for (const lang of LANGS) assert.ok(!r.entries.some((e) => e.url.endsWith(`/${lang}/ripassi/ccna/ip-addressing`)), lang);
  missingLangForCluster = null;
});

test("sitemap: un errore del backend o del CMS interrompe la generazione (nessuna sitemap monca)", async () => {
  const mod = await import("../src/app/sitemap");
  for (const pattern of [/\/api\/certifications$/, /\/by-slug\/cert-3$/, /\/api\/topic-reviews$/]) {
    failPath = pattern;
    await assert.rejects(mod.default(), /sitemap: .* non disponibile|503/, String(pattern));
  }
  failPath = null;
  sanityFails = true;
  await assert.rejects(mod.default(), /sanity down/);
  sanityFails = false;
  assert.ok((await mod.default()).length > 0);
});

test("sitemap: durante next build un errore non fa fallire il deploy (sitemap parziale, rigenerata)", async () => {
  const mod = await import("../src/app/sitemap");
  const previous = process.env.NEXT_PHASE;
  process.env.NEXT_PHASE = "phase-production-build";
  failPath = /\/by-slug\//;
  sanityFails = true;
  try {
    const entries = await mod.default();
    assert.ok(Array.isArray(entries) && entries.length > 0, "le pagine statiche restano");
  } finally {
    failPath = null;
    sanityFails = false;
    if (previous === undefined) delete process.env.NEXT_PHASE;
    else process.env.NEXT_PHASE = previous;
  }
});
