// src/certifications/data/plc-fundamentals.ts
// PLC Fundamentals – Industrial Automation: a CertifyQuiz Technical Skills path.
// It is NOT an official, vendor or accredited certification.
//
// PLANNED (not launched). While publicationStatus is "planned":
// - the landing returns 404 in every language (CertificationDetailView), except in a
//   local developer preview (CERTIFYQUIZ_PLANNED_PREVIEW=1, never on Vercel production);
// - it is excluded from the certifications list and category pages;
// - it is in ROLLOUT_NOINDEX_CERTIFICATION_SLUGS: noindex,follow in every language,
//   its topics noindex, and absent from the sitemap, whatever the DB inventory.
// No IDS_BY_SLUG entry until the production import assigns the certification id.
//
// Launch languages: EN + IT. FR/ES are not offered: their strings below repeat EN only
// to satisfy LocalizedText and must be replaced or kept non-public before any launch.
// Topic slugs match the backend import catalog
// (quiz_project tools/content/plc-fundamentals/import/catalog.js).

import type { CertificationData } from "../types";

const EN_TITLE = "PLC Fundamentals – Industrial Automation";
const EN_DESCRIPTION =
  "A CertifyQuiz Technical Skills path with practical, vendor-neutral PLC fundamentals in English and Italian: safety, control circuits, sensors, I/O, ladder logic, timers, analog signals, motors and drives, HMI/SCADA, industrial networks and troubleshooting. It is not an official certification.";

const topic = (it: string, en: string, slugIt: string, slugEn: string) => ({
  title: { it, en, fr: en, es: en },
  slug: { it: slugIt, en: slugEn },
});

const PLCFundamentals: CertificationData = {
  slug: "plc-fundamentals",
  publicationStatus: "planned",
  imageUrl: "/images/certifications/plc-fundamentals.svg",
  officialUrl: "https://www.certifyquiz.com/certifications/plc-fundamentals",

  title: {
    it: "PLC Fundamentals – Automazione industriale",
    en: EN_TITLE,
    fr: EN_TITLE,
    es: EN_TITLE,
  },
  level: { it: "Base", en: "Beginner", fr: "Beginner", es: "Beginner" },
  description: {
    it: "Un percorso Technical Skills di CertifyQuiz con i fondamenti pratici dei PLC, vendor-neutral, in italiano e inglese: sicurezza, circuiti di comando, sensori, I/O, ladder, timer, segnali analogici, motori e inverter, HMI/SCADA, reti industriali e ricerca guasti. Non è una certificazione ufficiale.",
    en: EN_DESCRIPTION,
    fr: EN_DESCRIPTION,
    es: EN_DESCRIPTION,
  },

  metaTitle: {
    it: "PLC Fundamentals: quiz di automazione industriale",
    en: "PLC Fundamentals: Industrial Automation Practice Quiz",
    fr: "PLC Fundamentals: Industrial Automation Practice Quiz",
    es: "PLC Fundamentals: Industrial Automation Practice Quiz",
  },
  metaDescription: {
    it: "Quiz PLC vendor-neutral in italiano e inglese: sicurezza, cablaggio, ladder, analogici, inverter, HMI, reti, guasti. Non è una certificazione ufficiale.",
    en: "Vendor-neutral PLC practice in English and Italian: safety, wiring, ladder, analog, drives, HMI, networks, troubleshooting. Not an official certification.",
    fr: "Vendor-neutral PLC practice in English and Italian: safety, wiring, ladder, analog, drives, HMI, networks, troubleshooting. Not an official certification.",
    es: "Vendor-neutral PLC practice in English and Italian: safety, wiring, ladder, analog, drives, HMI, networks, troubleshooting. Not an official certification.",
  },

  topics: [
    topic("Automazione industriale e principi di lavoro in sicurezza", "Industrial Automation and Safe Working Principles", "automazione-industriale-lavoro-sicuro", "industrial-automation-safe-working"),
    topic("Architettura del PLC e ciclo di scansione", "PLC Architecture and Scan Cycle", "architettura-plc-ciclo-scansione", "plc-architecture-scan-cycle"),
    topic("Circuiti di comando: 24 VDC, relè, contattori e circuiti di sicurezza", "Control Circuits: 24 VDC, Relays, Contactors and Safety Circuits", "circuiti-comando-rele-contattori", "control-circuits-relays-contactors"),
    topic("Sensori e attuatori", "Sensors and Actuators", "sensori-attuatori", "sensors-actuators"),
    topic("I/O digitali e cablaggio di campo", "Digital I/O and Field Wiring", "io-digitali-cablaggio-campo", "digital-io-field-wiring"),
    topic("Fondamenti di logica ladder", "Ladder Logic Fundamentals", "fondamenti-logica-ladder", "ladder-logic-fundamentals"),
    topic("Timer, contatori, fronti e sequenze di base", "Timers, Counters, Edges and Basic Sequences", "timer-contatori-sequenze", "timers-counters-sequences"),
    topic("Segnali analogici e scalatura", "Analog Signals and Scaling", "segnali-analogici-scalatura", "analog-signals-scaling"),
    topic("Motori, avviatori e fondamenti di inverter", "Motors, Starters and VFD Fundamentals", "motori-avviatori-inverter", "motors-starters-vfd"),
    topic("Fondamenti di HMI e SCADA", "HMI and SCADA Basics", "fondamenti-hmi-scada", "hmi-scada-basics"),
    topic("Reti industriali", "Industrial Networks", "reti-industriali", "industrial-networks"),
    topic("Ricerca guasti e diagnostica del PLC", "PLC Troubleshooting and Diagnostics", "ricerca-guasti-diagnostica-plc", "plc-troubleshooting-diagnostics"),
  ],

  extraContent: {
    topicsHeading: {
      it: "I 12 argomenti del percorso",
      en: "The 12 topics of the path",
      fr: "The 12 topics of the path",
      es: "The 12 topics of the path",
    },
  },

  quizRoute: {
    it: "/it/quiz/plc-fundamentals",
    en: "/en/quiz/plc-fundamentals",
    fr: "/fr/quiz/plc-fundamentals",
    es: "/es/quiz/plc-fundamentals",
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
};

export default PLCFundamentals;
