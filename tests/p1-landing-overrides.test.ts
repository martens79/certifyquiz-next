import assert from "node:assert/strict";
import test from "node:test";
import { CERTS_BY_SLUG } from "../src/certifications/data";
import { P1_LANDING_OVERRIDES } from "../src/certifications/editorial/p1-landing-overrides";

const LANGS = ["it", "en", "fr", "es"] as const;

// Affermazioni di mercato / di formato che non devono rientrare senza fonte primaria.
const BANNED = /high demand|in demand|in-demand|boost your career|widely recognized|globally recognized|highest level|top-requested|most widely used|molto richiest|alta demanda|haute demande|riconosciut|international recognition/i;

const strings = (value: unknown, out: string[] = []): string[] => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
};

test("overlay: ogni slug esiste nel registry (nessun override silenziosamente ignorato)", () => {
  for (const slug of Object.keys(P1_LANDING_OVERRIDES)) {
    assert.ok(CERTS_BY_SLUG[slug], `slug non presente nel registry: ${slug}`);
  }
});

test("overlay: il registry espone i campi dell'overlay, non quelli vecchi", () => {
  for (const [slug, override] of Object.entries(P1_LANDING_OVERRIDES)) {
    const cert = CERTS_BY_SLUG[slug];
    assert.deepEqual(cert.description, override.description, slug);
    assert.deepEqual(cert.extraContent, override.extraContent, slug);
    // topics, route e immagine restano quelli del file dati
    assert.ok(cert.topics.length > 0 && cert.quizRoute.en, slug);
  }
});

test("overlay: 4 lingue complete, sezioni allineate, meta entro i limiti", () => {
  for (const [slug, override] of Object.entries(P1_LANDING_OVERRIDES)) {
    for (const field of ["description", "metaTitle", "metaDescription", "title"] as const) {
      const value = override[field];
      if (!value) continue;
      for (const lang of LANGS) assert.ok(value[lang]?.trim(), `${slug}.${field}.${lang}`);
    }
    if (override.metaTitle) for (const lang of LANGS) assert.ok(override.metaTitle[lang].length <= 70, `${slug} metaTitle ${lang} ${override.metaTitle[lang].length}`);
    if (override.metaDescription) for (const lang of LANGS) assert.ok(override.metaDescription[lang].length <= 165, `${slug} metaDescription ${lang} ${override.metaDescription[lang].length}`);
    const extra = override.extraContent!;
    const counts = LANGS.map((lang) => extra.guideSections?.[lang].length);
    assert.equal(new Set(counts).size, 1, `${slug}: guideSections non allineate ${counts}`);
    const refs = LANGS.map((lang) => extra.examReference?.[lang].length);
    assert.equal(new Set(refs).size, 1, `${slug}: examReference non allineati ${refs}`);
    const faq = LANGS.map((lang) => extra.faq?.[lang].length);
    assert.equal(new Set(faq).size, 1, `${slug}: faq non allineate ${faq}`);
    for (const lang of LANGS) assert.ok((extra.learn?.[lang].length ?? 0) > 0, `${slug} learn ${lang}`);
  }
});

test("overlay: nessuna affermazione di mercato non documentata, nessun link HTTP, nessun whyChoose generico", () => {
  for (const [slug, override] of Object.entries(P1_LANDING_OVERRIDES)) {
    const all = strings(override);
    for (const text of all) assert.doesNotMatch(text, BANNED, `${slug}: ${text.slice(0, 80)}`);
    assert.equal(override.extraContent?.whyChoose, undefined, `${slug}: whyChoose rimosso`);
    for (const lang of LANGS)
      for (const ref of override.extraContent?.examReference?.[lang] ?? []) assert.match(ref.url, /^https:\/\//, `${slug} ${ref.url}`);
  }
});

test("overlay: i codici d'esame ritirati compaiono solo come ritirati", () => {
  const retired = /AZ-80[01]|AZ-204|PT0-002/;
  for (const [slug, override] of Object.entries(P1_LANDING_OVERRIDES)) {
    for (const text of strings(override.extraContent)) {
      if (!retired.test(text)) continue;
      assert.match(text, /prepara ad AZ-204\?|prépare-t-il à AZ-204|prepara para AZ-204\?|prepare for AZ-204\?|retir|ritirat|ancora valid|still current|encore valable|siguen vigentes|replaced|sostitu|remplac|sustitu|not AZ-204|non è AZ-204|n'est pas|no es|does not prepare|non prepara|ne prépare|no prepara|did not|non preparava|n'y préparait|no preparaba|AZ-802|AZ-204 \(|PT0-003 only|solo PT0-003|que PT0-003|solo de PT0-003/i, `${slug}: ${text.slice(0, 120)}`);
    }
  }
});
