import assert from "node:assert/strict";
import test from "node:test";
import { certificationsListMetadata } from "../src/app/[lang]/certificazioni/listMetadata.ts";

const SITE = "https://www.certifyquiz.com";
const LIST = {
  it: `${SITE}/it/certificazioni`,
  en: `${SITE}/certifications`,
  fr: `${SITE}/fr/certifications`,
  es: `${SITE}/es/certificaciones`,
} as const;

for (const lang of ["it", "en", "fr", "es"] as const) {
  test(`${lang}: self-canonical pulito, indicizzabile, con title`, () => {
    const m = certificationsListMetadata(lang);
    assert.equal(m.alternates?.canonical, LIST[lang]);
    assert.ok(!String(m.alternates?.canonical).includes("?"));
    assert.deepEqual(m.robots, { index: true, follow: true });
    assert.match(String(m.title), /\| CertifyQuiz$/);
  });
}

test("hreflang reciproco: stesso cluster in tutte le lingue, x-default EN root", () => {
  const expected = {
    "it-IT": LIST.it,
    "en-US": LIST.en,
    "fr-FR": LIST.fr,
    "es-ES": LIST.es,
    "x-default": LIST.en,
  };
  for (const lang of ["it", "en", "fr", "es"] as const) {
    assert.deepEqual(certificationsListMetadata(lang).alternates?.languages, expected);
  }
});
