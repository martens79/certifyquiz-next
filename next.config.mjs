// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // (opzionale ma utile) stricter React
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        // tutte le chiamate FE → /api/backend/... verranno proxate al backend reale
        source: "/api/backend/:path*",
        destination: "https://api.certifyquiz.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
