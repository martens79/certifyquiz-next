// src/app/[lang]/profile/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import ProfileClient from "./profile-client";
import ProfileSkeleton from "./ProfileSkeleton";

type Lang = "it" | "en" | "fr" | "es";

export const dynamic = "force-dynamic";

// 🔧 noindex: pagina account, non deve apparire su Google
export async function generateMetadata(
  props: { params: Promise<{ lang: Lang }> }
): Promise<Metadata> {
  const { lang } = await props.params;

  const title =
    lang === "it" ? "Profilo utente — CertifyQuiz" : "User Profile — CertifyQuiz";

  const description =
    lang === "it"
      ? "Area personale riservata: progressi, risultati e badge."
      : "Private area: your progress, results and badges.";

  return {
    title,
    description,
    robots: { index: false, follow: false }, // 🔧 follow=false per sicurezza
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function Page(
  props: { params: Promise<{ lang: Lang }> }
) {
  const { lang } = await props.params;

  return (
    <Suspense fallback={<ProfileSkeleton lang={lang} />}>
      <ProfileClient lang={lang} />
    </Suspense>
  );
}
