// src/app/suggested/layout.tsx
import type { ReactNode } from "react";
import LayoutShellClient from "@/components/layout/LayoutShellClient";

export default function SuggestedLayout({ children }: { children: ReactNode }) {
  return <LayoutShellClient lang="en">{children}</LayoutShellClient>;
}
