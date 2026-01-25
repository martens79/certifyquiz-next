// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // ---------------------------------------------------------------------
      // ICDL / ECDL canonicalization (SEO) — CERTIFICATIONS pages
      // ---------------------------------------------------------------------
      { source: "/certifications/ecdl", destination: "/certifications/icdl", permanent: true },
      { source: "/en/certifications/ecdl", destination: "/certifications/icdl", permanent: true },
      { source: "/en/certificazioni/ecdl", destination: "/certifications/icdl", permanent: true },
      { source: "/fr/certifications/ecdl", destination: "/fr/certifications/icdl", permanent: true },
      { source: "/es/certificaciones/ecdl", destination: "/es/certificaciones/icdl", permanent: true },

      // ---------------------------------------------------------------------
      // ICDL / ECDL canonicalization (SEO) — QUIZ pages
      // ✅ nel tuo progetto i quiz hanno SEMPRE prefisso lingua (/en/quiz/...)
      // ---------------------------------------------------------------------
      { source: "/it/quiz/ecdl", destination: "/it/quiz/icdl", permanent: true },
      { source: "/en/quiz/ecdl", destination: "/en/quiz/icdl", permanent: true },
      { source: "/fr/quiz/ecdl", destination: "/fr/quiz/icdl", permanent: true },
      { source: "/es/quiz/ecdl", destination: "/es/quiz/icdl", permanent: true },

      // ---------------------------------------------------------------------
      // EIPASS Basic legacy -> EIPASS (QUIZ)
      // ---------------------------------------------------------------------
      { source: "/it/quiz/eipass-basic", destination: "/it/quiz/eipass", permanent: true },
      { source: "/en/quiz/eipass-basic", destination: "/en/quiz/eipass", permanent: true },
      { source: "/fr/quiz/eipass-basic", destination: "/fr/quiz/eipass", permanent: true },
      { source: "/es/quiz/eipass-basic", destination: "/es/quiz/eipass", permanent: true },

      // ---------------------------------------------------------------------
      // FIX 404: EN path errato (/en/certificazioni/*) -> /certifications/*
      // (EN SEO pages: niente /en davanti)
      // ---------------------------------------------------------------------
      { source: "/en/certifications", destination: "/certifications", permanent: true },
      { source: "/en/certifications/:path*", destination: "/certifications/:path*", permanent: true },

      { source: "/en/categories", destination: "/categories", permanent: true },
      { source: "/en/categories/:path*", destination: "/categories/:path*", permanent: true },

      // ✅ EN pages sometimes indexed with IT segment
      { source: "/en/certificazioni", destination: "/certifications", permanent: true },
      { source: "/en/certificazioni/:path*", destination: "/certifications/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // FIX 404: slug legacy / alias (quelli che hai visto oggi)
      // ---------------------------------------------------------------------
      // CCST Cybersecurity alias -> canonical slug
      { source: "/certifications/cisco-ccst-cybersecurity", destination: "/certifications/cisco-ccst-security", permanent: true },
      { source: "/it/certificazioni/cisco-ccst-cybersecurity", destination: "/it/certificazioni/cisco-ccst-security", permanent: true },

      // C# alias (oggi 404)
      { source: "/it/certificazioni/microsoft-csharp", destination: "/it/certificazioni/csharp", permanent: true },
      { source: "/certifications/microsoft-csharp", destination: "/certifications/csharp", permanent: true },

      // ---------------------------------------------------------------------
      // Legacy slug redirects (examples - add the ones you see in GSC)
      // ---------------------------------------------------------------------
      { source: "/it/certificazioni/mysql-certification", destination: "/it/certificazioni/mysql", permanent: true },
      { source: "/it/certificazioni/google-tensorflow", destination: "/it/certificazioni/tensorflow", permanent: true },
      { source: "/it/certificazioni/microsoft-ai", destination: "/it/certificazioni/microsoft-ai-fundamentals", permanent: true },
      { source: "/it/certificazioni/vmware-certified-professional", destination: "/it/certificazioni/vmware-vcp", permanent: true },

      // Quiz legacy (examples)
      { source: "/it/quiz/javascript", destination: "/it/quiz/javascript-developer", permanent: true },
      { source: "/quiz/javascript", destination: "/quiz/javascript-developer", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // NOTE:
      // - redirects = canonical URL (visibile in browser)
      // - rewrites  = alias invisibile (ti serve se vuoi accettare più path senza cambiare URL)

      { source: "/fr/certifications", destination: "/fr/certificazioni" },
      { source: "/fr/certifications/:slug", destination: "/fr/certificazioni/:slug" },

      { source: "/es/certificaciones", destination: "/es/certificazioni" },
      { source: "/es/certificaciones/:slug", destination: "/es/certificazioni/:slug" },

      { source: "/fr/categories", destination: "/fr/categorie" },
      { source: "/fr/categories/:slug", destination: "/fr/categorie/:slug" },

      { source: "/es/categorias", destination: "/es/categorie" },
      { source: "/es/categorias/:slug", destination: "/es/categorie/:slug" },
    ];
  },
};

export default nextConfig;
