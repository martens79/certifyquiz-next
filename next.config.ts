// next.config.ts
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  outputFileTracingRoot: path.resolve(__dirname),
  turbopack: { root: __dirname },
  experimental: {},

  async redirects() {
    return [
      // 0) non-www → www (hardening)
      {
        source: "/:path*",
        has: [{ type: "host", value: "certifyquiz.com" }],
        destination: "https://www.certifyquiz.com/:path*",
        permanent: true,
      },

      // ✅ NIENTE redirect "/" → "/it"
      // (root = EN globale)

      // 1) legacy senza lingua → nuove rotte localizzate
      // liste
      {
        source: "/certificazioni",
        destination: "/it/certificazioni",
        permanent: true,
      },
      {
        source: "/certificaciones",
        destination: "/es/certificaciones",
        permanent: true,
      },

      // detail
      {
        source: "/certificazioni/:slug",
        destination: "/it/certificazioni/:slug",
        permanent: true,
      },
      {
        source: "/certificaciones/:slug",
        destination: "/es/certificaciones/:slug",
        permanent: true,
      },
    ];
  },

  /**
   * Rewrites = alias senza cambiare URL.
   * Li mettiamo in beforeFiles così vincono rispetto al file-system routing.
   */
  async rewrites() {
    return {
      beforeFiles: [
        // =========================================================
        // EN (prefissato) "pretty" → route fisica ITA
        // =========================================================
        // /en/certifications/... → /en/certificazioni/...
        { source: "/en/certifications", destination: "/en/certificazioni" },
        {
          source: "/en/certifications/:slug",
          destination: "/en/certificazioni/:slug",
        },

        // /en/categories/... → /en/categorie/...
        { source: "/en/categories", destination: "/en/categorie" },
        { source: "/en/categories/:cat", destination: "/en/categorie/:cat" },

        // =========================================================
        // EN ROOT (no /en) → route fisica /en/...
        // =========================================================
        { source: "/certifications", destination: "/en/certificazioni" },
        {
          source: "/certifications/:slug",
          destination: "/en/certificazioni/:slug",
        },

        { source: "/categories", destination: "/en/categorie" },
        { source: "/categories/:cat", destination: "/en/categorie/:cat" },

        // quiz EN-root (senza /en) → route fisica /en/...
        { source: "/quiz/:slug/mixed", destination: "/en/quiz/:slug/mixed" },
        { source: "/quiz/:slug", destination: "/en/quiz/:slug" },
        { source: "/quiz/topic/:topicId", destination: "/en/quiz/topic/:topicId" },

        // =========================================================
        // FR "pretty" → route fisica ITA
        // =========================================================
        { source: "/fr/certifications", destination: "/fr/certificazioni" },
        {
          source: "/fr/certifications/:slug",
          destination: "/fr/certificazioni/:slug",
        },
        { source: "/fr/categories", destination: "/fr/categorie" },
        { source: "/fr/categories/:cat", destination: "/fr/categorie/:cat" },

        // =========================================================
        // ES "pretty" → route fisica ITA
        // =========================================================
        // (già usi /es/certificaciones pubblicamente)
        { source: "/es/certificaciones", destination: "/es/certificazioni" },
        {
          source: "/es/certificaciones/:slug",
          destination: "/es/certificazioni/:slug",
        },

        // alias spagnolo "categorias" → cartella fisica "categorie"
        { source: "/es/categorias", destination: "/es/categorie" },
        { source: "/es/categorias/:cat", destination: "/es/categorie/:cat" },

        // =========================================================
        // IT hardening (se arriva /it/certifications)
        // =========================================================
        { source: "/it/certifications", destination: "/it/certificazioni" },
        {
          source: "/it/certifications/:slug",
          destination: "/it/certificazioni/:slug",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
