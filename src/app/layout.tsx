// src/app/layout.tsx
import "@/app/globals.css";
import { Inter, Manrope } from "next/font/google";
import { cookies } from "next/headers";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import RootShellClient from "@/components/layout/RootShellClient";
import { AuthProvider } from "@/components/auth/AuthProvider"; // ✅ aggiungi

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

// 👇 DEVE essere async
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("cq_lang")?.value || "en";

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable}`}>
        <GoogleAnalytics />

        {/* ✅ Provider client globale: abilita isAdmin/isPremiumUser/premiumLocked ovunque */}
        <AuthProvider>
          <RootShellClient>{children}</RootShellClient>
        </AuthProvider>
      </body>
    </html>
  );
}