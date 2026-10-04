import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { normalizeDbSlug } from "../src/lib/cert-db-slug";
import { stripDuplicateIntro } from "../src/lib/topic-intro";
import type { CertificationResources } from "../src/lib/data";

// Il progetto compila il JSX con il runtime automatico di Next; sotto tsx serve React in scope.
(globalThis as { React?: typeof React }).React = React;
// TrackedResourceLink e' un client component che richiede router e AuthProvider:
// per il solo markup della griglia lo sostituiamo con un <a> equivalente.
const loadGrid = async () => {
  const trackedPath = path.resolve(__dirname, "../src/components/certification/TrackedResourceLink.tsx");
  require.cache[trackedPath] = {
    id: trackedPath,
    filename: trackedPath,
    loaded: true,
    exports: {
      __esModule: true,
      default: ({ href, className, children }: { href: string; className: string; children: React.ReactNode }) =>
        createElement("a", { href, className }, children),
    },
  } as unknown as NodeModule;
  return (await import("../src/components/certification/StudyMaterialGrid")).default;
};

const resources = (scenarios: number): CertificationResources => ({
  certificationId: 1,
  certificationName: "Test",
  quiz: { questionCount: 150, topicCount: 5 },
  reviews: { count: 0 },
  scenarios: { count: scenarios },
  labs: { count: 0 },
  guide: { available: false, slug: null, pageCount: null },
  maps: { available: false, slug: null, mapCount: null, pageCount: null },
} as unknown as CertificationResources);

const render = async (lang: "it" | "en" | "fr" | "es", scenarios: number) => {
  const StudyMaterialGrid = await loadGrid();
  return renderToStaticMarkup(
    createElement(StudyMaterialGrid, {
      lang,
      resources: resources(scenarios),
      certificationSlug: "test",
      quizHref: "/quiz/test",
      reviewsHref: "/reviews",
      scenariosHref: "/scenarios/test",
      guideHref: null,
      mapsHref: "/maps",
      labsHref: "/labs",
    })
  );
};

test("scenarios card is absent when a certification has no scenarios", async () => {
  for (const lang of ["it", "en", "fr", "es"] as const) {
    const html = await render(lang, 0);
    assert.doesNotMatch(html, /Coming soon|In arrivo|Bientôt|Próximamente/);
    assert.doesNotMatch(html, /\/scenarios\/test/);
    assert.match(html, /\/quiz\/test/);
  }
});

test("scenarios card is still rendered with its count when scenarios exist", async () => {
  const html = await render("en", 12);
  assert.match(html, /\/scenarios\/test/);
  assert.match(html, /12 scenarios/);
});

test("backend slugs: python keeps its DB slug, csharp maps to microsoft-csharp", () => {
  assert.equal(normalizeDbSlug("python-developer"), "python-developer");
  assert.equal(normalizeDbSlug("csharp"), "microsoft-csharp");
  assert.equal(normalizeDbSlug("microsoft-csharp"), "microsoft-csharp");
  assert.equal(normalizeDbSlug("tensorflow"), "google-tensorflow");
  assert.equal(normalizeDbSlug("ccna"), "ccna");
});

test("duplicate intro paragraph is removed only when it is identical", () => {
  const intro = "Apple Device Support develops help desk skills.  It is an independent study aid.";
  const content = `## Key concepts\n\nApple Device Support develops help desk skills. It is an independent study aid.\n\n- **A** — one\n\n## Next\n\nBody`;
  assert.equal(
    stripDuplicateIntro(content, intro),
    "## Key concepts\n\n- **A** — one\n\n## Next\n\nBody"
  );
  const different = `## Key concepts\n\nA different opening paragraph.\n\n- **A** — one`;
  assert.equal(stripDuplicateIntro(different, intro), different);
  assert.equal(stripDuplicateIntro(content, null), content);
  assert.equal(stripDuplicateIntro(content, ""), content);
});
