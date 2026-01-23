// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // ---------------------------------------------------------------------
      // ICDL / ECDL canonicalization (SEO)
      // Obiettivo: EN pubblico senza /en -> /certifications/icdl
      // ---------------------------------------------------------------------
      { source: "/certifications/ecdl", destination: "/certifications/icdl", permanent: true },

      // Varianti vecchie/indicizzate (se esistono)
      { source: "/en/certifications/ecdl", destination: "/certifications/icdl", permanent: true },
      { source: "/en/certificazioni/ecdl", destination: "/certifications/icdl", permanent: true },

      // (Opzionale ma consigliato) FR/ES: slug coerente
      { source: "/fr/certifications/ecdl", destination: "/fr/certifications/icdl", permanent: true },
      { source: "/es/certificaciones/ecdl", destination: "/es/certificaciones/icdl", permanent: true },

      // ---------------------------------------------------------------------
      // EN SEO pages: niente /en davanti (regola generale)
      // ---------------------------------------------------------------------
      { source: "/en/certifications", destination: "/certifications", permanent: true },
      { source: "/en/certifications/:path*", destination: "/certifications/:path*", permanent: true },

      { source: "/en/categories", destination: "/categories", permanent: true },
      { source: "/en/categories/:path*", destination: "/categories/:path*", permanent: true },

            // EN SEO pages: niente /en davanti (regola generale)
      { source: "/en/certifications", destination: "/certifications", permanent: true },
      { source: "/en/certifications/:path*", destination: "/certifications/:path*", permanent: true },

      // ✅ aggiungi anche la variante italiana dentro /en (capita spesso)
      { source: "/en/certificazioni", destination: "/certifications", permanent: true },
      { source: "/en/certificazioni/:path*", destination: "/certifications/:path*", permanent: true },

    ];
  },

  async rewrites() {
    return [
      // ---------------------------------------------------------------------
      // CERTIFICATIONS localized segments -> internal /[lang]/certificazioni
      // (le pagine reali sono sotto /[lang]/certificazioni/*)
      // ---------------------------------------------------------------------
      { source: "/fr/certifications", destination: "/fr/certificazioni" },
      { source: "/fr/certifications/:slug", destination: "/fr/certificazioni/:slug" },

      { source: "/es/certificaciones", destination: "/es/certificazioni" },
      { source: "/es/certificaciones/:slug", destination: "/es/certificazioni/:slug" },

      // (IT già “giusto” perché usi /it/certificazioni)

      // ---------------------------------------------------------------------
      // CATEGORIES localized segments -> internal /[lang]/categorie
      // ---------------------------------------------------------------------
      { source: "/fr/categories", destination: "/fr/categorie" },
      { source: "/fr/categories/:slug", destination: "/fr/categorie/:slug" },

      { source: "/es/categorias", destination: "/es/categorie" },
      { source: "/es/categorias/:slug", destination: "/es/categorie/:slug" },
    ];
  },
};

export default nextConfig;
