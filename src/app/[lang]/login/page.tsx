// src/app/[lang]/login/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import LoginPageClient from "./login-client";

type Lang = Locale;

export const dynamic = "force-dynamic";

// 🔧 noindex: pagina di login, non deve apparire su Google
export async function generateMetadata(
  props: { params: Promise<{ lang: Lang }> }
): Promise<Metadata> {
  const { lang } = await props.params;

  const title =
    lang === "it" ? "Accedi — CertifyQuiz" : "Login — CertifyQuiz";

  const description =
    lang === "it"
      ? "Accedi al tuo account CertifyQuiz per vedere progressi, quiz e badge."
      : "Log in to your CertifyQuiz account to view progress, quizzes and badges.";

  return {
    title,
    description,
    robots: { index: false, follow: false }, // 👈 importantissimo
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function Page(
  props: { params: Promise<{ lang: Lang }> }
) {
  const { lang } = await props.params;

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-700 text-white text-lg">
        ⏳ ...
      </div>
    }>
      <LoginPageClient initialLang={lang} />
    </Suspense>
  );
}
