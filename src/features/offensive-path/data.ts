// src/features/offensive-path/data.ts
// Live enrichment for the Offensive Security Path: counts per certification
// (GET /certifications/:slug/resources) and the lab list of a certification
// (GET /labs?certification=). Nothing here is required to render the page:
// on failure a stage simply shows no numbers / no inline lab list, while its
// static copy (what exists, what is planned) stays intact.

import "server-only";

import type { Locale } from "@/lib/paths";
import { getCertificationResources, type CertificationResources } from "@/lib/data";
import { PATH_STAGES } from "./stages";

const API = process.env.API_BASE_URL || "https://api.certifyquiz.com/api";

export type PathLabItem = {
  slug: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  /** Anonymous resolution (no user token server-side): true only for the free lab. */
  free: boolean;
};

export type PathLiveData = {
  resourcesBySlug: Record<string, CertificationResources | null>;
  labsByCertSlug: Record<string, PathLabItem[] | null>;
};

async function getCertLabs(certSlug: string, lang: Locale): Promise<PathLabItem[] | null> {
  try {
    const res = await fetch(
      `${API}/labs?certification=${encodeURIComponent(certSlug)}&lang=${lang}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!Array.isArray(json?.items)) return null;
    const items = (json.items as Array<Record<string, unknown>>)
      .slice()
      .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
    return items.map((item) => ({
      slug: String(item.slug),
      title: String(item.title),
      description: String(item.description ?? ""),
      estimatedMinutes: Number(item.estimated_minutes) || 0,
      free: item.locked === false,
    }));
  } catch {
    return null;
  }
}

export async function getPathLiveData(lang: Locale): Promise<PathLiveData> {
  const available = PATH_STAGES.filter((s) => s.status === "available");
  const certSlugs = Array.from(new Set(available.flatMap((s) => s.certSlugs)));
  const labSlugs = Array.from(
    new Set(available.map((s) => s.labsCertSlug).filter((s): s is string => !!s))
  );

  const [resources, labs] = await Promise.all([
    Promise.all(
      certSlugs.map((slug) => getCertificationResources(slug, lang).catch(() => null))
    ),
    Promise.all(labSlugs.map((slug) => getCertLabs(slug, lang))),
  ]);

  return {
    resourcesBySlug: Object.fromEntries(certSlugs.map((slug, i) => [slug, resources[i]])),
    labsByCertSlug: Object.fromEntries(labSlugs.map((slug, i) => [slug, labs[i]])),
  };
}
