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

export function isPlannedPreviewEnabled(env: Env = process.env): boolean {
  return env[PLANNED_PREVIEW_ENV] === "1" && env.VERCEL_ENV !== "production" && env.NODE_ENV !== "production";
}

/** Public discovery surfaces (lists, category pages) never show planned certifications. */
export function isPubliclyListed(
  slug: string,
  registry: Readonly<Record<string, CertificationData | undefined>>
): boolean {
  return !isPlannedCertification(registry[slug]);
}
