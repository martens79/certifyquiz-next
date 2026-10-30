import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

// Setup minimale come in analytics-funnel-event.test.ts.
const sessionStore = new Map<string, string>();
(globalThis as any).window = { location: { pathname: "/it/quiz/ccna", search: "", hash: "" } };
(globalThis as any).document = { referrer: "" };
(globalThis as any).sessionStorage = {
  getItem: (key: string) => sessionStore.get(key) ?? null,
  setItem: (key: string, value: string) => void sessionStore.set(key, value),
};
let uuid = 0;
Object.defineProperty(globalThis, "crypto", { value: { randomUUID: () => `00000000-0000-4000-8000-${String(++uuid).padStart(12, "0")}` }, configurable: true });
const beacons: Array<{ blob: Blob }> = [];
const gtagCalls: unknown[][] = [];
Object.defineProperty(globalThis, "navigator", { value: { sendBeacon: (_e: string, blob: Blob) => (beacons.push({ blob }), true) }, configurable: true });
// Consenso accettato: serve alle versioni di trackEvent/trackFunnelEvent che lo controllano (#147); su main e' ininfluente.
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: (key: string) => (key === "cq_cookie_consent" ? '{"accepted":true}' : null), setItem: () => {} } });

const privacy = import("../src/lib/analytics-privacy.ts");
const analytics = import("../src/lib/analytics.ts");

test("scrubAnalyticsPayload toglie chiavi personali e valori che sembrano email, anche annidati", async () => {
  const { scrubAnalyticsPayload } = await privacy;
  const out = scrubAnalyticsPayload({
    plan: "premium_monthly", Email: "a@b.it", user_email: "x", metadata: { source: "ok", contact: "mario.rossi@example.com", nested: { token: "t", fine: 1 }, list: ["ok", "luigi@example.org"] },
    username: "mario", visitor: "11111111-1111-4111-8111-111111111111",
  });
  assert.deepEqual(out, { plan: "premium_monthly", metadata: { source: "ok", nested: { fine: 1 }, list: ["ok"] }, visitor: "11111111-1111-4111-8111-111111111111" });
});

test("sanitizeAnalyticsUrl: via token, codici e id di sessione; vuota la query sulle pagine sensibili; tiene utm e filtri", async () => {
  const { sanitizeAnalyticsUrl, isSensitiveAnalyticsPath } = await privacy;
  assert.equal(sanitizeAnalyticsUrl("https://www.certifyquiz.com/it/reset-password?token=SEGRETO"), "https://www.certifyquiz.com/it/reset-password");
  assert.equal(sanitizeAnalyticsUrl("https://www.certifyquiz.com/auth/callback?token=JWT&redirect=%2Fit&remember=1"), "https://www.certifyquiz.com/auth/callback");
  assert.equal(
    sanitizeAnalyticsUrl("https://www.certifyquiz.com/premium/success?session_id=cs_live_abc&plan=premium_monthly&utm_source=x"),
    "https://www.certifyquiz.com/premium/success?plan=premium_monthly&utm_source=x"
  );
  assert.equal(sanitizeAnalyticsUrl("https://www.certifyquiz.com/pricing?source=guide_preview&email=a%40b.it&code=zz"), "https://www.certifyquiz.com/pricing?source=guide_preview");
  assert.equal(sanitizeAnalyticsUrl("https://www.certifyquiz.com/x#access_token=ey.AAA"), "https://www.certifyquiz.com/x");
  assert.equal(sanitizeAnalyticsUrl("non un url"), "");
  for (const p of ["/reset-password", "/it/reset-password", "/fr/reset-password/abc", "/auth/callback", "/es/forgot-password"]) assert.equal(isSensitiveAnalyticsPath(p), true, p);
  for (const p of ["/", "/pricing", "/it/prezzi", "/premium/success", "/certifications/ccna", undefined, 5]) assert.equal(isSensitiveAnalyticsPath(p as unknown), false, String(p));
});

test("trackFunnelEvent non invia mai l'email, nemmeno se un chiamante la passa", async () => {
  const { trackFunnelEvent } = await analytics;
  beacons.length = 0;
  trackFunnelEvent({
    event: "premium_clicked", cert_slug: "ccna", lang: "it",
    email: "mario.rossi@example.com", // campo non piu' previsto dal tipo: simula un vecchio chiamante
    metadata: { source_page: "x", contact: "mario.rossi@example.com", plan: "premium_monthly" },
  } as any);
  assert.equal(beacons.length, 1);
  const raw = await beacons[0].blob.text();
  const payload = JSON.parse(raw);
  assert.equal("email" in payload, false);
  assert.equal(/@/.test(raw), false, "nessun indirizzo nel payload");
  assert.deepEqual(payload.metadata, { source_page: "x", plan: "premium_monthly" });
  // gli identificatori tecnici per l'attribuzione restano
  assert.equal(payload.cert_slug, "ccna");
  assert.ok(payload.event_id && payload.session_id && payload.visitor_id !== undefined && payload.page_view_id, "id tecnici presenti");
  assert.equal(payload.source_type, "web_client");
});

test("trackEvent (GA4) toglie chiavi personali dai parametri", async () => {
  const { trackEvent } = await analytics;
  (globalThis as any).window.gtag = (...args: unknown[]) => gtagCalls.push(args);
  gtagCalls.length = 0;
  trackEvent("premium_cta_clicked", { language: "it", user_state: "free", email: "a@b.it", note: "scrivimi a mario@example.com" } as any);
  assert.equal(gtagCalls.length, 1);
  const params = gtagCalls[0][2] as Record<string, unknown>;
  assert.equal("email" in params, false);
  assert.equal("note" in params, false);
  assert.equal(params.language, "it");
  assert.ok(params.anonymous_session_id, "id di sessione anonimo mantenuto");
});

// ---- guardie statiche sul codice -----------------------------------------------------------
const ROOT = join(process.cwd(), "src");
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}
const FILES = walk(ROOT).filter((f) => !/[\\/]app[\\/]admin[\\/]/.test(f));

function stripStrings(s: string): string {
  return s.replace(/`(?:\\.|[^`\\])*`/g, "``").replace(/"(?:\\.|[^"\\])*"/g, '""').replace(/'(?:\\.|[^'\\])*'/g, "''");
}
function callBlock(text: string, start: number): string {
  let depth = 0, i = text.indexOf("(", start);
  const from = i;
  for (; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")" && --depth === 0) return text.slice(from, i + 1);
  }
  return text.slice(from, from + 600);
}

test("nessuna chiamata di tracciamento passa un'email (guardia statica sull'intero codice)", () => {
  const CALLS = /\b(trackFunnelEventOnce|trackFunnelEvent|trackEventOnce|trackEvent|trackQuizEvent|trackMapEvent|trackReviewModuleEvent|trackMetaPixel|trackCheckoutCreated)\s*\(|\bgtag\s*\(|\bfbq\s*\(/g;
  const offenders: string[] = [];
  let seen = 0;
  for (const file of FILES) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(CALLS)) {
      seen++;
      const block = stripStrings(callBlock(text, m.index!));
      if (/\bemail\b|\.email\b|user_email|customer_email/i.test(block)) offenders.push(`${file.replace(process.cwd(), "")}: ${m[0].trim()}`);
    }
  }
  assert.ok(seen > 100, `controllati solo ${seen} punti di chiamata`);
  assert.deepEqual(offenders, [], "una chiamata di tracciamento passa un'email");
});

test("il tipo del corpo del funnel non ha un campo email", () => {
  const src = readFileSync(join(ROOT, "lib", "analytics.ts"), "utf8");
  const type = src.slice(src.indexOf("type FunnelEventBody"), src.indexOf("};", src.indexOf("type FunnelEventBody")));
  assert.equal(/\bemail\b/.test(type), false);
});

test("GA4 e Meta Pixel non partono sulle pagine con segreti nell'URL e GA4 invia page_location ripulita", () => {
  const ga = readFileSync(join(ROOT, "components", "analytics", "GoogleAnalytics.tsx"), "utf8");
  const px = readFileSync(join(ROOT, "components", "analytics", "MetaPixel.tsx"), "utf8");
  assert.ok(ga.includes("isSensitiveAnalyticsPath(pathname)") && px.includes("isSensitiveAnalyticsPath(pathname)"));
  assert.ok(/page_location:\s*sanitizeAnalyticsUrl\(window\.location\.href\)/.test(ga));
  // l'early return sta dopo tutti gli hook (regole di React)
  assert.ok(ga.indexOf("useEffect(") < ga.indexOf("isSensitiveAnalyticsPath(pathname)) return null"));
});
