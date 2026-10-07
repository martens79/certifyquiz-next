import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { NextRequest } from "next/server";

import { middleware } from "../src/middleware";
import {
  LEGACY_EXACT_REDIRECTS,
  LEGACY_PREFIX_REDIRECTS,
  resolveLegacyRedirect,
} from "../src/lib/legacyRedirects";
import { categoryPath, type CategoryKey, type Locale } from "../src/lib/paths";

const ORIGIN = "https://www.certifyquiz.com";

type Outcome = { status: number; location: string | null; next: boolean };

function run(pathname: string): Outcome {
  const res = middleware(new NextRequest(new URL(pathname, ORIGIN)));
  const loc = res.headers.get("location");
  return {
    status: res.status,
    location: loc ? new URL(loc).pathname : null,
    next: res.headers.get("x-middleware-next") === "1",
  };
}

function assertRedirect(from: string, to: string) {
  const out = run(from);
  assert.equal(out.status, 301, `${from} dovrebbe dare 301`);
  assert.equal(out.location, to, `${from} → ${out.location}, atteso ${to}`);
}

function assertPassThrough(pathname: string) {
  const out = run(pathname);
  assert.ok(out.next && !out.location, `${pathname} non deve essere rediretto (→ ${out.location})`);
}

/* ------------------------------------------------------------------ */

test("exact-match: redirect singoli", () => {
  assertRedirect("/fr/certifications/cisco-ccst", "/fr/certifications/cisco-ccst-networking");
  assertRedirect(
    "/certifications/ai-foundations/generative-ai-and-real-world-applications",
    "/certifications/ai-foundations/generative-ai-real-world-applications",
  );
  assertRedirect("/esundefined", "/es");
  assertRedirect("/base-quiz", "/certifications");
});

test("prefix: vecchi topic ES sotto network-plus → pagina cert canonica", () => {
  assertRedirect("/es/certificaciones/network-plus/topologias", "/es/certificaciones/comptia-network-plus");
  assert.equal(resolveLegacyRedirect("/es/certificaciones/network-plus/a/b"), "/es/certificaciones/comptia-network-plus");
  // La radice (senza topic) resta gestita dalla regola già esistente nel middleware.
  assert.equal(resolveLegacyRedirect("/es/certificaciones/network-plus"), null);
  assertRedirect("/es/certificaciones/network-plus", "/es/certificaciones/comptia-network-plus");
});

test("rimozione /en: le sorgenti /en/* arrivano alla destinazione finale in un salto", () => {
  // Senza la mappa, il middleware toglieva /en e finiva su /sicurezza (404).
  assertRedirect("/en/sicurezza", "/categories/security");
  assertRedirect("/en/intelligenza-artificiale", "/categories/artificial-intelligence");
  assertRedirect("/en/privacy-policy", "/privacy");
  assertRedirect("/en/terms-conditions", "/terms");
  assertRedirect("/en/certifications/itfplus", "/certifications/comptia-itf-plus");
});

test("redirect localizzati IT/FR/ES usano gli slug canonici", () => {
  assertRedirect("/it/sicurezza", "/it/categorie/sicurezza");
  assertRedirect("/fr/sicurezza", "/fr/categories/securite");
  assertRedirect("/es/sicurezza", "/es/categorias/seguridad");
  assertRedirect("/fr/database", "/fr/categories/bases-de-donnees");
  assertRedirect("/es/programmazione", "/es/categorias/programacion");
  assertRedirect("/fr/intelligenza-artificiale", "/fr/categories/intelligence-artificielle");
  assertRedirect("/es/base", "/es/categorias/fundamentos");
});

test("vecchie category roots: 8 slug × 4 lingue = categoryPath()", () => {
  const legacy: Record<string, CategoryKey> = {
    base: "base",
    sicurezza: "sicurezza",
    reti: "reti",
    cloud: "cloud",
    database: "database",
    programmazione: "programmazione",
    virtualizzazione: "virtualizzazione",
    "intelligenza-artificiale": "ai",
  };
  let n = 0;
  for (const lang of ["it", "fr", "es", "en"] as Locale[]) {
    for (const [slug, key] of Object.entries(legacy)) {
      assertRedirect(`/${lang}/${slug}`, categoryPath(lang, key));
      n++;
    }
  }
  assert.equal(n, 32);
});

test("privacy / terms", () => {
  const cases: [string, string][] = [
    ["/privacy-policy", "/privacy"],
    ["/it/privacy-policy", "/it/privacy"],
    ["/fr/privacy-policy", "/fr/privacy"],
    ["/es/privacy-policy", "/es/privacy"],
    ["/terms-conditions", "/terms"],
    ["/fr/terms-conditions", "/fr/conditions"],
    ["/es/terms-conditions", "/es/terminos"],
    // già esistenti nel middleware, non devono cambiare
    ["/it/terms-conditions", "/it/termini"],
    ["/en/cookie-policy", "/cookies"],
  ];
  for (const [from, to] of cases) assertRedirect(from, to);
  // /terms è la pagina viva EN: non va toccata
  assertPassThrough("/terms");
});

test("CCST Cybersecurity: 36 vecchi topic → pagina certificazione della stessa lingua", () => {
  const bases = [
    "/it/certificazioni/cisco-ccst-cybersecurity",
    "/certifications/cisco-ccst-cybersecurity",
    "/fr/certifications/cisco-ccst-cybersecurity",
    "/es/certificaciones/cisco-ccst-cybersecurity",
  ];
  const ccst = Object.entries(LEGACY_EXACT_REDIRECTS).filter(([, to]) => bases.includes(to));
  assert.equal(ccst.length, 36);
  for (const [from, to] of ccst) {
    assert.ok(from.startsWith(`${to}/`), `${from} deve puntare alla cert della sua lingua`);
    assertRedirect(from, to);
  }
  assertRedirect(
    "/fr/certifications/cisco-ccst-cybersecurity/techniques-dingenierie-sociale",
    "/fr/certifications/cisco-ccst-cybersecurity",
  );
});

test("/quiz-suggeriti/undefined/* → /suggested", () => {
  assertRedirect("/quiz-suggeriti/undefined/database", "/suggested");
  assertRedirect("/quiz-suggeriti/undefined", "/suggested");
  assertPassThrough("/suggested");
});

test("nessun loop né catene: source ≠ destination, destination non è una source e non viene rediretta", () => {
  const sources = new Set(Object.keys(LEGACY_EXACT_REDIRECTS));
  const destinations = [
    ...Object.entries(LEGACY_EXACT_REDIRECTS),
    ...LEGACY_PREFIX_REDIRECTS.map((r) => [r.prefix, r.destination] as [string, string]),
  ];
  for (const [from, to] of destinations) {
    assert.notEqual(from, to);
    assert.ok(!sources.has(to), `${to} è anche una source (catena)`);
    assert.equal(resolveLegacyRedirect(to), null, `${to} matcha una regola legacy`);
    assertPassThrough(to);
  }
  for (const { prefix, destination } of LEGACY_PREFIX_REDIRECTS) {
    assert.ok(!destination.startsWith(prefix), `prefix ${prefix} produrrebbe un loop`);
  }
});

test("le source non corrispondono a route statiche dell'app", () => {
  const appDir = path.resolve(process.cwd(), "src/app");
  for (const from of Object.keys(LEGACY_EXACT_REDIRECTS)) {
    const segs = from.split("/").filter(Boolean);
    const candidates = [path.join(appDir, ...segs)];
    if (["it", "fr", "es", "en"].includes(segs[0])) {
      candidates.push(path.join(appDir, "[lang]", ...segs.slice(1)));
    }
    for (const dir of candidates) {
      assert.ok(
        !fs.existsSync(path.join(dir, "page.tsx")) && !fs.existsSync(path.join(dir, "route.ts")),
        `${from} coincide con una route statica (${dir})`,
      );
    }
  }
});

test("precedenza: i mapping esatti restano attivi senza il prefix Google Cloud indiscriminato", () => {
  // Il prefix google-cloud → google-cloud-digital-leader manterrebbe lo slug vecchio.
  assertRedirect(
    "/it/certificazioni/google-cloud/trasformazione-digitale-google-cloud",
    "/it/certificazioni/google-cloud-digital-leader/trasformazione-digitale-con-google-cloud",
  );
  assertRedirect(
    "/fr/certifications/google-cloud/donnees-ia-innovation",
    "/fr/certifications/google-cloud-digital-leader/innovation-avec-les-donnees-et-google-cloud",
  );
  // Regole esistenti (decisioni più recenti del middleware) non cambiano.
  assertPassThrough("/certifications/google-cloud/some-topic");
  assertRedirect("/fr/inizia", "/fr/quiz-home");
  assertRedirect("/it/come-funziona", "/it/percorsi");
  assertRedirect("/hub/security", "/categories/security");
  assertRedirect("/it/hub/ibm-security", "/it/hub/ibm");
  assertRedirect("/quiz/cissp", "/en/quiz/cissp");
  assertRedirect("/en/blog/some-post", "/blog/some-post");
  assertRedirect("/it/certifications/ccna", "/it/certificazioni/ccna");
  assertRedirect("/fr/categorie/reti", "/fr/categories/reti");
  assertRedirect("/&/undefined/cloud", "/it/categorie/cloud");
});

test("pagine vive che il vecchio next.config.ts avrebbe rediretto restano accessibili", () => {
  for (const p of [
    "/hub/ibm",
    "/hub/oracle",
    "/hub/google-career",
    "/hub/vendors",
    "/it/hub/aws-cloud",
    "/fr/blog",
    "/es/blog",
    "/es/certificaciones",
    "/es/quiz-home",
    "/es/precios",
    "/fr/contact",
    "/es/privacidad",
    "/certifications/pl-300-power-bi-data-analyst",
    "/it/certificazioni/dp-900-azure-data-fundamentals",
    "/it/certificazioni/comptia-security-plus",
    "/fr/certifications/vmware-certified-professional",
    "/certifications/ccst",
    "/terms",
  ]) {
    assertPassThrough(p);
  }
});
