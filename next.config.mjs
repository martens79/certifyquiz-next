/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Allow remote images (Sanity)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  async rewrites() {
    const isProd = process.env.NODE_ENV === "production";

    // ✅ DEV: do NOT rewrite /api/backend -> so it hits app/api/backend/[...path]
    if (!isProd) return [];

    // ✅ PROD: rewrite to your API (Railway / custom domain)
    return [
      {
        source: "/api/backend/:path*",
        destination: "https://api.certifyquiz.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;