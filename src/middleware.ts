import { NextResponse, type NextRequest } from "next/server";

const LOCALES = new Set(["it", "en", "fr", "es"]);
function isLocale(s?: string) {
  return !!s && LOCALES.has(s);
}
function buildPath(parts: string[]) {
  return "/" + parts.filter(Boolean).join("/");
}

// 301 helper (SEO canonical)
function redirect301(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 301);
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
  // QUICK TAPS (spam / crawler weird paths)
  // es: /favicon.ico/undefined/database
  // ---------------------------------------------------------------------
  if (pathname.startsWith("/favicon.ico/")) {
    return redirect301(req, "/favicon.ico");
  }

  // ---------------------------------------------------------------------
  // ✅ HARD ALIASES (redirect stabili)
  // ---------------------------------------------------------------------

  // IT: C# alias
  if (pathname === "/it/certificazioni/microsoft-csharp") {
    return redirect301(req, "/it/certificazioni/csharp");
  }

  // IT: Terms slug EN dentro IT
  if (pathname === "/it/terms-conditions") {
    return redirect301(req, "/it/termini");
  }

  // CCST Cybersecurity alias -> canonical slug
  if (pathname === "/certifications/cisco-ccst-cybersecurity") {
    return redirect301(req, "/certifications/cisco-ccst-security");
  }
  if (pathname === "/it/certificazioni/cisco-ccst-cybersecurity") {
    return redirect301(req, "/it/certificazioni/cisco-ccst-security");
  }

  // Slug legacy (certifications)
  if (pathname === "/certifications/tensorflow-developer")
    return redirect301(req, "/certifications/tensorflow");
  if (pathname === "/it/certificazioni/tensorflow-developer")
    return redirect301(req, "/it/certificazioni/tensorflow");

  if (pathname === "/certifications/mysql-certification")
    return redirect301(req, "/certifications/mysql");
  if (pathname === "/it/certificazioni/mysql-certification")
    return redirect301(req, "/it/certificazioni/mysql");

  if (pathname === "/certifications/csharp-certification")
    return redirect301(req, "/certifications/csharp");
  if (pathname === "/it/certificazioni/csharp-certification")
    return redirect301(req, "/it/certificazioni/csharp");

  if (pathname === "/certifications/vmware-certified-professional")
    return redirect301(req, "/certifications/vmware-vcp");
  if (pathname === "/it/certificazioni/vmware-certified-professional")
    return redirect301(req, "/it/certificazioni/vmware-vcp");

  // ---------------------------------------------------------------------
  // ✅ QUIZ: EN canonical = /en/quiz/*
  // - /quiz/* (root) -> /en/quiz/*
  // - legacy specifici vengono portati direttamente a /en
  // ---------------------------------------------------------------------

  // Quiz legacy (root) -> canonical EN quiz
  if (pathname === "/quiz/javascript")
    return redirect301(req, "/en/quiz/javascript-developer");

  // Quiz legacy IT (resta IT)
  if (pathname === "/it/quiz/javascript")
    return redirect301(req, "/it/quiz/javascript-developer");

  // Qualsiasi /quiz/* senza prefisso lingua => /en/quiz/*
  // (NON tocca /it/quiz, /fr/quiz, /es/quiz, /en/quiz)
  if (pathname === "/quiz" || pathname.startsWith("/quiz/")) {
    return redirect301(req, `/en${pathname}`);
  }

  // ---------------------------------------------------------------------
  // ✅ REVIEW ERRORS: EN-root
  // ---------------------------------------------------------------------
  if (pathname === "/review" || pathname.startsWith("/review/")) {
    return NextResponse.next();
  }
  const reviewPrefixed = pathname.match(/^\/(it|en|fr|es)\/review(\/|$)/);
  if (reviewPrefixed) {
    return redirect301(req, pathname.replace(/^\/(it|en|fr|es)/, ""));
  }

  // ---------------------------------------------------------------------
  // ✅ BLOG canonical = /en/blog
  // - /blog/*        -> /en/blog/*
  // - /it|fr|es/blog -> /en/blog/*
  // ---------------------------------------------------------------------
  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    return redirect301(req, `/en${pathname}`);
  }
  const blogPrefixed = pathname.match(/^\/(it|fr|es)\/blog(\/|$)/);
  if (blogPrefixed) {
    // /fr/blog/x -> /en/blog/x
    const newPath = pathname.replace(/^\/(it|fr|es)/, "/en");
    return redirect301(req, newPath);
  }

  // ---------------------------------------------------------------------
  // ✅ LEGACY "mixed by category" -> NEW /it/quiz/<cert>/mixed
  // ---------------------------------------------------------------------
  if (pathname === "/quiz/sicurezza/mixed")
    return redirect301(req, "/it/quiz/security-plus/mixed");
  if (pathname === "/quiz/reti/mixed")
    return redirect301(req, "/it/quiz/ccna/mixed");
  if (pathname === "/quiz/cloud/mixed")
    return redirect301(req, "/it/quiz/aws-cloud-practitioner/mixed");
  if (pathname === "/quiz/database/mixed")
    return redirect301(req, "/it/quiz/microsoft-sql-server/mixed");
  if (pathname === "/quiz/programmazione/mixed")
    return redirect301(req, "/it/quiz/javascript-developer/mixed");
  if (pathname === "/quiz/virtualizzazione/mixed")
    return redirect301(req, "/it/quiz/vmware-vcp/mixed");
  if (pathname === "/quiz/intelligenza-artificiale/mixed")
    return redirect301(req, "/it/quiz/microsoft-ai-fundamentals/mixed");

  if (pathname === "/it/quiz/sicurezza/mixed")
    return redirect301(req, "/it/quiz/security-plus/mixed");
  if (pathname === "/it/quiz/reti/mixed")
    return redirect301(req, "/it/quiz/ccna/mixed");
  if (pathname === "/it/quiz/cloud/mixed")
    return redirect301(req, "/it/quiz/aws-cloud-practitioner/mixed");
  if (pathname === "/it/quiz/database/mixed")
    return redirect301(req, "/it/quiz/microsoft-sql-server/mixed");

  // ---------------------------------------------------------------------
  // ✅ NORMALIZZAZIONE PREFISSI LINGUA + SEGMENTI SPORCHI
  // ---------------------------------------------------------------------
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return NextResponse.next();

  let changed = false;

  // EN root: rimuovi /en SOLO per SEO pages (non quiz, non blog)
  if (parts[0] === "en" && parts[1] !== "quiz" && parts[1] !== "blog") {
    parts.shift();
    changed = true;
  }

  // doppia lingua: tieni solo la seconda
  if (isLocale(parts[0]) && isLocale(parts[1])) {
    const second = parts[1];
    parts.splice(0, 2, second);
    changed = true;
  }

  // locale corrente
  const locale = isLocale(parts[0]) ? parts[0] : "en";
  const segIndex = isLocale(parts[0]) ? 1 : 0;
  const seg = parts[segIndex];

  // segmenti canonici per lingua
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

  if (!changed) return NextResponse.next();

  return redirect301(req, buildPath(parts));
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
