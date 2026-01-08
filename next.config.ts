// next.config.ts
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  outputFileTracingRoot: path.resolve(__dirname),

  async redirects() {
    return [
      // =========================
      // HARDENING DOMAIN
      // =========================
      {
        source: "/:path*",
        has: [{ type: "host", value: "certifyquiz.com" }],
        destination: "https://www.certifyquiz.com/:path*",
        permanent: true,
      },

      // =========================
      // LEGACY / WRONG EN LINKS
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
      // IT / ES legacy
      // =========================
      {
        source: "/certificazioni",
        destination: "/it/certificazioni",
        permanent: true,
      },
      {
        source: "/certificazioni/:slug",
        destination: "/it/certificazioni/:slug",
        permanent: true,
      },
      {
        source: "/certificaciones",
        destination: "/es/certificazioni",
        permanent: true,
      },
      {
        source: "/certificaciones/:slug",
        destination: "/es/certificazioni/:slug",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      // =========================
      // EN ROOT → route fisica
      // =========================
      {
        source: "/certifications",
        destination: "/en/certificazioni",
      },
      {
        source: "/certifications/:slug",
        destination: "/en/certificazioni/:slug",
      },
      {
        source: "/categories",
        destination: "/en/categorie",
      },
      {
        source: "/categories/:cat",
        destination: "/en/categorie/:cat",
      },

      // =========================
      // QUIZ EN ROOT
      // =========================
      {
        source: "/quiz/:slug",
        destination: "/en/quiz/:slug",
      },
      {
        source: "/quiz/:slug/mixed",
        destination: "/en/quiz/:slug/mixed",
      },
      {
        source: "/quiz/topic/:topicId",
        destination: "/en/quiz/topic/:topicId",
      },
    ];
  },
};

export default nextConfig;
