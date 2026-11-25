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
 * "available" marks the modules with a live topic (all seven at the time of writing: topics 569-575). A module becomes available only by a deliberate code change in this
 * file (status + topicId) together with the database activation of its topic (see docs/eipass-standard/M2_RELEASE.md);
 * a database flag alone never shows a link. The visible copy follows the availability automatically
 * (eipassStandardCopy below) and tests/eipass-standard-modules.test.tsx keeps the registry text equal to that helper.
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
  { number: 1, title: "I fondamenti dell'ICT", digcompArea: { number: 5, name: "Risolvere problemi" }, status: "available", topicId: 569 },
  // Module 2 is the first module with a short practice. topicId = topics.id of the module in the database (verified in Production on 2026-11-05: certification 79, topics 569-575).
  { number: 2, title: "Navigare e cercare informazioni sul Web", digcompArea: { number: 1, name: "Alfabetizzazione su informazioni e dati" }, status: "available", topicId: 570 },
  { number: 3, title: "Comunicare e collaborare in Rete", digcompArea: { number: 2, name: "Comunicazione e collaborazione" }, status: "available", topicId: 571 },
  { number: 4, title: "Sicurezza informatica", digcompArea: { number: 4, name: "Sicurezza" }, status: "available", topicId: 572 },
  { number: 5, title: "Creare documenti elettronici", digcompArea: { number: 3, name: "Creazione di contenuti digitali" }, status: "available", topicId: 573 },
  { number: 6, title: "Creare e gestire fogli di lavoro", digcompArea: { number: 3, name: "Creazione di contenuti digitali" }, status: "available", topicId: 574 },
  { number: 7, title: "Creare presentazioni multimediali", digcompArea: { number: 3, name: "Creazione di contenuti digitali" }, status: "available", topicId: 575 },
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

/**
 * Visible copy of the landing, the catalogue card and the metadata, derived from the module availability. With no
 * available module it is exactly the original "in arrivo" text; as soon as a module is available (status + topicId in
 * EIPASS_STANDARD_MODULES) every statement that says "no quiz yet" is replaced, so activating a module is a two-field change.
 * Original text only: no coverage, equivalence or exam-simulation claim.
 */
export type EipassStandardCopy = Readonly<{
  partial: boolean;
  statusLabel: string;
  panelText: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  guideTitle: string;
  guideParagraph: string;
  faqQuestion: string;
  faqAnswer: string;
  pointerLabel: string;
  pointerText: string;
  ogSubtitle: string;
  cardPill: string | undefined;
}>;

export const EIPASS_STANDARD_PARTIAL_LABEL = "Primo modulo disponibile";

export function eipassStandardCopy(modules: ReadonlyArray<EipassStandardModule> = EIPASS_STANDARD_MODULES): EipassStandardCopy {
  const available = modules.filter(isEipassStandardModuleAvailable).map((m) => m.number);
  if (available.length === 0) {
    return {
      partial: false,
      statusLabel: "Quiz di preparazione in arrivo",
      panelText:
        "Stiamo preparando i quiz di allenamento per EIPASS Standard. Per ora questa pagina è solo informativa: non sono ancora disponibili quiz, simulazioni, ripassi né pagine per singolo modulo. CertifyQuiz offre preparazione indipendente e non rilascia la certificazione.",
      description:
        "EIPASS Standard è una certificazione informatica basata sul DigComp 2.2, il quadro europeo delle competenze digitali dei cittadini, articolata in sette moduli d'esame. I quiz di preparazione di CertifyQuiz sono in arrivo: questa pagina è informativa e CertifyQuiz non rilascia la certificazione.",
      metaTitle: "EIPASS Standard: 7 moduli e quiz in arrivo | CertifyQuiz",
      metaDescription:
        "Che cos'è EIPASS Standard, come si lega al DigComp 2.2 e in cosa differisce da EIPASS 7 Moduli User. Quiz di preparazione indipendenti in arrivo su CertifyQuiz.",
      guideTitle: "Cosa sta preparando CertifyQuiz",
      guideParagraph:
        "Stiamo preparando quiz di allenamento indipendenti per i sette moduli. Oggi non sono ancora disponibili quiz, simulazioni, ripassi né pagine dedicate ai singoli moduli: questa pagina serve a informare e a misurare l'interesse. Quando saranno pronti, seguiranno le regole di CertifyQuiz valide per tutti i quiz di allenamento.",
      faqQuestion: "I quiz di EIPASS Standard sono già disponibili su CertifyQuiz?",
      faqAnswer: "No. I quiz di preparazione sono in arrivo. Per ora la pagina è solo informativa e non offre quiz, simulazioni o ripassi.",
      pointerLabel: "In preparazione",
      pointerText: "è un percorso distinto da EIPASS 7 Moduli User. Per ora è disponibile solo la pagina informativa.",
      ogSubtitle: "Quiz di preparazione in arrivo",
      cardPill: undefined,
    };
  }
  // All seven modules available: nothing may say that other modules are "in preparazione".
  const all = available.length === modules.length;
  const which = all
    ? "tutti e sette i moduli"
    : available.length === 1 ? `il Modulo ${available[0]}` : `i moduli ${available.length > 2 ? `${available.slice(0, -1).join(", ")} e ${available[available.length - 1]}` : available.join(" e ")}`;
  const multiple = available.length > 1;
  const label = multiple ? "Moduli disponibili" : EIPASS_STANDARD_PARTIAL_LABEL;
  const practice = multiple ? "sono disponibili esercitazioni brevi" : "è disponibile un'esercitazione breve";
  const whichCap = which.charAt(0).toUpperCase() + which.slice(1);
  const othersSoon = all ? "" : " Gli altri moduli sono in preparazione.";
  const othersSoonShort = all ? "" : "; gli altri moduli sono in preparazione";
  return {
    partial: true,
    statusLabel: label,
    panelText: `Su CertifyQuiz ${practice} per ${which}: poche domande originali per allenarti, non una simulazione dell'esame ufficiale e senza alcuna garanzia di superamento.${othersSoon} CertifyQuiz offre preparazione indipendente e non rilascia la certificazione.`,
    description: `EIPASS Standard è una certificazione informatica basata sul DigComp 2.2, articolata in sette moduli d'esame. CertifyQuiz offre esercitazioni indipendenti per ${which}.${othersSoon} CertifyQuiz non rilascia la certificazione.`,
    metaTitle: multiple ? "EIPASS Standard: 7 moduli e quiz | CertifyQuiz" : "EIPASS Standard: 7 moduli e primo quiz | CertifyQuiz",
    metaDescription:
      `EIPASS Standard e DigComp 2.2. Esercitazioni indipendenti per ${which}.${othersSoon}`,
    guideTitle: "Cosa offre CertifyQuiz oggi",
    guideParagraph: all
      ? `${whichCap}: esercitazioni brevi e indipendenti con domande originali. Non è una simulazione dell'esame ufficiale, non copre l'intero programma e non garantisce il superamento. Seguono le regole di CertifyQuiz valide per tutti i quiz di allenamento.`
      : `${whichCap}: esercitazioni brevi e indipendenti con domande originali. Non è una simulazione dell'esame ufficiale, non copre l'intero programma e non garantisce il superamento. Per gli altri moduli le esercitazioni sono in preparazione; seguiranno le regole di CertifyQuiz valide per tutti i quiz di allenamento.`,
    faqQuestion: "Quali quiz di EIPASS Standard sono disponibili su CertifyQuiz?",
    faqAnswer: `Per ora ${practice} per ${which}. Non è una simulazione dell'esame ufficiale.${othersSoon}`,
    pointerLabel: label,
    pointerText: `è un percorso distinto da EIPASS 7 Moduli User. Per ora ${practice} per ${which}${othersSoonShort}.`,
    ogSubtitle: label,
    cardPill: label,
  };
}

/**
 * Dolphin Study (one-time package) on the Italian landing. The card is client-rendered and appears only when the
 * backend returns an ACTIVE offer for this slug (or an inactive one to an admin): no offer, no card. The name and the
 * scope note keep the two EIPASS paths distinct and promise nothing beyond the available content.
 */
export const EIPASS_STANDARD_PACKAGE_NAME = "EIPASS Standard";
export const EIPASS_STANDARD_PACKAGE_SCOPE_NOTE =
  "Solo in italiano. Esercitazioni indipendenti sui 7 moduli di EIPASS Standard (non EIPASS 7 Moduli User): non è una simulazione dell'esame ufficiale e non copre l'intero programma. CertifyQuiz non rilascia la certificazione.";

/**
 * "Study" link of a purchased package (profile, checkout success). EIPASS Standard has no /quiz/<slug> route (404 by
 * design): its study entry point is the Italian landing with the seven module links.
 */
export function packageStudyHref(quizPrefix: string, certificationSlug: string): string {
  if (isEipassStandardSlug(certificationSlug)) return EIPASS_STANDARD_LANDING_PATH;
  return `${quizPrefix}/quiz/${certificationSlug}`;
}

/**
 * Languages in which a one-time package is PROMOTED (card, pricing upsell). Commercial decision of 25/11/2026:
 * EIPASS Standard only in Italian; EIPASS 7 Moduli User only in Italian and English (FR/ES have too few questions).
 * Certifications not listed here: every language, as before. Presentation only: free access to questions and
 * existing entitlements are never affected.
 */
const PACKAGE_LANGS: Readonly<Record<string, ReadonlyArray<string>>> = {
  [EIPASS_STANDARD_SLUG]: EIPASS_STANDARD_LANGS,
  eipass: ["it", "en"],
};

export function isPackageCertificationOfferedInLang(certificationSlug: string, lang: string): boolean {
  const langs = PACKAGE_LANGS[certificationSlug];
  return !langs || langs.includes(lang);
}

/** The one visible status line of the landing. */
export const EIPASS_STANDARD_COMING_SOON_LABEL = "Quiz di preparazione in arrivo";

/** GA4 event for the two links that really exist on the landing (and the pointer from the User landing). */
export const EIPASS_STANDARD_LINK_EVENT = "eipass_standard_link_click";
