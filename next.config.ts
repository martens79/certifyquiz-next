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

  async rewrites() {
    return [
      // Liste (URL pubblici “belli” → route fisica)
      { source: "/en/certifications", destination: "/en/certificazioni" },
      { source: "/fr/certifications", destination: "/fr/certificazioni" },
      { source: "/es/certificaciones", destination: "/es/certificazioni" },

      // Detail
      { source: "/en/certifications/:slug", destination: "/en/certificazioni/:slug" },
      { source: "/fr/certifications/:slug", destination: "/fr/certificazioni/:slug" },
      { source: "/es/certificaciones/:slug", destination: "/es/certificazioni/:slug" },
    ];
  },
};

export default nextConfig;
