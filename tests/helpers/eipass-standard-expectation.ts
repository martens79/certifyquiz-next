// Expected public state of EIPASS Standard, derived from the module registry (the single source of truth), shared by the
// production smoke (scripts/verify-eipass-standard-coming-soon.mjs, run through tsx) and the Playwright browser spec.
//
// Two states are supported and BOTH are asserted for real (nothing is skipped or relaxed):
//   - dormant: every module "Prossimamente", no link to any topic, no availability statement;
//   - partial: only the modules with status "available" + a valid topicId are links to /it/quiz/topic/<id>, every
//     other module stays disabled, and the copy describes a short practice, never an official exam simulation.
// The wording is spelled out here as literals (not read back from eipassStandardCopy), so a copy regression is caught.
import {
  EIPASS_STANDARD_MODULES,
  getEipassStandardModuleHref,
  isEipassStandardModuleAvailable,
  type EipassStandardModule,
} from "../../src/lib/eipass-standard";

export function eipassStandardExpectation(modules: ReadonlyArray<EipassStandardModule> = EIPASS_STANDARD_MODULES) {
  const list = modules.map((m) => ({
    number: m.number,
    title: m.title,
    available: isEipassStandardModuleAvailable(m),
    href: getEipassStandardModuleHref(m),
  }));
  const availableHrefs = list.filter((m) => m.available).map((m) => m.href as string);
  const dormant = availableHrefs.length === 0;
  return {
    dormant,
    modules: list,
    /** Links to practice topics that must exist in the landing content (none when dormant). */
    availableHrefs,
    availableCount: availableHrefs.length,
    disabledCount: list.length - availableHrefs.length,
    /** The status heading of the landing panel. */
    statusHeading: dormant ? "Quiz di preparazione in arrivo" : "Primo modulo disponibile",
    /** Catalogue card pill. */
    cataloguePill: dormant ? "Prossimamente" : "Primo modulo disponibile",
    /** Pill on the Italian EIPASS 7 Moduli User landing pointer. */
    userPointerLabel: dormant ? "In preparazione" : "Primo modulo disponibile",
    /** Phrases that must appear in the landing content. */
    mustSay: dormant
      ? [/solo informativa/, /non sono ancora disponibili quiz/]
      : [/esercitazione breve/, /non una simulazione dell'esame ufficiale/, /senza alcuna garanzia di superamento/, /Gli altri moduli sono in preparazione/],
    /** Phrases that must NOT appear in the landing content. */
    mustNotSay: dormant
      ? [/Primo modulo disponibile/, /Inizia l'esercitazione breve/, /\bDisponibile\b/]
      : [/solo informativa/, /non sono ancora disponibili quiz/, /Quiz di preparazione in arrivo/],
    /** Never allowed, in either state: promises, exam simulation, guarantees, unvalidated levels. */
    neverSay: [
      /Inizia il quiz|Avvia (il )?quiz|Passa a Premium|Preparazione completa|Acquista|€/i,
      /simulazione (ufficiale )?d.esame|simula l.esame|garantit[oi] il superamento|supererai|certificazione garantita/i,
      /livello (base|intermedio|avanzato)/i,
    ],
  };
}
