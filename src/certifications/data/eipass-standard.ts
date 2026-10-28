// src/certifications/data/eipass-standard.ts
// EIPASS Standard (DigComp 2.2): distinct product from "EIPASS 7 Moduli User" (slug "eipass", id 3).
//
// COMING SOON: publicationStatus "coming_soon" => ONLY the Italian landing is public (200, index/follow,
// self canonical, in the sitemap). No quiz, topic page, practice, review or other language exists: those
// routes are 404. Not listed in the catalogue, home or category pages (only one contextual link from the
// Italian EIPASS 7 Moduli User landing). No DB id on purpose: the certification row does not exist.
//
// The copy is original, independent and never says the preparation is available: it states that the
// quizzes are in preparation. No coverage, equivalence, ranking or "valid for competitions" claim.
// The other-language strings repeat the Italian text only to satisfy LocalizedText and are never rendered
// (those routes are 404, see launchScope).

import type { CertificationData } from "../types";
import {
  EIPASS_STANDARD_COMING_SOON_LABEL,
  EIPASS_STANDARD_COUNTRIES,
  EIPASS_STANDARD_LANGS,
  EIPASS_STANDARD_MODULES,
  EIPASS_STANDARD_OFFICIAL_URL,
  EIPASS_STANDARD_SLUG,
} from "@/lib/eipass-standard";

const IT_TITLE = "EIPASS Standard";
const IT_DESCRIPTION =
  "EIPASS Standard è una certificazione informatica basata sul DigComp 2.2, il quadro europeo delle competenze digitali dei cittadini, articolata in sette moduli d'esame. I quiz di preparazione di CertifyQuiz sono in arrivo: questa pagina è informativa e CertifyQuiz non rilascia la certificazione.";
const IT_META_TITLE = "EIPASS Standard: 7 moduli e quiz in arrivo | CertifyQuiz";
const IT_META_DESCRIPTION =
  "Che cos'è EIPASS Standard, come si lega al DigComp 2.2 e in cosa differisce da EIPASS 7 Moduli User. Quiz di preparazione indipendenti in arrivo su CertifyQuiz.";

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
    title: "Cosa sta preparando CertifyQuiz",
    paragraphs: [
      "Stiamo preparando quiz di allenamento indipendenti per i sette moduli. Oggi non sono ancora disponibili quiz, simulazioni, ripassi né pagine dedicate ai singoli moduli: questa pagina serve a informare e a misurare l'interesse. Quando saranno pronti, seguiranno le regole di CertifyQuiz valide per tutti i quiz di allenamento.",
    ],
  },
] as const;

const FAQ_IT = [
  {
    q: "I quiz di EIPASS Standard sono già disponibili su CertifyQuiz?",
    a: "No. I quiz di preparazione sono in arrivo. Per ora la pagina è solo informativa e non offre quiz, simulazioni o ripassi.",
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
  launchScope: { languages: EIPASS_STANDARD_LANGS, countries: EIPASS_STANDARD_COUNTRIES },
  // Original illustration: no EIPASS logo or mark.
  imageUrl: "/images/certifications/eipass-standard.svg",
  officialUrl: EIPASS_STANDARD_OFFICIAL_URL,

  title: { it: IT_TITLE, en: IT_TITLE, fr: IT_TITLE, es: IT_TITLE },
  level: {
    it: EIPASS_STANDARD_COMING_SOON_LABEL,
    en: EIPASS_STANDARD_COMING_SOON_LABEL,
    fr: EIPASS_STANDARD_COMING_SOON_LABEL,
    es: EIPASS_STANDARD_COMING_SOON_LABEL,
  },
  description: { it: IT_DESCRIPTION, en: IT_DESCRIPTION, fr: IT_DESCRIPTION, es: IT_DESCRIPTION },
  metaTitle: { it: IT_META_TITLE, en: IT_META_TITLE, fr: IT_META_TITLE, es: IT_META_TITLE },
  metaDescription: { it: IT_META_DESCRIPTION, en: IT_META_DESCRIPTION, fr: IT_META_DESCRIPTION, es: IT_META_DESCRIPTION },

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
