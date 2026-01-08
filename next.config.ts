// next.config.ts
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname),

  async redirects() {
    return [
      // 0) non-www → www
      {
        source: "/:path*",
        has: [{ type: "host", value: "certifyquiz.com" }],
        destination: "https://www.certifyquiz.com/:path*",
        permanent: true,
      },

      // 1) QUIZ EN: vecchi link senza /en → metti /en
      // (così i quiz "ufficiali" EN stanno sempre sotto /en/quiz)
      { source: "/quiz/:slug/mixed", destination: "/en/quiz/:slug/mixed", permanent: true },
      { source: "/quiz/:slug", destination: "/en/quiz/:slug", permanent: true },
      { source: "/quiz/topic/:topicId", destination: "/en/quiz/topic/:topicId", permanent: true },

      // 2) Legacy EN pages con /en/... → root (perché EN pages le vuoi senza /en)
      { source: "/en/certifications", destination: "/certifications", permanent: true },
      { source: "/en/certifications/:slug", destination: "/certifications/:slug", permanent: true },
      { source: "/en/categories", destination: "/categories", permanent: true },
      { source: "/en/categories/:cat", destination: "/categories/:cat", permanent: true },

      // 3) Legacy IT/ES senza prefisso → con prefisso
      { source: "/certificazioni", destination: "/it/certificazioni", permanent: true },
      { source: "/certificazioni/:slug", destination: "/it/certificazioni/:slug", permanent: true },
      { source: "/certificaciones", destination: "/es/certificaciones", permanent: true },
      { source: "/certificaciones/:slug", destination: "/es/certificaciones/:slug", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // =========================
      // EN PAGES ROOT (NO /en) → route fisica /en/...
      // =========================

      // certifications
      { source: "/certifications", destination: "/en/certificazioni" },
      { source: "/certifications/:slug", destination: "/en/certificazioni/:slug" },

      // categories
      { source: "/categories", destination: "/en/categorie" },
      { source: "/categories/:cat", destination: "/en/categorie/:cat" },

      // (QUIZ: NIENTE rewrite qui, perché li vuoi con /en visibile)
      // quindi devono essere linkati come /en/quiz/...

      // =========================
      // FR pretty → cartelle fisiche
      // =========================
      { source: "/fr/certifications", destination: "/fr/certificazioni" },
      { source: "/fr/certifications/:slug", destination: "/fr/certificazioni/:slug" },
      { source: "/fr/categories", destination: "/fr/categorie" },
      { source: "/fr/categories/:cat", destination: "/fr/categorie/:cat" },

      // =========================
      // ES pretty → cartelle fisiche
      // =========================
      { source: "/es/certificaciones", destination: "/es/certificazioni" },
      { source: "/es/certificaciones/:slug", destination: "/es/certificazioni/:slug" },
      { source: "/es/categorias", destination: "/es/categorie" },
      { source: "/es/categorias/:cat", destination: "/es/categorie/:cat" },
    ];
  },
};

export default nextConfig;
