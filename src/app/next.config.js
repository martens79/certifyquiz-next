/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Liste localizzate → rotta unica
      { source: "/it/certificazioni", destination: "/it/certifications" },
      { source: "/es/certificaciones", destination: "/es/certifications" },
      // Dettagli localizzati → rotta unica
      { source: "/it/certificazioni/:slug", destination: "/it/certifications/:slug" },
      { source: "/es/certificaciones/:slug", destination: "/es/certifications/:slug" },
    ];
  },
};

module.exports = nextConfig;
