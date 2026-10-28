// Metadata of the EIPASS Standard "coming soon" landing.
//
// The ONLY indexable Standard URL is the Italian landing: index, follow, self-referencing canonical, no hreflang
// (no other language exists). Every other language answers 404 (CertificationDetailView), so it is noindex here too.
// This deliberately bypasses isCertificationIndexable: that rule is inventory-based, and a coming-soon landing has
// no quiz inventory by definition. Any other Standard surface (topics, quiz) stays out of every index rule.
import type { Metadata } from "next";

import { CERTS_BY_SLUG } from "@/certifications/registry";
import { isComingSoonCertification } from "@/certifications/publication";
import { EIPASS_STANDARD_LANDING_PATH, EIPASS_STANDARD_SLUG } from "@/lib/eipass-standard";

export function eipassStandardMetadata(lang: string, siteUrl: string): Metadata {
  const reg = CERTS_BY_SLUG[EIPASS_STANDARD_SLUG];
  if (lang !== "it" || !reg || !isComingSoonCertification(reg)) return { robots: { index: false, follow: true } };

  const base = siteUrl.replace(/\/+$/, "");
  const canonical = `${base}${EIPASS_STANDARD_LANDING_PATH}`;
  const title = reg.metaTitle?.it ?? reg.title.it;
  const description = reg.metaDescription?.it ?? reg.description.it;
  const image = `${base}/api/og?type=topic&title=${encodeURIComponent("EIPASS Standard")}&subtitle=${encodeURIComponent(
    "Quiz di preparazione in arrivo"
  )}&category=fundamentals`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: "CertifyQuiz",
      locale: "it_IT",
      images: [{ url: image, width: 1200, height: 630, alt: "EIPASS Standard — CertifyQuiz" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
