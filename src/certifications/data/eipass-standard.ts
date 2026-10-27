// src/certifications/data/eipass-standard.ts
// EIPASS Standard (DigComp 2.2): distinct product from "EIPASS 7 Moduli User" (slug "eipass", id 3).
//
// PLANNED: publicationStatus "planned" => 404 in every public route, absent from lists, categories,
// home and sitemap; also in ROLLOUT_NOINDEX_CERTIFICATION_SLUGS (fail closed even once the status flips).
// Offered in Italian for the Italian market only (launchScope); the other language strings below repeat
// the Italian text only to satisfy LocalizedText and are never rendered (those routes are 404).
// No DB id on purpose: the certification row does not exist yet (see docs/eipass-standard).
//
// The text makes no coverage, equivalence or "valid for ranking/concorsi" claim: those claims need
// the launch requirements in docs/eipass-standard/LAUNCH_REQUIREMENTS.md.

import type { CertificationData } from "../types";
import {
  EIPASS_STANDARD_COUNTRIES,
  EIPASS_STANDARD_LANGS,
  EIPASS_STANDARD_MODULES,
  EIPASS_STANDARD_OFFICIAL_URL,
  EIPASS_STANDARD_SLUG,
} from "@/lib/eipass-standard";

const IT_TITLE = "EIPASS Standard";
const IT_DESCRIPTION =
  "Preparazione indipendente a EIPASS Standard (utente qualificato di computer in base al DigComp 2.2): sette moduli, dai fondamenti dell'ICT alla sicurezza, dalla ricerca di informazioni online a documenti, fogli di lavoro e presentazioni. CertifyQuiz non rilascia la certificazione.";

const LEARN_IT = [
  "Come si articolano i sette moduli d'esame di EIPASS Standard e a quale area del DigComp 2.2 corrisponde ciascuno",
  "Come cercare, valutare e gestire le informazioni online",
  "Come comunicare e collaborare in Rete in modo consapevole",
  "Come proteggere dispositivi, dati personali e benessere digitale",
  "Come creare documenti, fogli di lavoro e presentazioni",
  "Come verificare il tuo livello con quiz di allenamento indipendenti",
] as const;

const FAQ_IT = [
  {
    q: "CertifyQuiz rilascia la certificazione EIPASS Standard?",
    a: "No. CertifyQuiz offre solo preparazione indipendente. L'esame e la certificazione sono erogati da CERTIPASS tramite i suoi centri.",
  },
  {
    q: "Qual è la differenza con EIPASS 7 Moduli User?",
    a: "Sono due percorsi distinti dello stesso ente. EIPASS Standard è basato sul DigComp 2.2; EIPASS 7 Moduli User ha un programma proprio. Su CertifyQuiz hanno pagine e quiz separati.",
  },
  {
    q: "Posso usare i quiz come simulazione dell'esame ufficiale?",
    a: "No. I quiz sono un allenamento indipendente e non riproducono la struttura a livelli dell'esame ufficiale.",
  },
  {
    q: "La certificazione vale per graduatorie o concorsi?",
    a: "Dipende dal bando o dall'avviso di riferimento: verifica sempre le condizioni sul testo ufficiale prima di iscriverti a un esame.",
  },
] as const;

const EipassStandard: CertificationData = {
  slug: EIPASS_STANDARD_SLUG,
  publicationStatus: "planned",
  launchScope: { languages: EIPASS_STANDARD_LANGS, countries: EIPASS_STANDARD_COUNTRIES },
  imageUrl: "/images/certifications/eipass.png",
  officialUrl: EIPASS_STANDARD_OFFICIAL_URL,

  title: { it: IT_TITLE, en: IT_TITLE, fr: IT_TITLE, es: IT_TITLE },
  level: { it: "Base", en: "Beginner", fr: "Débutant", es: "Principiante" },
  description: { it: IT_DESCRIPTION, en: IT_DESCRIPTION, fr: IT_DESCRIPTION, es: IT_DESCRIPTION },

  metaTitle: {
    it: "EIPASS Standard: preparazione ai 7 moduli | CertifyQuiz",
    en: "EIPASS Standard: preparazione ai 7 moduli | CertifyQuiz",
    fr: "EIPASS Standard: preparazione ai 7 moduli | CertifyQuiz",
    es: "EIPASS Standard: preparazione ai 7 moduli | CertifyQuiz",
  },
  metaDescription: {
    it: "Preparazione indipendente a EIPASS Standard (DigComp 2.2): sette moduli, quiz di allenamento e spiegazioni. Non rilasciamo la certificazione.",
    en: "Preparazione indipendente a EIPASS Standard (DigComp 2.2): sette moduli, quiz di allenamento e spiegazioni. Non rilasciamo la certificazione.",
    fr: "Preparazione indipendente a EIPASS Standard (DigComp 2.2): sette moduli, quiz di allenamento e spiegazioni. Non rilasciamo la certificazione.",
    es: "Preparazione indipendente a EIPASS Standard (DigComp 2.2): sette moduli, quiz di allenamento e spiegazioni. Non rilasciamo la certificazione.",
  },

  topics: EIPASS_STANDARD_MODULES.map((m) => {
    const title = `Modulo ${m.number} — ${m.title}`;
    return {
      title: { it: title, en: title, fr: title, es: title },
      slug: { it: m.slug },
    };
  }),

  extraContent: {
    topicsHeading: {
      it: "I 7 moduli di EIPASS Standard",
      en: "I 7 moduli di EIPASS Standard",
      fr: "I 7 moduli di EIPASS Standard",
      es: "I 7 moduli di EIPASS Standard",
    },
    examReference: {
      it: [{ text: "EIPASS Standard — Pagina ufficiale", url: EIPASS_STANDARD_OFFICIAL_URL }],
      en: [{ text: "EIPASS Standard — Pagina ufficiale", url: EIPASS_STANDARD_OFFICIAL_URL }],
      fr: [{ text: "EIPASS Standard — Pagina ufficiale", url: EIPASS_STANDARD_OFFICIAL_URL }],
      es: [{ text: "EIPASS Standard — Pagina ufficiale", url: EIPASS_STANDARD_OFFICIAL_URL }],
    },
    learn: { it: LEARN_IT, en: LEARN_IT, fr: LEARN_IT, es: LEARN_IT },
    faq: { it: FAQ_IT, en: FAQ_IT, fr: FAQ_IT, es: FAQ_IT },
  },

  quizRoute: {
    it: `/it/quiz/${EIPASS_STANDARD_SLUG}`,
    en: `/en/quiz/${EIPASS_STANDARD_SLUG}`,
    fr: `/fr/quiz/${EIPASS_STANDARD_SLUG}`,
    es: `/es/quiz/${EIPASS_STANDARD_SLUG}`,
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
};

export default EipassStandard;
