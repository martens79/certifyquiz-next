// Dolphin ICDL: package names in 4 languages, scope note, card features, promoted in every language.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { packageFeatures, packageDisplayName, accessValidityLabel } from "../src/lib/commercial-packages";
import { isPackageCertificationOfferedInLang, packageStudyHref } from "../src/lib/eipass-standard";
import { ICDL_PACKAGE_NOTE, icdlPackageNote, packageCertificationName } from "../src/lib/icdl-package";

const LANGS = ["it", "en", "fr", "es"] as const;
const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");

test("names: 'Dolphin Study · ECDL (ICDL)' in Italian, 'Dolphin Study · ICDL' elsewhere; DB name 'ECDL' never shown alone", () => {
  const name = (lang: (typeof LANGS)[number]) => packageDisplayName("dolphin-study", packageCertificationName("icdl", "ECDL", lang), lang);
  assert.equal(name("it"), "Dolphin Study · ECDL (ICDL)");
  for (const lang of ["en", "fr", "es"] as const) assert.equal(name(lang), "Dolphin Study · ICDL");
  assert.equal(packageCertificationName("ccna", "CCNA", "it"), "CCNA", "other certifications unchanged");
  assert.equal(packageCertificationName("eipass", "EIPASS", "en"), "EIPASS");
});

test("card content: 1068 questions, unlimited explanations, reviews, guide, maps, no expiry", () => {
  const full = ["explanation", "guide", "map", "progress", "quiz", "review"];
  const counts = { questionCount: 1068, guidePages: 68, mapPages: 11 };
  assert.deepEqual(packageFeatures("dolphin-study", counts, "it", full), [
    "Banca domande completa: 1068 domande", "Spiegazioni complete senza limiti", "Ripassi per argomento",
    "Guida PDF · 68 pagine", "Mappe concettuali · 11 pagine",
  ]);
  assert.deepEqual(packageFeatures("dolphin-study", counts, "en", full), [
    "Complete question bank: 1,068 questions", "Unlimited full explanations", "Topic reviews",
    "PDF guide · 68 pages", "Concept maps · 11 pages",
  ]);
  for (const lang of LANGS) {
    const f = packageFeatures("dolphin-study", counts, lang, full);
    assert.equal(f.length, 5, lang);
    assert.ok(!f.some((x) => /Mock|simula|exam/i.test(x)), `${lang}: no Premium/Octopus feature`);
  }
  assert.equal(accessValidityLabel(null, "fr"), "Accès sans expiration aux contenus inclus");
});

test("scope note in 4 languages: 9 reviews, guide and maps in the selected language, no affiliation claim", () => {
  for (const lang of LANGS) {
    const note = icdlPackageNote("icdl", lang);
    assert.equal(note, ICDL_PACKAGE_NOTE[lang]);
    assert.match(note!, /\b9\b/);
    assert.match(note!, /PDF/);
    assert.match(note!, /ICDL Foundation/);
    assert.doesNotMatch(note!, /garanti|guarant|simulaz|simulation|simulación/i);
  }
  assert.equal(icdlPackageNote("ccna", "it"), undefined);
});

test("ICDL promoted in every language, study link to the quiz page", () => {
  for (const lang of LANGS) assert.equal(isPackageCertificationOfferedInLang("icdl", lang), true, lang);
  assert.equal(packageStudyHref("/fr", "icdl"), "/fr/quiz/icdl");
});

test("the four package surfaces use the ICDL name", () => {
  for (const p of [
    "../src/components/CertificationPage.tsx",
    "../src/app/(marketing)/pricing/PackagesUpsell.tsx",
    "../src/components/profile/MyPackages.tsx",
    "../src/components/packages/PackageSuccess.tsx",
  ]) assert.match(read(p), /packageCertificationName\(/, p);
});
