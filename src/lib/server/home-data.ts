// src/lib/server/home-data.ts
//
// Dati server-side della home: metriche (home-stats) e lista leggera delle certificazioni
// per il finder mobile.
//
// Regole:
// - cache dati Next (1h per le metriche, 5 min per la lista, come /certifications): a cache
//   calda (anche scaduta: Next serve la copia vecchia e rinnova in background) il costo e' ~0;
// - il rendering NON aspetta mai il backend oltre SOFT_DEADLINE_MS: allo scadere si rende con
//   `null` (fallback client per le metriche, soli chip per il finder). La fetch NON viene
//   annullata: continua (timeout 3s, nessun retry) e, se completa, scalda la cache dati per le
//   richieste successive;
// - qualunque errore => `null`.

import "server-only";

import { CERTS_BY_SLUG } from "@/certifications/registry";
import { isPubliclyListed } from "@/certifications/publication";
import { normalizeSlug } from "@/lib/cert-slug";
import type { HomeStats } from "@/components/home/Home";
import type { FinderCert } from "@/lib/home-finder";
import { certPath, type Locale } from "@/lib/paths";
import { backendGetJson } from "@/lib/server/backend-fetch";
import { CERTS_LIST_TAG } from "@/lib/server/certs";

const BASE_URL = (process.env.API_BASE_URL || "http://localhost:3000/api/backend").replace(/\/+$/, "");
/** Tempo massimo di attesa del backend durante il rendering della home (cache fredda). */
export const SOFT_DEADLINE_MS = 400;

function withDeadline<T>(work: Promise<T | null>): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), SOFT_DEADLINE_MS);
  });
  return Promise.race([work, deadline]).finally(() => clearTimeout(timer));
}

const isCount = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;

export function getHomeStats(): Promise<HomeStats | null> {
  return withDeadline(
    backendGetJson<Partial<HomeStats>>(`${BASE_URL}/public/home-stats`, {
      revalidate: 3600,
      tags: ["home-stats"],
      retry: false,
    }).then((res) => {
      if (res.kind !== "ok") return null;
      const { questions, topics, certifications } = res.data ?? {};
      if (!isCount(questions) || !isCount(topics) || !isCount(certifications)) return null;
      return { questions, topics, certifications };
    })
  );
}

type RawCert = { slug?: unknown; name?: unknown; name_en?: unknown; name_fr?: unknown; name_es?: unknown };

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

export function getHomeFinderCerts(lang: Locale): Promise<FinderCert[] | null> {
  return withDeadline(
    backendGetJson<RawCert[]>(`${BASE_URL}/certifications`, {
      revalidate: 300,
      tags: [CERTS_LIST_TAG],
      retry: false,
    }).then((res) => (res.kind === "ok" && Array.isArray(res.data) ? toFinderCerts(res.data, lang) : null))
  );
}

function toFinderCerts(data: RawCert[], lang: Locale): FinderCert[] | null {
  const seen = new Set<string>();
  const items: FinderCert[] = [];

  for (const raw of data) {
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
