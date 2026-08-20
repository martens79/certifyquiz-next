import type { Metadata } from "next";
import { roadmapPath, toHreflang, type Locale } from "@/lib/paths";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");
const locales: readonly Locale[] = ["it", "en", "fr", "es"];

export function buildRoadmapMetadata({ lang, area, title, description }: {
  lang: Locale;
  area: "networking" | "cybersecurity";
  title: string;
  description: string;
}): Metadata {
  const canonical = `${SITE}${roadmapPath(lang, area)}`;
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[toHreflang(locale)] = `${SITE}${roadmapPath(locale, area)}`;
  }
  languages["x-default"] = `${SITE}${roadmapPath("en", area)}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical, languages },
    openGraph: { type: "website", title, description, url: canonical, siteName: "CertifyQuiz", locale: toHreflang(lang) },
  };
}
