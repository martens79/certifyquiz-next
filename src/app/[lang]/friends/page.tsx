// src/app/[lang]/friends/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import FriendsClient from "./friends-client";

type Lang = Locale;

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: { params: Promise<{ lang: Lang }> }
): Promise<Metadata> {
  const { lang } = await props.params;
  const title = lang === "it" ? "Amici | CertifyQuiz" : "Friends | CertifyQuiz";
  return {
    title,
    robots: { index: false, follow: true },
  };
}

export default async function Page(
  props: { params: Promise<{ lang: Lang }> }
) {
  const { lang } = await props.params;

  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="animate-pulse rounded-2xl bg-white shadow ring-1 ring-black/5 p-6">
            <div className="h-4 w-40 bg-slate-200 rounded mb-3" />
            <div className="h-3 w-64 bg-slate-200 rounded mb-2" />
          </div>
        </main>
      }
    >
      <FriendsClient lang={lang} />
    </Suspense>
  );
}
