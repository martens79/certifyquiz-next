import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";
import test from "node:test";
import CCST from "../src/certifications/data/CiscoCCSTSecurity.ts";

// Exercise the real route metadata functions; isolate only backend I/O and
// the page view (whose rendering is unrelated to generateMetadata).
const requireFromRoot = Module.createRequire(path.resolve(process.cwd(), "package.json"));
function stub(relativePath: string, exports: object) {
  const filename = path.resolve(process.cwd(), relativePath);
  requireFromRoot.cache[filename] = {
    id: filename, filename, loaded: true, exports,
  } as NodeJS.Module;
}

const slug = "cisco-ccst-cybersecurity";
const inventory = { it: 619, en: 619, fr: 619, es: 619 };
let backendUnavailable = false;
stub("src/lib/server/certs.ts", {
  getCertificationDetailResult: async () => backendUnavailable
    ? { kind: "error", reason: "network" }
    : { kind: "ok", data: {
      slug, name_en: "Cisco CCST Cybersecurity", questionCountByLang: inventory,
      description_en: "Older backend description: threats and malware.",
    } },
});
stub("src/lib/data.ts", {
  getCertBySlug: async () => ({ questionCountByLang: inventory }),
});
stub("src/app/_views/CertificationDetailView.tsx", { CertificationDetailView: () => null });

const canonicalPaths = {
  en: "/certifications/cisco-ccst-cybersecurity",
  it: "/it/certificazioni/cisco-ccst-cybersecurity",
  fr: "/fr/certifications/cisco-ccst-cybersecurity",
  es: "/es/certificaciones/cisco-ccst-cybersecurity",
};

test("English route emits the registry description in HTML, Open Graph and Twitter metadata", async () => {
  const { generateMetadata } = await import("../src/app/certifications/[slug]/page.tsx");
  const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
  assert.equal(metadata.description, CCST.metaDescription.en);
  assert.match(metadata.description!, /100-160/);
  assert.match(metadata.description!, /endpoints/);
  assert.equal(metadata.openGraph?.description, metadata.description);
  assert.equal(metadata.twitter?.description, metadata.description);
  assert.equal(metadata.alternates?.canonical, `https://www.certifyquiz.com${canonicalPaths.en}`);
});

test("English legacy alias emits the same description and canonical URL", async () => {
  const { generateMetadata } = await import("../src/app/certifications/[slug]/page.tsx");
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: "cisco-ccst-security" }) });
  assert.equal(metadata.description, CCST.metaDescription.en);
  assert.equal(metadata.alternates?.canonical, `https://www.certifyquiz.com${canonicalPaths.en}`);
});

test("English metadata retains the registry description when the backend is unavailable", async () => {
  const { generateMetadata } = await import("../src/app/certifications/[slug]/page.tsx");
  backendUnavailable = true;
  try {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
    assert.equal(metadata.description, CCST.metaDescription.en);
    assert.notDeepEqual(metadata.robots, { index: false, follow: true });
  } finally {
    backendUnavailable = false;
  }
});

for (const lang of ["it", "fr", "es"] as const) {
  test(`${lang}: localized route retains its description, canonical and language cluster`, async () => {
    const metadata = lang === "it"
      ? await (await import("../src/app/[lang]/certificazioni/[slug]/page.tsx")).generateMetadata({
        params: Promise.resolve({ lang, slug }),
      })
      : lang === "fr"
        ? await (await import("../src/app/fr/certifications/[slug]/page.tsx")).generateMetadata({
          params: Promise.resolve({ slug }),
        })
        : await (await import("../src/app/es/certificaciones/[slug]/page.tsx")).generateMetadata({
          params: Promise.resolve({ slug }),
        });
    assert.equal(metadata.description, CCST.metaDescription[lang]);
    assert.equal(metadata.openGraph?.description, metadata.description);
    assert.equal(metadata.title, CCST.metaTitle[lang]);
    assert.equal(metadata.alternates?.canonical, `https://www.certifyquiz.com${canonicalPaths[lang]}`);
    assert.deepEqual(metadata.robots, { index: true, follow: true });
    assert.deepEqual(metadata.alternates?.languages, {
      "it-IT": `https://www.certifyquiz.com${canonicalPaths.it}`,
      "en-US": `https://www.certifyquiz.com${canonicalPaths.en}`,
      "fr-FR": `https://www.certifyquiz.com${canonicalPaths.fr}`,
      "es-ES": `https://www.certifyquiz.com${canonicalPaths.es}`,
      "x-default": `https://www.certifyquiz.com${canonicalPaths.en}`,
    });
  });
}
