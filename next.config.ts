// next.config.ts
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  outputFileTracingRoot: path.resolve(__dirname),
  turbopack: { root: __dirname },
  // non serve pageExtensions mdx, perché NON importiamo mdx come moduli
  // sperimentalmente puoi tenere mdxRs spento (qui inutile)
  experimental: {},
};

export default nextConfig;
