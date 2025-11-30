// src/app/[lang]/leaderboard/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import LeaderboardClient from "./leaderboard-client";

type Lang = Locale;
const ALL: Lang[] = ["it", "en", "fr", "es"];

const RAW_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE = RAW_SITE.replace(/\/+$/, "");

const PATH_BY_LANG: Record<Lang, string> = {
  it: "/it/leaderboard",
  en: "/en/leaderboard",
  fr: "/fr/leaderboard",
  es: "/es/leaderboard",
};

const hreflang = (l: Lang) =>
  l === "it" ? "it-IT" :
  l === "en" ? "en-US" :
  l === "fr" ? "fr-FR" : "es-ES";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: { params: Promise<{ lang: Lang }> }
): Promise<Metadata> {
  const { lang } = await props.params;

  const languages = Object.fromEntries(
    ALL.map((l) => [hreflang(l), `${SITE}${PATH_BY_LANG[l]}`])
  );
  (languages as Record<string, string>)["x-default"] = `${SITE}${PATH_BY_LANG.it}`;

  const title =
    lang === "it"
      ? "Classifica | CertifyQuiz"
      : "Leaderboard | CertifyQuiz";

  const description =
    lang === "it"
      ? "Guarda le migliori performance degli utenti su CertifyQuiz."
      : "See the top performances of CertifyQuiz users.";

  const url = `${SITE}${PATH_BY_LANG[lang]}`;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    // 🔒 Per ora non indicizziamo la classifica
    robots: { index: false, follow: true },
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
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

export default async function Page(
  props: { params: Promise<{ lang: Lang }> }
) {
  const { lang } = await props.params;

  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-5xl px-4 py-10">
          <div className="animate-pulse rounded-2xl bg-white shadow ring-1 ring-black/5 p-6">
            <div className="h-4 w-40 bg-slate-200 rounded mb-3" />
            <div className="h-3 w-64 bg-slate-200 rounded mb-2" />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-20 bg-slate-100 rounded-xl" />
              <div className="h-20 bg-slate-100 rounded-xl" />
            </div>
          </div>
        </main>
      }
    >
      <LeaderboardClient lang={lang} />
    </Suspense>
  );
}
