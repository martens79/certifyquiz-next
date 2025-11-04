import type { CertificationData } from "./types";
import { CERTS } from "./data";

// Slug list (per generateStaticParams, test, ecc.)
export const CERT_SLUGS = CERTS.map(c => c.slug) as readonly string[];

// Lookup veloce slug → dato certificazione
export const CERTS_BY_SLUG: Record<string, CertificationData> =
  Object.fromEntries(CERTS.map(c => [c.slug, c]));

// (opzionale) re-export se ti serve altrove
export { CERTS };
export type { CertificationData };
