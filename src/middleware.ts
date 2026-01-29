import { NextResponse, type NextRequest } from "next/server";

const LOCALES = new Set(["it", "en", "fr", "es"]);

function isLocale(s?: string) {
  return !!s && LOCALES.has(s);
}

function buildPath(parts: string[]) {
  return "/" + parts.filter(Boolean).join("/");
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // -------------------------------------------------------
  // SKIP assets / api
  // -------------------------------------------------------
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  // -------------------------------------------------------
  // LEGACY BLOG ROOT → /en/blog/...
  // -------------------------------------------------------
  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url, 308);
  }

  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return NextResponse.next();

  let changed = false;

  // -------------------------------------------------------
  // 1) NORMALIZZA PREFISSI LINGUA
  // -------------------------------------------------------
  // /en è root SOLO per SEO pages
  // ❌ NON per quiz
  // ❌ NON per blog
  if (
    parts[0] === "en" &&
    parts[1] !== "quiz" &&
    parts[1] !== "blog"
  ) {
    parts.shift();
    changed = true;
  }

  // /fr/es/... -> tieni solo il secondo (evita doppia lingua)
  if (isLocale(parts[0]) && isLocale(parts[1])) {
    const second = parts[1];
    parts.splice(0, 2, second);
    changed = true;
  }

  // ricalcola locale corrente
  const locale = isLocale(parts[0]) ? parts[0] : "en";
  const segIndex = isLocale(parts[0]) ? 1 : 0;
  const seg = parts[segIndex];

  // -------------------------------------------------------
  // 2) CORREGGI SEGMENTI "SPORCHI"
  // -------------------------------------------------------

  // FR
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

  // ES
  if (locale === "es") {
    if (seg === "certificazioni") {
      parts[segIndex] = "certificaciones";
      changed = true;
    }
    if (seg === "categorie") {
      parts[segIndex] = "categorias";
      changed = true;
    }
  }

  // IT
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

  // -------------------------------------------------------
  // 3) REDIRECT SE SERVE
  // -------------------------------------------------------
  if (!changed) return NextResponse.next();

  url.pathname = buildPath(parts);
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
