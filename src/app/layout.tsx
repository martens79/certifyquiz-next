// src/app/layout.tsx
import "./globals.css";
import { Inter, Manrope } from "next/font/google";
import { cookies } from "next/headers";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import { ConsentProvider } from "@/components/analytics/ConsentProvider";
import RootShellClient from "@/components/layout/RootShellClient";
import { AuthProvider } from "@/components/auth/AuthProvider"; // ✅ aggiungi
import ChatbotWidget from "@/components/ChatbotWidget";
import { QuizTutorProvider } from "@/components/quiz/QuizTutorContext";
import TwaGuard from "@/components/twa/TwaGuard";
import { TWA_BOOTSTRAP_SCRIPT } from "@/lib/twa";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "CertifyQuiz",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
  other: {
    // Verifica proprietà sito per l'account AdSense in revisione (ca-pub-9931117843269176).
    // Nessuno script caricato: solo un meta tag statico, nessun annuncio servito da questo.
    "google-adsense-account": "ca-pub-9931117843269176",
  },
};

export const viewport = {
  themeColor: "#0f172a",
};
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
      <head>
        {/* App Android (TWA): imposta data-twa prima del primo paint. Fuori dalla TWA e' un no-op. */}
        <script dangerouslySetInnerHTML={{ __html: TWA_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className={`${inter.variable} ${manrope.variable}`}>
        <TwaGuard />
        <ConsentProvider>
          <GoogleAnalytics />
          <MetaPixel />

          {/* ✅ Provider client globale: abilita isAdmin/isPremiumUser/premiumLocked ovunque */}
          <AuthProvider>
            <QuizTutorProvider>
              <RootShellClient>{children}</RootShellClient>
              <ChatbotWidget />
            </QuizTutorProvider>
          </AuthProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
