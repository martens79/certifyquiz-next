import assert from "node:assert/strict";
import test from "node:test";

import ICDL from "../src/certifications/data/ICDL.ts";
import PEKIT from "../src/certifications/data/PEKIT.ts";

// Fonti verificate il 2026-10-26:
// - PEKIT Expert: schema di certificazione rev. 3.0 (novembre 2024) e allegato CSACI al
//   certificato Accredia 02266 Persons (rev. 000, 09/04/2025).
// - ICDL / AICA: pagina "DigComp 2.2 per utente qualificato del computer" e FAQ AICA.
// - GPS 2026/28: O.M. 27/2026 e Allegati A (solo certificazioni Accredia + DigComp 2.2 / DigCompEdu).

const LANGS = ["it", "en", "fr", "es"] as const;

function visibleItalianText(cert: typeof PEKIT | typeof ICDL): string {
  const faq = cert.extraContent.faq.it.map((f) => `${f.q} ${f.a}`).join(" ");
  return [
    cert.metaDescription.it,
    cert.description.it,
    ...cert.extraContent.whyChoose.it,
    ...cert.extraContent.learn.it,
    faq,
  ].join(" ");
}

test("PEKIT and ICDL keep slug, quiz routes, back routes and meta titles unchanged", () => {
  assert.equal(PEKIT.slug, "pekit");
  assert.equal(ICDL.slug, "icdl");
  assert.equal(PEKIT.metaTitle.it, "PEKIT: quiz, simulazioni e preparazione per competenze digitali");
  assert.equal(ICDL.metaTitle.it, "ECDL / ICDL: quiz, simulazioni e preparazione certificazione informatica");
  assert.deepEqual(PEKIT.quizRoute, {
    it: "/it/quiz/pekit",
    en: "/en/quiz/pekit",
    fr: "/fr/quiz/pekit",
    es: "/es/quiz/pekit",
  });
  assert.equal(PEKIT.backRoute.it, "/it/certificazioni");
});

test("PEKIT and ICDL keep every topic slug (URLs of existing topic pages)", () => {
  assert.deepEqual(
    PEKIT.topics.map((topic) => topic.slug.it),
    ["cominciare-le-operazioni", "esplorare-e-risolvere", "imparare-e-lavorare", "vivere-in-connessione"]
  );
  assert.deepEqual(
    ICDL.topics.map((topic) => (topic as { slug: { it: string } }).slug.it),
    [
      "concetti-di-base-dellict",
      "uso-del-computer-e-gestione-dei-file",
      "elaborazione-testi",
      "foglio-elettronico",
      "uso-delle-basi-di-dati",
      "navigazione-e-comunicazione",
      "strumenti-di-presentazione",
    ]
  );
});

test("PEKIT and ICDL Italian copy no longer promises ATA, GPS or concorsi validity", () => {
  for (const cert of [PEKIT, ICDL]) {
    const text = visibleItalianText(cert);
    assert.doesNotMatch(text, /molto cercata/i);
    assert.doesNotMatch(text, /utile per (studenti, )?(lavoratori, )?docenti, personale ATA/i);
    assert.doesNotMatch(text, /prepararsi a concorsi pubblici/i);
    assert.doesNotMatch(text, /riconosciute a livello internazionale/i);
    assert.doesNotMatch(text, /Sì, (PEKIT|è spesso)/);
    assert.match(text, /bando/i);
  }
});

test("PEKIT states what the official scheme says and the real coverage limits", () => {
  const text = visibleItalianText(PEKIT);
  assert.match(text, /4 esami da 36 domande/);
  assert.match(text, /70%/);
  assert.match(text, /9 aprile 2025/);
  assert.match(text, /DigComp 2\.2/);
  assert.match(text, /poco o per nulla coperti/);
  for (const phase of ["Cominciare le operazioni", "Vivere in connessione", "Esperienza multimediale", "Diventare esperti"]) {
    assert.ok(text.includes(phase), `FAQ must name the official phase ${phase}`);
  }
});

test("PEKIT official references point to the Expert page, the scheme PDF and certificate verification", () => {
  for (const lang of LANGS) {
    const urls = PEKIT.extraContent.examReference[lang].map((ref) => ref.url);
    assert.deepEqual(urls, [
      "https://www.pekitproject.it/studenti/certificazione-pekit-expert/",
      "https://www.pekitproject.it/wordpress/wp-content/uploads/2025/06/Schema-cert.-Pekit-Expert-rev_3-Novembre-2024.pdf",
      "https://www.pekitproject.it/verifica-certificazioni/",
    ]);
  }
});

test("ICDL says that the CIAD is the AICA DigComp 2.2 certification, not ICDL Full Standard alone", () => {
  const text = visibleItalianText(ICDL);
  assert.match(text, /DigComp 2\.2 per utente qualificato di computer/);
  assert.match(text, /test di conformità/);
  assert.match(text, /Accredia/);
  assert.match(text, /non è presentata da AICA come CIAD/);
  const urls = ICDL.extraContent.examReference.it.map((ref) => ref.url);
  assert.ok(urls.includes("https://www.aicanet.it/digcomp2-2-per-utente-qualificato-del-computer"));
});
