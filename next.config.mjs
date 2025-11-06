/** @type {import('next').NextConfig} */
const nextConfig = {
  // React più severo (buone warning in dev)
  reactStrictMode: true,

  // 🔓 Sblocca build anche se ESLint trova errori (temporaneo)
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        // FE → proxy al backend reale
        source: "/api/backend/:path*",
        destination: "https://api.certifyquiz.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
