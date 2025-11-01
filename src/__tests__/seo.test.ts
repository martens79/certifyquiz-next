import { buildMeta } from "./seo";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");

describe("buildMeta", () => {
  it("aggiunge x-default se alternates presenti e non specificati", () => {
    const meta = buildMeta({
      title: "Test",
      description: "Desc",
      path: "/it/certificazioni",
      lang: "it",
      alternates: {
        it: "/it/certificazioni",
        en: "/en/certifications",
        fr: "/fr/certifications",
        es: "/es/certificaciones",
        // x-default non passato di proposito
      },
    });

    expect(meta.alternates?.languages?.["x-default"]).toBe(`${BASE}/it/certificazioni`);
    expect(meta.alternates?.canonical).toBe(`${BASE}/it/certificazioni`);
  });

  it("normalizza og:image relative in assolute", () => {
    const meta = buildMeta({
      title: "IMG",
      path: "/it/certificazioni",
      images: ["/og/cert-default.png"],
    });
    // @ts-expect-error openGraph typing is fine at runtime
    const img = meta.openGraph?.images?.[0]?.url || meta.openGraph?.images?.[0];
    expect(String(img)).toBe(`${BASE}/og/cert-default.png`);
  });

  it("non crea alternates se non passati", () => {
    const meta = buildMeta({ title: "NoAlt" });
    expect(meta.alternates).toBeUndefined();
  });
});
