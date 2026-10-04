import assert from "node:assert/strict";
import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import test from "node:test";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// "server-only" lancia fuori da Next: modulo vuoto, come fa Next lato server.
const requireFromRoot = Module.createRequire(path.resolve(process.cwd(), "package.json"));
const serverOnlyPath = requireFromRoot.resolve("server-only");
requireFromRoot.cache[serverOnlyPath] = { id: serverOnlyPath, filename: serverOnlyPath, loaded: true, exports: {} } as NodeJS.Module;
(globalThis as { React?: typeof React }).React = React;

const SECRET = "frontend-test-internal-token-0123456789abcdef";
process.env.API_BASE_URL = "https://api.example.test/api";
process.env.INTERNAL_SERVER_TOKEN = SECRET;

type Call = { url: string; headers: Record<string, string>; init?: RequestInit };
const calls: Call[] = [];
let handler: (url: string, n: number) => Response | Promise<Response> = () => new Response("{}", { status: 200 });

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input);
  calls.push({ url, headers: { ...(init?.headers as Record<string, string>) }, init });
  const n = calls.filter((c) => c.url === url).length;
  return handler(url, n);
}) as typeof fetch;

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

const DETAIL_OK = { id: 7, slug: "ccna", name: "CCNA", questionCountByLang: { it: 1453, en: 1418, fr: 1453, es: 1453 } };
const LIST = [{ id: 7, slug: "ccna", name: "CCNA" }];
const reset = () => {
  calls.length = 0;
};
const abortError = () => Object.assign(new Error("aborted"), { name: "AbortError" });

/* ------------------------------------------------------------ backendGetJson */

test("backendGetJson: 429 -> rate_limited, mai ritentato", async () => {
  const { backendGetJson } = await import("../src/lib/server/backend-fetch");
  reset();
  handler = () => json(429, { error: "rate" }, { "retry-after": "894" });
  const r = await backendGetJson("https://api.example.test/api/x");
  assert.deepEqual(r, { kind: "error", reason: "rate_limited", status: 429, retryAfterSeconds: 894 });
  assert.equal(calls.length, 1);
});

test("backendGetJson: 5xx, timeout e rete -> UN solo retry; 404 -> not_found senza retry", async () => {
  const { backendGetJson } = await import("../src/lib/server/backend-fetch");

  reset();
  handler = () => json(503, {});
  const a = await backendGetJson("https://api.example.test/api/a");
  assert.equal(a.kind === "error" && a.reason, "server_error");
  assert.equal(calls.length, 2, "esattamente 1 retry");

  reset();
  handler = (_u, n) => (n === 1 ? json(500, {}) : json(200, { ok: true }));
  assert.deepEqual(await backendGetJson("https://api.example.test/api/b"), { kind: "ok", data: { ok: true } });
  assert.equal(calls.length, 2);

  reset();
  handler = () => json(404, {});
  assert.deepEqual(await backendGetJson("https://api.example.test/api/c"), { kind: "not_found" });
  assert.equal(calls.length, 1);

  reset();
  handler = () => new Promise<Response>((_res, rej) => setTimeout(() => rej(abortError()), 5));
  const t = await backendGetJson("https://api.example.test/api/d", { timeoutMs: 20 });
  assert.equal(t.kind === "error" && t.reason, "timeout");
  assert.equal(calls.length, 2);

  reset();
  handler = () => {
    throw new TypeError("fetch failed");
  };
  const n = await backendGetJson("https://api.example.test/api/e");
  assert.equal(n.kind === "error" && n.reason, "network");
  assert.equal(calls.length, 2);
});

test("backendGetJson: Retry-After lungo -> nessun retry; retry:false rispettato", async () => {
  const { backendGetJson } = await import("../src/lib/server/backend-fetch");
  reset();
  handler = () => json(503, {}, { "retry-after": "30" });
  await backendGetJson("https://api.example.test/api/f");
  assert.equal(calls.length, 1);
  reset();
  handler = () => json(500, {});
  await backendGetJson("https://api.example.test/api/g", { retry: false });
  assert.equal(calls.length, 1);
});

test("backendGetJson: header interno inviato, secret mai nell'URL, Data Cache se richiesta", async () => {
  const { backendGetJson } = await import("../src/lib/server/backend-fetch");
  reset();
  handler = () => json(200, {});
  await backendGetJson("https://api.example.test/api/h", { revalidate: 300, tags: ["t"] });
  assert.equal(calls[0].headers["X-Internal-Server-Token"], SECRET);
  assert.ok(!calls[0].url.includes(SECRET));
  assert.deepEqual((calls[0].init as { next?: unknown }).next, { revalidate: 300, tags: ["t"] });
  assert.notEqual(calls[0].init?.cache, "no-store");
});

/* ------------------------------------------------------------ getCertBySlug */

const certHandler = (detail: () => Response | Promise<Response>) => (url: string) =>
  url.includes("/by-slug/") ? detail() : url.includes("/certifications?locale=") ? json(200, LIST) : json(404, {});

test("getCertBySlug: dettaglio ok -> conteggi per lingua", async () => {
  const { getCertBySlug } = await import("../src/lib/data");
  reset();
  handler = certHandler(() => json(200, DETAIL_OK));
  const cert = await getCertBySlug("ccna", "en");
  assert.equal(cert?.questionCountByLang?.en, 1418);
});

test("getCertBySlug: 429 / 500 / timeout / rete -> inventario SCONOSCIUTO, mai zero", async () => {
  const { getCertBySlug } = await import("../src/lib/data");
  const cases: Array<[string, () => Response | Promise<Response>]> = [
    ["429", () => json(429, {}, { "retry-after": "894" })],
    ["500", () => json(500, {})],
    ["timeout", () => new Promise<Response>((_r, rej) => setTimeout(() => rej(abortError()), 5))],
    [
      "rete",
      () => {
        throw new TypeError("fetch failed");
      },
    ],
  ];
  for (const [label, detail] of cases) {
    reset();
    handler = certHandler(detail);
    const cert = await getCertBySlug("ccna", "en");
    assert.ok(cert, `${label}: la certificazione deve restare renderizzabile`);
    assert.equal(cert?.questionCountByLang, undefined, `${label}: nessun conteggio inventato`);
    assert.equal(cert?.questionCount, undefined, `${label}: nessun conteggio inventato`);
  }
});

test("getCertBySlug: Data Cache (non no-store), 300s (60s Apple), header interno", async () => {
  const { getCertBySlug } = await import("../src/lib/data");
  reset();
  handler = certHandler(() => json(200, DETAIL_OK));
  await getCertBySlug("ccna", "en");
  const detail = calls.find((c) => c.url.includes("/by-slug/"))!;
  assert.equal((detail.init as { next?: { revalidate?: number } }).next?.revalidate, 300);
  assert.notEqual(detail.init?.cache, "no-store");
  assert.equal(detail.headers["X-Internal-Server-Token"], SECRET);
  reset();
  await getCertBySlug("apple-device-support", "en");
  const apple = calls.find((c) => c.url.includes("/by-slug/"))!;
  assert.equal((apple.init as { next?: { revalidate?: number } }).next?.revalidate, 60);
});

test("getCertificationResources: errori -> null (mai throw), ok -> dati", async () => {
  const { getCertificationResources } = await import("../src/lib/data");
  const failures: Array<() => Response> = [
    () => json(429, {}),
    () => json(500, {}),
    () => {
      throw new TypeError("fetch failed");
    },
  ];
  for (const make of failures) {
    reset();
    handler = make;
    assert.equal(await getCertificationResources("ccna", "en"), null);
  }
  reset();
  handler = () =>
    json(200, {
      certification: { id: 7, name: "CCNA" },
      resources: {
        quiz: { questionCount: 1418, topicCount: 9 },
        reviews: { count: 0 },
        scenarios: { count: 0 },
        labs: { count: 0 },
        guide: { available: false },
        maps: { available: false },
      },
    });
  const resources = await getCertificationResources("ccna", "en");
  assert.equal(resources?.quiz.questionCount, 1418);
});

/* ------------------------------------------------------------ inventario / indicizzazione */

test("resolveQuizInventory: unknown != zero; seconda fonte solo se la prima manca", async () => {
  const { resolveQuizInventory } = await import("../src/lib/quiz-availability");
  assert.deepEqual(resolveQuizInventory(undefined, undefined), { state: "unknown" });
  assert.deepEqual(resolveQuizInventory(null), { state: "unknown" });
  assert.deepEqual(resolveQuizInventory(), { state: "unknown" });
  assert.deepEqual(resolveQuizInventory(0), { state: "zero" });
  assert.deepEqual(resolveQuizInventory(undefined, 150), { state: "available", count: 150 });
  assert.deepEqual(resolveQuizInventory(0, 150), { state: "zero" });
  assert.deepEqual(resolveQuizInventory(Number.NaN, 5), { state: "available", count: 5 });
});

test("isCertificationIndexable: inventario sconosciuto non produce noindex; zero reale e policy si", async () => {
  const { isCertificationIndexable } = await import("../src/lib/seo/certification-indexability");
  assert.equal(isCertificationIndexable({ slug: "ccna", questionCount: null, inventoryUnknown: true }), true);
  assert.equal(isCertificationIndexable({ slug: "apple-device-support", questionCount: null, inventoryUnknown: true }), true);
  assert.equal(isCertificationIndexable({ slug: "ccna", questionCount: 0 }), false);
  assert.equal(isCertificationIndexable({ slug: "ccna", questionCount: null }), false, "senza il flag il comportamento storico non cambia");
  assert.equal(isCertificationIndexable({ slug: "apple-device-support", questionCount: 12 }), false);
  assert.equal(isCertificationIndexable({ slug: "sap-s4hana-sales", questionCount: null, inventoryUnknown: true }), false, "la deny-list editoriale vale sempre");
});

/* ------------------------------------------------------------ render della griglia */

const loadGrid = async () => {
  const trackedPath = path.resolve(process.cwd(), "src/components/certification/TrackedResourceLink.tsx");
  requireFromRoot.cache[trackedPath] = {
    id: trackedPath,
    filename: trackedPath,
    loaded: true,
    exports: {
      __esModule: true,
      default: ({ href, className, children }: { href: string; className: string; children: React.ReactNode }) =>
        createElement("a", { href, className }, children),
    },
  } as unknown as NodeModule;
  return (await import("../src/components/certification/StudyMaterialGrid")).default;
};

const grid = async (quizQuestionCount: number | undefined, resources: unknown) => {
  const Grid = await loadGrid();
  return renderToStaticMarkup(
    createElement(Grid, {
      lang: "en",
      resources: resources as never,
      certificationSlug: "ccna",
      quizHref: "/en/quiz/ccna",
      quizQuestionCount,
      reviewsHref: "/reviews",
      scenariosHref: "/scenarios",
      guideHref: null,
      mapsHref: "/maps",
      labsHref: "/labs",
    })
  );
};

const res = (n: number) => ({
  certificationId: 7,
  certificationName: "CCNA",
  quiz: { questionCount: n, topicCount: 9 },
  reviews: { count: 0 },
  scenarios: { count: 0 },
  labs: { count: 0 },
  guide: { available: false },
  maps: { available: false },
});

test("griglia: inventario sconosciuto -> Quiz cliccabile, niente 'Coming soon'", async () => {
  const html = await grid(undefined, null);
  assert.match(html, /href="\/en\/quiz\/ccna"/);
  assert.doesNotMatch(html, /Coming soon/);
});

test("griglia: inventario sconosciuto ma resources disponibile -> conteggio da resources", async () => {
  const html = await grid(undefined, res(1418));
  assert.match(html, /1,418 questions/);
  assert.match(html, /href="\/en\/quiz\/ccna"/);
});

test("griglia: zero reale -> Quiz disabilitato; positivo -> cliccabile con conteggio", async () => {
  const zero = await grid(0, res(0));
  assert.doesNotMatch(zero, /href="\/en\/quiz\/ccna"/);
  assert.match(zero, /Coming soon/);
  assert.match(await grid(150, res(150)), /150 questions/);
});

test("CertificationPage: 'not available yet' solo con zero confermato", () => {
  const src = fs.readFileSync(path.resolve(process.cwd(), "src/components/CertificationPage.tsx"), "utf8");
  assert.match(src, /inventory\.state === "zero" && <p[^>]*>\{unavailableQuizLabels\[lang\]\}/);
  assert.match(src, /const hasQuestions = inventory\.state !== "zero"/);
  assert.match(src, /resolveQuizInventory\(\s*getQuestionCountByLang\(data, lang\),\s*resources\?\.quiz\?\.questionCount/);
});

test("metadata: i due generateMetadata non producono noindex per inventario sconosciuto", () => {
  const lang = fs.readFileSync(path.resolve(process.cwd(), "src/app/[lang]/certificazioni/[slug]/page.tsx"), "utf8");
  const en = fs.readFileSync(path.resolve(process.cwd(), "src/app/certifications/[slug]/page.tsx"), "utf8");
  for (const src of [lang, en]) assert.match(src, /inventoryUnknown: typeof knownCount !== "number"/);
  assert.match(en, /getCertificationDetailResult/);
  assert.ok(!/getCertificationDetailRSC/.test(en), "il metadata EN non deve piu' lanciare su 429");
});
