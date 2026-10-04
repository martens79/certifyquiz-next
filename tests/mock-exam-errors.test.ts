import assert from "node:assert/strict";
import test from "node:test";

import { getMockExamLoadError } from "../src/lib/mock-exam-errors";

const backendError = {
  detail: { code: "CEH_BLUEPRINT_POOL_TOO_SMALL" },
};

test("CEH blueprint pool error is neutral and localized in IT/EN/FR/ES", () => {
  const messages = (["it", "en", "fr", "es"] as const).map((locale) =>
    getMockExamLoadError(backendError, locale),
  );

  assert.ok(messages.every(Boolean));
  assert.equal(new Set(messages).size, 4);
  for (const message of messages) {
    assert.doesNotMatch(
      message ?? "",
      /blueprint_domain|required[:=]|available[:=]|topic 78|pool too small/i,
    );
  }
});

test("unrelated load errors keep the existing mock-exam fallback", () => {
  assert.equal(getMockExamLoadError(new Error("network"), "en"), null);
});

test("Apple first package unavailability is explained in all four languages", () => {
  for (const lang of ["en", "it", "fr", "es"] as const) {
    const message = getMockExamLoadError({ detail: { code: "MOCK_EXAM_FIRST_PACKAGE_UNAVAILABLE" } }, lang);
    assert.ok(message);
    assert.match(message!, /topic|sujet|tema/);
  }
});
