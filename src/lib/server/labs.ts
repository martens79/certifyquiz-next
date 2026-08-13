// src/lib/server/labs.ts
import "server-only";

import type { Locale } from "@/lib/paths";
import { getCertBySlug } from "@/certifications/registry";

// Stessa convenzione di src/lib/data.ts: in locale, senza API_BASE_URL impostato
// a un host locale, questo colpisce la produzione (server-only, mai il proxy
// client /api/backend). Per testare contro un backend locale, impostare
// API_BASE_URL=http://127.0.0.1:8080/api nell'ambiente del processo next dev.
const API = process.env.API_BASE_URL || "https://api.certifyquiz.com/api";

export type LabsCatalogEntry = {
  id: number;
  slug: string;
  difficulty: "base" | "intermediate" | "final";
  estimatedMinutes: number;
  sortOrder: number;
  certificationSlug: string | null;
  title: string;
  description: string;
};

export type LabsCatalogCertificationFilter = {
  slug: string;
  label: string;
  count: number;
};

export type LabsCatalog = {
  labs: LabsCatalogEntry[];
  certifications: LabsCatalogCertificationFilter[];
};

/**
 * Metadata dei lab DB-backed (slug, titolo, descrizione, difficolta', durata,
 * certificazione) e l'elenco delle certificazioni con contenuto, risolti
 * SERVER-SIDE cosi' che compaiano nell'HTML iniziale (link di dettaglio inclusi)
 * invece che apparire solo dopo un useEffect client-side.
 *
 * Deliberatamente SENZA locked/accessReason: sono dati per-utente, non
 * calcolabili qui -- un Server Component non ha accesso al token dell'utente
 * (salvato in localStorage, mai in un cookie leggibile server-side), lo stesso
 * motivo per cui GuidedCertificationLab.tsx li richiede sempre client-side.
 * Lo stato di accesso va sovrapposto in un secondo momento, lato client.
 *
 * NON cattura errori qui apposta: fetch/status/JSON non validi propagano come
 * eccezione al chiamante. Questo file usa `next: { revalidate: 300 }`, quindi
 * Next patcha fetch() per l'ISR -- se un tentativo di rigenerazione fallisce,
 * Next STESSO continua a servire l'ultima risposta buona cachata, senza che
 * questo codice se ne accorga. Se invece catturassimo l'errore qui e
 * restituissimo liste vuote, quel risultato "vuoto ma riuscito" verrebbe
 * trattato da Next come una rigenerazione valida e rischierebbe di sostituire la
 * pagina cachata buona con una vuota per l'intera finestra di revalidate, anche
 * dopo che il backend e' tornato su. Il fallback a liste vuote esiste SOLO nel
 * chiamante (i due page.tsx di /interactive-labs), per il caso in cui non esiste
 * alcuna versione precedente da servire (primo avvio, o Next lascia comunque
 * propagare l'errore) -- l'unico caso in cui non c'e' nulla di buono da
 * preservare nella cache.
 */
export async function getLabsCatalog(lang: Locale): Promise<LabsCatalog> {
  const [labsRes, certsRes] = await Promise.all([
    fetch(`${API}/labs?certification=all&lang=${lang}`, { next: { revalidate: 300 } }),
    fetch(`${API}/labs/certifications`, { next: { revalidate: 300 } }),
  ]);

  if (!labsRes.ok || !certsRes.ok) {
    throw new Error(`getLabsCatalog: backend responded ${labsRes.status}/${certsRes.status}`);
  }

  const labsJson = await labsRes.json();
  const certsJson = await certsRes.json();

  const labs: LabsCatalogEntry[] = Array.isArray(labsJson?.items)
    ? labsJson.items.map((item: Record<string, unknown>) => ({
        id: Number(item.id),
        slug: String(item.slug),
        difficulty: item.difficulty as LabsCatalogEntry["difficulty"],
        estimatedMinutes: Number(item.estimated_minutes),
        sortOrder: Number(item.sort_order),
        certificationSlug: (item.certification_slug as string | null) ?? null,
        title: String(item.title),
        description: String(item.description),
      }))
    : [];

  const certifications: LabsCatalogCertificationFilter[] = Array.isArray(certsJson?.certifications)
    ? certsJson.certifications.map((c: Record<string, unknown>) => {
        const slug = String(c.certificationSlug);
        return {
          slug,
          label: getCertBySlug(slug)?.title[lang] ?? slug,
          count: Number(c.labCount),
        };
      })
    : [];

  return { labs, certifications };
}
