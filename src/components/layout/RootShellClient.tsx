"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import LayoutShellClient from "@/components/layout/LayoutShellClient";
import type { Locale } from "@/lib/i18n";

import { AuthProvider } from "@/components/auth/AuthProvider";
import LanguageSuggestionBanner from "@/components/i18n/LanguageSuggestionBanner";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";

export default function RootShellClient({ children }: { children: ReactNode }) {
  const p = usePathname() ?? "/";

  const m = p.match(/^\/(it|fr|es)(\/|$)/);
  const lang: Locale = (m?.[1] as Locale) || "en";

  return (
    <AuthProvider>
      <LanguageSuggestionBanner />

      <LayoutShellClient lang={lang}>{children}</LayoutShellClient>

      <ServiceWorkerRegister />
      <PwaInstallPrompt />
    </AuthProvider>
  );
}