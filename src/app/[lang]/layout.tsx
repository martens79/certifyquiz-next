// src/app/[lang]/layout.tsx
import type { ReactNode } from "react";
import LayoutShellClient from "@/components/layout/LayoutShellClient";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // sicurezza: se qualcuno arriva con /xx/... non supportato
  const safeLang: Locale = isLocale(lang) ? lang : "it";

  return <LayoutShellClient lang={safeLang}>{children}</LayoutShellClient>;
}
