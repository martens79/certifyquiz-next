/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    const isProd = process.env.NODE_ENV === "production";

    // ✅ DEV: non riscrivere /api/backend → così prende la route app/api/backend/[...path]
    if (!isProd) return [];

    // ✅ PROD: riscrivi verso Railway come prima
    return [
      {
        source: "/api/backend/:path*",
        destination: "https://api.certifyquiz.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
