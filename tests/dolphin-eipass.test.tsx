// Dolphin EIPASS (7 Moduli User + Standard): card features, names, Italian-only scope and study links.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { packageFeatures, packageDisplayName } from "../src/lib/commercial-packages";
import {
  EIPASS_STANDARD_LANDING_PATH,
  EIPASS_STANDARD_PACKAGE_NAME,
  EIPASS_STANDARD_PACKAGE_SCOPE_NOTE,
  isPackageCertificationOfferedInLang,
  packageStudyHref,
} from "../src/lib/eipass-standard";
import { EIPASS_USER_COPY } from "../src/lib/eipass-user-release";

const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");

test("packageFeatures without includedResources: unchanged for every existing package", () => {
  const counts = { questionCount: 990, guidePages: 40, mapPages: 12 };
  assert.deepEqual(packageFeatures("dolphin-study", counts, "it"), packageFeatures("dolphin-study", counts, "it", null));
  assert.deepEqual(packageFeatures("dolphin-study", counts, "it"), [
    "Banca domande completa: 990 domande", "Spiegazioni complete senza limiti", "Ripassi per argomento",
    "Guida PDF · 40 pagine", "Mappe concettuali · 12 pagine",
  ]);
  const full = ["explanation", "guide", "map", "progress", "quiz", "review"];
  assert.deepEqual(packageFeatures("dolphin-study", counts, "it", full), packageFeatures("dolphin-study", counts, "it"));
});

test("packageFeatures with includedResources: no review, guide or map promised when not included", () => {
  const counts = { questionCount: 350, guidePages: 40, mapPages: 12 };
  assert.deepEqual(packageFeatures("dolphin-study", counts, "it", ["explanation", "progress", "quiz"]), [
    "Banca domande completa: 350 domande", "Spiegazioni complete senza limiti",
  ]);
  assert.deepEqual(packageFeatures("dolphin-study", {}, "it", ["explanation", "progress", "quiz", "review"]), [
    "Banca domande completa", "Spiegazioni complete senza limiti", "Ripassi per argomento",
  ]);
});

test("names keep the two EIPASS paths distinct", () => {
  assert.equal(packageDisplayName("dolphin-study", EIPASS_STANDARD_PACKAGE_NAME, "it"), "EIPASS Standard Study");
  for (const lang of ["it", "en", "fr", "es"] as const) {
    assert.equal(packageDisplayName("dolphin-study", EIPASS_USER_COPY.name[lang], lang), "EIPASS 7 Moduli User Study");
    assert.match(EIPASS_USER_COPY.packageNote[lang], /EIPASS Standard \/ CIAD/);
  }
  assert.match(EIPASS_STANDARD_PACKAGE_SCOPE_NOTE, /Solo in italiano/);
  assert.match(EIPASS_STANDARD_PACKAGE_SCOPE_NOTE, /non EIPASS 7 Moduli User/);
  assert.doesNotMatch(EIPASS_STANDARD_PACKAGE_SCOPE_NOTE, /garanti|completa|tutto il programma/i);
});

test("EIPASS Standard: package lists only in Italian, study link to the landing (its /quiz route is 404)", () => {
  assert.equal(isPackageCertificationOfferedInLang("eipass-standard", "it"), true);
  for (const lang of ["en", "fr", "es"]) assert.equal(isPackageCertificationOfferedInLang("eipass-standard", lang), false);
  for (const lang of ["it", "en", "fr", "es"]) assert.equal(isPackageCertificationOfferedInLang("eipass", lang), true);
  assert.equal(packageStudyHref("/it", "eipass-standard"), EIPASS_STANDARD_LANDING_PATH);
  assert.equal(packageStudyHref("", "eipass-standard"), EIPASS_STANDARD_LANDING_PATH);
  assert.equal(packageStudyHref("/it", "eipass"), "/it/quiz/eipass");
  assert.equal(packageStudyHref("", "ccna"), "/quiz/ccna");
});

test("wiring: card uses includedResources, upsell filters by language, profile/success use the study link", () => {
  assert.match(read("../src/components/certification/CertificationPackageOffers.tsx"), /packageFeatures\(o\.productCode, counts, lang, o\.includedResources\)/);
  const upsell = read("../src/app/(marketing)/pricing/PackagesUpsell.tsx");
  assert.match(upsell, /\.filter\(\(c: Cert\) => isPackageCertificationOfferedInLang\(c\.slug, lang\)\)/);
  const mine = read("../src/components/profile/MyPackages.tsx");
  assert.match(mine, /packageStudyHref\(quizPrefix,x\.certification_slug\)/);
  assert.match(mine, /x\.tier==="dolphin-study"&&!isEipassStandardSlug\(x\.certification_slug\)/, "no 'Passa a Complete' for Standard (no Octopus)");
  assert.match(read("../src/components/packages/PackageSuccess.tsx"), /packageStudyHref\(prefix,data\.certification_slug\)/);
  const page = read("../src/components/CertificationPage.tsx");
  assert.match(page, /certificationName=\{data\.slug === "eipass" \? EIPASS_USER_COPY\.name\[lang\] : undefined\}/);
});
