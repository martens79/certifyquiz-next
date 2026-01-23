import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/certifications") {
    const url = req.nextUrl.clone();
    url.pathname = "/en/certificazioni";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/certifications/")) {
    const slug = pathname.replace("/certifications/", "");
    const url = req.nextUrl.clone();
    url.pathname = `/en/certificazioni/${slug}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/certifications", "/certifications/:path*"],
};
