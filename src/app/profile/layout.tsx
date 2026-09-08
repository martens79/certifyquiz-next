// src/app/profile/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Content-only layout.
  // Header/Footer are provided by RootShellClient or lang layouts.
  return <>{children}</>;
}
