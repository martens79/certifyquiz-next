// src/certifications/data/eipass-standard.ts
// EIPASS Standard (DigComp 2.2): distinct product from "EIPASS 7 Moduli User" (slug "eipass", id 3).
//
// COMING SOON: publicationStatus "coming_soon" => ONLY the Italian landing is public (200, index/follow,
// self canonical, in the sitemap). No quiz, topic page, practice, review or other language exists: those
// routes are 404. Listed in the ITALIAN catalogue (listedInCatalog) but not in home or category pages, plus
// one contextual link from the Italian EIPASS 7 Moduli User landing. No DB id on purpose: the landing and the
// catalogue entry come from this registry alone and never read the certification row.
//
// The copy is original, independent and never says the preparation is available: it states that the
// quizzes are in preparation. No coverage, equivalence, ranking or "valid for competitions" claim.
// The other-language strings repeat the Italian text only to satisfy LocalizedText and are never rendered
// (those routes are 404, see launchScope).

import type { CertificationData } from "../types";
import {
  eipassStandardCopy,
  EIPASS_STANDARD_COUNTRIES,
  EIPASS_STANDARD_LANGS,
  EIPASS_STANDARD_MODULES,
  EIPASS_STANDARD_OFFICIAL_URL,
  EIPASS_STANDARD_SLUG,
} from "@/lib/eipass-standard";

const IT_TITLE = "EIPASS Standard";
// Copy follows the module availability (lib/eipass-standard.ts): "in arrivo" while no module is available.
const COPY = eipassStandardCopy();

const GUIDE_IT = [
  {
    title: "Che cos'è EIPASS Standard",
    paragraphs: [
      "EIPASS Standard è la certificazione di competenze digitali di CERTIPASS costruita sul DigComp 2.2. Si consegue superando sette esami, uno per ciascun modulo: dai fondamenti dell'ICT alla ricerca di informazioni sul Web, dalla comunicazione e collaborazione in Rete alla sicurezza informatica, fino alla creazione di documenti, fogli di lavoro e presentazioni.",
      "Le condizioni di iscrizione, la struttura degli esami e i livelli sono stabiliti dall'ente certificatore: per i dettagli ufficiali usa sempre la pagina indicata qui sotto.",
    ],
  },
  {
    title: "EIPASS Standard e il DigComp 2.2",
    paragraphs: [
      "Il DigComp 2.2 è il quadro di riferimento europeo per le competenze digitali dei cittadini. Organizza le competenze in cinque aree: alfabetizzazione su informazioni e dati, comunicazione e collaborazione, creazione di contenuti digitali, sicurezza e risoluzione di problemi.",
      "I sette moduli di EIPASS Standard si collocano su queste cinque aree: i tre moduli dedicati ai documenti, ai fogli di lavoro e alle presentazioni fanno capo all'area della creazione di contenuti digitali, gli altri quattro corrispondono ciascuno a un'area.",
    ],
  },
  {
    title: "Differenze rispetto a EIPASS 7 Moduli User",
    paragraphs: [
      "EIPASS Standard ed EIPASS 7 Moduli User sono due percorsi distinti: hanno programmi, esami e riferimenti propri, anche se entrambi si articolano in sette moduli. Su CertifyQuiz non vanno confusi e non condividono la stessa pagina.",
    ],
    items: [
      "Il riferimento di EIPASS Standard è il DigComp 2.2; EIPASS 7 Moduli User ha un programma proprio, con altri contenuti per modulo.",
      "I moduli di EIPASS Standard seguono i nomi e l'ordine del programma ufficiale Standard, diversi da quelli di EIPASS 7 Moduli User.",
      "Se un bando, un avviso o un datore di lavoro richiede una certificazione precisa, verifica nel testo ufficiale quale delle due è accettata prima di iscriverti a un esame.",
    ],
  },
  {
    title: COPY.guideTitle,
    paragraphs: [COPY.guideParagraph],
  },
] as const;

const FAQ_IT = [
  {
    q: COPY.faqQuestion,
    a: COPY.faqAnswer,
  },
  {
    q: "CertifyQuiz rilascia la certificazione EIPASS Standard?",
    a: "No. CertifyQuiz offrirà preparazione indipendente. L'esame e la certificazione sono erogati da CERTIPASS.",
  },
  {
    q: "Che differenza c'è tra EIPASS Standard ed EIPASS 7 Moduli User?",
    a: "Sono due percorsi distinti, con programmi ed esami propri. EIPASS Standard fa riferimento al DigComp 2.2; EIPASS 7 Moduli User ha un programma proprio. Su CertifyQuiz hanno pagine separate.",
  },
  {
    q: "La certificazione vale per graduatorie o concorsi?",
    a: "Dipende dal bando o dall'avviso di riferimento: controlla sempre le condizioni nel testo ufficiale prima di iscriverti a un esame.",
  },
] as const;

const EipassStandard: CertificationData = {
  slug: EIPASS_STANDARD_SLUG,
  publicationStatus: "coming_soon",
  listedInCatalog: true,
  launchScope: { languages: EIPASS_STANDARD_LANGS, countries: EIPASS_STANDARD_COUNTRIES },
  // Original illustration: no EIPASS logo or mark.
  imageUrl: "/images/certifications/eipass-standard.svg",
  officialUrl: EIPASS_STANDARD_OFFICIAL_URL,

  title: { it: IT_TITLE, en: IT_TITLE, fr: IT_TITLE, es: IT_TITLE },
  level: {
    it: COPY.statusLabel,
    en: COPY.statusLabel,
    fr: COPY.statusLabel,
    es: COPY.statusLabel,
  },
  description: { it: COPY.description, en: COPY.description, fr: COPY.description, es: COPY.description },
  metaTitle: { it: COPY.metaTitle, en: COPY.metaTitle, fr: COPY.metaTitle, es: COPY.metaTitle },
  metaDescription: { it: COPY.metaDescription, en: COPY.metaDescription, fr: COPY.metaDescription, es: COPY.metaDescription },

  // Informational only: titles WITHOUT slug, so the landing never links to a module page.
  topics: EIPASS_STANDARD_MODULES.map((m) => {
    const title = `Modulo ${m.number} — ${m.title}`;
    return { title: { it: title, en: title, fr: title, es: title } };
  }),

  extraContent: {
    topicsHeading: {
      it: "I 7 moduli d'esame",
      en: "I 7 moduli d'esame",
      fr: "I 7 moduli d'esame",
      es: "I 7 moduli d'esame",
    },
    guideSections: { it: GUIDE_IT, en: GUIDE_IT, fr: GUIDE_IT, es: GUIDE_IT },
    faq: { it: FAQ_IT, en: FAQ_IT, fr: FAQ_IT, es: FAQ_IT },
  },

  // Nothing is reachable at these routes (404); they only satisfy the registry contract.
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
