// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CertifyQuiz",
  description: "Quiz per certificazioni IT con spiegazioni dettagliate.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="min-h-dvh bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
