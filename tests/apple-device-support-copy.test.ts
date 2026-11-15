import assert from "node:assert/strict";
import test from "node:test";
import Apple from "../src/certifications/data/apple-device-support.ts";

const LANGS = ["en", "it", "fr", "es"] as const;
const texts = (lang: (typeof LANGS)[number]) => [
  Apple.description?.[lang] ?? "",
  ...(Apple.extraContent?.guideSections?.[lang] ?? []).flatMap(s => [s.title, ...s.paragraphs]),
];

test("Apple landing copy never hardcodes a question count (counts come from the API)", () => {
  for (const lang of LANGS) {
    const joined = texts(lang).join("\n");
    // 45 / 85 / 121 / 240 and 180 / 960 translation tallies must not appear as claims.
    assert.doesNotMatch(joined, /\b(?:45|85|121|240|180|960)\b/, `${lang}: hardcoded inventory number`);
    assert.doesNotMatch(joined, /\b\d+\s+(?:original\s+)?(?:questions?|domande|questions|preguntas)\b/i, `${lang}: numeric question claim`);
  }
  assert.doesNotMatch(JSON.stringify(Apple.title), /\d{2,}/);
});

test("Apple landing copy points to the current exam edition and does not present unpublished Apple localisations as available", () => {
  for (const lang of LANGS) {
    const exam = texts(lang).join("\n");
    assert.match(exam, /iOS 27/, `${lang}: current edition missing`);
    assert.match(exam, /iPadOS 27/, `${lang}: current edition missing`);
    assert.match(exam, /macOS 27/, `${lang}: current edition missing`);
    // iOS 26 / Tahoe may only appear as the PREVIOUS edition, in the sentence about how our questions were written.
    const paragraph = (Apple.extraContent?.guideSections?.[lang] ?? []).find(s => /iOS 27/.test(s.paragraphs.join(" ")))!;
    assert(paragraph, `${lang}: exam paragraph missing`);
    for (const m of exam.matchAll(/iOS 26|Tahoe/g)) {
      const context = exam.slice(Math.max(0, m.index! - 80), m.index!);
      assert.match(context, /\((?:[^)]*)$|precedent|précédente|anterior|previous/i, `${lang}: iOS 26/Tahoe not framed as previous edition`);
    }
    // The localisations are only ANNOUNCED for 28 January 2027.
    assert.match(exam, /28 (?:January|gennaio|janvier|de enero de) 2027|28 January 2027/, `${lang}: announced date missing`);
    assert.match(exam, /annunciato|announced|annoncé|anunciado/i, `${lang}: must say "announced"`);
    assert.doesNotMatch(exam, /(?:già|déjà|ya|already)\s+(?:disponibil|disponible|available)/i, `${lang}: localisation claimed as available`);
  }
});

test("Apple landing copy keeps the official names, no exam code and the independence statement", () => {
  for (const lang of LANGS) {
    const exam = texts(lang).join("\n");
    assert.match(exam, /Apple Device Support Exam|Apple Device Support/);
    assert.match(exam, /Apple Certified Support Professional/);
    assert.doesNotMatch(exam, /9L0-3023/);
    assert.match(exam, /dump/i);
  }
  assert.equal(Apple.examBlueprint?.lastVerifiedAt, "2026-11-15");
  assert.match(Apple.examBlueprint?.officialSourceUrl ?? "", /^https:\/\/it-training\.apple\.com\/support\/tutorials\/course\/sup020\/$/);
});

test("Apple registry descriptions stay free of obsolete counts and of the old first-package wording with numbers", () => {
  for (const lang of LANGS) {
    const d = Apple.description![lang]!;
    assert(d.length >= 150 && d.length <= 400, `${lang}: description length ${d.length}`);
    assert.doesNotMatch(d, /\b\d{2,3}\b/);
  }
});
