// src/lib/topic-pool.ts
//
// Pool "fissato" di una sessione di topic training. Il server emette un token firmato (poolToken) che identifica gli ID della
// sessione; il client lo conserva insieme al progresso (localStorage e quiz_progress.state) e lo restituisce a ogni ripresa.
// Cosi' orario, deploy e dispositivo non cambiano mai il pool di una sessione iniziata. Qui la sola decisione pura.

export type SavedSession = { kind: "local" | "db"; data: any } | null;

/** Token salvato nella sessione scelta come fonte (progresso locale o riga DB), se c'e'. */
export function savedPoolTokenOf(source: SavedSession): string | null {
  if (!source) return null;
  const t = source.kind === "db" ? source.data?.state?.poolToken : source.data?.poolToken;
  return typeof t === "string" && t.length > 0 ? t : null;
}

/**
 * Cosa chiedere al server:
 *  - undefined  : pinning disattivo (mixed, mock, assessment, ...) -> comportamento di sempre
 *  - <token>    : ripresa di una sessione con pool fissato
 *  - "legacy"   : sessione salvata prima dei token (le stesse prime 100 per ID di allora)
 *  - "new"      : nessuna sessione salvata -> nuovo campione dall'intero pool eleggibile
 */
export function poolHint(pin: boolean, source: SavedSession): string | undefined {
  if (!pin) return undefined;
  return savedPoolTokenOf(source) ?? (source ? "legacy" : "new");
}
