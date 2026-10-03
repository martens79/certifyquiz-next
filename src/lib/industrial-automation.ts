// src/lib/industrial-automation.ts
// Visibility of the "Industrial Automation" area (first path: PLC Fundamentals).
//
// Fail-closed by construction: the area is public only while its certification is NOT
// "planned" in the registry and only in the languages it is offered in (EN + IT).
// Launching therefore needs no second switch: removing `publicationStatus: "planned"`
// from the registry entry (in its own change, after the production import) turns the
// home card and the category page on. FR/ES stay hidden until the content is translated.

import { CERTS_BY_SLUG } from "@/certifications/data";
import { isPlannedCertification, isPlannedPreviewEnabled } from "@/certifications/publication";

export const INDUSTRIAL_AUTOMATION_CERT_SLUG = "plc-fundamentals";
export const INDUSTRIAL_AUTOMATION_LANGS: ReadonlyArray<string> = ["it", "en"];
/** Free questions of PLC Fundamentals (PLC-01, PLC-02, PLC-06): the pool of a non-entitled user. */
export const PLC_FREE_QUESTION_COUNT = 68;

export function isIndustrialAutomationPublic(lang: string): boolean {
  if (!INDUSTRIAL_AUTOMATION_LANGS.includes(lang)) return false;
  const cert = CERTS_BY_SLUG[INDUSTRIAL_AUTOMATION_CERT_SLUG];
  if (!cert) return false;
  // A local developer preview (CERTIFYQUIZ_PLANNED_PREVIEW=1, never in production) shows the area
  // like the planned landing itself.
  return !isPlannedCertification(cert) || isPlannedPreviewEnabled();
}
