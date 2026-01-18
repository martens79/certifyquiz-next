// src/app/[lang]/layout.tsx
import type { ReactNode } from "react";

export default async function LangLayout({
  children,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  return <>{children}</>;
}
