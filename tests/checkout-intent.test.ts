import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  CHECKOUT_PLANS,
  INTENT_TTL_MS,
  buildLoginHref,
  buildResumePath,
  checkoutAuthBanner,
  clearCheckoutIntent,
  consumeCheckoutIntent,
  decideResume,
  normalizePlan,
  saveCheckoutIntent,
  stripResumeParams,
} from "../src/lib/checkout-intent.ts";
import { readConversionContext, safeInternalRedirect, safePostAuthRedirect } from "../src/lib/conversion-context.ts";

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
}

test("normalizePlan accetta solo i piani noti", () => {
  for (const p of CHECKOUT_PLANS) assert.equal(normalizePlan(p), p);
  for (const bad of ["premium", "PREMIUM_MONTHLY", "premium_monthly ", "__proto__", "constructor", null, undefined, 3, {}]) {
    assert.equal(normalizePlan(bad as unknown), null, String(bad));
  }
});

test("l'intenzione e' a uso singolo: la seconda lettura non restituisce nulla", () => {
  const storage = memoryStorage();
  const saved = saveCheckoutIntent({ plan: "premium_annual", promo: "thanks1month", originCertSlug: "CCNA", paywallSource: "guide_preview", ctaId: "guide_gate" }, { storage, now: 1000 });
  assert.equal(saved?.plan, "premium_annual");
  const first = consumeCheckoutIntent({ storage, now: 2000 });
  assert.deepEqual(first, { plan: "premium_annual", promo: "thanks1month", originCertSlug: "ccna", paywallSource: "guide_preview", ctaId: "guide_gate", createdAt: 1000 });
  assert.equal(consumeCheckoutIntent({ storage, now: 2000 }), null);
  assert.equal(storage.map.size, 0);
});

test("intenzione scaduta, dal futuro, manomessa o con piano ignoto viene scartata (e rimossa)", () => {
  const key = "cq_checkout_intent";
  const base = { plan: "premium_monthly", promo: null, originCertSlug: null, paywallSource: null, ctaId: null };
  const cases: Array<[string, string]> = [
    ["scaduta", JSON.stringify({ ...base, createdAt: 0 })],
    ["dal futuro", JSON.stringify({ ...base, createdAt: 10 * 60 * 60 * 1000 })],
    ["piano ignoto", JSON.stringify({ ...base, plan: "premium_lifetime", createdAt: 1000 })],
    ["non json", "{rotto"],
    ["senza data", JSON.stringify(base)],
  ];
  for (const [name, raw] of cases) {
    const storage = memoryStorage({ [key]: raw });
    assert.equal(consumeCheckoutIntent({ storage, now: INTENT_TTL_MS + 5000 }), null, name);
    assert.equal(storage.map.has(key), false, `${name}: rimossa`);
  }
  const hostile = memoryStorage({ [key]: JSON.stringify({ ...base, originCertSlug: "<b>", paywallSource: "x y", ctaId: "<script>", promo: "a'b", createdAt: 1000 }) });
  assert.deepEqual(consumeCheckoutIntent({ storage: hostile, now: 2000 }), { ...base, createdAt: 1000 });
});

test("storage assente o che lancia non rompe nulla", () => {
  const throwing = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };
  assert.doesNotThrow(() => saveCheckoutIntent({ plan: "premium_monthly" }, { storage: throwing }));
  assert.equal(consumeCheckoutIntent({ storage: throwing }), null);
  assert.equal(consumeCheckoutIntent({ storage: null }), null);
  assert.doesNotThrow(() => clearCheckoutIntent({ storage: throwing }));
  assert.equal(saveCheckoutIntent({ plan: "nope" }, { storage: memoryStorage() }), null);
});

test("buildResumePath ricostruisce la query da un elenco chiuso e scarta il resto", () => {
  const path = buildResumePath(
    "/it/prezzi",
    "?source=guide_preview&certification_slug=ccna&cta=guide_gate&promo=thanks1month&utm_source=x&redirect=//evil.com&plan=premium_annual&resume=1&token=abc",
    "premium_monthly"
  );
  assert.ok(path);
  const url = new URL(path!, "https://example.test");
  assert.equal(url.pathname, "/it/prezzi");
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    source: "guide_preview",
    certification_slug: "ccna",
    cta: "guide_gate",
    promo: "thanks1month",
    plan: "premium_monthly",
    resume: "1",
  });
  assert.equal(buildResumePath("/pricing", "", "gratis"), null, "piano non valido");
  assert.equal(buildResumePath("//evil.com/x", "", "premium_monthly"), null, "percorso esterno");
  assert.equal(buildResumePath("/\\evil.com", "", "premium_monthly"), null, "backslash");
  const weird = buildResumePath("/pricing", "?cta=%3Cscript%3E&source=a%20b&certification_slug=%27%3B--", "premium_monthly")!;
  assert.equal(weird, "/pricing?plan=premium_monthly&resume=1", "valori ostili scartati");
});

test("il link di login porta source e redirect interno e sopravvive alla lettura del contesto", () => {
  const resume = buildResumePath("/it/prezzi", "?source=mock_review&certification_slug=ccna", "premium_monthly");
  const href = buildLoginHref("it", resume);
  const url = new URL(href, "https://example.test");
  assert.equal(url.pathname, "/it/login");
  assert.equal(url.searchParams.get("source"), "premium_checkout");
  const ctx = readConversionContext(url.searchParams);
  assert.equal(ctx.source, "premium_checkout");
  assert.equal(ctx.redirect, resume, "il redirect dopo il login e' esattamente il percorso di ripresa");
  assert.equal(new URL(buildLoginHref("xx", null), "https://example.test").pathname, "/en/login", "lingua ignota -> en");
});

test("decideResume: ripresa automatica solo con URL + intenzione + utente autenticato non Premium", () => {
  const intent = { plan: "premium_monthly" as const, promo: null, originCertSlug: null, paywallSource: null, ctaId: null, createdAt: 1 };
  const search = "?resume=1&plan=premium_monthly&source=x";
  assert.deepEqual(decideResume({ search, authenticated: true, alreadyPremium: false, intent }), { decision: "auto", plan: "premium_monthly" });
  assert.deepEqual(decideResume({ search, authenticated: true, alreadyPremium: false, intent: null }), { decision: "manual", plan: "premium_monthly" }, "altra scheda / scaduta: niente avvio automatico");
  assert.deepEqual(decideResume({ search, authenticated: true, alreadyPremium: false, intent: { ...intent, plan: "premium_annual" } }), { decision: "manual", plan: "premium_monthly" }, "piano diverso: nessun avvio");
  assert.deepEqual(decideResume({ search, authenticated: false, alreadyPremium: false, intent }), { decision: "none", plan: null }, "mai senza autenticazione");
  assert.deepEqual(decideResume({ search, authenticated: true, alreadyPremium: true, intent }), { decision: "none", plan: null }, "mai un secondo abbonamento");
  assert.deepEqual(decideResume({ search: "?plan=premium_monthly", authenticated: true, alreadyPremium: false, intent }), { decision: "none", plan: null }, "senza resume=1");
  assert.deepEqual(decideResume({ search: "?resume=1&plan=gratis", authenticated: true, alreadyPremium: false, intent }), { decision: "none", plan: null }, "piano manipolato");
  assert.deepEqual(decideResume({ search: "?resume=true&plan=premium_monthly", authenticated: true, alreadyPremium: false, intent }), { decision: "none", plan: null });
});

test("stripResumeParams toglie solo resume e plan", () => {
  assert.equal(stripResumeParams("?resume=1&plan=premium_monthly"), "");
  assert.equal(stripResumeParams("?source=x&resume=1&plan=premium_annual&cta=header_pricing"), "?source=x&cta=header_pricing");
  assert.equal(stripResumeParams(""), "");
});

test("safePostAuthRedirect / safeInternalRedirect respingono redirect aperti", () => {
  const bad = ["https://evil.com", "//evil.com", "/\\evil.com", "/%5Cevil.com", "/%2F%2Fevil.com", "javascript:alert(1)", "/ok\u0000", "/ok\r\nSet-Cookie:x", "evil.com", "", null, undefined];
  for (const value of bad) {
    assert.equal(safePostAuthRedirect(value as string | null | undefined), "/", String(value));
    assert.equal(safeInternalRedirect(value as string | null | undefined), null, String(value));
  }
  assert.equal(safePostAuthRedirect("/it/prezzi?plan=premium_monthly&resume=1"), "/it/prezzi?plan=premium_monthly&resume=1");
  assert.equal(safePostAuthRedirect("/it/profilo"), "/it/profile");
  assert.equal(safePostAuthRedirect("/profilo"), "/profile");
});

test("il banner esiste nelle 4 lingue e cade su en per lingue ignote", () => {
  for (const lang of ["it", "en", "fr", "es"]) assert.ok(checkoutAuthBanner(lang).length > 40, lang);
  assert.equal(checkoutAuthBanner("de"), checkoutAuthBanner("en"));
});

// --- Guardie statiche sulla pagina prezzi -----------------------------------------------------
const pricing = readFileSync(new URL("../src/app/(marketing)/pricing/PremiumComingSoonView.tsx", import.meta.url), "utf8");

test("pricing: nessuna chiamata di checkout prima del controllo di autenticazione", () => {
  const start = pricing.indexOf("async function startPremiumCheckout");
  assert.ok(start > 0);
  const fn = pricing.slice(start, pricing.indexOf("return (\n    <main", start));
  const authGate = fn.indexOf("if (!user)");
  const goAuth = fn.indexOf("goToAuth(plan");
  const inFlight = fn.indexOf("inFlightRef.current = true");
  const api = fn.indexOf("create-checkout-session");
  const attempted = fn.indexOf('event: "checkout_attempted"');
  assert.ok(authGate > 0 && goAuth > authGate, "il ramo anonimo esiste");
  assert.ok(inFlight > goAuth && api > inFlight && attempted > inFlight, "checkout_attempted e API solo dopo il ramo anonimo");
  assert.equal(fn.replace("opts.plan ?? selectedPlan", "").includes("selectedPlan"), false, "il piano usato e' quello passato/ripreso, non lo stato letto in ritardo");
  assert.equal(/window\.location\.href\s*=\s*`\/login/.test(pricing), false, "niente piu' redirect a /login non localizzato e senza ripresa");
});

test("pricing: la ripresa automatica non rimanda mai al login (nessun giro infinito)", () => {
  const i = pricing.indexOf("if (res.status === 401)");
  assert.ok(i > 0);
  const block = pricing.slice(i, i + 500);
  assert.ok(block.indexOf("opts.auto") > 0 && block.indexOf("opts.auto") < block.indexOf("goToAuth(plan, origin)"));
  assert.ok(pricing.includes("resumeHandledRef.current = true"), "una sola gestione per caricamento");
  assert.ok(pricing.includes("window.history.replaceState"), "i parametri di ripresa vengono rimossi dall'URL");
  assert.ok(pricing.includes('"pageshow"'), "ritorno da Stripe dalla cache");
});

test("pacchetti: il flusso anonimo esistente (redirect al login, nessun checkout) non e' stato alterato", () => {
  const offers = readFileSync(new URL("../src/components/certification/CertificationPackageOffers.tsx", import.meta.url), "utf8");
  const i = offers.indexOf("if (!user) {");
  assert.ok(i > 0);
  assert.match(offers.slice(i, i + 220), /router\.push\(`\$\{lang === "en" \? "" : `\/\$\{lang\}`\}\/login\?redirect=\$\{encodeURIComponent\(pathname \|\| "\/"\)\}`\);\s*return;/);
  assert.ok(offers.indexOf("apiFetch(\"/packages/checkout\"") > i, "checkout pacchetto solo dopo il controllo utente");
});
