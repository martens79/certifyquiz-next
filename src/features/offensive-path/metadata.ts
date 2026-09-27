// src/features/offensive-path/metadata.ts
// Same shape as buildRoadmapMetadata (canonical + it/en/fr/es + x-default=en),
// on the Offensive Security Path URL.

import type { Metadata } from "next";
import { offensiveSecurityPath, toHreflang, type Locale } from "@/lib/paths";
import { PATH_COPY } from "./copy";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");
const locales: readonly Locale[] = ["it", "en", "fr", "es"];

export function buildOffensivePathMetadata(lang: Locale): Metadata {
  const { title, description } = PATH_COPY[lang].meta;
  const canonical = `${SITE}${offensiveSecurityPath(lang)}`;
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[toHreflang(locale)] = `${SITE}${offensiveSecurityPath(locale)}`;
  }
  languages["x-default"] = `${SITE}${offensiveSecurityPath("en")}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical, languages },
    openGraph: { type: "website", title, description, url: canonical, siteName: "CertifyQuiz", locale: toHreflang(lang) },
  };
}
