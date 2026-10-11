import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  TWA_BOOTSTRAP_SCRIPT,
  TWA_PACKAGE_ID,
  TWA_REFERRER_PREFIX,
  detectTwa,
  isPurchaseHref,
  isPurchasePath,
  localeFromPathname,
} from "../src/lib/twa.ts";
import TwaNotice from "../src/components/twa/TwaNotice";

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
}

const ORIGIN = "https://www.certifyquiz.com";

test("package id e prefisso referrer coincidono con l'app Android", () => {
  assert.equal(TWA_PACKAGE_ID, "com.certifyquiz.app");
  assert.equal(TWA_REFERRER_PREFIX, "android-app://com.certifyquiz.app");
});

test("detectTwa: referrer android-app del nostro package -> true e viene ricordato", () => {
  const storage = memoryStorage();
  assert.equal(detectTwa({ referrer: "android-app://com.certifyquiz.app/", search: "", storage }), true);
  // Dopo una navigazione interna il referrer e' il sito stesso: il flag resta.
  assert.equal(detectTwa({ referrer: "https://www.certifyquiz.com/it", search: "", storage }), true);
});

test("detectTwa: browser normale, referrer vuoto o di altre app -> false", () => {
  assert.equal(detectTwa({ referrer: "", search: "", storage: memoryStorage() }), false);
  assert.equal(detectTwa({ referrer: "https://www.google.com/", search: "", storage: memoryStorage() }), false);
  assert.equal(detectTwa({ referrer: "android-app://com.altra.app/", search: "", storage: memoryStorage() }), false);
  assert.equal(detectTwa({ referrer: "android-app://com.certifyquiz.app.evil/", search: "", storage: memoryStorage() }), false);
});

test("detectTwa: senza sessionStorage decide solo il referrer, senza lanciare", () => {
  assert.equal(detectTwa({ referrer: "android-app://com.certifyquiz.app/", search: "", storage: null }), true);
  assert.equal(detectTwa({ referrer: "", search: "", storage: null }), false);
});

test("detectTwa: ?cq_twa=1 forza, ?cq_twa=0 annulla", () => {
  const storage = memoryStorage();
  assert.equal(detectTwa({ referrer: "", search: "?cq_twa=1", storage }), true);
  assert.equal(detectTwa({ referrer: "", search: "", storage }), true);
  assert.equal(detectTwa({ referrer: "", search: "?cq_twa=0", storage }), false);
  assert.equal(detectTwa({ referrer: "", search: "", storage }), false);
});

test("isPurchasePath: pricing, B2B e ritorni Stripe nelle 4 lingue", () => {
  for (const p of [
    "/pricing",
    "/it/prezzi",
    "/fr/prix",
    "/es/precios",
    "/en/pricing",
    "/business",
    "/it/aziende",
    "/fr/entreprises",
    "/es/empresas",
    "/premium/success",
    "/it/premium/cancel",
    "/packages/success",
    "/it/packages/success",
  ]) {
    assert.equal(isPurchasePath(p), true, p);
  }
});

test("isPurchasePath: quiz, catalogo, blog e profilo NON sono pagine di acquisto", () => {
  for (const p of [
    "/",
    "/it",
    "/it/profile",
    "/en/quiz/ccna",
    "/it/certificazioni/ccna",
    "/blog/prezzi-cloud-guida",
    "/it/blog/pricing-strategy",
    "/categories/business-applications/sap",
    "/it/categorie/business-applications/sap",
    "/it/guide/ccna",
    "/login",
    "/it/login",
  ]) {
    assert.equal(isPurchasePath(p), false, p);
  }
});

test("isPurchaseHref: relativi, assoluti, con query e hash", () => {
  assert.equal(isPurchaseHref("/pricing?source=explanation_paywall", ORIGIN), true);
  assert.equal(isPurchaseHref("/it/prezzi#plans", ORIGIN), true);
  assert.equal(isPurchaseHref("https://www.certifyquiz.com/fr/prix", ORIGIN), true);
  assert.equal(isPurchaseHref("https://certifyquiz.com/pricing", ORIGIN), true);
  assert.equal(isPurchaseHref("../pricing", `${ORIGIN}/it/profile`), true);
});

test("isPurchaseHref: link non di acquisto o esterni non vengono toccati", () => {
  assert.equal(isPurchaseHref("/it/quiz/ccna", ORIGIN), false);
  assert.equal(isPurchaseHref("#packages", ORIGIN), false);
  assert.equal(isPurchaseHref("mailto:info@certifyquiz.com", ORIGIN), false);
  assert.equal(isPurchaseHref("https://example.com/pricing", ORIGIN), false);
  assert.equal(isPurchaseHref("", ORIGIN), false);
  assert.equal(isPurchaseHref(null, ORIGIN), false);
  assert.equal(isPurchaseHref("javascript:alert(1)", ORIGIN), false);
});

test("localeFromPathname: lingua dal prefisso, inglese di default", () => {
  assert.equal(localeFromPathname("/it/prezzi"), "it");
  assert.equal(localeFromPathname("/fr"), "fr");
  assert.equal(localeFromPathname("/es/precios"), "es");
  assert.equal(localeFromPathname("/pricing"), "en");
  assert.equal(localeFromPathname(null), "en");
});

test("script di bootstrap: sintassi valida, nessuna dipendenza esterna", () => {
  assert.doesNotThrow(() => new Function(TWA_BOOTSTRAP_SCRIPT));
  assert.match(TWA_BOOTSTRAP_SCRIPT, /android-app:\/\/com\.certifyquiz\.app/);
  assert.match(TWA_BOOTSTRAP_SCRIPT, /data-twa/);
});

test("script di bootstrap: imposta data-twa dal referrer e rispetta sessionStorage", () => {
  const attrs = new Map<string, string>();
  const store = new Map<string, string>();
  const win = {
    sessionStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    },
  };
  const run = (referrer: string, search = "") => {
    attrs.clear();
    new Function("window", "document", "location", TWA_BOOTSTRAP_SCRIPT)(
      win,
      { referrer, documentElement: { setAttribute: (k: string, v: string) => attrs.set(k, v) } },
      { search }
    );
    return attrs.get("data-twa");
  };
  assert.equal(run("https://www.google.com/"), undefined);
  assert.equal(run("android-app://com.certifyquiz.app/"), "1");
  assert.equal(run("https://www.certifyquiz.com/it"), "1"); // ricordato
  assert.equal(run("", "?cq_twa=0"), undefined);
  // package simile ma diverso: non e' la nostra app
  assert.equal(run("android-app://com.certifyquiz.app.evil/"), undefined);
});

test("TwaNotice: avviso neutro, senza prezzi ne' inviti all'acquisto, nelle 4 lingue", () => {
  const forbidden = /€|\$|prezzo|price|prix|precio|acquista|buy|purchase|abbonati|subscribe|checkout|stripe|sito web|website|certifyquiz\.com/i;
  for (const lang of ["it", "en", "fr", "es"] as const) {
    for (const variant of ["section", "guide"] as const) {
      const html = renderToStaticMarkup(createElement(TwaNotice, { lang, variant }));
      assert.ok(html.length > 50, `${lang}/${variant} vuoto`);
      assert.doesNotMatch(html, forbidden, `${lang}/${variant}: ${html}`);
      assert.match(html, new RegExp(`href="${lang === "en" ? "/" : `/${lang}`}"`));
    }
  }
});
