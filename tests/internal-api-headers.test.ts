import assert from "node:assert/strict";
import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import test from "node:test";

// "server-only" lancia fuori da Next (manca la condizione react-server):
// lo sostituiamo con un modulo vuoto, come fa Next lato server.
const requireFromRoot = Module.createRequire(path.resolve(process.cwd(), "package.json"));
const serverOnlyPath = requireFromRoot.resolve("server-only");
requireFromRoot.cache[serverOnlyPath] = {
  id: serverOnlyPath,
  filename: serverOnlyPath,
  loaded: true,
  exports: {},
} as NodeJS.Module;

const SECRET = "frontend-test-internal-token-0123456789abcdef";
process.env.API_BASE_URL = "https://api.example.test/api";

type Call = { url: string; headers: Record<string, string> };
const calls: Call[] = [];
let nextResponse: () => Response = () => new Response("{}", { status: 200 });

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  calls.push({ url: String(input), headers: { ...(init?.headers as Record<string, string>) } });
  return nextResponse();
}) as typeof fetch;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

test("internalApiHeaders: header solo se INTERNAL_SERVER_TOKEN è impostato", async () => {
  const { internalApiHeaders, INTERNAL_TOKEN_HEADER } = await import("../src/lib/server/internal-api");
  delete process.env.INTERNAL_SERVER_TOKEN;
  assert.deepEqual(internalApiHeaders(), {});
  process.env.INTERNAL_SERVER_TOKEN = SECRET;
  assert.deepEqual(internalApiHeaders(), { [INTERNAL_TOKEN_HEADER]: SECRET });
  assert.equal(INTERNAL_TOKEN_HEADER, "X-Internal-Server-Token");
});

test("getTopicPageData invia l'header interno e non mette il secret nell'URL", async () => {
  process.env.INTERNAL_SERVER_TOKEN = SECRET;
  const { getTopicPageData } = await import("../src/lib/server/topic-page");
  calls.length = 0;
  nextResponse = () =>
    json(200, {
      topic: { id: 1, quiz_id: null, slug: "t", title: "T", description: "" },
      certification: { id: 2, slug: "c", title: "C" },
      relatedTopics: [],
      questionCount: 3,
    });
  const data = await getTopicPageData({ certSlug: "c", topicSlug: "t", lang: "en" });
  assert.equal(data?.topic.id, 1);
  assert.deepEqual(data?.topic.faq, []);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.example.test/api/topic-pages/c/t?lang=en");
  assert.equal(calls[0].headers["X-Internal-Server-Token"], SECRET);
  assert.ok(!calls[0].url.includes(SECRET));
});

test("getTopicPageData: 404 → null, ma 429 e 5xx restano errori (mai 404)", async () => {
  const { getTopicPageData } = await import("../src/lib/server/topic-page");

  nextResponse = () => json(404, { error: "TOPIC_PAGE_NOT_FOUND" });
  assert.equal(await getTopicPageData({ certSlug: "c", topicSlug: "missing", lang: "en" }), null);

  for (const status of [429, 500, 503]) {
    nextResponse = () => json(status, { error: "x" });
    await assert.rejects(
      getTopicPageData({ certSlug: "c", topicSlug: "t", lang: "it" }),
      (err: Error) => {
        assert.match(err.message, new RegExp(`HTTP ${status}`));
        assert.ok(!err.message.includes(SECRET), "il secret non deve finire nel messaggio d'errore");
        return true;
      },
    );
  }
});

test("topic resolver uses the real DB key for public TensorFlow/C# aliases in every language", async () => {
  const { getTopicPageData } = await import("../src/lib/server/topic-page");
  const previousFetch = globalThis.fetch;
  const cases = [
    ["tensorflow", "google-tensorflow", "neural-networks"],
    ["google-tensorflow", "google-tensorflow", "neural-networks"],
    ["tensorflow-developer", "google-tensorflow", "neural-networks"],
    ["csharp", "microsoft-csharp", "object-oriented-programming"],
    ["microsoft-csharp", "microsoft-csharp", "object-oriented-programming"],
  ];
  try {
  for (const lang of ["en", "it", "fr", "es"] as const) {
    for (const [certSlug, dbSlug, topicSlug] of cases) {
      calls.length = 0;
      globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        calls.push({ url, headers: { ...(init?.headers as Record<string, string>) } });
        return url === `https://api.example.test/api/topic-pages/${dbSlug}/${topicSlug}?lang=${lang}`
          ? json(200, { topic: { id: 145, faq: [] }, certification: { slug: dbSlug }, relatedTopics: [], questionCount: 5 })
          : json(404, { error: "TOPIC_PAGE_NOT_FOUND" });
      }) as typeof fetch;
      assert.equal((await getTopicPageData({ certSlug, topicSlug, lang }))?.topic.id, 145);
      assert.equal(calls.length, 1);
    }
  }
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("getTopicsByCertSlug (by-cert) invia l'header interno", async () => {
  process.env.INTERNAL_SERVER_TOKEN = SECRET;
  const { getTopicsByCertSlug } = await import("../src/lib/data");
  calls.length = 0;
  nextResponse = () => json(200, { topics: [{ id: 1, slug_en: "a", title_en: "A", slug: "a", title: "A" }] });
  await getTopicsByCertSlug("ccna", "en");
  const call = calls.find((c) => c.url.includes("/topic-pages/by-cert/"));
  assert.ok(call, "fetch by-cert non eseguita");
  assert.equal(call.headers["X-Internal-Server-Token"], SECRET);
  assert.ok(!call.url.includes(SECRET));
});

test("il secret non è esposto come NEXT_PUBLIC_* e il modulo resta server-only", () => {
  const src = fs.readFileSync(path.resolve(process.cwd(), "src/lib/server/internal-api.ts"), "utf8");
  assert.match(src, /^import "server-only";/m);
  assert.ok(!/NEXT_PUBLIC_INTERNAL/.test(src));

  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(e.name)) {
        const t = fs.readFileSync(p, "utf8");
        if (/NEXT_PUBLIC_INTERNAL_SERVER_TOKEN/.test(t)) offenders.push(p);
        if (/^["']use client["']/m.test(t) && /INTERNAL_SERVER_TOKEN|server\/internal-api/.test(t)) offenders.push(p);
      }
    }
  };
  walk(path.resolve(process.cwd(), "src"));
  assert.deepEqual(offenders, []);
});
