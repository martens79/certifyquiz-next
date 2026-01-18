"use client";

import type { ReactNode } from "react";
import LayoutShellClient from "@/components/layout/LayoutShellClient";
import { usePathname } from "next/navigation";
import { toLocale } from "@/lib/paths";

export default function RootShellClient({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";

  // determina lingua dal path
  const lang = pathname.startsWith("/it")
    ? "it"
    : pathname.startsWith("/fr")
    ? "fr"
    : pathname.startsWith("/es")
    ? "es"
    : "en"; // EN root

  return <LayoutShellClient lang={lang}>{children}</LayoutShellClient>;
}
