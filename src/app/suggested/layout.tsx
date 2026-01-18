// src/app/suggested/layout.tsx
import type { ReactNode } from "react";

export default function SuggestedLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Content-only layout.
  // Header/Footer are provided by RootShellClient (EN root) and by /it|/fr|/es layouts.
  return <>{children}</>;
}
