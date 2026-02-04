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
  async redirects() {
    return [
      // ---------------------------------------------------------------------
      // ✅ SALVAGENTE: doppio prefisso lingua /it/en/... ecc.
      // ---------------------------------------------------------------------

      // se il secondo è EN, EN è root (niente /en)
      {
        source: "/:l1(it|en|fr|es)/en/:path*",
        destination: "/:path*",
        permanent: false,
      },
      // se il secondo NON è EN, tieni solo il secondo
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

      // certifications "in italiano" dentro FR/ES -> correggi al segmento canonico
      { source: "/fr/certificazioni/:path*", destination: "/fr/certifications/:path*", permanent: true },
      { source: "/es/certificazioni/:path*", destination: "/es/certificaciones/:path*", permanent: true },

      // categories "in italiano" dentro FR/ES -> correggi al segmento canonico
      { source: "/fr/categorie/:path*", destination: "/fr/categories/:path*", permanent: true },
      { source: "/es/categorie/:path*", destination: "/es/categorias/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Fix: IT che usa segmenti EN per errore (quelli "it/.../certifications/*")
      // ---------------------------------------------------------------------
      { source: "/it/certifications", destination: "/it/certificazioni", permanent: true },
      { source: "/it/certifications/:path*", destination: "/it/certificazioni/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Fix: ES che usa segmenti EN per errore
      // ---------------------------------------------------------------------
      { source: "/es/certifications", destination: "/es/certificaciones", permanent: true },
      { source: "/es/certifications/:path*", destination: "/es/certificaciones/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Fix: FR/ES che usa /certifications senza essere EN (già ok per FR, per ES sopra)
      // (nessun redirect extra per FR qui)
      // ---------------------------------------------------------------------

      // ---------------------------------------------------------------------
      // ✅ Fix 404: categorie "vecchie" senza /categorie|/categories|/categorias
      // Esempi: /it/cloud, /it/sicurezza, /en/cloud, /es/reti, ecc.
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

      // FR (se le category FR non esistono ancora davvero, meglio comunque portare su /fr/categories/...)
      { source: "/fr/base", destination: "/fr/categories/base", permanent: true },
      { source: "/fr/sicurezza", destination: "/fr/categories/sicurezza", permanent: true },
      { source: "/fr/reti", destination: "/fr/categories/reti", permanent: true },
      { source: "/fr/cloud", destination: "/fr/categories/cloud", permanent: true },
      { source: "/fr/database", destination: "/fr/categories/database", permanent: true },
      { source: "/fr/programmazione", destination: "/fr/categories/programmazione", permanent: true },
      { source: "/fr/virtualizzazione", destination: "/fr/categories/virtualizzazione", permanent: true },
      { source: "/fr/intelligenza-artificiale", destination: "/fr/categories/intelligenza-artificiale", permanent: true },

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
      // ✅ Blog: se ti arrivano /en/blog, /fr/blog, /es/blog (visti nei 404)
      // ---------------------------------------------------------------------
      { source: "/en/blog", destination: "/blog", permanent: true },
      { source: "/en/blog/:path*", destination: "/blog/:path*", permanent: true },
      { source: "/fr/blog", destination: "/blog", permanent: true },
      { source: "/fr/blog/:path*", destination: "/blog/:path*", permanent: true },
      { source: "/es/blog", destination: "/blog", permanent: true },
      { source: "/es/blog/:path*", destination: "/blog/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Legal pages: /en/* deve diventare root; IT ha /it/...
      // (tu mi hai confermato: /it/termini)
      // ---------------------------------------------------------------------

      // Terms
      { source: "/it/terms-conditions", destination: "/it/termini", permanent: true },
      { source: "/terms-conditions", destination: "/terms-conditions", permanent: false }, // no-op, lasciato volutamente
      { source: "/en/terms-conditions", destination: "/terms-conditions", permanent: true },

      // Privacy
      { source: "/en/privacy-policy", destination: "/privacy-policy", permanent: true },
      { source: "/it/privacy-policy", destination: "/it/privacy-policy", permanent: false }, // se esiste già ok, se no lo vediamo dai prossimi 404

      // Cookie
      { source: "/en/cookie-policy", destination: "/cookie-policy", permanent: true },
      { source: "/it/cookie-policy", destination: "/it/cookie-policy", permanent: false }, // idem

      // ---------------------------------------------------------------------
      // ✅ ICDL / ECDL canonicalization (SEO) — CERTIFICATIONS pages
      // ---------------------------------------------------------------------
      { source: "/certifications/ecdl", destination: "/certifications/icdl", permanent: true },
      { source: "/it/certificazioni/ecdl", destination: "/it/certificazioni/icdl", permanent: true },
      { source: "/fr/certifications/ecdl", destination: "/fr/certifications/icdl", permanent: true },
      { source: "/es/certificaciones/ecdl", destination: "/es/certificaciones/icdl", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ ICDL / ECDL canonicalization (SEO) — QUIZ pages
      // ---------------------------------------------------------------------
      { source: "/it/quiz/ecdl", destination: "/it/quiz/icdl", permanent: true },
      { source: "/quiz/ecdl", destination: "/quiz/icdl", permanent: true },
      { source: "/fr/quiz/ecdl", destination: "/fr/quiz/icdl", permanent: true },
      { source: "/es/quiz/ecdl", destination: "/es/quiz/icdl", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ EIPASS Basic legacy -> EIPASS (QUIZ)
      // ---------------------------------------------------------------------
      { source: "/it/quiz/eipass-basic", destination: "/it/quiz/eipass", permanent: true },
      { source: "/quiz/eipass-basic", destination: "/quiz/eipass", permanent: true },
      { source: "/fr/quiz/eipass-basic", destination: "/fr/quiz/eipass", permanent: true },
      { source: "/es/quiz/eipass-basic", destination: "/es/quiz/eipass", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Slug legacy / alias (visti nei 404)
      // ---------------------------------------------------------------------

      // Tensorflow
      { source: "/certifications/tensorflow-developer", destination: "/certifications/tensorflow", permanent: true },
      { source: "/it/certificazioni/tensorflow-developer", destination: "/it/certificazioni/tensorflow", permanent: true },
      { source: "/fr/certifications/tensorflow-developer", destination: "/fr/certifications/tensorflow", permanent: true },
      { source: "/es/certificaciones/tensorflow-developer", destination: "/es/certificaciones/tensorflow", permanent: true },

      // MySQL
      { source: "/certifications/mysql-certification", destination: "/certifications/mysql", permanent: true },
      { source: "/it/certificazioni/mysql-certification", destination: "/it/certificazioni/mysql", permanent: true },
      { source: "/fr/certifications/mysql-certification", destination: "/fr/certifications/mysql", permanent: true },
      { source: "/es/certificaciones/mysql-certification", destination: "/es/certificaciones/mysql", permanent: true },

      // C# legacy
      { source: "/certifications/csharp-certification", destination: "/certifications/csharp", permanent: true },
      { source: "/it/certificazioni/csharp-certification", destination: "/it/certificazioni/csharp", permanent: true },
      { source: "/fr/certifications/csharp-certification", destination: "/fr/certifications/csharp", permanent: true },
      { source: "/es/certificaciones/csharp-certification", destination: "/es/certificaciones/csharp", permanent: true },

      // VMware legacy
      { source: "/it/certificazioni/vmware-certified-professional", destination: "/it/certificazioni/vmware-vcp", permanent: true },
      { source: "/certifications/vmware-certified-professional", destination: "/certifications/vmware-vcp", permanent: true },
      { source: "/fr/certifications/vmware-certified-professional", destination: "/fr/certifications/vmware-vcp", permanent: true },
      { source: "/es/certificaciones/vmware-certified-professional", destination: "/es/certificaciones/vmware-vcp", permanent: true },

      // CCST Cybersecurity alias -> canonical slug (se ti serve ancora)
      { source: "/certifications/cisco-ccst-cybersecurity", destination: "/certifications/cisco-ccst-security", permanent: true },
      { source: "/it/certificazioni/cisco-ccst-cybersecurity", destination: "/it/certificazioni/cisco-ccst-security", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Fix 404: "it/certifications/<slug>" che è EN segment + IT prefix
      // + fix /en/certifications/<slug> (EN root)
      // ---------------------------------------------------------------------

      // IT prefix + EN segment
      { source: "/it/certifications/:slug*", destination: "/it/certificazioni/:slug*", permanent: true },

      // EN prefix (EN root)
      { source: "/en/certifications", destination: "/certifications", permanent: true },
      { source: "/en/certifications/:path*", destination: "/certifications/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Legacy "mixed by category" quiz paths -> NEW mixed quiz paths
      // (hai confermato: /it/quiz/security-plus/mixed)
      // ---------------------------------------------------------------------

      // categoria -> una cert "default" (modificabile)
      { source: "/quiz/sicurezza/mixed", destination: "/it/quiz/security-plus/mixed", permanent: true },
      { source: "/quiz/reti/mixed", destination: "/it/quiz/ccna/mixed", permanent: true },
      { source: "/quiz/programmazione/mixed", destination: "/it/quiz/javascript-developer/mixed", permanent: true },
      { source: "/quiz/virtualizzazione/mixed", destination: "/it/quiz/vmware-vcp/mixed", permanent: true },
      { source: "/quiz/intelligenza-artificiale/mixed", destination: "/it/quiz/microsoft-ai-fundamentals/mixed", permanent: true },
      { source: "/quiz/cloud/mixed", destination: "/it/quiz/aws-cloud-practitioner/mixed", permanent: true },
      { source: "/quiz/database/mixed", destination: "/it/quiz/microsoft-sql-server/mixed", permanent: true },

      // se arrivano con prefisso lingua (a volte succede)
      { source: "/it/quiz/sicurezza/mixed", destination: "/it/quiz/security-plus/mixed", permanent: true },
      { source: "/it/quiz/reti/mixed", destination: "/it/quiz/ccna/mixed", permanent: true },
      { source: "/it/quiz/cloud/mixed", destination: "/it/quiz/aws-cloud-practitioner/mixed", permanent: true },
      { source: "/it/quiz/database/mixed", destination: "/it/quiz/microsoft-sql-server/mixed", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Garbage / bot paths (visto: /favicon.ico/undefined/database)
      // ---------------------------------------------------------------------
      { source: "/favicon.ico/:path*", destination: "/favicon.ico", permanent: true },
    ];
  },
};

export default nextConfig;
