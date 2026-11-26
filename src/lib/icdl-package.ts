// src/lib/icdl-package.ts
// Dolphin Study ICDL (one-time package, 12,90 EUR, IT/EN/FR/ES). Presentation only: the card appears only when the
// backend returns an ACTIVE offer for slug "icdl" (or an inactive one to an admin). Database name of the
// certification is "ECDL": the package carries "ECDL (ICDL) Study" in Italian and "ICDL Study" elsewhere.
// The scope note names what the package really includes (offer inclusions checked by activate.sql): the reviews
// of the 9 topics, the PDF guide and the concept maps in the selected language. No exam-simulation claim.
import type { Locale } from "@/lib/paths";

export const ICDL_SLUG = "icdl";

const CERT_NAME: Record<Locale, string> = { it: "ECDL (ICDL)", en: "ICDL", fr: "ICDL", es: "ICDL" };

export const ICDL_PACKAGE_NOTE: Record<Locale, string> = {
  it: "Include i ripassi dei 9 argomenti, la guida PDF e le mappe concettuali nella lingua selezionata. Preparazione indipendente: CertifyQuiz non rilascia la certificazione e non è affiliato a ICDL Foundation o AICA.",
  en: "Includes the reviews of all 9 topics, the PDF guide and the concept maps in the language you selected. Independent preparation: CertifyQuiz does not issue the certification and is not affiliated with ICDL Foundation.",
  fr: "Comprend les révisions des 9 thèmes, le guide PDF et les cartes conceptuelles dans la langue sélectionnée. Préparation indépendante : CertifyQuiz ne délivre pas la certification et n'est pas affilié à l'ICDL Foundation.",
  es: "Incluye los repasos de los 9 temas, la guía PDF y los mapas conceptuales en el idioma seleccionado. Preparación independiente: CertifyQuiz no emite la certificación y no está afiliado a ICDL Foundation.",
};

export function isIcdlSlug(slug: string | null | undefined): boolean {
  return slug === ICDL_SLUG;
}

/** Certification name used in package names ("<name> Study"); other certifications keep their own name. */
export function packageCertificationName(
  slug: string | null | undefined,
  name: string | null | undefined,
  lang: Locale
): string | null | undefined {
  return isIcdlSlug(slug) ? CERT_NAME[lang] : name;
}

export function icdlPackageNote(slug: string | null | undefined, lang: Locale): string | undefined {
  return isIcdlSlug(slug) ? ICDL_PACKAGE_NOTE[lang] : undefined;
}
