// next.config.ts
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  outputFileTracingRoot: path.resolve(__dirname),
  turbopack: { root: __dirname },

  async redirects() {
    return [
      // 0) non-www → www
      {
        source: "/:path*",
        has: [{ type: "host", value: "certifyquiz.com" }],
        destination: "https://www.certifyquiz.com/:path*",
        permanent: true,
      },

      // 1) Legacy senza lingua → IT/ES (come avevi)
      { source: "/certificazioni", destination: "/it/certificazioni", permanent: true },
      { source: "/certificazioni/:slug", destination: "/it/certificazioni/:slug", permanent: true },

      { source: "/certificaciones", destination: "/es/certificaciones", permanent: true },
      { source: "/certificaciones/:slug", destination: "/es/certificaciones/:slug", permanent: true },

      // 2) Hardening IT alias
      { source: "/it/certifications", destination: "/it/certificazioni", permanent: true },
      { source: "/it/certifications/:slug", destination: "/it/certificazioni/:slug", permanent: true },

      // 3) ✅ LEGACY EN con /en/* → EN root (senza /en)
      { source: "/en/certifications", destination: "/certifications", permanent: true },
      { source: "/en/certifications/:slug", destination: "/certifications/:slug", permanent: true },

      { source: "/en/categories", destination: "/categories", permanent: true },
      { source: "/en/categories/:cat", destination: "/categories/:cat", permanent: true },

      { source: "/en/quiz/:slug/mixed", destination: "/quiz/:slug/mixed", permanent: true },
      { source: "/en/quiz/:slug", destination: "/quiz/:slug", permanent: true },
      { source: "/en/quiz/topic/:topicId", destination: "/quiz/topic/:topicId", permanent: true },

      { source: "/en/privacy", destination: "/privacy", permanent: true },
      { source: "/en/terms", destination: "/terms", permanent: true },
      { source: "/en/cookies", destination: "/cookies", permanent: true },
      { source: "/en/contact", destination: "/contact", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // =========================
      // EN ROOT (pretty) → route fisica /en/...
      // =========================
      { source: "/certifications", destination: "/en/certificazioni" },
      { source: "/certifications/:slug", destination: "/en/certificazioni/:slug" },

      { source: "/categories", destination: "/en/categorie" },
      { source: "/categories/:cat", destination: "/en/categorie/:cat" },

      { source: "/quiz/:slug/mixed", destination: "/en/quiz/:slug/mixed" },
      { source: "/quiz/:slug", destination: "/en/quiz/:slug" },
      { source: "/quiz/topic/:topicId", destination: "/en/quiz/topic/:topicId" },

      // =========================
      // Alias prefissati (FR/ES) → route fisica (cartelle IT)
      // =========================
      { source: "/fr/certifications", destination: "/fr/certificazioni" },
      { source: "/fr/certifications/:slug", destination: "/fr/certificazioni/:slug" },
      { source: "/fr/categories", destination: "/fr/categorie" },
      { source: "/fr/categories/:cat", destination: "/fr/categorie/:cat" },

      { source: "/es/certificaciones", destination: "/es/certificazioni" },
      { source: "/es/certificaciones/:slug", destination: "/es/certificazioni/:slug" },
      { source: "/es/categorias", destination: "/es/categorie" },
      { source: "/es/categorias/:cat", destination: "/es/categorie/:cat" },
    ];
  },
};

export default nextConfig;
