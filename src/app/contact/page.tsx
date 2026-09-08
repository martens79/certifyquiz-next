import StaticPage from "@/app/[lang]/[page]/page";
import type { Locale } from "@/lib/i18n";

export default function Page() {
  return (
    <StaticPage
      params={Promise.resolve({ lang: "en" as Locale, page: "contact" })}
    />
  );
}
import type { Metadata } from "next";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");
export const metadata: Metadata = {
  title: "Contact CertifyQuiz",
  description: "Contact CertifyQuiz for support, corrections, privacy requests or general questions.",
  alternates: { canonical: `${SITE}/contact` },
};
