// src/app/categories/layout.tsx
import type { ReactNode } from "react";
import LayoutShellClient from "@/components/layout/LayoutShellClient";
import { dict, type Locale } from "@/lib/i18n";

/**
 * EN root routes (senza /en) devono comunque avere Header + Footer + BottomNav.
 * Le pagine /categories/* NON passano da /[lang]/layout.tsx, quindi qui replichiamo lo shell.
 */
export default function CategoriesLayout({ children }: { children: ReactNode }) {
  const lang: Locale = "en";

  return (
    <LayoutShellClient lang={lang} dict={dict.en}>
      {children}
    </LayoutShellClient>
  );
}
