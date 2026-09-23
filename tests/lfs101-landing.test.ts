import assert from "node:assert/strict";
import test from "node:test";

import LFS101 from "../src/certifications/data/lfs101.ts";
import { isCertificationIndexable } from "../src/lib/seo/certification-indexability.ts";

const LANGS = ["it", "en", "fr", "es"] as const;
const extra = LFS101.extraContent!;

test("LFS101 landing has real informational content in every language", () => {
  for (const l of LANGS) {
    const about = extra.currentCertification![l];
    assert.ok(about.length >= 2, `${l}: about paragraphs`);
    for (const p of about) assert.ok(p.length >= 250, `${l}: about paragraph too short`);
    assert.ok(extra.currentCertificationHeading?.[l], `${l}: heading`);
    assert.ok(extra.learn![l].length >= 6, `${l}: learn bullets`);

    const sections = extra.guideSections![l];
    assert.equal(sections.length, 3, `${l}: guide sections`);
    assert.equal(new Set(sections.map((s) => s.title)).size, 3, `${l}: unique titles`);
    for (const s of sections) assert.ok((s.items?.length ?? 0) >= 4, `${l}: ${s.title} items`);

    const faq = extra.faq![l];
    assert.ok(faq.length >= 5, `${l}: faq count`);
    assert.equal(new Set(faq.map((f) => f.q)).size, faq.length, `${l}: duplicate faq`);
    for (const f of faq) assert.ok(f.a.length >= 80, `${l}: faq answer too short: ${f.q}`);

    const refs = extra.examReference![l];
    assert.ok(refs.length >= 2 && refs.every((r) => r.url.startsWith("https://")), `${l}: references`);

    assert.ok(LFS101.metaTitle![l].length <= 65, `${l}: metaTitle ${LFS101.metaTitle![l].length}`);
    const md = LFS101.metaDescription![l].length;
    assert.ok(md >= 90 && md <= 165, `${l}: metaDescription ${md}`);
  }
});

test("LFS101 landing text is localized, not copied between languages", () => {
  for (const key of ["currentCertification", "faq", "guideSections"] as const) {
    const serialized = LANGS.map((l) => JSON.stringify((extra as Record<string, Record<string, unknown>>)[key][l]));
    assert.equal(new Set(serialized).size, 4, key);
  }
});

test("LFS101 does not claim an exam blueprint and keeps the fail-closed indexability policy", () => {
  // Non esiste un esame proctored né pesi ufficiali: il box "programma dell'esame" sarebbe fuorviante.
  assert.equal(LFS101.examBlueprint, undefined);
  // La landing migliorata non cambia le regole: con inventario zero resta noindex.
  assert.equal(isCertificationIndexable({ slug: "lfs101", questionCount: 0 }), false);
});
