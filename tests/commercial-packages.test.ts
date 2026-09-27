import assert from "node:assert/strict";
import test from "node:test";
import {
  accessValidityLabel,
  activeUntilLabel,
  packageDisplayName,
  packageFeatures,
  packageKind,
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

test("Complete elenca Mock Review/lab/scenari solo se esistono; Study mai", () => {
  const counts = { questionCount: 1358, labCount: 8, scenarioCount: 0, guidePages: 120, mapPages: 0 };
  const complete = packageFeatures("octopus-complete", counts, "en");
  assert.ok(complete.some((f) => f.startsWith("Complete question bank: 1,358")));
  assert.ok(complete.includes("Mock Review: question-by-question feedback"));
  assert.ok(complete.includes("8 Interactive Labs"));
  assert.ok(!complete.some((f) => /scenario/i.test(f)), "nessuno scenario se il conteggio e' 0");
  assert.ok(!complete.some((f) => /Concept maps/.test(f)));

  const study = packageFeatures("dolphin-study", counts, "en");
  for (const locked of [/Mock Review/, /explanations/i, /Labs/, /Mistake/]) {
    assert.ok(!study.some((f) => locked.test(f)), String(locked));
  }
});
