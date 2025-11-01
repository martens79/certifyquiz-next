// next.config.ts
import type { NextConfig } from "next";
import path from "node:path";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // usa il provider ufficiale MDX (serve @mdx-js/react)
    providerImportSource: "@mdx-js/react",
    // remarkPlugins: [], // opzionale
    // rehypePlugins: [], // opzionale
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  outputFileTracingRoot: path.resolve(__dirname),
  turbopack: { root: __dirname },
  pageExtensions: ["tsx", "ts", "jsx", "js", "mdx"],

  // (opzionale) redirect dai vecchi URL non localizzati
  // async redirects() {
  //   return [
  //     { source: "/privacy",  destination: "/it/privacy",  permanent: true },
  //     { source: "/termini",  destination: "/it/termini",  permanent: true },
  //     { source: "/cookie",   destination: "/it/cookie",   permanent: true },
  //     { source: "/contatti", destination: "/it/contatti", permanent: true },
  //   ];
  // },
};

export default withMDX(nextConfig);
