// src/app/[lang]/profile/page.tsx
import type { Metadata } from "next";
import ProfileClient from "./profile-client";

type Lang = "it" | "en" | "fr" | "es";
const ALL: Lang[] = ["it", "en", "fr", "es"];

// Base assoluta (senza trailing slash)
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");

// Path localizzati del profilo
const PATH_BY_LANG: Record<Lang, string> = {
  it: "/it/profile",
  en: "/en/profile",
  fr: "/fr/profile",
  es: "/es/profile",
};

// Mappa hreflang → locale completo
const hreflang = (l: Lang) => (l === "it" ? "it-IT" : l === "en" ? "en-US" : l === "fr" ? "fr-FR" : "es-ES");

export async function generateMetadata(
  props: { params: Promise<{ lang: Lang }> }
): Promise<Metadata> {
  const { lang } = await props.params;

  // hreflang alternates
  const languages = Object.fromEntries(
    ALL.map((l) => [hreflang(l), `${SITE}${PATH_BY_LANG[l]}`])
  );
  (languages as Record<string, string>)["x-default"] = `${SITE}${PATH_BY_LANG.it}`;

  const title = lang === "it" ? "Profilo | CertifyQuiz" : "Profile | CertifyQuiz";
  const description =
    lang === "it"
      ? "Consulta progressi, risultati e badge sul tuo profilo CertifyQuiz."
      : "View your progress, results and badges on your CertifyQuiz profile.";

  const url = `${SITE}${PATH_BY_LANG[lang]}`;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    // Il profilo utente di norma NON va indicizzato
    robots: { index: false, follow: true },
    openGraph: {
      type: "profile",
      url,
      title,
      description,
      siteName: "CertifyQuiz",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// In Next 15 PPR `params` è una Promise → va await-ato
export default async function Page(
  props: { params: Promise<{ lang: Lang }> }
) {
  const { lang } = await props.params;
  return <ProfileClient lang={lang} />;
}
