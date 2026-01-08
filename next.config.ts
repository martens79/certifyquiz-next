// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // EN SEO pages: niente /en davanti
      { source: "/en/certifications", destination: "/certifications", permanent: true },
      { source: "/en/certifications/:path*", destination: "/certifications/:path*", permanent: true },

      { source: "/en/categories", destination: "/categories", permanent: true },
      { source: "/en/categories/:path*", destination: "/categories/:path*", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // ---- CERTIFICATIONS localized segments -> internal /[lang]/certificazioni ----
      { source: "/fr/certifications", destination: "/fr/certificazioni" },
      { source: "/fr/certifications/:slug", destination: "/fr/certificazioni/:slug" },

      { source: "/es/certificaciones", destination: "/es/certificazioni" },
      { source: "/es/certificaciones/:slug", destination: "/es/certificazioni/:slug" },

      // (IT già “giusto” perché usi /it/certificazioni)
      // { source: "/it/certificazioni/:path*", destination: "/it/certificazioni/:path*" }, // non serve

      // ---- CATEGORIES localized segments -> internal /[lang]/categorie ----
      { source: "/fr/categories", destination: "/fr/categorie" },
      { source: "/fr/categories/:slug", destination: "/fr/categorie/:slug" },

      { source: "/es/categorias", destination: "/es/categorie" },
      { source: "/es/categorias/:slug", destination: "/es/categorie/:slug" },
    ];
  },
};

export default nextConfig;
