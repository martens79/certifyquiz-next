"use client";

import type { ReactNode } from "react";
import LayoutShellClient from "@/components/layout/LayoutShellClient";
import { usePathname } from "next/navigation";

export default function RootShellClient({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";

  // ✅ IMPORTANTE:
  // RootShellClient deve wrappare SOLO le route SENZA prefisso lingua (EN root SEO).
  // Le route /it, /fr, /es (e /en se esiste) sono già wrappate da src/app/[lang]/layout.tsx.

  if (
    pathname.startsWith("/it") ||
    pathname.startsWith("/fr") ||
    pathname.startsWith("/es") ||
    pathname.startsWith("/en")
  ) {
    // niente wrapper qui, evitiamo doppio header
    return <>{children}</>;
  }

  // EN root
  return <LayoutShellClient lang="en">{children}</LayoutShellClient>;
}
