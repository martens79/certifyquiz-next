// src/certifications/data/plc-fundamentals.ts
// PLC Fundamentals – Industrial Automation: a CertifyQuiz Technical Skills path.
// It is NOT an official, vendor or accredited certification.
//
// LAUNCHED (EN + IT): publicationStatus is no longer "planned" (production id 75 in
// IDS_BY_SLUG). The area, category page, landing and quiz topics page are public in EN/IT.
// It is STILL in ROLLOUT_NOINDEX_CERTIFICATION_SLUGS: noindex,follow in every language, its
// topics noindex, and absent from the sitemap, whatever the DB inventory. That entry is
// removed in a separate change after the production smoke test.
// FR/ES stay 404 for this certification (see lib/industrial-automation).
//
// Launch languages: EN + IT. FR/ES are not offered: their strings below repeat EN only
// to satisfy LocalizedText and stay non-public.
// Topic slugs match the backend import catalog
// (quiz_project tools/content/plc-fundamentals/import/catalog.js).

import type { CertificationData } from "../types";

const EN_TITLE = "PLC Fundamentals – Industrial Automation";
const EN_DESCRIPTION =
  "A CertifyQuiz Technical Skills path with practical, vendor-neutral PLC fundamentals in English and Italian: safety, control circuits, sensors, I/O, ladder logic, timers, analog signals, motors and drives, HMI/SCADA, industrial networks and troubleshooting. It is not an official certification.";

const LEARN_EN = [
  "How to work safely around automated machines: isolation, stored energy and the limits of who may do what",
  "How a PLC scan cycle works and what it means for logic and I/O",
  "How to read control circuits, sensors, actuators and field wiring, and what typical faults look like",
  "How to read and reason about ladder logic, timers, counters and sequences",
  "How analog signals are scaled, and the basics of motors and drives, HMI/SCADA and industrial networks",
  "How to troubleshoot in a structured way: safe state first, then evidence, then the fault",
] as const;
const LEARN_IT = [
  "Come lavorare in sicurezza vicino a macchine automatizzate: isolamento, energia accumulata e limiti di chi può fare che cosa",
  "Come funziona il ciclo di scansione di un PLC e che cosa implica per logica e I/O",
  "Come leggere circuiti di comando, sensori, attuatori e cablaggio di campo, e come si presentano i guasti tipici",
  "Come leggere e ragionare sulla logica ladder, su timer, contatori e sequenze",
  "Come si scalano i segnali analogici, e le basi di motori e inverter, HMI/SCADA e reti industriali",
  "Come fare ricerca guasti in modo strutturato: prima lo stato sicuro, poi le evidenze, poi il guasto",
] as const;

const FAQ_EN = [
  { q: "Is PLC Fundamentals an official certification?", a: "No. It is a CertifyQuiz Technical Skills path. It is vendor-neutral and is not issued, endorsed or accredited by any vendor or certification body." },
  { q: "Which parts are free?", a: "Three topics are free: Industrial Automation and Safe Working Principles, PLC Architecture and Scan Cycle, and Ladder Logic Fundamentals (68 questions). The other nine topics (206 questions) are Premium." },
  { q: "Which languages are available?", a: "English and Italian." },
  { q: "Can I use it as a procedure for working on live equipment?", a: "No. The questions practise concepts and diagnostic reasoning. Always follow your site rules and the instructions of authorized personnel." },
] as const;
const FAQ_IT = [
  { q: "PLC Fundamentals è una certificazione ufficiale?", a: "No. È un percorso Technical Skills di CertifyQuiz, vendor-neutral, non rilasciato, approvato o accreditato da alcun costruttore o ente di certificazione." },
  { q: "Quali parti sono gratuite?", a: "Tre argomenti sono gratuiti: Automazione industriale e principi di lavoro in sicurezza, Architettura del PLC e ciclo di scansione, Fondamenti di logica ladder (68 domande). Gli altri nove argomenti (206 domande) sono Premium." },
  { q: "In quali lingue è disponibile?", a: "Inglese e italiano." },
  { q: "Posso usarlo come procedura per lavorare su impianti in tensione?", a: "No. Le domande esercitano concetti e ragionamento diagnostico. Segui sempre le regole del tuo sito e le indicazioni del personale autorizzato." },
] as const;

const topic = (it: string, en: string, slugIt: string, slugEn: string) => ({
  title: { it, en, fr: en, es: en },
  slug: { it: slugIt, en: slugEn },
});

const PLCFundamentals: CertificationData = {
  slug: "plc-fundamentals",
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
    learn: { it: LEARN_IT, en: LEARN_EN, fr: LEARN_EN, es: LEARN_EN },
    faq: { it: FAQ_IT, en: FAQ_EN, fr: FAQ_EN, es: FAQ_EN },
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
