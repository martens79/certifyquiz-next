// src/lib/server/jobTracks.ts
import "server-only";

import type { Locale } from "@/lib/paths";

// Stessa convenzione di src/lib/server/labs.ts: server-only, colpisce
// produzione salvo API_BASE_URL impostato a un host locale.
const API = process.env.API_BASE_URL || "https://api.certifyquiz.com/api";

export type JobTrackLabItem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty: "base" | "intermediate" | "final";
  estimatedMinutes: number;
  sortOrder: number;
  isOptional: boolean;
  /** Risoluzione ANONIMA/di cache (fetch SSR con revalidate): stato iniziale
   *  per il primo paint, mai il dato definitivo per l'utente loggato -- lo
   *  stesso principio di getLabsCatalog in lib/server/labs.ts. JobTrackDetail
   *  (client) rifà la stessa chiamata via apiFetch per sovrapporre lo stato
   *  reale, esattamente come accessById/completedById in
   *  InteractiveLabsLanding.tsx. */
  locked: boolean;
  accessReason: string;
  completed: boolean;
};

export type JobTrackDetailData = {
  track: { id: number; slug: string; title: string; description: string };
  labs: JobTrackLabItem[];
  labCount: number;
  completedLabs: number;
};

/**
 * Metadata del Job Track (titolo, descrizione, lab in ordine di track) risolti
 * SERVER-SIDE per il primo paint/SEO. locked/completed nella risposta sono
 * quelli anonimi (nessun token disponibile in un Server Component): vedi il
 * commento su JobTrackLabItem.locked sopra.
 *
 * Ritorna null SOLO per un vero 404 (track inesistente o disattivato) --
 * qualunque altro errore propaga come eccezione al chiamante, che decide se
 * trattarlo come notFound() o rilanciarlo. GET /job-tracks/:slug non è mai
 * stato modificato per questa pagina: stessa forma di risposta di Fase B1.
 */
export async function getJobTrack(lang: Locale, slug: string): Promise<JobTrackDetailData | null> {
  const res = await fetch(`${API}/job-tracks/${encodeURIComponent(slug)}?lang=${lang}`, {
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`getJobTrack: backend responded ${res.status}`);

  const json = await res.json();
  if (!json?.track) return null;

  const labs: JobTrackLabItem[] = Array.isArray(json.labs)
    ? json.labs.map((item: Record<string, unknown>) => ({
        id: Number(item.id),
        slug: String(item.slug),
        title: String(item.title),
        description: String(item.description),
        difficulty: item.difficulty as JobTrackLabItem["difficulty"],
        estimatedMinutes: Number(item.estimatedMinutes),
        sortOrder: Number(item.sortOrder),
        isOptional: !!item.isOptional,
        locked: !!item.locked,
        accessReason: String(item.accessReason ?? ""),
        completed: !!item.completed,
      }))
    : [];

  return {
    track: {
      id: Number(json.track.id),
      slug: String(json.track.slug),
      title: String(json.track.title),
      description: String(json.track.description),
    },
    labs,
    labCount: Number(json.labCount ?? labs.length),
    completedLabs: Number(json.completedLabs ?? 0),
  };
}
