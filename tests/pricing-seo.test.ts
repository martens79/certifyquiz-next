import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { NextRequest } from "next/server";

import { middleware } from "../src/middleware";
import { pricingPath, type Locale } from "../src/lib/paths";
import { PRICING_SEO, pricingMetadata, pricingSlugRedirect, pricingUrl } from "../src/lib/seo/pricing-metadata";

const ORIGIN = "https://www.certifyquiz.com";
const LANGS: Locale[] = ["it", "en", "fr", "es"];
const EXPECTED: Record<Locale, string> = {
  it: `${ORIGIN}/it/prezzi`,
  en: `${ORIGIN}/pricing`,
  fr: `${ORIGIN}/fr/prix`,
  es: `${ORIGIN}/es/precios`,
};

const run = (pathAndQuery: string) => {
  const res = middleware(new NextRequest(new URL(pathAndQuery, ORIGIN)));
  const loc = res.headers.get("location");
  return { status: res.status, location: loc ? new URL(loc) : null };
};

test("mappatura lingua -> URL canonico Premium", () => {
  for (const lang of LANGS) assert.equal(pricingUrl(lang), EXPECTED[lang]);
});

test("ogni variante e' self-canonical e ha title/description propri", () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const lang of LANGS) {
    const md = pricingMetadata(lang);
    assert.equal(md.alternates?.canonical, EXPECTED[lang], `canonical ${lang}`);
    assert.equal(md.title, PRICING_SEO[lang].title);
    assert.equal(md.description, PRICING_SEO[lang].description);
    assert.ok(PRICING_SEO[lang].title.length <= 60, `title ${lang}: ${PRICING_SEO[lang].title.length}`);
    assert.ok(PRICING_SEO[lang].description.length <= 160, `description ${lang}: ${PRICING_SEO[lang].description.length}`);
    titles.add(PRICING_SEO[lang].title);
    descriptions.add(PRICING_SEO[lang].description);
  }
  assert.equal(titles.size, 4);
  assert.equal(descriptions.size, 4);
});

test("hreflang reciproci: stesso set su tutte le varianti, x-default = EN", () => {
  const expected = { it: EXPECTED.it, en: EXPECTED.en, fr: EXPECTED.fr, es: EXPECTED.es, "x-default": EXPECTED.en };
  for (const lang of LANGS) assert.deepEqual(pricingMetadata(lang).alternates?.languages, expected, `lingua ${lang}`);
});

test("nessuna variante e' noindex", () => {
  for (const lang of LANGS) assert.equal(pricingMetadata(lang).robots, undefined);
});

test("le pagine esportano le metadata della lingua corretta", () => {
  const root = path.resolve(__dirname, "..");
  const files: Record<Locale, [string, string]> = {
    it: ["src/app/[lang]/prezzi/page.tsx", 'pricingMetadata("it")'],
    en: ["src/app/pricing/page.tsx", 'pricingMetadata("en")'],
    fr: ["src/app/fr/prix/page.tsx", 'pricingMetadata("fr")'],
    es: ["src/app/es/precios/page.tsx", 'pricingMetadata("es")'],
  };
  for (const lang of LANGS) {
    const [file, call] = files[lang];
    assert.ok(fs.readFileSync(path.join(root, file), "utf8").includes(call), `${file} deve usare ${call}`);
  }
});

test("/<lang>/prezzi: fr/es/en rimandano allo slug canonico (non rediretto, nessuna catena); it e sconosciute no", () => {
  assert.equal(pricingSlugRedirect("fr"), "/fr/prix");
  assert.equal(pricingSlugRedirect("es"), "/es/precios");
  assert.equal(pricingSlugRedirect("en"), "/pricing");
  assert.equal(pricingSlugRedirect("it"), null);
  assert.equal(pricingSlugRedirect("de"), null);
  for (const lang of ["fr", "es", "en"]) assert.equal(run(pricingSlugRedirect(lang)!).location, null);
});

test("la route [lang]/prezzi conserva la query nel redirect e dà 404 alle lingue sconosciute", () => {
  const src = fs.readFileSync(path.resolve(__dirname, "..", "src/app/[lang]/prezzi/page.tsx"), "utf8");
  assert.ok(src.includes("permanentRedirect("));
  assert.ok(src.includes("searchParams"));
  assert.ok(src.includes("notFound()"));
});

test("le URL canoniche Premium non vengono rediretti dal middleware", () => {
  for (const lang of LANGS) assert.equal(run(pricingPath(lang)).location, null, pricingPath(lang));
});

test("la pagina di pagamento annullato non linka /${lang}/prezzi", () => {
  const src = fs.readFileSync(path.resolve(__dirname, "..", "src/app/[lang]/premium/cancel/page.tsx"), "utf8");
  assert.ok(!src.includes("/prezzi"));
  assert.ok(src.includes("pricingPath("));
});
