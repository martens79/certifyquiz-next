// src/app/certifications/layout.tsx
import type { ReactNode } from "react";
import LayoutShellClient from "@/components/layout/LayoutShellClient";

export default function CertificationsLayout({ children }: { children: ReactNode }) {
  // ✅ EN root route: /certifications
  return <LayoutShellClient lang="en">{children}</LayoutShellClient>;
}
