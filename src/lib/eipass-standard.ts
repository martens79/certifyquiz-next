// src/lib/eipass-standard.ts
// EIPASS Standard (DigComp 2.2): a product distinct from "EIPASS 7 Moduli User" (certification id 3).
//
// STATUS: "coming_soon" (see certifications/data/eipass-standard.ts). ONLY the Italian landing is public
// (HTTP 200, indexable, in the sitemap). There is no quiz, no topic page, no practice, no review and no
// other language: those routes answer 404 and the certification has no database row.
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

export type EipassStandardModule = Readonly<{
  /** Official module number: also the display order. */
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Official module title (programma rev. 02/2024). */
  title: string;
  /** DigComp 2.2 competence area the module belongs to. */
  digcompArea: Readonly<{ number: 1 | 2 | 3 | 4 | 5; name: string }>;
}>;

export const EIPASS_STANDARD_MODULES: ReadonlyArray<EipassStandardModule> = [
  { number: 1, title: "I fondamenti dell'ICT", digcompArea: { number: 5, name: "Risolvere problemi" } },
  { number: 2, title: "Navigare e cercare informazioni sul Web", digcompArea: { number: 1, name: "Alfabetizzazione su informazioni e dati" } },
  { number: 3, title: "Comunicare e collaborare in Rete", digcompArea: { number: 2, name: "Comunicazione e collaborazione" } },
  { number: 4, title: "Sicurezza informatica", digcompArea: { number: 4, name: "Sicurezza" } },
  { number: 5, title: "Creare documenti elettronici", digcompArea: { number: 3, name: "Creazione di contenuti digitali" } },
  { number: 6, title: "Creare e gestire fogli di lavoro", digcompArea: { number: 3, name: "Creazione di contenuti digitali" } },
  { number: 7, title: "Creare presentazioni multimediali", digcompArea: { number: 3, name: "Creazione di contenuti digitali" } },
] as const;

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
