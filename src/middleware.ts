import { NextResponse, type NextRequest } from "next/server";

const LOCALES = new Set(["it", "en", "fr", "es"]);

function isLocale(s?: string) {
  return !!s && LOCALES.has(s);
}

function buildPath(parts: string[]) {
  return "/" + parts.filter(Boolean).join("/");
}

// Detect locale from any pathname.
// EN root canonical: if no locale prefix, assume "en".
function detectLocaleFromPath(pathname: string) {
  const first = pathname.split("/")[1];
  if (isLocale(first)) return first;
  return "en";
}

// Attach cookie used by RootLayout (<html lang>)
function withLangCookie(res: NextResponse, lang: string) {
  res.cookies.set("cq_lang", lang, { path: "/" });
  return res;
}

// 301 helper + set language cookie
function redirect301(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;

  const res = NextResponse.redirect(url, 301);
  const lang = detectLocaleFromPath(pathname);

  return withLangCookie(res, lang);
}
function canonicalCertSlug(slug: string) {
  const map: Record<string, string> = {
    "vmware-certified-professional": "vmware-vcp",
    "tensorflow-developer": "tensorflow",
    "google-tensorflow": "tensorflow",
    "mysql-certification": "mysql",
    "csharp-certification": "csharp",
    "comptia-security-plus": "security-plus",
    "comptia-network-plus": "network-plus",
    "python": "python-developer",
    "microsoft-ai-fundamentals": "microsoft-ai",
    "cisco-ccst-security": "cisco-ccst-cybersecurity",
    "ccst": "cisco-ccst-networking",
  };

  return map[slug] ?? slug;
}

function redirectLegacyCertificationTopic(req: NextRequest, pathname: string) {
  const patterns: Array<{
    re: RegExp;
    build: (certSlug: string) => string;
  }> = [
    {
      re: /^\/certifications\/([^/]+)\/([^/]+)(?:\/.*)?$/,
      build: (certSlug) => `/certifications/${canonicalCertSlug(certSlug)}`,
    },
    {
      re: /^\/it\/certificazioni\/([^/]+)\/([^/]+)(?:\/.*)?$/,
      build: (certSlug) => `/it/certificazioni/${canonicalCertSlug(certSlug)}`,
    },
    {
      re: /^\/fr\/certifications\/([^/]+)\/([^/]+)(?:\/.*)?$/,
      build: (certSlug) => `/fr/certifications/${canonicalCertSlug(certSlug)}`,
    },
    {
      re: /^\/es\/certificaciones\/([^/]+)\/([^/]+)(?:\/.*)?$/,
      build: (certSlug) => `/es/certificaciones/${canonicalCertSlug(certSlug)}`,
    },
  ];

  for (const pattern of patterns) {
    const match = pathname.match(pattern.re);

    if (match) {
      const certSlug = match[1];
      return redirect301(req, pattern.build(certSlug));
    }
  }

  return null;
}
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // ---------------------------------------------------------------------
  // SKIP assets / api
  // ---------------------------------------------------------------------
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/sitemap") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // ---------------------------------------------------------------------
  // QUICK TRAPS
  // Spam / crawler weird paths / broken generated URLs
  // ---------------------------------------------------------------------

  // Asset sporchi tipo /favicon.ico/undefined/database
  if (pathname.startsWith("/favicon.ico/")) {
    return redirect301(req, "/favicon.ico");
  }

  // URL rotti con "undefined" generati/scoperti da crawler o vecchi link.
  // Esempi:
  // /roadmap-management/undefined/database
  // /how-it-works/undefined/reti
  // /privacy/undefined/virtualizzazione
  // /quiz-suggeriti/undefined/database
  // /&/undefined/cloud
  if (pathname.includes("/undefined/") || pathname.endsWith("/undefined")) {
    if (pathname.startsWith("/it/")) {
      return redirect301(req, "/it/percorsi");
    }

    if (pathname.startsWith("/es/")) {
      return redirect301(req, "/es/rutas");
    }

    if (pathname.startsWith("/fr/")) {
      return redirect301(req, "/fr/parcours");
    }

    if (pathname.startsWith("/roadmap-management")) {
      return redirect301(req, "/paths");
    }

    if (pathname.startsWith("/how-it-works")) {
  return redirect301(req, "/");
}

    if (pathname.startsWith("/privacy")) {
      return redirect301(req, "/privacy");
    }

    if (pathname.startsWith("/quiz-suggeriti")) {
      return redirect301(req, "/suggested");
    }

    if (pathname.startsWith("/&")) {
      return redirect301(req, "/");
    }

    return redirect301(req, "/");
  }

  // ---------------------------------------------------------------------
  // HARD ALIASES
  // Redirect stabili
  // ---------------------------------------------------------------------

  // IT: C# alias
  if (pathname === "/it/certificazioni/microsoft-csharp") {
    return redirect301(req, "/it/certificazioni/csharp");
  }

  // IT: Terms slug EN dentro IT
  if (pathname === "/it/terms-conditions") {
    return redirect301(req, "/it/termini");
  }

  // Slug legacy certificazioni
  if (pathname === "/certifications/tensorflow-developer") {
    return redirect301(req, "/certifications/tensorflow");
  }

  if (pathname === "/it/certificazioni/tensorflow-developer") {
    return redirect301(req, "/it/certificazioni/tensorflow");
  }

  if (pathname === "/certifications/mysql-certification") {
    return redirect301(req, "/certifications/mysql");
  }

  if (pathname === "/it/certificazioni/mysql-certification") {
    return redirect301(req, "/it/certificazioni/mysql");
  }

  if (pathname === "/certifications/csharp-certification") {
    return redirect301(req, "/certifications/csharp");
  }

  if (pathname === "/it/certificazioni/csharp-certification") {
    return redirect301(req, "/it/certificazioni/csharp");
  }

  if (pathname === "/certifications/microsoft-csharp") {
    return redirect301(req, "/certifications/csharp");
  }

  if (pathname === "/certifications/vmware-certified-professional") {
    return redirect301(req, "/certifications/vmware-vcp");
  }

  if (pathname === "/it/certificazioni/vmware-certified-professional") {
    return redirect301(req, "/it/certificazioni/vmware-vcp");
  }
    // ---------------------------------------------------------------------
  // LEGACY CERTIFICATION SLUGS
  // Vecchi slug singoli ancora indicizzati da Google
  // ---------------------------------------------------------------------

  // Google TensorFlow -> TensorFlow
  if (pathname === "/certifications/google-tensorflow") {
    return redirect301(req, "/certifications/tensorflow");
  }

  if (pathname === "/it/certificazioni/google-tensorflow") {
    return redirect301(req, "/it/certificazioni/tensorflow");
  }

  if (pathname === "/fr/certifications/google-tensorflow") {
    return redirect301(req, "/fr/certifications/tensorflow");
  }

  if (pathname === "/es/certificaciones/google-tensorflow") {
    return redirect301(req, "/es/certificaciones/tensorflow");
  }

  // Python -> Python Developer
  if (pathname === "/certifications/python") {
    return redirect301(req, "/certifications/python-developer");
  }

  if (pathname === "/it/certificazioni/python") {
    return redirect301(req, "/it/certificazioni/python-developer");
  }

  if (pathname === "/fr/certifications/python") {
    return redirect301(req, "/fr/certifications/python-developer");
  }

  if (pathname === "/es/certificaciones/python") {
    return redirect301(req, "/es/certificaciones/python-developer");
  }

  // CompTIA Network+ -> Network+
  if (pathname === "/certifications/comptia-network-plus") {
    return redirect301(req, "/certifications/network-plus");
  }

  if (pathname === "/it/certificazioni/comptia-network-plus") {
    return redirect301(req, "/it/certificazioni/network-plus");
  }

  if (pathname === "/fr/certifications/comptia-network-plus") {
    return redirect301(req, "/fr/certifications/network-plus");
  }

  if (pathname === "/es/certificaciones/comptia-network-plus") {
    return redirect301(req, "/es/certificaciones/network-plus");
  }
    // ---------------------------------------------------------------------
  // STATIC LEGACY PAGES
  // Vecchie pagine statiche/localizzate non più esistenti
  // ---------------------------------------------------------------------

  if (pathname === "/it/come-funziona") {
    return redirect301(req, "/it/percorsi");
  }

  if (pathname === "/es/como-funciona") {
    return redirect301(req, "/es/rutas");
  }

  if (pathname === "/fr/fonctionnement") {
    return redirect301(req, "/fr/parcours");
  }

  if (pathname === "/es/contactos") {
    return redirect301(req, "/es");
  }

  if (pathname === "/fr/inizia") {
    return redirect301(req, "/fr");
  }

  // ---------------------------------------------------------------------
  // LEGACY HUBS
  // ---------------------------------------------------------------------

  if (pathname === "/hub/security") {
    return redirect301(req, "/categories/security");
  }

  if (pathname === "/it/hub/security") {
    return redirect301(req, "/it/categorie/sicurezza");
  }

  if (pathname === "/es/hub/security") {
    return redirect301(req, "/es/categorias/seguridad");
  }

  if (pathname === "/fr/hub/security") {
    return redirect301(req, "/fr/categories/securite");
  }

  // ---------------------------------------------------------------------
  // ECDL -> ICDL
  // ---------------------------------------------------------------------

  if (pathname === "/certifications/ecdl" || pathname === "/en/certifications/ecdl") {
    return redirect301(req, "/certifications/icdl");
  }

  if (pathname === "/it/certificazioni/ecdl") {
    return redirect301(req, "/it/certificazioni/icdl");
  }

  if (pathname === "/fr/certifications/ecdl") {
    return redirect301(req, "/fr/certifications/icdl");
  }

  if (pathname === "/es/certificaciones/ecdl") {
    return redirect301(req, "/es/certificaciones/icdl");
  }
  // ---------------------------------------------------------------------
  // LEGACY CERTIFICATION TOPIC URLS
  //
  // Vecchia struttura:
  // /certifications/:certSlug/:topicSlug
  // /it/certificazioni/:certSlug/:topicSlug
  // /fr/certifications/:certSlug/:topicSlug
  // /es/certificaciones/:certSlug/:topicSlug
  //
  // Nuova struttura: redirect alla pagina certificazione.
  // ---------------------------------------------------------------------
  const legacyCertTopicRedirect = redirectLegacyCertificationTopic(req, pathname);

  if (legacyCertTopicRedirect) {
    return legacyCertTopicRedirect;
  }
  // ---------------------------------------------------------------------
  // LEGACY "mixed by category" -> NEW /it/quiz/<cert>/mixed
  //
  // IMPORTANTE:
  // Questo blocco deve stare PRIMA del redirect generale /quiz/* -> /en/quiz/*
  // altrimenti /quiz/reti/mixed diventa /en/quiz/reti/mixed e resta rotto.
  // ---------------------------------------------------------------------

  if (pathname === "/quiz/sicurezza/mixed") {
    return redirect301(req, "/it/quiz/security-plus/mixed");
  }

  if (pathname === "/quiz/reti/mixed") {
    return redirect301(req, "/it/quiz/ccna/mixed");
  }

  if (pathname === "/quiz/cloud/mixed") {
    return redirect301(req, "/it/quiz/aws-cloud-practitioner/mixed");
  }

  if (pathname === "/quiz/database/mixed") {
    return redirect301(req, "/it/quiz/microsoft-sql-server/mixed");
  }

  if (pathname === "/quiz/programmazione/mixed") {
    return redirect301(req, "/it/quiz/javascript-developer/mixed");
  }

  if (pathname === "/quiz/virtualizzazione/mixed") {
    return redirect301(req, "/it/quiz/vmware-vcp/mixed");
  }

  if (pathname === "/quiz/intelligenza-artificiale/mixed") {
    return redirect301(req, "/it/quiz/microsoft-ai-fundamentals/mixed");
  }

  if (pathname === "/it/quiz/sicurezza/mixed") {
    return redirect301(req, "/it/quiz/security-plus/mixed");
  }

  if (pathname === "/it/quiz/reti/mixed") {
    return redirect301(req, "/it/quiz/ccna/mixed");
  }

  if (pathname === "/it/quiz/cloud/mixed") {
    return redirect301(req, "/it/quiz/aws-cloud-practitioner/mixed");
  }

  if (pathname === "/it/quiz/database/mixed") {
    return redirect301(req, "/it/quiz/microsoft-sql-server/mixed");
  }

  if (pathname === "/it/quiz/programmazione/mixed") {
    return redirect301(req, "/it/quiz/javascript-developer/mixed");
  }

  if (pathname === "/it/quiz/virtualizzazione/mixed") {
    return redirect301(req, "/it/quiz/vmware-vcp/mixed");
  }

  if (pathname === "/it/quiz/intelligenza-artificiale/mixed") {
    return redirect301(req, "/it/quiz/microsoft-ai-fundamentals/mixed");
  }

  // ---------------------------------------------------------------------
  // QUIZ
  // EN canonical = /en/quiz/*
  //
  // - /quiz/* root -> /en/quiz/*
  // - legacy specifici vengono gestiti prima
  // ---------------------------------------------------------------------

  if (pathname === "/quiz/javascript") {
    return redirect301(req, "/en/quiz/javascript-developer");
  }

  if (pathname === "/it/quiz/javascript") {
    return redirect301(req, "/it/quiz/javascript-developer");
  }

  // Qualsiasi /quiz/* senza prefisso lingua => /en/quiz/*
  // Non tocca /it/quiz, /fr/quiz, /es/quiz, /en/quiz
  if (pathname === "/quiz" || pathname.startsWith("/quiz/")) {
    return redirect301(req, `/en${pathname}`);
  }

  // ---------------------------------------------------------------------
  // REVIEW ERRORS
  // EN-root
  // ---------------------------------------------------------------------

  if (pathname === "/review" || pathname.startsWith("/review/")) {
    return withLangCookie(NextResponse.next(), detectLocaleFromPath(pathname));
  }

  const reviewPrefixed = pathname.match(/^\/(it|en|fr|es)\/review(\/|$)/);

  if (reviewPrefixed) {
    return redirect301(req, pathname.replace(/^\/(it|en|fr|es)/, ""));
  }

  // ---------------------------------------------------------------------
  // BLOG
  // EN root optional: /en/blog -> /blog
  // ---------------------------------------------------------------------

  if (pathname.startsWith("/en/blog")) {
    return redirect301(req, pathname.replace(/^\/en/, ""));
  }

  // ---------------------------------------------------------------------
  // NORMALIZZAZIONE PREFISSI LINGUA + SEGMENTI SPORCHI
  // ---------------------------------------------------------------------

  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) {
    return withLangCookie(NextResponse.next(), detectLocaleFromPath(pathname));
  }

  let changed = false;

  // EN root: rimuovi /en SOLO per SEO pages.
  // Non rimuovere /en da quiz e blog.
  if (parts[0] === "en" && parts[1] !== "quiz" && parts[1] !== "blog") {
    parts.shift();
    changed = true;
  }

  // Doppia lingua: /it/en/... -> /en/...
  // Tiene solo la seconda lingua.
  if (isLocale(parts[0]) && isLocale(parts[1])) {
    const second = parts[1];
    parts.splice(0, 2, second);
    changed = true;
  }

  // Locale corrente
  const locale = isLocale(parts[0]) ? parts[0] : "en";
  const segIndex = isLocale(parts[0]) ? 1 : 0;
  const seg = parts[segIndex];

  // Segmenti canonici per lingua
  if (locale === "fr") {
    if (seg === "certificazioni") {
      parts[segIndex] = "certifications";
      changed = true;
    }

    if (seg === "categorie") {
      parts[segIndex] = "categories";
      changed = true;
    }
  }

  if (locale === "es") {
    if (seg === "certificazioni") {
      parts[segIndex] = "certificaciones";
      changed = true;
    }

    if (seg === "categorie") {
      parts[segIndex] = "categorias";
      changed = true;
    }

    if (seg === "certifications") {
      parts[segIndex] = "certificaciones";
      changed = true;
    }
  }

  if (locale === "it") {
    if (seg === "certifications") {
      parts[segIndex] = "certificazioni";
      changed = true;
    }

    if (seg === "categories") {
      parts[segIndex] = "categorie";
      changed = true;
    }
  }

  if (!changed) {
    return withLangCookie(NextResponse.next(), detectLocaleFromPath(pathname));
  }

  return redirect301(req, buildPath(parts));
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};