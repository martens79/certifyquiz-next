import assert from "node:assert/strict";
import test from "node:test";
import {
  accessValidityLabel,
  activeUntilLabel,
  packageDisplayName,
  packageFeatures,
  packageKind,
  packageTagline,
} from "../src/lib/commercial-packages.ts";

test("i product_code interni non compaiono mai nel nome commerciale", () => {
  assert.equal(packageDisplayName("octopus-complete", "CCNA", "en"), "CCNA Complete");
  assert.equal(packageDisplayName("dolphin-study", "CCNA", "it"), "CCNA Study");
  assert.equal(packageDisplayName("octopus-complete", null, "fr"), "Complete Pass");
  for (const lang of ["it", "en", "fr", "es"] as const) {
    for (const code of ["octopus-complete", "dolphin-study"]) {
      const name = packageDisplayName(code, "CCNA", lang);
      assert.doesNotMatch(name, /octopus|dolphin/i, `${code}/${lang}`);
    }
  }
  assert.equal(packageKind("something-else"), "unknown");
});

test("la durata viene dall'offerta: giorni se presenti, altrimenti senza scadenza", () => {
  assert.equal(accessValidityLabel(90, "en"), "Access valid for 90 days");
  assert.equal(accessValidityLabel(90, "it"), "Accesso valido 90 giorni");
  assert.match(accessValidityLabel(null, "en"), /No-expiry/);
  assert.match(accessValidityLabel(0, "es"), /sin caducidad/);
});

test("activeUntilLabel formatta la scadenza e ignora valori non validi", () => {
  assert.match(activeUntilLabel("2026-12-26T10:00:00.000Z", "en") ?? "", /^Active until 26 December 2026$/);
  assert.equal(activeUntilLabel(null, "en"), null);
  assert.equal(activeUntilLabel("not-a-date", "it"), null);
});

test("Complete elenca Mock Review/lab/scenari solo se esistono; Study non li elenca mai", () => {
  const counts = { questionCount: 1358, labCount: 8, scenarioCount: 0, guidePages: 120, mapPages: 0 };
  const complete = packageFeatures("octopus-complete", counts, "en");
  assert.ok(complete.some((f) => f.startsWith("Complete question bank: 1,358")));
  assert.ok(complete.includes("Mock Review: question-by-question feedback"));
  assert.ok(complete.includes("8 Interactive Labs"));
  assert.ok(!complete.some((f) => /scenario/i.test(f)), "nessuno scenario se il conteggio e' 0");
  assert.ok(!complete.some((f) => /Concept maps/.test(f)));

  const study = packageFeatures("dolphin-study", counts, "en");
  for (const locked of [/Mock Review/, /Labs/, /Mistake/, /Exam simulations/]) {
    assert.ok(!study.some((f) => locked.test(f)), String(locked));
  }
});

// Decisione product owner 13/10/2026: Dolphin/Study include le spiegazioni
// illimitate sulla certificazione acquistata (la rimozione del 23/09 era una
// regressione). Il copy deve dirlo in tutte le lingue.
test("Study elenca le spiegazioni complete in tutte le lingue, come Complete", () => {
  const counts = { questionCount: 619, labCount: 9, scenarioCount: 0, guidePages: 18, mapPages: 8 };
  const expected = {
    it: "Spiegazioni complete senza limiti",
    en: "Unlimited full explanations",
    fr: "Explications complètes illimitées",
    es: "Explicaciones completas ilimitadas",
  } as const;
  for (const lang of ["it", "en", "fr", "es"] as const) {
    const study = packageFeatures("dolphin-study", counts, lang);
    const complete = packageFeatures("octopus-complete", counts, lang);
    assert.ok(study.includes(expected[lang]), `study/${lang}`);
    assert.ok(complete.includes(expected[lang]), `complete/${lang}`);
    // le spiegazioni vengono subito dopo la banca domande
    assert.equal(study[1], expected[lang], `study/${lang}: posizione`);
  }
  // un prodotto sconosciuto non promette spiegazioni
  assert.ok(!packageFeatures("something-else", counts, "en").includes(expected.en));
});

test("la tagline di Study cita le spiegazioni; non cita lab, simulazioni o Mock Review", () => {
  for (const lang of ["it", "en", "fr", "es"] as const) {
    const tagline = packageTagline("dolphin-study", lang);
    assert.match(tagline, /spiegazion|explanation|explication|explicaci/i, lang);
    assert.doesNotMatch(tagline, /lab|simulaz|simulat|mock/i, lang);
  }
});
