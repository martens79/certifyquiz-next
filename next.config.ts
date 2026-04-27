// next.config.ts
import type { NextConfig } from "next";

/**
 * Redirect strategy:
 * - EN is root (no /en prefix)
 * - IT uses /it/...
 * - FR uses /fr/...
 * - ES uses /es/...
 *
 * Canonical segments:
 * - IT: /it/certificazioni, /it/categorie
 * - EN: /certifications, /categories
 * - FR: /fr/certifications, /fr/categories
 * - ES: /es/certificaciones, /es/categorias
 */

const nextConfig: NextConfig = {

  // ✅ Sanity / LCP images
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

  async redirects() {
    return [
      // ---------------------------------------------------------------------
      // ✅ SALVAGENTE: doppio prefisso lingua /it/en/... ecc.
      // ---------------------------------------------------------------------
      {
        source: "/:l1(it|en|fr|es)/en/:path*",
        destination: "/:path*",
        permanent: false,
      },
      {
        source: "/:l1(it|en|fr|es)/:l2(it|fr|es)/:path*",
        destination: "/:l2/:path*",
        permanent: false,
      },

      // ---------------------------------------------------------------------
      // ✅ EN è root: rimuovi /en
      // ---------------------------------------------------------------------
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Fix segmenti "misti" (italiano dentro FR/ES)
      // ---------------------------------------------------------------------
      { source: "/fr/certificazioni/:path*", destination: "/fr/certifications/:path*", permanent: true },
      { source: "/es/certificazioni/:path*", destination: "/es/certificaciones/:path*", permanent: true },
      { source: "/fr/categorie/:path*", destination: "/fr/categories/:path*", permanent: true },
      { source: "/es/categorie/:path*", destination: "/es/categorias/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Fix: IT che usa segmenti EN per errore
      // ---------------------------------------------------------------------
      { source: "/it/certifications", destination: "/it/certificazioni", permanent: true },
      { source: "/it/certifications/:path*", destination: "/it/certificazioni/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Fix: ES che usa segmenti EN per errore
      // ---------------------------------------------------------------------
      { source: "/es/certifications", destination: "/es/certificaciones", permanent: true },
      { source: "/es/certifications/:path*", destination: "/es/certificaciones/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Fix 404: categorie "vecchie" senza prefisso /categorie|/categories
      // ---------------------------------------------------------------------

      // IT
      { source: "/it/base", destination: "/it/categorie/base", permanent: true },
      { source: "/it/sicurezza", destination: "/it/categorie/sicurezza", permanent: true },
      { source: "/it/reti", destination: "/it/categorie/reti", permanent: true },
      { source: "/it/cloud", destination: "/it/categorie/cloud", permanent: true },
      { source: "/it/database", destination: "/it/categorie/database", permanent: true },
      { source: "/it/programmazione", destination: "/it/categorie/programmazione", permanent: true },
      { source: "/it/virtualizzazione", destination: "/it/categorie/virtualizzazione", permanent: true },
      { source: "/it/intelligenza-artificiale", destination: "/it/categorie/intelligenza-artificiale", permanent: true },

      // FR
      { source: "/fr/base", destination: "/fr/categories/base", permanent: true },
      { source: "/fr/sicurezza", destination: "/fr/categories/sicurezza", permanent: true },
      { source: "/fr/reti", destination: "/fr/categories/reti", permanent: true },
      { source: "/fr/cloud", destination: "/fr/categories/cloud", permanent: true },
      { source: "/fr/database", destination: "/fr/categories/database", permanent: true },
      { source: "/fr/programmazione", destination: "/fr/categories/programmazione", permanent: true },
      { source: "/fr/virtualizzazione", destination: "/fr/categories/virtualizzazione", permanent: true },
      { source: "/fr/intelligenza-artificiale", destination: "/fr/categories/intelligenza-artificiale", permanent: true },
      { source: "/fr/inizia", destination: "/fr", permanent: true },

      // ES
      { source: "/es/base", destination: "/es/categorias/base", permanent: true },
      { source: "/es/sicurezza", destination: "/es/categorias/sicurezza", permanent: true },
      { source: "/es/reti", destination: "/es/categorias/reti", permanent: true },
      { source: "/es/cloud", destination: "/es/categorias/cloud", permanent: true },
      { source: "/es/database", destination: "/es/categorias/database", permanent: true },
      { source: "/es/programmazione", destination: "/es/categorias/programmazione", permanent: true },
      { source: "/es/virtualizzazione", destination: "/es/categorias/virtualizzazione", permanent: true },
      { source: "/es/intelligenza-artificiale", destination: "/es/categorias/intelligenza-artificiale", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Hub legacy
      // ---------------------------------------------------------------------
      { source: "/hub/:path*", destination: "/certifications", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Legal pages
      // ---------------------------------------------------------------------
      { source: "/it/terms-conditions", destination: "/it/termini", permanent: true },
      { source: "/en/terms-conditions", destination: "/terms-conditions", permanent: true },
      { source: "/fr/terms-conditions", destination: "/fr/conditions", permanent: true },
      { source: "/en/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/en/cookie-policy", destination: "/cookies", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ ICDL / ECDL canonicalization — CERTIFICATIONS
      // ---------------------------------------------------------------------
      { source: "/certifications/ecdl", destination: "/certifications/icdl", permanent: true },
      { source: "/it/certificazioni/ecdl", destination: "/it/certificazioni/icdl", permanent: true },
      { source: "/fr/certifications/ecdl", destination: "/fr/certifications/icdl", permanent: true },
      { source: "/es/certificaciones/ecdl", destination: "/es/certificaciones/icdl", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ ICDL / ECDL canonicalization — QUIZ
      // ---------------------------------------------------------------------
      { source: "/it/quiz/ecdl", destination: "/it/quiz/icdl", permanent: true },
      { source: "/quiz/ecdl", destination: "/quiz/icdl", permanent: true },
      { source: "/fr/quiz/ecdl", destination: "/fr/quiz/icdl", permanent: true },
      { source: "/es/quiz/ecdl", destination: "/es/quiz/icdl", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ EIPASS Basic legacy
      // ---------------------------------------------------------------------
      { source: "/it/quiz/eipass-basic", destination: "/it/quiz/eipass", permanent: true },
      { source: "/quiz/eipass-basic", destination: "/quiz/eipass", permanent: true },
      { source: "/fr/quiz/eipass-basic", destination: "/fr/quiz/eipass", permanent: true },
      { source: "/es/quiz/eipass-basic", destination: "/es/quiz/eipass", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ CompTIA Security+ legacy
      // ---------------------------------------------------------------------
      { source: "/certifications/comptia-security-plus", destination: "/certifications/security-plus", permanent: true },
      { source: "/certifications/comptia-security-plus/:path*", destination: "/certifications/security-plus/:path*", permanent: true },
      { source: "/it/certificazioni/comptia-security-plus", destination: "/it/certificazioni/security-plus", permanent: true },
      { source: "/it/certificazioni/comptia-security-plus/:path*", destination: "/it/certificazioni/security-plus/:path*", permanent: true },
      { source: "/fr/certifications/comptia-security-plus", destination: "/fr/certifications/security-plus", permanent: true },
      { source: "/fr/certifications/comptia-security-plus/:path*", destination: "/fr/certifications/security-plus/:path*", permanent: true },
      { source: "/es/certificaciones/comptia-security-plus", destination: "/es/certificaciones/security-plus", permanent: true },
      { source: "/es/certificaciones/comptia-security-plus/:path*", destination: "/es/certificaciones/security-plus/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Google TensorFlow legacy (CORRETTO: google-tensorflow non tensorflow)
      // ---------------------------------------------------------------------
      { source: "/certifications/tensorflow-developer", destination: "/certifications/google-tensorflow", permanent: true },
      { source: "/certifications/tensorflow-developer/:path*", destination: "/certifications/google-tensorflow/:path*", permanent: true },
      { source: "/it/certificazioni/tensorflow-developer", destination: "/it/certificazioni/google-tensorflow", permanent: true },
      { source: "/it/certificazioni/tensorflow-developer/:path*", destination: "/it/certificazioni/google-tensorflow/:path*", permanent: true },
      { source: "/fr/certifications/tensorflow-developer", destination: "/fr/certifications/google-tensorflow", permanent: true },
      { source: "/fr/certifications/tensorflow-developer/:path*", destination: "/fr/certifications/google-tensorflow/:path*", permanent: true },
      { source: "/es/certificaciones/tensorflow-developer", destination: "/es/certificaciones/google-tensorflow", permanent: true },
      { source: "/es/certificaciones/tensorflow-developer/:path*", destination: "/es/certificaciones/google-tensorflow/:path*", permanent: true },
      { source: "/en/certifications/tensorflow-developer", destination: "/certifications/google-tensorflow", permanent: true },
      { source: "/en/certifications/tensorflow-developer/:path*", destination: "/certifications/google-tensorflow/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Microsoft C# legacy (CORRETTO: microsoft-csharp non csharp)
      // ---------------------------------------------------------------------
      { source: "/certifications/csharp-certification", destination: "/certifications/microsoft-csharp", permanent: true },
      { source: "/certifications/csharp-certification/:path*", destination: "/certifications/microsoft-csharp/:path*", permanent: true },
      { source: "/it/certificazioni/csharp-certification", destination: "/it/certificazioni/microsoft-csharp", permanent: true },
      { source: "/it/certificazioni/csharp-certification/:path*", destination: "/it/certificazioni/microsoft-csharp/:path*", permanent: true },
      { source: "/fr/certifications/csharp-certification", destination: "/fr/certifications/microsoft-csharp", permanent: true },
      { source: "/fr/certifications/csharp-certification/:path*", destination: "/fr/certifications/microsoft-csharp/:path*", permanent: true },
      { source: "/es/certificaciones/csharp-certification", destination: "/es/certificaciones/microsoft-csharp", permanent: true },
      { source: "/es/certificaciones/csharp-certification/:path*", destination: "/es/certificaciones/microsoft-csharp/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Microsoft AI Fundamentals legacy → microsoft-ai
      // ---------------------------------------------------------------------
      { source: "/certifications/microsoft-ai-fundamentals", destination: "/certifications/microsoft-ai", permanent: true },
      { source: "/certifications/microsoft-ai-fundamentals/:path*", destination: "/certifications/microsoft-ai/:path*", permanent: true },
      { source: "/it/certificazioni/microsoft-ai-fundamentals", destination: "/it/certificazioni/microsoft-ai", permanent: true },
      { source: "/it/certificazioni/microsoft-ai-fundamentals/:path*", destination: "/it/certificazioni/microsoft-ai/:path*", permanent: true },
      { source: "/fr/certifications/microsoft-ai-fundamentals", destination: "/fr/certifications/microsoft-ai", permanent: true },
      { source: "/fr/certifications/microsoft-ai-fundamentals/:path*", destination: "/fr/certifications/microsoft-ai/:path*", permanent: true },
      { source: "/es/certificaciones/microsoft-ai-fundamentals", destination: "/es/certificaciones/microsoft-ai", permanent: true },
      { source: "/es/certificaciones/microsoft-ai-fundamentals/:path*", destination: "/es/certificaciones/microsoft-ai/:path*", permanent: true },
      { source: "/en/certifications/microsoft-ai-fundamentals", destination: "/certifications/microsoft-ai", permanent: true },
      { source: "/en/certifications/microsoft-ai-fundamentals/:path*", destination: "/certifications/microsoft-ai/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ VMware legacy (verifica che vmware-certified-professional esista nel DB)
      // ---------------------------------------------------------------------
      { source: "/certifications/vmware-certified-professional", destination: "/certifications/vmware-certified-professional", permanent: false },
      { source: "/it/certificazioni/vmware-certified-professional", destination: "/it/certificazioni/vmware-certified-professional", permanent: false },
      { source: "/fr/certifications/vmware-certified-professional", destination: "/fr/certifications/vmware-certified-professional", permanent: false },
      { source: "/es/certificaciones/vmware-certified-professional", destination: "/es/certificaciones/vmware-certified-professional", permanent: false },

      // ---------------------------------------------------------------------
      // ✅ CCST Cybersecurity alias
      // ---------------------------------------------------------------------
      { source: "/certifications/cisco-ccst-cybersecurity", destination: "/certifications/cisco-ccst-cybersecurity", permanent: false },
      { source: "/it/certificazioni/cisco-ccst-cybersecurity", destination: "/it/certificazioni/cisco-ccst-cybersecurity", permanent: false },

      // ---------------------------------------------------------------------
      // ✅ Legacy quiz paths per categoria
      // ---------------------------------------------------------------------
      { source: "/quiz/sicurezza/mixed", destination: "/it/quiz/security-plus/mixed", permanent: true },
      { source: "/quiz/reti/mixed", destination: "/it/quiz/ccna/mixed", permanent: true },
      { source: "/quiz/programmazione/mixed", destination: "/it/quiz/javascript-developer/mixed", permanent: true },
      { source: "/quiz/virtualizzazione/mixed", destination: "/it/quiz/vmware-certified-professional/mixed", permanent: true },
      { source: "/quiz/intelligenza-artificiale/mixed", destination: "/it/quiz/microsoft-ai/mixed", permanent: true },
      { source: "/quiz/cloud/mixed", destination: "/it/quiz/aws-cloud-practitioner/mixed", permanent: true },
      { source: "/quiz/database/mixed", destination: "/it/quiz/microsoft-sql-server/mixed", permanent: true },
      { source: "/it/quiz/sicurezza/mixed", destination: "/it/quiz/security-plus/mixed", permanent: true },
      { source: "/it/quiz/reti/mixed", destination: "/it/quiz/ccna/mixed", permanent: true },
      { source: "/it/quiz/cloud/mixed", destination: "/it/quiz/aws-cloud-practitioner/mixed", permanent: true },
      { source: "/it/quiz/database/mixed", destination: "/it/quiz/microsoft-sql-server/mixed", permanent: true },

      // Oracle hub legacy
      { source: "/hub/oracle", destination: "/certifications/oracle-database-sql", permanent: true },

      // CCST alias senza specificare networking/cybersecurity
      { source: "/certifications/ccst", destination: "/certifications/cisco-ccst-networking", permanent: true },
      { source: "/it/certificazioni/ccst", destination: "/it/certificazioni/cisco-ccst-networking", permanent: true },
      { source: "/fr/certifications/ccst", destination: "/fr/certifications/cisco-ccst-networking", permanent: true },
      { source: "/es/certificaciones/ccst", destination: "/es/certificaciones/cisco-ccst-networking", permanent: true },

      // csharp senza microsoft (già gestito ma aggiungi anche topic)
      { source: "/certifications/csharp", destination: "/certifications/microsoft-csharp", permanent: true },
      { source: "/certifications/csharp/:path*", destination: "/certifications/microsoft-csharp/:path*", permanent: true },
      // ---------------------------------------------------------------------
      // ✅ Garbage / bot paths
      // ---------------------------------------------------------------------
      { source: "/favicon.ico/:path*", destination: "/favicon.ico", permanent: true },
    ];
  },
};

export default nextConfig;