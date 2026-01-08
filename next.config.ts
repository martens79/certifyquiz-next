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
      // 0) non-www → www (hardening)
      {
        source: "/:path*",
        has: [{ type: "host", value: "certifyquiz.com" }],
        destination: "https://www.certifyquiz.com/:path*",
        permanent: true,
      },

      // =========================
      // EN legacy with /en/... → EN root pages
      // =========================
      {
        source: "/en/certifications",
        destination: "/certifications",
        permanent: true,
      },
      {
        source: "/en/certifications/:slug",
        destination: "/certifications/:slug",
        permanent: true,
      },
      {
        source: "/en/categories",
        destination: "/categories",
        permanent: true,
      },
      {
        source: "/en/categories/:cat",
        destination: "/categories/:cat",
        permanent: true,
      },

      // =========================
      // OLD EN quiz root (/quiz/...) → new EN quiz (/en/quiz/...)
      // =========================
      {
        source: "/quiz/:slug/mixed",
        destination: "/en/quiz/:slug/mixed",
        permanent: true,
      },
      {
        source: "/quiz/topic/:topicId",
        destination: "/en/quiz/topic/:topicId",
        permanent: true,
      },
      {
        source: "/quiz/:slug",
        destination: "/en/quiz/:slug",
        permanent: true,
      },

      // =========================
      // IT/ES legacy without lang → localized
      // =========================
      { source: "/certificazioni", destination: "/it/certificazioni", permanent: true },
      { source: "/certificazioni/:slug", destination: "/it/certificazioni/:slug", permanent: true },

      { source: "/certificaciones", destination: "/es/certificaciones", permanent: true },
      { source: "/certificaciones/:slug", destination: "/es/certificaciones/:slug", permanent: true },

      // hardening IT old EN-name paths
      { source: "/it/certifications", destination: "/it/certificazioni", permanent: true },
      { source: "/it/certifications/:slug", destination: "/it/certificazioni/:slug", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // =========================
      // EN root pages → physical routes /en/...
      // =========================
      { source: "/certifications", destination: "/en/certificazioni" },
      { source: "/certifications/:slug", destination: "/en/certificazioni/:slug" },

      { source: "/categories", destination: "/en/categorie" },
      { source: "/categories/:cat", destination: "/en/categorie/:cat" },

      // =========================
      // Pretty aliases for other langs (optional hardening)
      // =========================
      { source: "/it/certifications", destination: "/it/certificazioni" },
      { source: "/it/certifications/:slug", destination: "/it/certificazioni/:slug" },

      { source: "/es/certificaciones", destination: "/es/certificazioni" },
      { source: "/es/certificaciones/:slug", destination: "/es/certificazioni/:slug" },
    ];
  },
};

export default nextConfig;
