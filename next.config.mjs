import fs from 'node:fs';
// Disposable E2E build only: never send synthetic authenticated traffic to LIVE.
let testBackendOrigin = null;
if (process.env.CCST_E2E_CONFIG) {
  const fixture = JSON.parse(fs.readFileSync(process.env.CCST_E2E_CONFIG, 'utf8'));
  const target = new URL(fixture.backendOrigin);
  if (!/^ccst-r02-[a-zA-Z0-9]{12,64}$/.test(fixture.testRunId || '') || target.protocol !== 'http:' || target.hostname !== '127.0.0.1' || !target.port || target.pathname !== '/' || target.username || target.password || target.search || target.hash) throw Error('INVALID_ISOLATED_E2E_REWRITE');
  testBackendOrigin = target.origin;
}
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
        // Versioned attempts use the existing route handler's complete-body transport.
        // Other API paths retain their existing rewrite.
        source: "/api/backend/:path((?!ccst-versioned-training).*)",
        destination: `${testBackendOrigin || 'https://api.certifyquiz.com'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
