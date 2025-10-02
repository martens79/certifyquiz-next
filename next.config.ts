// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  output: "standalone",
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
