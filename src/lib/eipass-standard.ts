// src/lib/eipass-standard.ts
// EIPASS Standard (DigComp 2.2): a product distinct from "EIPASS 7 Moduli User" (certification id 3).
//
// STATUS: planned, Italy only, not launched. Nothing here touches the User path: no User id, slug,
// question or association is read or written. The module list below is the structural contract
// (official module names and order); the topic pages built from it are DEMONSTRATION DATA that
// only render in a local developer preview (CERTIFYQUIZ_PLANNED_PREVIEW=1, never in production).
//
// Source of the module names/order: "EIPASS Standard - Utente qualificato di computer in base al
// DigComp 2.2", programma analitico rev. 02/2024, Centro Studi CERTIPASS. Only the seven module titles
// and their area are used. The topic/activity lists of the programme are NOT reproduced: the programme
// asks for CERTIPASS authorisation before reuse, and that request is a launch requirement.

import { isPlannedPreviewEnabled } from "@/certifications/publication";

export const EIPASS_STANDARD_SLUG = "eipass-standard";
export const EIPASS_STANDARD_LANGS = ["it"] as const;
export const EIPASS_STANDARD_COUNTRIES = ["IT"] as const;
export const EIPASS_STANDARD_OFFICIAL_URL =
  "https://it.eipass.com/certificazioni-informatiche/eipass-standard-digcomp/";
/** Never a real DB id: the certification row does not exist yet. */
export const EIPASS_STANDARD_DEMO_CERT_ID = -1;

export type EipassStandardModule = Readonly<{
  /** Official module number: also the display order. */
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Official module title (programma rev. 02/2024). */
  title: string;
  slug: string;
  digcompArea: Readonly<{ number: 1 | 2 | 3 | 4 | 5; name: string }>;
  /**
   * Topic of EIPASS 7 Moduli User whose questions are CANDIDATES for reuse (read-only reference,
   * from the DigComp matrix v0). A candidate is not an approved link: see docs/eipass-standard.
   */
  userTopicId: 17 | 18 | 19 | 20 | 21 | 22 | 23;
  /** Original one-line summary written for CertifyQuiz (DEMO copy, not taken from the programme). */
  demoSummary: string;
}>;

export const EIPASS_STANDARD_MODULES: ReadonlyArray<EipassStandardModule> = [
  {
    number: 1,
    title: "I fondamenti dell'ICT",
    slug: "modulo-1-fondamenti-ict",
    digcompArea: { number: 5, name: "Risolvere problemi" },
    userTopicId: 17,
    demoSummary: "Dispositivi, connessione e risoluzione dei problemi tecnici di tutti i giorni.",
  },
  {
    number: 2,
    title: "Navigare e cercare informazioni sul Web",
    slug: "modulo-2-navigare-cercare-informazioni-web",
    digcompArea: { number: 1, name: "Alfabetizzazione su informazioni e dati" },
    userTopicId: 20,
    demoSummary: "Ricerca, valutazione e gestione delle informazioni trovate online.",
  },
  {
    number: 3,
    title: "Comunicare e collaborare in Rete",
    slug: "modulo-3-comunicare-collaborare-rete",
    digcompArea: { number: 2, name: "Comunicazione e collaborazione" },
    userTopicId: 19,
    demoSummary: "Strumenti per comunicare, condividere e partecipare online.",
  },
  {
    number: 4,
    title: "Sicurezza informatica",
    slug: "modulo-4-sicurezza-informatica",
    digcompArea: { number: 4, name: "Sicurezza" },
    userTopicId: 18,
    demoSummary: "Protezione di dispositivi, dati personali e benessere digitale.",
  },
  {
    number: 5,
    title: "Creare documenti elettronici",
    slug: "modulo-5-creare-documenti-elettronici",
    digcompArea: { number: 3, name: "Creazione di contenuti digitali" },
    userTopicId: 23,
    demoSummary: "Elaborazione di testi e produzione di documenti.",
  },
  {
    number: 6,
    title: "Creare e gestire fogli di lavoro",
    slug: "modulo-6-creare-gestire-fogli-di-lavoro",
    digcompArea: { number: 3, name: "Creazione di contenuti digitali" },
    userTopicId: 22,
    demoSummary: "Fogli di calcolo: dati, formule e rappresentazioni.",
  },
  {
    number: 7,
    title: "Creare presentazioni multimediali",
    slug: "modulo-7-creare-presentazioni-multimediali",
    digcompArea: { number: 3, name: "Creazione di contenuti digitali" },
    userTopicId: 21,
    demoSummary: "Presentazioni con testo, immagini e contenuti multimediali.",
  },
] as const;

export function isEipassStandardSlug(slug: string | null | undefined): boolean {
  return slug === EIPASS_STANDARD_SLUG;
}

export function isEipassStandardLang(lang: string): boolean {
  return (EIPASS_STANDARD_LANGS as ReadonlyArray<string>).includes(lang);
}

/** Demo data is reachable only in a local developer preview, in Italian. */
export function isEipassStandardDemoVisible(lang: string, env?: Readonly<Record<string, string | undefined>>): boolean {
  return isEipassStandardLang(lang) && (env ? isPlannedPreviewEnabled(env) : isPlannedPreviewEnabled());
}

export const EIPASS_STANDARD_DEMO_BANNER =
  "Anteprima interna con dati dimostrativi: EIPASS Standard non è disponibile su CertifyQuiz. Le domande, i conteggi e gli argomenti mostrati non sono definitivi.";

export function getEipassStandardDemoTopicLinks(): Array<{ title: string; slug: string }> {
  return EIPASS_STANDARD_MODULES.map((m) => ({ title: `Modulo ${m.number} — ${m.title}`, slug: m.slug }));
}

/** Shape-compatible with TopicPageData (src/lib/server/topic-page.ts); questionCount 0 hides every quiz CTA. */
export function getEipassStandardDemoTopicPage(topicSlug: string) {
  const current = EIPASS_STANDARD_MODULES.find((m) => m.slug === topicSlug);
  if (!current) return null;
  const certification = { id: EIPASS_STANDARD_DEMO_CERT_ID, slug: EIPASS_STANDARD_SLUG, title: "EIPASS Standard" };
  return {
    topic: {
      id: -current.number,
      quiz_id: null,
      slug: current.slug,
      title: `Modulo ${current.number} — ${current.title}`,
      description: `[DEMO] ${current.demoSummary} Area DigComp 2.2 ${current.digcompArea.number}: ${current.digcompArea.name}.`,
      intro: null,
      seoTitle: null,
      seoDescription: null,
      content: null,
      faq: [] as Array<{ q: string; a: string }>,
    },
    certification,
    relatedTopics: EIPASS_STANDARD_MODULES.filter((m) => m.number !== current.number).map((m) => ({
      id: -m.number,
      slug: m.slug,
      title: `Modulo ${m.number} — ${m.title}`,
      description: `[DEMO] ${m.demoSummary}`,
    })),
    questionCount: 0,
    reviewAvailable: false,
  };
}
