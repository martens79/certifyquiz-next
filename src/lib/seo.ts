import type { Metadata } from "next";

// 🔧 Normalizza la base (senza slash finale)
const RAW_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE = RAW_SITE.replace(/\/+$/, "");

// Lingue gestite
export type Lang = "it" | "es" | "en" | "fr";

// Mappa lingua → locale completo
const OG_LOCALE: Record<Lang, string> = {
  it: "it-IT",
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
};

// ✅ Costruisce un URL canonico assoluto
export function canonicalUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return new URL(clean, SITE).toString();
}

// ✅ Funzione principale: crea i metadata SEO per una pagina
export function buildMeta(opts: {
  title?: string;
  description?: string;
  path?: string; // es. "/it/certificazioni"
  lang?: Lang;   // lingua corrente
  alternates?: Partial<Record<Lang | "x-default", string>>; // hreflang
  images?: string[]; // og:image
  noindex?: boolean;
} = {}): Metadata {
  const title = opts.title ?? "CertifyQuiz — Quiz per certificazioni IT";

  const description =
    opts.description ??
    "Allenati con quiz reali e spiegazioni premium per CompTIA, Cisco, AWS, Azure, Google Cloud e altre certificazioni.";

  const url = opts.path ? canonicalUrl(opts.path) : SITE;

  // --- alternates (hreflang + canonical) ---
  let alternates: Metadata["alternates"] | undefined = undefined;

  if (opts.alternates && Object.keys(opts.alternates).length > 0) {
    const langs: Record<string, string> = {};

    for (const [k, v] of Object.entries(opts.alternates)) {
      if (!v) continue;

      // 🔧 Mappa chiavi brevi a locale completo
      const hreflang =
        k === "it" ? "it-IT" :
        k === "en" ? "en-US" :
        k === "fr" ? "fr-FR" :
        k === "es" ? "es-ES" :
        k; // x-default o altro invariato

      langs[hreflang] = canonicalUrl(v);
    }

    // Aggiunge x-default se manca
    if (!langs["x-default"]) langs["x-default"] = url;

    alternates = { languages: langs, canonical: url };
  }

  // --- immagini OG/Twitter ---
  const images = (opts.images ?? ["/og/cert-default.png"]).map((img) =>
    img.startsWith("http") ? img : canonicalUrl(img)
  );

  // --- locale OG corretto ---
  const ogLocale = opts.lang ? OG_LOCALE[opts.lang] : OG_LOCALE.it;

  // --- metadata finale ---
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates, // undefined se non passato
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images,
      siteName: "CertifyQuiz",
      locale: ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
  };
}
