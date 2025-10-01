// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  output: "standalone",         // ✅ importante per API/SSR/ISR su Vercel
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "https://api.certifyquiz.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
