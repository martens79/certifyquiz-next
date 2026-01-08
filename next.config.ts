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
      // ✅ alias EN “pretty” → route fisica ITA (cartella)
// /en/certifications/... → /en/certificazioni/...
{ source: "/en/certifications", destination: "/en/certificazioni" },
{ source: "/en/certifications/:slug", destination: "/en/certificazioni/:slug" },

// /en/categories/... → /en/categorie/...
{ source: "/en/categories", destination: "/en/categorie" },
{ source: "/en/categories/:cat", destination: "/en/categorie/:cat" },
      // 1) legacy senza lingua → nuove rotte localizzate
      // liste
      { source: "/certificazioni", destination: "/it/certificazioni", permanent: true },
      { source: "/certificaciones", destination: "/es/certificaciones", permanent: true },

      // detail
      { source: "/certificazioni/:slug", destination: "/it/certificazioni/:slug", permanent: true },
      { source: "/certificaciones/:slug", destination: "/es/certificaciones/:slug", permanent: true },

      // 2) hardening: vecchie rotte IT non localizzate
      { source: "/it/certifications", destination: "/it/certificazioni", permanent: true },
      { source: "/it/certifications/:slug", destination: "/it/certificazioni/:slug", permanent: true },

      // 3) hardening: eventuali vecchie rotte EN con prefisso "/en" (se arrivano link vecchi)
      // 👉 le riportiamo al nuovo EN root (senza /en)
      { source: "/en/certifications", destination: "/certifications", permanent: true },
      { source: "/en/certifications/:slug", destination: "/certifications/:slug", permanent: true },
      { source: "/en/privacy", destination: "/privacy", permanent: true },
      { source: "/en/terms", destination: "/terms", permanent: true },
      { source: "/en/cookies", destination: "/cookies", permanent: true },
      { source: "/en/contact", destination: "/contact", permanent: true },
    ];
  },

  async rewrites() {
  return [
    // =========================
    // EN ROOT (pretty) → /en/...
    // =========================

    // ✅ EN root certifications → route fisica /en/certificazioni
    { source: "/certifications", destination: "/en/certificazioni" },
    { source: "/certifications/:slug", destination: "/en/certificazioni/:slug" },

    // ✅ EN root categories → route fisica /en/categorie
    { source: "/categories", destination: "/en/categorie" },
    { source: "/categories/:cat", destination: "/en/categorie/:cat" },

    // ✅ quiz EN-root (senza /en) → route fisica /en/...
    { source: "/quiz/:slug/mixed", destination: "/en/quiz/:slug/mixed" },
    { source: "/quiz/:slug", destination: "/en/quiz/:slug" },
    { source: "/quiz/topic/:topicId", destination: "/en/quiz/topic/:topicId" },

    // =========================
    // PRETTY (prefissati) → route fisica (cartelle IT)
    // =========================

    // FR: /fr/certifications → /fr/certificazioni
    { source: "/fr/certifications", destination: "/fr/certificazioni" },
    { source: "/fr/certifications/:slug", destination: "/fr/certificazioni/:slug" },

    // FR: /fr/categories → /fr/categorie
    { source: "/fr/categories", destination: "/fr/categorie" },
    { source: "/fr/categories/:cat", destination: "/fr/categorie/:cat" },

    // ES: /es/certificaciones → /es/certificazioni (come già avevi)
    { source: "/es/certificaciones", destination: "/es/certificazioni" },
    { source: "/es/certificaciones/:slug", destination: "/es/certificazioni/:slug" },

    // ES: /es/categorias → /es/categorie
    { source: "/es/categorias", destination: "/es/categorie" },
    { source: "/es/categorias/:cat", destination: "/es/categorie/:cat" },

    // IT hardening (se ti serve ancora)
    { source: "/it/certifications", destination: "/it/certificazioni" },
    { source: "/it/certifications/:slug", destination: "/it/certificazioni/:slug" },
  ];
}

};

export default nextConfig;
