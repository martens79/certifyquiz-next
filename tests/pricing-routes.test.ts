import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { NextRequest } from "next/server";

import { middleware } from "../src/middleware";
import { LEGACY_EXACT_REDIRECTS } from "../src/lib/legacyRedirects";
import { PRICING_SLUG_BY_LANG, pricingPath, type Locale } from "../src/lib/paths";
import { prettyPricing } from "../src/lib/prettyPaths";

const ORIGIN = "https://www.certifyquiz.com";
const LANGS: Locale[] = ["it", "en", "fr", "es"];

function run(pathAndQuery: string) {
  const res = middleware(new NextRequest(new URL(pathAndQuery, ORIGIN)));
  const loc = res.headers.get("location");
  return {
    status: res.status,
    location: loc ? new URL(loc) : null,
    next: res.headers.get("x-middleware-next") === "1",
  };
}

// Una pagina Premium esiste per ogni lingua: stesse route che servono le pagine in produzione.
const PRICING_ROUTE_FILES: Record<Locale, string> = {
  en: "src/app/pricing/page.tsx",
  fr: "src/app/fr/prix/page.tsx",
  es: "src/app/es/precios/page.tsx",
  it: "src/app/[lang]/prezzi/page.tsx",
};

test("gli URL Premium canonici sono /pricing, /it/prezzi, /fr/prix, /es/precios", () => {
  assert.deepEqual(
    LANGS.map((l) => pricingPath(l)),
    ["/it/prezzi", "/pricing", "/fr/prix", "/es/precios"],
  );
  assert.equal(PRICING_SLUG_BY_LANG.fr, "prix");
});

test("ogni URL Premium canonico ha una route nell'app e non viene rediretto", () => {
  const root = path.resolve(__dirname, "..");
  for (const lang of LANGS) {
    assert.ok(fs.existsSync(path.join(root, PRICING_ROUTE_FILES[lang])), `manca la route ${PRICING_ROUTE_FILES[lang]}`);
    const out = run(pricingPath(lang));
    assert.ok(out.next && !out.location, `${pricingPath(lang)} non deve essere rediretto (→ ${out.location?.pathname})`);
  }
});

test("prettyPricing() coincide con pricingPath(): nessun riferimento a URL non serviti", () => {
  for (const lang of LANGS) assert.equal(prettyPricing(lang), pricingPath(lang), `lingua ${lang}`);
});

test("/fr/tarifs risponde con un 301 verso /fr/prix in un solo salto", () => {
  const out = run("/fr/tarifs");
  assert.equal(out.status, 301);
  assert.equal(out.location?.pathname, "/fr/prix");
  assert.equal(out.location?.origin, ORIGIN);
});

test("/fr/tarifs conserva i parametri di query (source, cta, certificazione, piano)", () => {
  const qs = "?source=guide_preview&certification_slug=ccna&cta=guide_gate&plan=premium_monthly&resume=1";
  const out = run(`/fr/tarifs${qs}`);
  assert.equal(out.status, 301);
  assert.equal(out.location?.pathname, "/fr/prix");
  assert.equal(out.location?.search, qs);
});

test("la destinazione del redirect non e' a sua volta rediretta (nessuna catena)", () => {
  const destination = LEGACY_EXACT_REDIRECTS["/fr/tarifs"];
  assert.equal(destination, "/fr/prix");
  assert.equal(run(destination).location, null);
});

test("nessun link o sorgente applicativa punta a /fr/tarifs, tranne il redirect", () => {
  const root = path.resolve(__dirname, "..", "src");
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(ts|tsx|mjs|js)$/.test(entry.name) && fs.readFileSync(full, "utf8").includes("/fr/tarifs")) {
        offenders.push(path.relative(root, full).replace(/\\/g, "/"));
      }
    }
  };
  walk(root);
  // legacyRedirects.ts cita /fr/tarifs solo nel commento del redirect.
  assert.deepEqual(offenders.filter((f) => f !== "lib/legacyRedirects.ts"), []);
});
