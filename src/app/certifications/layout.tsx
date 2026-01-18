// src/app/certifications/layout.tsx
import type { ReactNode } from "react";

export default function CertificationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Content-only layout.
  // Header/Footer are provided by:
  // - RootShellClient for EN root (no /en)
  // - /it, /fr, /es layouts for localized routes
  return <>{children}</>;
}
