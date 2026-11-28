// src/lib/map-access.ts
// Stato di accesso di una mappa concettuale, come restituito da GET /maps.
// "premium" = Premium/admin/organizzazione (o trial: il backend nega poi il
// download con trial_pdf_restricted), "package" = inclusa in un pacchetto
// Study/Complete acquistato, "locked" = nessun accesso completo.
// Il frontend decide solo cosa MOSTRARE: l'autorizzazione resta sul backend
// (GET /maps/:slug/download).

export type MapAccess = "premium" | "package" | "purchased" | "trial" | "locked";

export function canDownloadMap(access: MapAccess | string | null | undefined): boolean {
  return access === "premium" || access === "package" || access === "purchased" || access === "trial";
}
