// src/certifications/publication.ts
// Publication state of registry certifications.
//
// "planned" = registered but not launched: no public page (404), not listed, not indexed.
// A local developer preview can render planned pages with CERTIFYQUIZ_PLANNED_PREVIEW=1,
// but never in a production build or on Vercel production.

import type { CertificationData } from "./types";

export const PLANNED_PREVIEW_ENV = "CERTIFYQUIZ_PLANNED_PREVIEW";

type Env = Readonly<Record<string, string | undefined>>;

export function isPlannedCertification(cert: CertificationData | null | undefined): boolean {
  return cert?.publicationStatus === "planned";
}

/** Landing-only publication: the landing is public, everything else of the certification stays 404. */
export function isComingSoonCertification(cert: CertificationData | null | undefined): boolean {
  return cert?.publicationStatus === "coming_soon";
}

export function isPlannedPreviewEnabled(env: Env = process.env): boolean {
  return env[PLANNED_PREVIEW_ENV] === "1" && env.VERCEL_ENV !== "production" && env.NODE_ENV !== "production";
}

/**
 * Public discovery surfaces (lists, category pages, home) never show planned or coming-soon certifications:
 * a coming-soon landing is reachable by its URL, the sitemap and one contextual link, not by the catalogue.
 */
export function isPubliclyListed(
  slug: string,
  registry: Readonly<Record<string, CertificationData | undefined>>
): boolean {
  const cert = registry[slug];
  return !isPlannedCertification(cert) && !isComingSoonCertification(cert);
}

/** Language routes of a certification: only the languages in its launch scope exist (default: all). */
export function isCertificationOfferedInLang(
  cert: CertificationData | null | undefined,
  lang: string
): boolean {
  const languages = cert?.launchScope?.languages;
  return !languages || (languages as ReadonlyArray<string>).includes(lang);
}
