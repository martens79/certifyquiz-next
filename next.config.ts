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
      // ✅ Fix 404: categorie "vecchie" senza prefisso
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
      // ✅ Hub legacy — specifici PRIMA del catch-all
      // ---------------------------------------------------------------------
      { source: "/hub/security", destination: "/roadmap-cybersecurity", permanent: true },
      { source: "/hub/oracle", destination: "/certifications/oracle-database-sql", permanent: true },
      { source: "/hub/google-career", destination: "/certifications/google-cloud", permanent: true },
      { source: "/hub/:path*", destination: "/certifications", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Legal pages
      // ---------------------------------------------------------------------
      { source: "/it/terms-conditions", destination: "/it/termini", permanent: true },
      { source: "/en/terms-conditions", destination: "/terms-conditions", permanent: true },
      { source: "/fr/terms-conditions", destination: "/fr/conditions", permanent: true },
      { source: "/en/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/en/cookie-policy", destination: "/cookie", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ ICDL / ECDL canonicalization — CERTIFICATIONS
      // ---------------------------------------------------------------------
      { source: "/certifications/ecdl", destination: "/certifications/icdl", permanent: true },
      { source: "/it/certificazioni/ecdl", destination: "/it/certificazioni/icdl", permanent: true },
      { source: "/fr/certifications/ecdl", destination: "/fr/certifications/icdl", permanent: true },
      { source: "/es/certificaciones/ecdl", destination: "/es/certificaciones/icdl", permanent: true },

      // ✅ ICDL / ECDL canonicalization — QUIZ
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
      // ✅ Google TensorFlow legacy
      // ---------------------------------------------------------------------
      { source: "/certifications/tensorflow-developer", destination: "/certifications/google-tensorflow", permanent: true },
      { source: "/certifications/tensorflow-developer/:path*", destination: "/certifications/google-tensorflow/:path*", permanent: true },
      { source: "/it/certificazioni/tensorflow-developer", destination: "/it/certificazioni/google-tensorflow", permanent: true },
      { source: "/it/certificazioni/tensorflow-developer/:path*", destination: "/it/certificazioni/google-tensorflow/:path*", permanent: true },
      { source: "/fr/certifications/tensorflow-developer", destination: "/fr/certifications/google-tensorflow", permanent: true },
      { source: "/fr/certifications/tensorflow-developer/:path*", destination: "/fr/certifications/google-tensorflow/:path*", permanent: true },
      { source: "/es/certificaciones/tensorflow-developer", destination: "/es/certificaciones/google-tensorflow", permanent: true },
      { source: "/es/certificaciones/tensorflow-developer/:path*", destination: "/es/certificaciones/google-tensorflow/:path*", permanent: true },

      // ---------------------------------------------------------------------
      // ✅ Microsoft C# legacy
      // ---------------------------------------------------------------------
      { source: "/certifications/csharp", destination: "/certifications/microsoft-csharp", permanent: true },
      { source: "/certifications/csharp/:path*", destination: "/certifications/microsoft-csharp/:path*", permanent: true },
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

      // ---------------------------------------------------------------------
      // ✅ CCST alias
      // ---------------------------------------------------------------------
      { source: "/certifications/ccst", destination: "/certifications/cisco-ccst-networking", permanent: true },
      { source: "/certifications/ccst/:path*", destination: "/certifications/cisco-ccst-networking/:path*", permanent: true },
      { source: "/it/certificazioni/ccst", destination: "/it/certificazioni/cisco-ccst-networking", permanent: true },
      { source: "/it/certificazioni/ccst/:path*", destination: "/it/certificazioni/cisco-ccst-networking/:path*", permanent: true },
      { source: "/fr/certifications/ccst", destination: "/fr/certifications/cisco-ccst-networking", permanent: true },
      { source: "/fr/certifications/ccst/:path*", destination: "/fr/certifications/cisco-ccst-networking/:path*", permanent: true },
      { source: "/es/certificaciones/ccst", destination: "/es/certificaciones/cisco-ccst-networking", permanent: true },
      { source: "/es/certificaciones/ccst/:path*", destination: "/es/certificaciones/cisco-ccst-networking/:path*", permanent: true },

      // ✅ CCST Security alias → cisco-ccst-cybersecurity
      { source: "/certifications/cisco-ccst-security", destination: "/certifications/cisco-ccst-cybersecurity", permanent: true },
      { source: "/certifications/cisco-ccst-security/:path*", destination: "/certifications/cisco-ccst-cybersecurity/:path*", permanent: true },
      { source: "/it/certificazioni/cisco-ccst-security", destination: "/it/certificazioni/cisco-ccst-cybersecurity", permanent: true },
      { source: "/fr/certifications/cisco-ccst-security", destination: "/fr/certifications/cisco-ccst-cybersecurity", permanent: true },
      { source: "/es/certificaciones/cisco-ccst-security", destination: "/es/certificaciones/cisco-ccst-cybersecurity", permanent: true },

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

      {
          source:
            "/certifications/ai-foundations/generative-ai-and-real-world-applications",
          destination:
            "/certifications/ai-foundations/generative-ai-real-world-applications",
          permanent: true,
        },
        /**
 * REDIRECT DA AGGIUNGERE in next.config.ts
 * Generati da analisi Search Console 2026-05-17 — 127 URL non coperti
 * Slug categorie verificati da src/lib/paths.ts (CAT_KEY_TO_SLUG)
 *
 * Incolla dentro il return[] di redirects(), PRIMA del blocco "Garbage / bot paths".
 */

// -----------------------------------------------------------------------
// 🐛 BUG: URL con /&/undefined/ — redirect temporanei (permanent: false)
//    Il vero fix è nel codice: cerca href con variabile slug/categoria undefined.
//    Rimuovi questi redirect dopo aver fixato il bug.
// -----------------------------------------------------------------------
{ source: "/&/undefined/programmazione",   destination: "/it/categorie/programmazione",           permanent: false },
{ source: "/&/undefined/sicurezza",        destination: "/it/categorie/sicurezza",                permanent: false },
{ source: "/&/undefined/reti",             destination: "/it/categorie/reti",                     permanent: false },
{ source: "/&/undefined/cloud",            destination: "/it/categorie/cloud",                    permanent: false },
{ source: "/&/undefined/database",         destination: "/it/categorie/database",                 permanent: false },
{ source: "/&/undefined/base",             destination: "/it/categorie/base",                     permanent: false },
{ source: "/&/undefined/ai",               destination: "/it/categorie/intelligenza-artificiale", permanent: false },
{ source: "/&/undefined/virtualizzazione", destination: "/it/categorie/virtualizzazione",         permanent: false },

// -----------------------------------------------------------------------
// 🐛 BUG: altri path malformati
// -----------------------------------------------------------------------
{ source: "/quiz-suggeriti/undefined/:path*", destination: "/", permanent: false },
{ source: "/login/blog",                      destination: "/it/blog", permanent: true },

// -----------------------------------------------------------------------
// ✅ IT: slug rinominati
// -----------------------------------------------------------------------
{ source: "/it/certificazioni/comptia-network-plus",         destination: "/it/certificazioni/network-plus",        permanent: true },
{ source: "/it/certificazioni/comptia-network-plus/:path*",  destination: "/it/certificazioni/network-plus/:path*", permanent: true },
{ source: "/it/certificazioni/python",                       destination: "/it/certificazioni/python-developer",    permanent: true },

// -----------------------------------------------------------------------
// ✅ IT: "foundations" — redirect a categoria
//    permanent: false finché non crei le pagine vere, poi cambia in true
// -----------------------------------------------------------------------
{ source: "/it/certificazioni/cloud-foundations",              destination: "/it/categorie/cloud",                    permanent: false },
{ source: "/it/certificazioni/networking-foundations",         destination: "/it/categorie/reti",                     permanent: false },
{ source: "/it/certificazioni/database-foundations",           destination: "/it/categorie/database",                 permanent: false },
{ source: "/it/certificazioni/programming-foundations",        destination: "/it/categorie/programmazione",           permanent: false },
{ source: "/it/certificazioni/data-analytics-foundations",     destination: "/it/categorie/analisi-dei-dati",         permanent: false },
{ source: "/it/certificazioni/cybersecurity-foundations",      destination: "/it/categorie/sicurezza",                permanent: false },
{ source: "/it/certificazioni/virtualization-foundations",     destination: "/it/categorie/virtualizzazione",         permanent: false },
{ source: "/it/certificazioni/project-management-foundations", destination: "/it/categorie/management",               permanent: false },

// -----------------------------------------------------------------------
// ✅ EN (root): "foundations" → categoria (slug da CAT_KEY_TO_SLUG en)
// -----------------------------------------------------------------------
{ source: "/certifications/cloud-foundations",              destination: "/categories/cloud",            permanent: false },
{ source: "/certifications/networking-foundations",         destination: "/categories/networking",       permanent: false },
{ source: "/certifications/database-foundations",           destination: "/categories/databases",        permanent: false },
{ source: "/certifications/programming-foundations",        destination: "/categories/programming",      permanent: false },
{ source: "/certifications/data-analytics-foundations",     destination: "/categories/data-analytics",   permanent: false },
{ source: "/certifications/cybersecurity-foundations",      destination: "/categories/security",         permanent: false },
{ source: "/certifications/virtualization-foundations",     destination: "/categories/virtualization",   permanent: false },
{ source: "/certifications/project-management-foundations", destination: "/categories/management",       permanent: false },

// -----------------------------------------------------------------------
// ✅ FR: "foundations" → categoria (slug da CAT_KEY_TO_SLUG fr)
// -----------------------------------------------------------------------
{ source: "/fr/certifications/cloud-foundations",              destination: "/fr/categories/cloud",               permanent: false },
{ source: "/fr/certifications/networking-foundations",         destination: "/fr/categories/reseaux",             permanent: false },
{ source: "/fr/certifications/database-foundations",           destination: "/fr/categories/bases-de-donnees",    permanent: false },
{ source: "/fr/certifications/programming-foundations",        destination: "/fr/categories/programmation",       permanent: false },
{ source: "/fr/certifications/data-analytics-foundations",     destination: "/fr/categories/analyse-des-donnees", permanent: false },
{ source: "/fr/certifications/cybersecurity-foundations",      destination: "/fr/categories/securite",            permanent: false },
{ source: "/fr/certifications/virtualization-foundations",     destination: "/fr/categories/virtualisation",      permanent: false },
{ source: "/fr/certifications/project-management-foundations", destination: "/fr/categories/management",          permanent: false },

// FR: alias e rinominati
{ source: "/fr/certifications/comptia-a",                     destination: "/fr/certifications/comptia-a-plus",             permanent: true },
{ source: "/fr/certifications/comptia-network",               destination: "/fr/certifications/network-plus",               permanent: true },
{ source: "/fr/certifications/comptia-security",              destination: "/fr/certifications/security-plus",              permanent: true },
{ source: "/fr/certifications/cisco-ccst",                    destination: "/fr/certifications/cisco-ccst-networking",      permanent: true },
{ source: "/fr/certifications/google-cloud",                  destination: "/fr/certifications/google-cloud-digital-leader", permanent: true },
{ source: "/fr/certifications/mysql-certification",           destination: "/fr/certifications/mysql",                      permanent: true },
{ source: "/fr/certifications/aws-solutions-architect",       destination: "/fr/certifications/aws-cloud-practitioner",     permanent: false },
// FR: cert non ancora create → homepage FR
{ source: "/fr/certifications/ibm-cloud-v5",                  destination: "/fr", permanent: false },
{ source: "/fr/certifications/jncie",                         destination: "/fr", permanent: false },
{ source: "/fr/certifications/vmware-certified-professional",  destination: "/fr", permanent: false },

// -----------------------------------------------------------------------
// ✅ ES: "foundations" → categoria (slug da CAT_KEY_TO_SLUG es)
// -----------------------------------------------------------------------
{ source: "/es/certificaciones/cloud-foundations",              destination: "/es/categorias/cloud",              permanent: false },
{ source: "/es/certificaciones/networking-foundations",         destination: "/es/categorias/redes",              permanent: false },
{ source: "/es/certificaciones/database-foundations",           destination: "/es/categorias/bases-de-datos",     permanent: false },
{ source: "/es/certificaciones/programming-foundations",        destination: "/es/categorias/programacion",       permanent: false },
{ source: "/es/certificaciones/data-analytics-foundations",     destination: "/es/categorias/analisis-de-datos",  permanent: false },
{ source: "/es/certificaciones/cybersecurity-foundations",      destination: "/es/categorias/seguridad",          permanent: false },
{ source: "/es/certificaciones/virtualization-foundations",     destination: "/es/categorias/virtualizacion",     permanent: false },
{ source: "/es/certificaciones/project-management-foundations", destination: "/es/categorias/gestion-management", permanent: false },

// ES: altri
{ source: "/es/certificaciones/network-plus/:path*", destination: "/es/certificaciones/network-plus", permanent: false },
{ source: "/es/certificaciones",                     destination: "/es",                               permanent: false },

// -----------------------------------------------------------------------
// ✅ Blog multilingua — redirect a IT (unica versione esistente)
//    Se in futuro crei il blog EN, aggiorna /fr e /es → /en/blog
// -----------------------------------------------------------------------
{ source: "/fr/blog",         destination: "/it/blog",         permanent: false },
{ source: "/fr/blog/:path*",  destination: "/it/blog/:path*",  permanent: false },
{ source: "/es/blog",         destination: "/it/blog",         permanent: false },
{ source: "/es/blog/:path*",  destination: "/it/blog/:path*",  permanent: false },

// -----------------------------------------------------------------------
// ✅ Pagine statiche FR/ES con slug errato
// -----------------------------------------------------------------------
{ source: "/fr/fonctionnement",               destination: "/fr",                          permanent: true },
{ source: "/fr/categories/virtualizzazione",  destination: "/fr/categories/virtualisation", permanent: true },
{ source: "/es/categorias/programmazione",    destination: "/es/categorias/programacion",   permanent: true },
{ source: "/es/contactos",                    destination: "/es",                           permanent: false },

// -----------------------------------------------------------------------
// ✅ Legal pages — slug da verificare nelle tue pagine Next.js
//    Se i tuoi slug sono diversi (es. /it/informativa-privacy) aggiorna qui
// -----------------------------------------------------------------------
{ source: "/it/privacy-policy",   destination: "/it/privacy",   permanent: true },
{ source: "/es/privacy-policy",   destination: "/es/privacy",   permanent: true },
{ source: "/es/terms-conditions", destination: "/es/terminos",   permanent: true },
{ source: "/fr/privacy-policy",   destination: "/fr/privacy",   permanent: true },
{ source: "/fr/cookie-policy",    destination: "/fr/cookie",   permanent: true },
{ source: "/es/cookie-policy",    destination: "/es/cookie",   permanent: true },

/**
 * SECONDO BLOCCO REDIRECT — 35 URL ancora in 404 (analisi 18 mag 2026)
 * Aggiungi in next.config.ts insieme agli altri, PRIMA del blocco "Garbage / bot paths"
 */

// -----------------------------------------------------------------------
// ✅ EN: slug che non esistono o rinominati
// -----------------------------------------------------------------------
{ source: "/certifications/google-tensorflow",          destination: "/certifications/google-tensorflow-developer", permanent: true },
{ source: "/certifications/python",                     destination: "/certifications/python-developer",            permanent: true },
{ source: "/certifications/comptia-network-plus",       destination: "/certifications/network-plus",                permanent: true },
{ source: "/certifications/comptia-network-plus/:path*",destination: "/certifications/network-plus/:path*",         permanent: true },
{ source: "/certifications/dp-900-azure-data-fundamentals",  destination: "/certifications/dp-900",             permanent: true },
{ source: "/certifications/pl-300-power-bi-data-analyst",    destination: "/certifications/pl-300",             permanent: true },

// -----------------------------------------------------------------------
// ✅ IT: slug che non esistono o rinominati
// -----------------------------------------------------------------------
{ source: "/it/certificazioni/google-tensorflow",            destination: "/it/certificazioni/google-tensorflow-developer", permanent: true },
{ source: "/it/certificazioni/dp-900-azure-data-fundamentals", destination: "/it/certificazioni/dp-900",         permanent: true },
{ source: "/it/certificazioni/pl-300-power-bi-data-analyst",   destination: "/it/certificazioni/pl-300",         permanent: true },

// -----------------------------------------------------------------------
// ✅ FR: slug che non esistono o rinominati
// -----------------------------------------------------------------------
{ source: "/fr/certifications/comptia-a-plus",               destination: "/fr/certifications/comptia-a-plus",   permanent: true }, // verifica esista
{ source: "/fr/certifications/comptia-network-plus",         destination: "/fr/certifications/network-plus",     permanent: true },
{ source: "/fr/certifications/dp-900-azure-data-fundamentals", destination: "/fr/certifications/dp-900",         permanent: true },
{ source: "/fr/certifications/pl-300-power-bi-data-analyst",   destination: "/fr/certifications/pl-300",         permanent: true },
{ source: "/fr/certifications/eipass",                       destination: "/fr/certifications/eipass",           permanent: true }, // verifica slug FR esatto
{ source: "/fr/certifications/microsoft-csharp",             destination: "/fr/certifications/microsoft-csharp", permanent: true }, // verifica esista in FR

// -----------------------------------------------------------------------
// ✅ ES: slug che non esistono o rinominati
// -----------------------------------------------------------------------
{ source: "/es/certificaciones/comptia-a-plus",              destination: "/es/certificaciones/comptia-a-plus",  permanent: true }, // verifica esista
{ source: "/es/certificaciones/comptia-network-plus",        destination: "/es/certificaciones/network-plus",    permanent: true },
{ source: "/es/certificaciones/dp-900-azure-data-fundamentals", destination: "/es/certificaciones/dp-900",       permanent: true },
{ source: "/es/certificaciones/pl-300-power-bi-data-analyst",   destination: "/es/certificaciones/pl-300",       permanent: true },
{ source: "/es/certificaciones/google-tensorflow",           destination: "/es/certificaciones/google-tensorflow-developer", permanent: true },
{ source: "/es/certificaciones/microsoft-csharp",            destination: "/es/certificaciones/microsoft-csharp", permanent: true }, // verifica esista in ES
{ source: "/es/certificaciones/mysql-certification",         destination: "/es/certificaciones/mysql",            permanent: true },
{ source: "/es/certificaciones/python",                      destination: "/es/certificaciones/python-developer", permanent: true },
{ source: "/es/certificaciones/vmware-certified-professional", destination: "/es/certificaciones/vmware-certified-professional", permanent: true }, // verifica esista

// -----------------------------------------------------------------------
// 🐛 BUG: /roadmap-management/undefined/... e altri /undefined/
//    Stesso bug &/undefined — variabile undefined nel codice
// -----------------------------------------------------------------------
{ source: "/roadmap-management/undefined/:path*", destination: "/roadmap-management", permanent: false },
{ source: "/how-it-works/undefined/:path*",       destination: "/",                  permanent: false },
{ source: "/privacy/undefined/:path*",            destination: "/privacy",            permanent: false },

// -----------------------------------------------------------------------
// ✅ Pagine statiche mancanti
// -----------------------------------------------------------------------
{ source: "/it/come-funziona",   destination: "/",   permanent: true }, // non esiste in IT? → homepage
{ source: "/es/como-funciona",   destination: "/es", permanent: true }, // idem ES
{ source: "/es/contactos",       destination: "/es", permanent: true }, // già nel primo blocco, ma ripetilo per sicurezza

// -----------------------------------------------------------------------
// ✅ Blog IT: post non trovato
// -----------------------------------------------------------------------
// /it/blog/come-funziona-certifyquiz → probabilmente esiste in /it/blog/{slug-corretto}
// Verifica lo slug esatto in Sanity, poi aggiorna:
{ source: "/it/blog/come-funziona-certifyquiz", destination: "/it/blog", permanent: false },

// -----------------------------------------------------------------------
// ✅ Categorie con slug errato (già nel primo blocco ma mancava ES/FR)
// -----------------------------------------------------------------------
{ source: "/es/categorias/programmazione",   destination: "/es/categorias/programacion",   permanent: true },
{ source: "/fr/categories/virtualizzazione", destination: "/fr/categories/virtualisation", permanent: true },
      // ---------------------------------------------------------------------
      // ✅ Garbage / bot paths
      // ---------------------------------------------------------------------
      { source: "/favicon.ico/:path*", destination: "/favicon.ico", permanent: true },
    ];
  },
};

export default nextConfig;