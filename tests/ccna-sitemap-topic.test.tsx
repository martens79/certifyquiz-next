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
stub("src/lib/sanity.server.ts", { sanityServerClient: { fetch: async () => [] } });

process.env.API_BASE_URL = "https://api.example.test/api";
process.env.NEXT_PUBLIC_SITE_URL = "https://www.example.test";

type Call = { url: string; init?: RequestInit };
const calls: Call[] = [];
let includeCcna = true;
let topicStatus = 200;
let topicBody: unknown = null;
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const longProse = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(" ");
const richTopic = () => ({
  title: "IP Services",
  intro: "Intro ".repeat(40),
  description: "DHCP, DNS, NTP and NAT.",
  content: `## Guide\n\n${longProse(400)}`,
  faq: [{ q: "What is DHCP?", a: "A protocol." }, { q: "What is NTP?", a: "Time sync." }],
});

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input);
  calls.push({ url, init });
  const u = new URL(url);
  if (u.pathname.endsWith("/api/certifications")) {
    return json(200, [
      ...(includeCcna ? [{ id: 1, slug: "ccna" }] : []),
      { id: 2, slug: "other-cert" },
    ]);
  }
  if (/\/certifications\/by-slug\//.test(u.pathname)) return json(200, { questionCountByLang: { it: 10, en: 10, fr: 10, es: 10 } });
  if (u.pathname.endsWith("/api/topic-reviews")) return json(200, []);
  if (u.pathname === "/api/topic-pages/ccna/ip-services") return json(topicStatus, topicBody);
  return json(404, {});
}) as typeof fetch;

const run = async () => {
  calls.length = 0;
  const mod = await import("../src/app/sitemap");
  return mod.default();
};
const TOPIC_URL = "https://www.example.test/certifications/ccna/ip-services";

test("ip-services is published only when isTopicIndexable accepts it", async () => {
  topicStatus = 200;
  topicBody = { questionCount: 120, topic: richTopic() };
  const entries = await run();
  assert.equal(entries.filter((e) => e.url === TOPIC_URL).length, 1);
  assert.ok(calls.some((c) => c.url.includes("/topic-pages/ccna/ip-services?lang=en")));
});

test("a thin topic or an empty inventory is not published (same rule as the page robots)", async () => {
  topicBody = { questionCount: 120, topic: { title: "IP Services", description: "short", faq: [] } };
  assert.equal((await run()).filter((e) => e.url === TOPIC_URL).length, 0);
  topicBody = { questionCount: 0, topic: richTopic() };
  assert.equal((await run()).filter((e) => e.url === TOPIC_URL).length, 0);
  topicBody = {};
  topicStatus = 404;
  assert.equal((await run()).filter((e) => e.url === TOPIC_URL).length, 0);
});

test("no other CCNA topic and no non-EN topic URL is added; no lab detail URL is published", async () => {
  topicStatus = 200;
  topicBody = { questionCount: 120, topic: richTopic() };
  const urls = (await run()).map((e) => e.url);
  const ccnaTopics = urls.filter((u) => /\/certifications\/ccna\/[^/]+$/.test(u));
  assert.deepEqual(ccnaTopics, [TOPIC_URL]);
  assert.ok(!urls.some((u) => /\/(it|fr|es)\/.*ip-services/.test(u)));
  assert.ok(!urls.some((u) => /\/interactive-labs\/[^/]+$/.test(u)), "i lab restano fuori dalla sitemap");
  assert.ok(urls.includes("https://www.example.test/certifications/ccna"), "URL esistenti invariati");
});

test("without the CCNA certification no topic request is made; fetches stay in Data Cache", async () => {
  includeCcna = false;
  await run();
  assert.ok(!calls.some((c) => c.url.includes("/topic-pages/")));
  includeCcna = true;
  topicBody = { questionCount: 120, topic: richTopic() };
  await run();
  for (const c of calls) {
    assert.notEqual(c.init?.cache, "no-store", c.url);
    const rv = (c.init as { next?: { revalidate?: number } } | undefined)?.next?.revalidate;
    assert.ok(typeof rv === "number" && rv >= 60, c.url);
  }
});

test("a backend error on the topic request interrupts generation (no truncated sitemap)", async () => {
  topicStatus = 503;
  topicBody = {};
  await assert.rejects(run(), /sitemap: .* non disponibile/);
  topicStatus = 200;
});
