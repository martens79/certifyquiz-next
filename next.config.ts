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
  // trailingSlash: false,

  async redirects() {
    return [
      // 0) non-www → www (hardening)
      {
        source: "/:path*",
        has: [{ type: "host", value: "certifyquiz.com" }],
        destination: "https://www.certifyquiz.com/:path*",
        permanent: true,
      },

      // 1) root → /it (x-default fallback)
      { source: "/", destination: "/it", permanent: true },

      // 2) legacy senza lingua → nuove rotte localizzate
      // liste
      { source: "/certificazioni", destination: "/it/certificazioni", permanent: true },
      { source: "/certifications", destination: "/en/certifications", permanent: true },
      { source: "/certificaciones", destination: "/es/certificaciones", permanent: true },
      // detail
      { source: "/certificazioni/:slug", destination: "/it/certificazioni/:slug", permanent: true },
      { source: "/certifications/:slug", destination: "/en/certifications/:slug", permanent: true },
      { source: "/certificaciones/:slug", destination: "/es/certificaciones/:slug", permanent: true },

      // 3) vecchie rotte IT non localizzate (ulteriore hardening)
      { source: "/it/certifications", destination: "/it/certificazioni", permanent: true },
      { source: "/it/certifications/:slug", destination: "/it/certificazioni/:slug", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // Liste (URL pubblici “belli” → route fisica)
      { source: "/it/certifications", destination: "/it/certificazioni" },
      { source: "/en/certifications", destination: "/en/certificazioni" },
      { source: "/fr/certifications", destination: "/fr/certificazioni" },
      { source: "/es/certificaciones", destination: "/es/certificazioni" },

      // Detail
      { source: "/it/certifications/:slug", destination: "/it/certificazioni/:slug" },
      { source: "/en/certifications/:slug", destination: "/en/certificazioni/:slug" },
      { source: "/fr/certifications/:slug", destination: "/fr/certificazioni/:slug" },
      { source: "/es/certificaciones/:slug", destination: "/es/certificazioni/:slug" },
    ];
  },
};

export default nextConfig;
