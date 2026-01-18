// src/app/profile/layout.tsx
import type { ReactNode } from "react";

export default function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Content-only layout.
  // Header/Footer are provided by RootShellClient or lang layouts.
  return <>{children}</>;
}
