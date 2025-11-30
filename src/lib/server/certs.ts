// src/lib/server/certs.ts
import "server-only";

/**
 * Base URL del backend lato SERVER.
 * In Vercel imposta: API_BASE_URL=https://api.certifyquiz.com/api
 * Fallback: proxy interno Next → /api/backend
 */
const BASE_URL = (process.env.API_BASE_URL || "http://localhost:3000/api/backend").replace(/\/+$/, "");

/** Tag ISR riutilizzabili */
export const CERTS_LIST_TAG = "certs:list";
export const certTag = (slug: string) => `cert:${slug}`;

/** Tipi minimi per SEO rendering (allineati al payload del backend) */
export type Localized<T = string> = T | Record<string, T>;

export interface CertListItem {
  id: number;
  slug: string;
  category_id: number | null;
  name: string | null;
  name_en?: string | null;
  name_fr?: string | null;
  name_es?: string | null;
  image_url?: string | null;
  level?: string | null;
  level_en?: string | null;
  level_fr?: string | null;
  level_es?: string | null;
  description?: string | null;
  description_en?: string | null;
  description_fr?: string | null;
  description_es?: string | null;
}

export interface CertDetail extends CertListItem {
  official_url?: string | null;
  topics?: Array<{
    id: number;
    certification_id: number;
    title_it: string;
    title_en: string;
    title_fr: string;
    title_es: string;
    description_it?: string;
    description_en?: string;
    description_fr?: string;
    description_es?: string;
  }>;
}

/** Helper fetch JSON lato server con revalidate & tags */
async function serverJson<T>(
  path: string,
  init?: RequestInit & { revalidate?: number; tags?: string[] }
): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const { revalidate = 86400, tags = [], ...rest } = init || {};

  const res = await fetch(url, {
    ...rest,
    headers: { "Content-Type": "application/json", ...(rest?.headers || {}) },
    next: { revalidate, tags },
  });

  if (!res.ok) {
    // piccolo messaggio utile in console server
    const body = await res.text().catch(() => "");
    throw new Error(`Server fetch failed ${res.status} ${url} :: ${body.slice(0, 200)}`);
  }

  return (await res.json()) as T;
}

/**
 * Lista certificazioni (ISR, SEO)
 * Tag: certs:list
 */
export async function getCertificationsListRSC(revalidateSeconds = 86400) {
  return serverJson<CertListItem[]>("/certifications", {
    revalidate: revalidateSeconds,
    tags: [CERTS_LIST_TAG],
  });
}

/**
 * Dettaglio certificazione per slug (ISR, SEO)
 * Tag: certs:list + cert:<slug>
 * NB: usa l'endpoint già usato nel client: /certifications/by-slug/:slug
 */
export async function getCertificationDetailRSC(slug: string, revalidateSeconds = 86400) {
  return serverJson<CertDetail>(`/certifications/by-slug/${encodeURIComponent(slug)}`, {
    revalidate: revalidateSeconds,
    tags: [CERTS_LIST_TAG, certTag(slug)],
  });
}
