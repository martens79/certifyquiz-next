// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  output: "standalone",
  async redirects() {
    return [
      // LISTE
      { source: "/it/certifications", destination: "/it/certificazioni", permanent: true },
      { source: "/es/certifications", destination: "/es/certificaciones", permanent: true },

      // DETTAGLI
      { source: "/it/certifications/:slug", destination: "/it/certificazioni/:slug", permanent: true },
      { source: "/es/certifications/:slug", destination: "/es/certificaciones/:slug", permanent: true },

      // PRICING
      { source: "/it/pricing", destination: "/it/prezzi", permanent: true },
      { source: "/fr/pricing", destination: "/fr/tarifs", permanent: true },
      { source: "/es/pricing", destination: "/es/precios", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Proxy backend
      { source: "/api/backend/:path*", destination: "https://api.certifyquiz.com/api/:path*" },

      // Pretty URLs localizzate — LISTE certificazioni
      { source: "/it/certificazioni",       destination: "/it/certifications" },
      { source: "/es/certificaciones",      destination: "/es/certifications" },

      // Pretty URLs localizzate — DETTAGLI certificazioni
      { source: "/it/certificazioni/:slug", destination: "/it/certifications/:slug" },
      { source: "/es/certificaciones/:slug",destination: "/es/certifications/:slug" },

      // Pretty URLs localizzate — PRICING
      { source: "/it/prezzi",               destination: "/it/pricing" },
      { source: "/fr/tarifs",               destination: "/fr/pricing" },
      { source: "/es/precios",              destination: "/es/pricing" },
    ];
  },
};

export default nextConfig;
