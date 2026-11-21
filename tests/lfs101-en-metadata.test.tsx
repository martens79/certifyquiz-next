import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";
import test from "node:test";
import LFS101 from "../src/certifications/data/lfs101.ts";

// Exercise the real EN route metadata function; isolate only backend I/O and
// the page view (whose rendering is unrelated to generateMetadata).
const requireFromRoot = Module.createRequire(path.resolve(process.cwd(), "package.json"));
function stub(relativePath: string, exports: object) {
  const filename = path.resolve(process.cwd(), relativePath);
  requireFromRoot.cache[filename] = {
    id: filename, filename, loaded: true, exports,
  } as NodeJS.Module;
}

const inventory = { it: 356, en: 356, fr: 356, es: 356 };
const backendCopy: Record<string, { name_en: string; description_en: string }> = {
  lfs101: {
    name_en: "LFS101: Introduction to Linux",
    description_en: "Free introductory Linux Foundation course covering core concepts (backend copy).",
  },
  pmp: {
    name_en: "PMP – Project Management Professional",
    description_en: "International certification focused on project management (backend copy).",
  },
};
let backendUnavailable = false;
stub("src/lib/server/certs.ts", {
  getCertificationDetailResult: async (slug: string) => backendUnavailable
    ? { kind: "error", reason: "network" }
    : { kind: "ok", data: { slug, questionCountByLang: inventory, ...backendCopy[slug] } },
});
stub("src/lib/data.ts", {
  getCertBySlug: async () => ({ questionCountByLang: inventory }),
});
stub("src/app/_views/CertificationDetailView.tsx", { CertificationDetailView: () => null });

const SITE = "https://www.certifyquiz.com";

test("LFS101 registry copy keeps SERP-friendly lengths", () => {
  assert.equal(LFS101.metaTitle?.en, "LFS101 Introduction to Linux: syllabus, study plan, practice");
  assert.ok(LFS101.metaTitle!.en.length <= 60, `title is ${LFS101.metaTitle!.en.length} chars`);
  const description = LFS101.metaDescription!.en;
  assert.ok(description.length >= 100 && description.length <= 160, `description is ${description.length} chars`);
});

test("EN route emits the registry title and description in HTML, Open Graph and Twitter metadata", async () => {
  const { generateMetadata } = await import("../src/app/certifications/[slug]/page.tsx");
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: "lfs101" }) });
  assert.equal(metadata.title, LFS101.metaTitle!.en);
  assert.equal(metadata.description, LFS101.metaDescription!.en);
  assert.equal(metadata.openGraph?.title, metadata.title);
  assert.equal(metadata.openGraph?.description, metadata.description);
  assert.equal(metadata.twitter?.title, metadata.title);
  assert.equal(metadata.twitter?.description, metadata.description);
  // The old generic fallback must be gone.
  assert.doesNotMatch(String(metadata.title), /practice exam and quiz preparation/);
  assert.doesNotMatch(String(metadata.description), /backend copy/);
});

test("EN route keeps canonical, hreflang cluster and indexability unchanged", async () => {
  const { generateMetadata } = await import("../src/app/certifications/[slug]/page.tsx");
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: "lfs101" }) });
  assert.equal(metadata.alternates?.canonical, `${SITE}/certifications/lfs101`);
  assert.deepEqual(metadata.alternates?.languages, {
    "it-IT": `${SITE}/it/certificazioni/lfs101`,
    "en-US": `${SITE}/certifications/lfs101`,
    "fr-FR": `${SITE}/fr/certifications/lfs101`,
    "es-ES": `${SITE}/es/certificaciones/lfs101`,
    "x-default": `${SITE}/certifications/lfs101`,
  });
  assert.equal(metadata.robots, undefined);
});

test("EN metadata keeps the registry copy when the backend is unavailable", async () => {
  const { generateMetadata } = await import("../src/app/certifications/[slug]/page.tsx");
  backendUnavailable = true;
  try {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "lfs101" }) });
    assert.equal(metadata.title, LFS101.metaTitle!.en);
    assert.equal(metadata.description, LFS101.metaDescription!.en);
    assert.notDeepEqual(metadata.robots, { index: false, follow: true });
  } finally {
    backendUnavailable = false;
  }
});

test("scope guard: a certification without an EN override keeps the generic fallback", async () => {
  const { generateMetadata } = await import("../src/app/certifications/[slug]/page.tsx");
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: "pmp" }) });
  assert.equal(
    metadata.title,
    "PMP – Project Management Professional: practice exam and quiz preparation | CertifyQuiz",
  );
  assert.equal(metadata.description, backendCopy.pmp.description_en);
});
