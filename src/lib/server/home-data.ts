// src/lib/server/home-data.ts
//
// Dati server-side della home: metriche (home-stats) e lista leggera delle certificazioni
// per il finder mobile.
//
// Regole:
// - cache dati Next (1h per le metriche, 5 min per la lista, come /certifications);
// - timeout breve e NESSUN retry: la home non deve diventare piu' lenta se il backend lo e';
// - qualunque errore => `null`: la home usa il fallback client (metriche) o i soli chip (finder).

import "server-only";

import { CERTS_BY_SLUG } from "@/certifications/registry";
import { isPubliclyListed } from "@/certifications/publication";
import { normalizeSlug } from "@/lib/cert-slug";
import type { FinderCert } from "@/lib/home-finder";
import { certPath, type Locale } from "@/lib/paths";
import { backendGetJson } from "@/lib/server/backend-fetch";
import { CERTS_LIST_TAG } from "@/lib/server/certs";

const BASE_URL = (process.env.API_BASE_URL || "http://localhost:3000/api/backend").replace(/\/+$/, "");
const HOME_TIMEOUT_MS = 1500;

export type HomeStatsData = { questions: number; topics: number; certifications: number };

const isCount = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;

export async function getHomeStats(): Promise<HomeStatsData | null> {
  const res = await backendGetJson<Partial<HomeStatsData>>(`${BASE_URL}/public/home-stats`, {
    revalidate: 3600,
    tags: ["home-stats"],
    timeoutMs: HOME_TIMEOUT_MS,
    retry: false,
  });
  if (res.kind !== "ok") return null;
  const { questions, topics, certifications } = res.data ?? {};
  if (!isCount(questions) || !isCount(topics) || !isCount(certifications)) return null;
  return { questions, topics, certifications };
}

type RawCert = { slug?: unknown; name?: unknown; name_en?: unknown; name_fr?: unknown; name_es?: unknown };

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

export async function getHomeFinderCerts(lang: Locale): Promise<FinderCert[] | null> {
  const res = await backendGetJson<RawCert[]>(`${BASE_URL}/certifications`, {
    revalidate: 300,
    tags: [CERTS_LIST_TAG],
    timeoutMs: HOME_TIMEOUT_MS,
    retry: false,
  });
  if (res.kind !== "ok" || !Array.isArray(res.data)) return null;

  const seen = new Set<string>();
  const items: FinderCert[] = [];

  for (const raw of res.data) {
    const slug = normalizeSlug(raw?.slug);
    // Stesse regole di /certifications: niente slug vuoti, duplicati o certificazioni "planned".
    if (!slug || seen.has(slug) || !isPubliclyListed(slug, CERTS_BY_SLUG)) continue;

    const registry = CERTS_BY_SLUG[slug];
    const backendName = str((raw as Record<string, unknown>)[`name_${lang}`]) || str(raw?.name);
    const title = backendName || registry?.title?.[lang] || slug;

    const codes: string[] = [];
    const blueprint = registry?.examBlueprint;
    if (blueprint?.examCode) codes.push(blueprint.examCode);
    for (const exam of blueprint?.exams ?? []) if (exam.examCode) codes.push(exam.examCode);

    const keywords = [
      slug.replace(/-/g, " "),
      str(raw?.name),
      str(raw?.name_en),
      str(raw?.name_fr),
      str(raw?.name_es),
      ...Object.values(registry?.title ?? {}),
      blueprint?.provider ?? "",
      ...codes,
    ]
      .filter(Boolean)
      .join(" ");

    seen.add(slug);
    items.push({ slug, title, href: certPath(lang, slug), keywords });
  }

  return items.length > 0 ? items : null;
}
