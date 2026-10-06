import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";
import test from "node:test";

// "server-only" lancia fuori da Next: modulo vuoto, come fa Next lato server.
const requireFromRoot = Module.createRequire(path.resolve(process.cwd(), "package.json"));
const serverOnlyPath = requireFromRoot.resolve("server-only");
requireFromRoot.cache[serverOnlyPath] = { id: serverOnlyPath, filename: serverOnlyPath, loaded: true, exports: {} } as NodeJS.Module;

process.env.API_BASE_URL = "https://api.example.test/api";

type Call = { url: string; init?: RequestInit };
const calls: Call[] = [];
let handler: (url: string) => Response | Promise<Response> = () => new Response("{}", { status: 200 });
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input);
  calls.push({ url, init });
  return handler(url);
}) as typeof fetch;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { normalizeQuery, prepareFinderIndex, searchFinder, POPULAR_CERTS, FINDER_COPY } = require("../src/lib/home-finder.ts") as typeof import("../src/lib/home-finder");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getHomeFinderCerts, getHomeStats } = require("../src/lib/server/home-data.ts") as typeof import("../src/lib/server/home-data");

/* ----------------------------------------------------------------- ricerca */
const FIXTURE = [
  { slug: "ccna", title: "CCNA", href: "/certifications/ccna", keywords: "ccna Cisco 200-301" },
  { slug: "ccnp-enterprise", title: "CCNP Enterprise", href: "/certifications/ccnp-enterprise", keywords: "ccnp enterprise 350-401" },
  { slug: "microsoft-azure-fundamentals", title: "Microsoft Azure Fundamentals", href: "/certifications/microsoft-azure-fundamentals", keywords: "azure Microsoft AZ-900" },
  { slug: "security-plus", title: "Security+", href: "/certifications/security-plus", keywords: "security plus CompTIA SY0-701" },
  { slug: "cisco-ccst-cybersecurity", title: "Cisco CCST – Cybersecurity", href: "/certifications/cisco-ccst-cybersecurity", keywords: "Cisco CCST cybersecurity sécurité" },
  { slug: "comptia-a-plus", title: "CompTIA A+", href: "/certifications/comptia-a-plus", keywords: "a plus CompTIA 220-1201" },
];
const index = prepareFinderIndex(FIXTURE);
const slugs = (q: string) => searchFinder(index, q).map((c) => c.slug);

test("normalizeQuery: minuscolo e senza accenti", () => {
  assert.equal(normalizeQuery("  Sécurité "), "securite");
});

test("ricerca per nome, codice esame e senza separatori", () => {
  assert.deepEqual(slugs("ccna"), ["ccna"]);
  assert.deepEqual(slugs("AZ-900"), ["microsoft-azure-fundamentals"]);
  assert.deepEqual(slugs("az900"), ["microsoft-azure-fundamentals"]);
  assert.deepEqual(slugs("350-401"), ["ccnp-enterprise"]);
  assert.deepEqual(slugs("sy0701"), ["security-plus"]);
});

test("simboli del nome: A+ e Security+", () => {
  assert.deepEqual(slugs("a+"), ["comptia-a-plus"]);
  assert.equal(slugs("security+")[0], "security-plus");
});

test("accenti e parole multiple", () => {
  assert.deepEqual(slugs("securite"), ["cisco-ccst-cybersecurity"]);
  assert.deepEqual(slugs("cisco cyber"), ["cisco-ccst-cybersecurity"]);
});

test("i titoli che iniziano con la query escono prima", () => {
  assert.deepEqual(slugs("cc").slice(0, 2), ["ccna", "ccnp-enterprise"]);
  assert.equal(slugs("comptia")[0], "comptia-a-plus"); // titolo che inizia con "comptia" prima delle sole keyword
});

test("query vuota o senza risultati", () => {
  assert.deepEqual(slugs(""), []);
  assert.deepEqual(slugs("   "), []);
  assert.deepEqual(slugs("zzzz"), []);
});

test("i risultati sono limitati", () => {
  const many = Array.from({ length: 30 }, (_, i) => ({ slug: `x${i}`, title: `Cert ${i}`, href: `/c/${i}`, keywords: "" }));
  assert.equal(searchFinder(prepareFinderIndex(many), "cert").length, 6);
});

test("testi presenti in tutte e 4 le lingue e chip popolari validi", () => {
  for (const lang of ["it", "en", "fr", "es"] as const) {
    const t = FINDER_COPY[lang];
    for (const k of ["title", "label", "placeholder", "popular", "categories", "seeAll"] as const) assert.ok(t[k].length > 0, `${lang}.${k}`);
    assert.match(t.results(3), /3/);
    assert.ok(t.noResults("x").includes("x"));
  }
  assert.ok(POPULAR_CERTS.length >= 6);
  assert.equal(new Set(POPULAR_CERTS.map((c) => c.slug)).size, POPULAR_CERTS.length);
});

/* ------------------------------------------------------------- dati server */
test("getHomeStats: valori validi, cache 1h, timeout breve, nessun retry", async () => {
  calls.length = 0;
  handler = () => json(200, { questions: 26144, topics: 460, certifications: 67 });
  assert.deepEqual(await getHomeStats(), { questions: 26144, topics: 460, certifications: 67 });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.example.test/api/public/home-stats");
  assert.equal((calls[0].init as { next?: { revalidate?: number } }).next?.revalidate, 3600);
});

test("getHomeStats: errori e payload non validi => null (fallback client)", async () => {
  for (const status of [429, 500, 404]) {
    calls.length = 0;
    handler = () => json(status, {});
    assert.equal(await getHomeStats(), null, `status ${status}`);
    assert.equal(calls.length, 1, "nessun retry");
  }
  handler = () => json(200, { questions: 0, topics: 460, certifications: 67 });
  assert.equal(await getHomeStats(), null);
  handler = () => json(200, { questions: "26144", topics: 1, certifications: 1 });
  assert.equal(await getHomeStats(), null);
  handler = () => {
    throw new Error("network down");
  };
  assert.equal(await getHomeStats(), null);
});

const RAW = [
  { id: 1, slug: "ccna", name: "CCNA", name_en: null, name_fr: null, name_es: null },
  { id: 2, slug: "security-plus", name: "CompTIA Security+", name_fr: "CompTIA Security+ (FR)" },
  { id: 3, slug: "microsoft-azure-fundamentals", name: "Microsoft Azure Fundamentals" },
  { id: 4, slug: "ecdl", name: "ICDL (alias)" }, // alias legacy -> icdl
  { id: 5, slug: "icdl", name: "ICDL" }, // duplicato dopo la normalizzazione
  { id: 6, slug: "", name: "senza slug" },
];

test("getHomeFinderCerts: slug normalizzati, duplicati e vuoti scartati, href per lingua", async () => {
  handler = () => json(200, RAW);
  const it = await getHomeFinderCerts("it");
  assert.ok(it);
  assert.deepEqual(
    it.map((c) => c.slug),
    ["ccna", "security-plus", "microsoft-azure-fundamentals", "icdl"]
  );
  assert.equal(it[0].href, "/it/certificazioni/ccna");
  assert.equal((await getHomeFinderCerts("en"))![0].href, "/certifications/ccna");
  assert.equal((await getHomeFinderCerts("fr"))![0].href, "/fr/certifications/ccna");
  assert.equal((await getHomeFinderCerts("es"))![0].href, "/es/certificaciones/ccna");
});

test("getHomeFinderCerts: titolo localizzato con fallback al nome base; codici esame nelle keyword", async () => {
  handler = () => json(200, RAW);
  const fr = (await getHomeFinderCerts("fr"))!;
  assert.equal(fr.find((c) => c.slug === "security-plus")!.title, "CompTIA Security+ (FR)");
  const en = (await getHomeFinderCerts("en"))!;
  assert.equal(en.find((c) => c.slug === "security-plus")!.title, "CompTIA Security+");

  // il codice esame del registry rende la certificazione trovabile per codice
  const idx = prepareFinderIndex(en);
  assert.deepEqual(searchFinder(idx, "az-900").map((c) => c.slug), ["microsoft-azure-fundamentals"]);
  assert.equal(searchFinder(idx, "200-301")[0]?.slug, "ccna");
});

test("getHomeFinderCerts: errore backend, payload non valido o lista vuota => null (solo chip)", async () => {
  for (const status of [429, 500]) {
    handler = () => json(status, {});
    assert.equal(await getHomeFinderCerts("en"), null, `status ${status}`);
  }
  handler = () => json(200, { not: "an array" });
  assert.equal(await getHomeFinderCerts("en"), null);
  handler = () => json(200, []);
  assert.equal(await getHomeFinderCerts("en"), null);
});

test("getHomeFinderCerts: le certificazioni 'planned' non compaiono", async () => {
  handler = () => json(200, [{ id: 9, slug: "ccna", name: "CCNA" }, { id: 10, slug: "plc-fundamentals", name: "PLC Fundamentals" }]);
  const res = (await getHomeFinderCerts("en"))!;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { CERTS_BY_SLUG } = require("../src/certifications/registry.ts") as typeof import("../src/certifications/registry");
  const planned = CERTS_BY_SLUG["plc-fundamentals"]?.publicationStatus === "planned";
  assert.equal(res.some((c) => c.slug === "plc-fundamentals"), !planned);
});
