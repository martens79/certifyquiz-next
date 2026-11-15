import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

// Stesso setup minimale di analytics-commercial-origin.test.ts.
const sessionStore = new Map<string, string>();
(globalThis as any).window = { location: { pathname: "/it/quiz/ccna", search: "", hash: "" } };
(globalThis as any).document = { referrer: "" };
(globalThis as any).sessionStorage = {
  getItem: (key: string) => sessionStore.get(key) ?? null,
  setItem: (key: string, value: string) => void sessionStore.set(key, value),
};
let uuidCounter = 0;
Object.defineProperty(globalThis, "crypto", {
  value: { randomUUID: () => `00000000-0000-4000-8000-${String(++uuidCounter).padStart(12, "0")}` },
  configurable: true,
});
const beaconCalls: Array<{ blob: Blob }> = [];
Object.defineProperty(globalThis, "navigator", {
  value: { sendBeacon: (_endpoint: string, blob: Blob) => (beaconCalls.push({ blob }), true) },
  configurable: true,
});
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: { getItem: (key: string) => (key === "cq_cookie_consent" ? '{"accepted":true}' : null), setItem: () => {} },
});

const origin = import("../src/lib/commercial-origin.ts");
const analytics = import("../src/lib/analytics.ts");
const payloadAt = async (i: number) => JSON.parse(await beaconCalls[i].blob.text());

test("gli id CTA sono un elenco chiuso, univoco e in snake_case", async () => {
  const { PREMIUM_CTA_IDS, normalizeCtaId } = await origin;
  assert.equal(new Set(PREMIUM_CTA_IDS).size, PREMIUM_CTA_IDS.length);
  for (const id of PREMIUM_CTA_IDS) assert.match(id, /^[a-z]+(_[a-z]+)*$/);
  assert.equal(normalizeCtaId("header_pricing"), "header_pricing");
  for (const bad of ["", "HEADER_PRICING", "header_pricing ", "<script>", "../x", "constructor", "__proto__", null, undefined, 7, {}]) {
    assert.equal(normalizeCtaId(bad as unknown), null, String(bad));
  }
});

test("pageKindForPath classifica solo dal percorso, senza id", async () => {
  const { pageKindForPath } = await origin;
  const cases: Array<[unknown, string]> = [
    ["/", "home"], ["/it", "home"], ["/it/quiz/ccna", "quiz"], ["/quiz/ccna?x=1", "quiz"],
    ["/en/certifications/ccna", "certification"], ["/es/certificaciones/ccna", "certification"],
    ["/it/certificazioni/ccna", "certification"], ["/pricing", "pricing"], ["/fr/prix", "pricing"],
    ["/es/precios", "pricing"], ["/it/prezzi", "pricing"], ["/it/guide/ccna", "guide"], ["/fr/profil", "profile"],
    ["/en/blog/qualcosa", "blog"], ["/it/ripassi/ccna/routing", "review"], ["/it/mappe", "map"],
    ["/zzz/segreto@example.com", "other"], [undefined, "other"], [42, "other"],
  ];
  for (const [path, expected] of cases) assert.equal(pageKindForPath(path), expected, String(path));
});

test("withCtaParam accoda ?cta una sola volta, conserva query e hash e rifiuta id non validi", async () => {
  const { withCtaParam } = await origin;
  assert.equal(withCtaParam("/pricing", "teaser_box"), "/pricing?cta=teaser_box");
  assert.equal(withCtaParam("/pricing?source=x", "teaser_box"), "/pricing?source=x&cta=teaser_box");
  assert.equal(withCtaParam("/pricing#piani", "teaser_box"), "/pricing?cta=teaser_box#piani");
  assert.equal(withCtaParam("/pricing?cta=header_pricing", "teaser_box"), "/pricing?cta=header_pricing");
  assert.equal(withCtaParam("/pricing", "non_valido" as any), "/pricing");
});

test("resolveCommercialOrigin: cta da URL, ripiego sullo storage con TTL, valori manipolati scartati", async () => {
  const { resolveCommercialOrigin, rememberCommercialOrigin } = await origin;
  const mem = new Map<string, string>();
  const storage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
  const now = 1_000_000;

  assert.equal(resolveCommercialOrigin("?cta=guide_gate", { storage, now }).ctaId, "guide_gate");
  assert.equal(resolveCommercialOrigin("?cta=%3Cscript%3E", { storage, now }).ctaId, null);
  assert.equal(resolveCommercialOrigin("?cta=constructor", { storage, now }).ctaId, null);

  rememberCommercialOrigin({ certSlug: "ccna", paywallType: "review", ctaId: "review_gate" }, { storage, now });
  assert.deepEqual(resolveCommercialOrigin("", { storage, now: now + 1000 }), { originCertSlug: "ccna", paywallType: "review", ctaId: "review_gate" });
  assert.equal(resolveCommercialOrigin("?cta=map_locked", { storage, now: now + 1000 }).ctaId, "map_locked", "l'URL vince sullo storage");
  assert.equal(resolveCommercialOrigin("", { storage, now: now + 3 * 60 * 60 * 1000 }).ctaId, null, "oltre il TTL");

  mem.set("cq_commercial_origin", JSON.stringify({ originCertSlug: "ccna", paywallType: null, ctaId: "<img>", recordedAt: now }));
  assert.equal(resolveCommercialOrigin("", { storage, now }).ctaId, null, "storage manomesso");

  assert.equal(resolveCommercialOrigin("?cert_slug=CCNA", { storage: null, now }).originCertSlug, "ccna", "il link del ripasso usa cert_slug");
  for (const source of ["constructor", "__proto__", "toString", "hasOwnProperty"]) {
    assert.equal(resolveCommercialOrigin(`?source=${source}`, { storage: null, now }).paywallType, null, source);
  }
});

test("un click Premium produce un solo evento con cta_id e page_kind, senza dati personali", async () => {
  const { trackFunnelEvent } = await analytics;
  const { premiumClickMetadata } = await origin;
  beaconCalls.length = 0;
  sessionStore.clear();

  trackFunnelEvent({
    event: "premium_clicked",
    cert_slug: "ccna",
    topic_slug: null,
    lang: "it",
    metadata: premiumClickMetadata("certification_card", "/it/certificazioni/ccna"),
  });

  assert.equal(beaconCalls.length, 1, "un click, un evento");
  const payload = await payloadAt(0);
  assert.equal(payload.event, "premium_clicked");
  assert.deepEqual(payload.metadata, { cta_id: "certification_card", page_kind: "certification" });
  assert.equal("email" in payload, false);
  assert.equal(/@/.test(JSON.stringify(payload.metadata)), false);
  assert.equal("paywall_type" in payload, false, "nessun paywall_type inventato per una CTA generica");
  assert.equal(JSON.parse(sessionStore.get("cq_commercial_origin")!).ctaId, "certification_card");
});

test("varianti con paywall: cta_id convive con paywall_type e un click generico senza cta azzera quello precedente", async () => {
  const { trackFunnelEvent } = await analytics;
  const { premiumClickMetadata } = await origin;
  beaconCalls.length = 0;

  trackFunnelEvent({ event: "premium_clicked_review_gate", cert_slug: "ccna", metadata: premiumClickMetadata("review_gate", "/it/ripassi/ccna") });
  const first = await payloadAt(0);
  assert.equal(first.paywall_type, "review");
  assert.equal(first.metadata.cta_id, "review_gate");

  trackFunnelEvent({ event: "premium_clicked", cert_slug: null });
  assert.equal(JSON.parse(sessionStore.get("cq_commercial_origin")!).ctaId, null);

  trackFunnelEvent({ event: "premium_clicked", cert_slug: null, metadata: { cta_id: "<script>" } });
  assert.equal(JSON.parse(sessionStore.get("cq_commercial_origin")!).ctaId, null, "cta_id fuori elenco non viene ricordato");
});

test("gli eventi non-Premium non memorizzano cta", async () => {
  const { trackFunnelEvent } = await analytics;
  beaconCalls.length = 0;
  sessionStore.clear();
  trackFunnelEvent({ event: "paywall_viewed", cert_slug: "ccna", metadata: { cta_id: "header_pricing" } });
  assert.equal(sessionStore.has("cq_commercial_origin"), false);
});

// --- Guardia statica sui punti di chiamata -----------------------------------------------------
function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}
const SRC = sourceFiles(join(process.cwd(), "src")).filter((f) => !/[\\/]admin[\\/]|admin-analytics|[\\/]lib[\\/](analytics|commercial-origin)\.ts$/.test(f));

test("ogni evento premium_clicked* nel codice dichiara un cta_id valido e il numero di punti di invio non cambia", async () => {
  const { PREMIUM_CTA_IDS } = await origin;
  const found: Record<string, number> = {};
  for (const file of SRC) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      if (!/event:\s*["']premium_clicked/.test(line)) return;
      const key = file.replace(process.cwd(), "").replace(/\\/g, "/");
      found[key] = (found[key] ?? 0) + 1;
      const block = lines.slice(i, i + 16).join("\n");
      const m = block.match(/premiumClickMetadata\(\s*["']([a-z_]+)["']/);
      assert.ok(m, `${key}:${i + 1} manca premiumClickMetadata`);
      assert.ok((PREMIUM_CTA_IDS as readonly string[]).includes(m![1]), `${key}:${i + 1} id sconosciuto ${m![1]}`);
    });
  }
  assert.deepEqual(found, {
    "/src/components/Header.tsx": 1,
    "/src/components/certification/PremiumResourcesCta.tsx": 1,
    "/src/components/guides/GuideAccessGate.tsx": 1,
    "/src/components/maps/MapOverviewGrid.tsx": 1,
    "/src/components/premium/PremiumTeaserBox.tsx": 1,
    "/src/components/quiz/QuizEngine.tsx": 3,
    "/src/components/reviews/ReviewPremiumContent.tsx": 1,
  }, "aggiungere un evento premium_clicked richiede di aggiornare questa lista (e di dichiarare un cta_id)");
});

test("ogni cta= usato nei link verso la pricing e' nell'elenco chiuso", async () => {
  const { PREMIUM_CTA_IDS } = await origin;
  const used = new Set<string>();
  for (const file of SRC) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/[?&]cta=([a-z_]+)/g)) used.add(m[1]);
    for (const m of text.matchAll(/(?:withCtaParam\([^)]*\)|premiumClickMetadata\()\s*,?\s*["']([a-z_]+)["']/g)) used.add(m[1]);
    for (const m of text.matchAll(/cta:\s*['"]([a-z_]+)['"]/g)) used.add(m[1]);
    for (const m of text.matchAll(/searchParams\.set\(\s*["']cta["']\s*,\s*["']([a-z_]+)["']/g)) used.add(m[1]);
  }
  assert.ok(used.size >= 10, `trovati solo ${used.size} id`);
  for (const id of used) assert.ok((PREMIUM_CTA_IDS as readonly string[]).includes(id), `id non in elenco: ${id}`);
});
