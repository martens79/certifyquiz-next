import assert from "node:assert/strict";
import test from "node:test";

import { CERTS_BY_SLUG } from "../src/certifications/data/index.ts";
import { isCatalogListed } from "../src/certifications/publication.ts";
import { mergeComingSoonCatalogEntries } from "../src/lib/catalog-coming-soon.ts";
import type { CertListItem } from "../src/lib/certs.ts";

const SLUG = "eipass-standard";
// what the backend list could return: ordinary certifications and, once the inactive row exists, EIPASS Standard itself
const backend = (withStandard: boolean): CertListItem[] => [
  { slug: "ccna", title: { it: "CCNA", en: "CCNA", fr: "CCNA", es: "CCNA" } },
  { slug: "eipass", title: { it: "EIPASS", en: "EIPASS", fr: "EIPASS", es: "EIPASS" } },
  ...(withStandard ? [{ slug: SLUG, title: { it: "EIPASS Standard (db)", en: "db", fr: "db", es: "db" } }] : []),
];
const visibleSlugs = (items: CertListItem[], lang: string) =>
  mergeComingSoonCatalogEntries(items, CERTS_BY_SLUG, lang)
    .filter((c) => isCatalogListed(c.slug, CERTS_BY_SLUG, lang))
    .map((c) => c.slug);

test("Italian catalogue: EIPASS Standard is listed exactly once, from the registry, with or without a database row", () => {
  for (const withRow of [false, true]) {
    const slugs = visibleSlugs(backend(withRow), "it");
    assert.equal(slugs.filter((s) => s === SLUG).length, 1, `withRow=${withRow}`);
    assert.ok(slugs.includes("ccna") && slugs.includes("eipass"), "published certifications are untouched");
  }
  const entry = mergeComingSoonCatalogEntries(backend(true), CERTS_BY_SLUG, "it").find((c) => c.slug === SLUG)!;
  const reg = CERTS_BY_SLUG[SLUG];
  assert.equal((entry.title as { it: string }).it, "EIPASS Standard", "the registry wins over the database name");
  assert.equal(entry.imageUrl, "/images/certifications/eipass-standard.svg");
  assert.equal((entry.level as { it: string }).it, reg.level.it);
  assert.equal(entry.category, null);
});

test("EN, FR and ES catalogues never list EIPASS Standard, even when the backend already returns its row", () => {
  for (const lang of ["en", "fr", "es"]) {
    for (const withRow of [false, true]) {
      assert.deepEqual(visibleSlugs(backend(withRow), lang), ["ccna", "eipass"], `${lang}, withRow=${withRow}`);
    }
  }
});

test("the merge adds nothing else: only coming-soon certifications flagged for the catalogue, nothing mutated", () => {
  const input = backend(false);
  const snapshot = JSON.stringify(input);
  const merged = mergeComingSoonCatalogEntries(input, CERTS_BY_SLUG, "it");
  assert.equal(JSON.stringify(input), snapshot, "input list not mutated");
  assert.deepEqual(merged.map((c) => c.slug), ["ccna", "eipass", SLUG]);
  assert.deepEqual(mergeComingSoonCatalogEntries(input, {}, "it").map((c) => c.slug), ["ccna", "eipass"], "an empty registry adds nothing");
  const planned = { ...CERTS_BY_SLUG[SLUG], slug: "x-planned", publicationStatus: "planned" as const, listedInCatalog: true };
  assert.deepEqual(mergeComingSoonCatalogEntries(input, { "x-planned": planned }, "it").map((c) => c.slug), ["ccna", "eipass"], "planned stays hidden even if flagged");
  const notFlagged = { ...CERTS_BY_SLUG[SLUG], slug: "x-soon", listedInCatalog: undefined };
  assert.deepEqual(mergeComingSoonCatalogEntries(input, { "x-soon": notFlagged }, "it").map((c) => c.slug), ["ccna", "eipass"], "coming-soon without the flag stays out");
});
