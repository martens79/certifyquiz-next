// src/lib/eipass-standard.ts
// EIPASS Standard (DigComp 2.2): a product distinct from "EIPASS 7 Moduli User" (certification id 3).
//
// STATUS: "coming_soon" (see certifications/data/eipass-standard.ts). ONLY the Italian landing is public
// (HTTP 200, indexable, in the sitemap) and the Italian catalogue lists it. There is no quiz, no topic page,
// no practice, no review and no other language: those routes answer 404, whether or not the certification
// row exists in the database (the landing never reads it).
//
// Per-module availability: every module is "coming_soon" and the landing shows "Prossimamente" with a
// disabled button. Activating a module later is a deliberate code change (status + the topic/quiz guards),
// never a side effect of a database flag.
//
// Source of the module names/order: "EIPASS Standard - Utente qualificato di computer in base al
// DigComp 2.2", programma analitico rev. 02/2024, Centro Studi CERTIPASS. Only the seven module titles
// and the DigComp area they belong to are used. The topic/activity lists of the programme are NOT
// reproduced (the programme asks for CERTIPASS authorisation before reuse) and no EIPASS logo or mark is
// used: the landing carries an original illustration.

export const EIPASS_STANDARD_SLUG = "eipass-standard";
export const EIPASS_STANDARD_LANGS = ["it"] as const;
export const EIPASS_STANDARD_COUNTRIES = ["IT"] as const;
export const EIPASS_STANDARD_OFFICIAL_URL =
  "https://it.eipass.com/certificazioni-informatiche/eipass-standard-digcomp/";
export const EIPASS_USER_LANDING_PATH = "/it/certificazioni/eipass";
export const EIPASS_STANDARD_LANDING_PATH = `/it/certificazioni/${EIPASS_STANDARD_SLUG}`;

/**
 * "available" is DORMANT: no module uses it today. A module becomes available only by a deliberate code change in this
 * file (status + topicId) together with the database activation of its topic (see docs/eipass-standard/M2_RELEASE.md);
 * a database flag alone never shows a link. The consistency test (tests/eipass-standard-modules.test.tsx) refuses an
 * "available" module while the landing still says "coming_soon".
 */
export type EipassStandardModuleStatus = "coming_soon" | "available";

export type EipassStandardModule = Readonly<{
  /** Official module number: also the display order. */
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Official module title (programma rev. 02/2024). */
  title: string;
  /** DigComp 2.2 competence area the module belongs to. */
  digcompArea: Readonly<{ number: 1 | 2 | 3 | 4 | 5; name: string }>;
  status: EipassStandardModuleStatus;
  /** Id of the module's topic (topics.id) in the database. Required, and used, only when status is "available". */
  topicId?: number;
}>;

export const EIPASS_STANDARD_MODULES: ReadonlyArray<EipassStandardModule> = [
  { number: 1, title: "I fondamenti dell'ICT", digcompArea: { number: 5, name: "Risolvere problemi" }, status: "coming_soon" },
  { number: 2, title: "Navigare e cercare informazioni sul Web", digcompArea: { number: 1, name: "Alfabetizzazione su informazioni e dati" }, status: "coming_soon" },
  { number: 3, title: "Comunicare e collaborare in Rete", digcompArea: { number: 2, name: "Comunicazione e collaborazione" }, status: "coming_soon" },
  { number: 4, title: "Sicurezza informatica", digcompArea: { number: 4, name: "Sicurezza" }, status: "coming_soon" },
  { number: 5, title: "Creare documenti elettronici", digcompArea: { number: 3, name: "Creazione di contenuti digitali" }, status: "coming_soon" },
  { number: 6, title: "Creare e gestire fogli di lavoro", digcompArea: { number: 3, name: "Creazione di contenuti digitali" }, status: "coming_soon" },
  { number: 7, title: "Creare presentazioni multimediali", digcompArea: { number: 3, name: "Creazione di contenuti digitali" }, status: "coming_soon" },
] as const;

/** Module card copy: no date, no promise, nothing that suggests a practice session exists. */
export const EIPASS_STANDARD_MODULES_HEADING = "I 7 moduli d'esame";
export const EIPASS_STANDARD_MODULE_SOON_LABEL = "Prossimamente";
export const EIPASS_STANDARD_MODULE_BUTTON_LABEL = "Esercitazione non ancora disponibile";
/** Labels of an AVAILABLE module: a short practice, never an exam simulation. */
export const EIPASS_STANDARD_MODULE_AVAILABLE_LABEL = "Disponibile";
export const EIPASS_STANDARD_MODULE_START_LABEL = "Inizia l'esercitazione breve";

/** A module is available only with status "available" AND a valid topic id: anything else stays "Prossimamente". */
export function isEipassStandardModuleAvailable(m: EipassStandardModule): boolean {
  return m.status === "available" && Number.isInteger(m.topicId) && (m.topicId as number) > 0;
}

/** Link of an available module (Italian only); null for every other module, so no link can exist by accident. */
export function getEipassStandardModuleHref(m: EipassStandardModule): string | null {
  return isEipassStandardModuleAvailable(m) ? `/it/quiz/topic/${m.topicId}` : null;
}

export function hasAvailableEipassStandardModule(
  modules: ReadonlyArray<EipassStandardModule> = EIPASS_STANDARD_MODULES,
): boolean {
  return modules.some(isEipassStandardModuleAvailable);
}

export function isEipassStandardSlug(slug: string | null | undefined): boolean {
  return slug === EIPASS_STANDARD_SLUG;
}

export function isEipassStandardLang(lang: string): boolean {
  return (EIPASS_STANDARD_LANGS as ReadonlyArray<string>).includes(lang);
}

/** The one visible status line of the landing. */
export const EIPASS_STANDARD_COMING_SOON_LABEL = "Quiz di preparazione in arrivo";

/** GA4 event for the two links that really exist on the landing (and the pointer from the User landing). */
export const EIPASS_STANDARD_LINK_EVENT = "eipass_standard_link_click";
