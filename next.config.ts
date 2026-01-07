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
      // ✅ Alias pubblici “belli” → route fisica (se la tua route fisica è /[lang]/certificazioni)
      // IT: /it/certifications → /it/certificazioni
      { source: "/it/certifications", destination: "/it/certificazioni" },
      { source: "/it/certifications/:slug", destination: "/it/certificazioni/:slug" },

      // ES: /es/certificaciones → /es/certificazioni (route fisica unica)
      { source: "/es/certificaciones", destination: "/es/certificazioni" },
      { source: "/es/certificaciones/:slug", destination: "/es/certificazioni/:slug" },

       

    ];
  },
};

export default nextConfig;
