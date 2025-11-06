// src/certifications/registry.ts
import type { CertificationData } from "./types";
import { CERTS } from "./data";

/**
 * Elenco slug (immutabile) derivato dal registro.
 * NB: richiede che CERTS sia definito come readonly nel file data/index.ts
 */
export const CERT_SLUGS = Object.freeze(
  CERTS.map((c) => c.slug) as ReadonlyArray<string>
);

/** Tipo ristretto agli slug effettivamente presenti nel registro */
export type CertSlug = (typeof CERT_SLUGS)[number];

/**
 * Mappa veloce slug → dato certificazione.
 * Con check anti-duplicato in dev.
 */
export const CERTS_BY_SLUG: Record<CertSlug, CertificationData> = (() => {
  const map = Object.create(null) as Record<CertSlug, CertificationData>;
  const seen = new Set<string>();

  for (const c of CERTS) {
    if (process.env.NODE_ENV !== "production" && seen.has(c.slug)) {
      // segnale utile in console se ci sono slug duplicati
      // (non interrompe la build, ma ti avvisa)
      // eslint-disable-next-line no-console
      console.warn(`[certifications] Duplicate slug detected: "${c.slug}"`);
    }
    seen.add(c.slug);
    (map as Record<string, CertificationData>)[c.slug] = c;
  }
  return map;
})();

/** Set di lookup O(1) per verificare l’esistenza di uno slug */
export const HAS_CERT_SLUG = new Set<string>(CERT_SLUGS);

/** Helper sicuro di lettura (undefined se non esiste) */
export function getCertBySlug(slug: string): CertificationData | undefined {
  return (CERTS_BY_SLUG as Record<string, CertificationData | undefined>)[slug];
}

/** Re-export utili */
export { CERTS };
export type { CertificationData };
