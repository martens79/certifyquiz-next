import { EIPASS_USER_COPY, EIPASS_USER_MODULES, EIPASS_USER_OFFICIAL_URL } from "@/lib/eipass-user-release";

const topicSlugs = {
  "17": {
    "it": "fondamenti-del-computer",
    "en": "computer-essentials",
    "fr": "notions-de-base-sur-lordinateur",
    "es": "fundamentos-del-ordenador"
  },
  "18": {
    "it": "sicurezza-informatica",
    "en": "it-security",
    "fr": "securite-informatique",
    "es": "seguridad-informatica"
  },
  "19": {
    "it": "collaborazione-online",
    "en": "online-collaboration",
    "fr": "collaboration-en-ligne",
    "es": "colaboracion-en-linea"
  },
  "20": {
    "it": "navigazione-e-comunicazione",
    "en": "online-essentials",
    "fr": "navigation-et-communication",
    "es": "navegacion-y-comunicacion"
  },
  "21": {
    "it": "strumenti-di-presentazione",
    "en": "presentation",
    "fr": "presentation",
    "es": "presentacion"
  },
  "22": {
    "it": "fogli-di-calcolo",
    "en": "spreadsheets",
    "fr": "tableurs",
    "es": "hojas-de-calculo"
  },
  "23": {
    "it": "elaborazione-testi",
    "en": "word-processing",
    "fr": "traitement-de-texte",
    "es": "procesamiento-de-textos"
  }
} as const;
const EIPASS = {
  slug: "eipass",
  imageUrl: "/images/certifications/eipass.png",
  officialUrl: EIPASS_USER_OFFICIAL_URL,
  title: EIPASS_USER_COPY.name,
  level: { it: "Base", en: "Beginner", fr: "Débutant", es: "Principiante" },
  metaTitle: EIPASS_USER_COPY.metaTitle,
  metaDescription: EIPASS_USER_COPY.description,
  description: EIPASS_USER_COPY.description,
  topics: EIPASS_USER_MODULES.map((module) => ({ title: module.title, slug: topicSlugs[module.id] })),
  extraContent: {
    examReference: Object.fromEntries((["it", "en", "fr", "es"] as const).map((lang) => [lang, [{text: "EIPASS 7 Moduli User", url: EIPASS_USER_OFFICIAL_URL}]])) as Record<"it" | "en" | "fr" | "es", {text: string; url: string}[]>,
    learn: {
  "it": [
    "Ripassa i sette moduli: ICT, web e posta, collaborazione, sicurezza, testi, fogli di calcolo e presentazioni.",
    "Usa quiz e spiegazioni disponibili per individuare i concetti da approfondire."
  ],
  "en": [
    "Review the seven modules: ICT, web and email, collaboration, security, word processing, spreadsheets and presentations.",
    "Use the available quizzes and explanations to identify concepts to study further."
  ],
  "fr": [
    "Révisez les sept modules : TIC, web et messagerie, collaboration, sécurité, traitement de texte, tableurs et présentations.",
    "Utilisez les quiz et explications disponibles pour identifier les notions à approfondir."
  ],
  "es": [
    "Repasa los siete módulos: TIC, web y correo, colaboración, seguridad, textos, hojas de cálculo y presentaciones.",
    "Utiliza los quizzes y explicaciones disponibles para identificar conceptos que debes profundizar."
  ]
},
    faq: {
  "it": [
    {
      "q": "CertifyQuiz rilascia la certificazione?",
      "a": "No. Offre quiz di preparazione indipendenti. Il titolo si consegue presso il certificatore secondo le sue procedure."
    },
    {
      "q": "7 Moduli User equivale a Standard / CIAD?",
      "a": "No. Sono percorsi distinti. Requisiti e punteggi dipendono dal bando e dal profilo; verifica le fonti ufficiali."
    }
  ],
  "en": [
    {
      "q": "Does CertifyQuiz issue the certification?",
      "a": "No. It offers independent practice quizzes. The certification is obtained through the certifier’s own procedures."
    },
    {
      "q": "Is 7 Moduli User equivalent to Standard / CIAD?",
      "a": "No. These are separate paths. Eligibility and points depend on the specific call and role; check official sources."
    }
  ],
  "fr": [
    {
      "q": "CertifyQuiz délivre-t-il la certification ?",
      "a": "Non. Il propose des quiz de préparation indépendants. Le titre s’obtient selon les procédures du certificateur."
    },
    {
      "q": "7 Moduli User équivaut-il à Standard / CIAD ?",
      "a": "Non. Ce sont des parcours distincts. Les conditions et points dépendent du concours et du profil ; consultez les sources officielles."
    }
  ],
  "es": [
    {
      "q": "¿CertifyQuiz emite la certificación?",
      "a": "No. Ofrece quizzes de preparación independientes. El título se obtiene según los procedimientos del certificador."
    },
    {
      "q": "¿7 Moduli User equivale a Standard / CIAD?",
      "a": "No. Son itinerarios distintos. Los requisitos y puntos dependen de la convocatoria y del perfil; consulta las fuentes oficiales."
    }
  ]
},
  },
  quizRoute: { it: "/it/quiz/eipass", en: "/en/quiz/eipass", fr: "/fr/quiz/eipass", es: "/es/quiz/eipass" },
  backRoute: { it: "/it/certificazioni", en: "/certifications", fr: "/fr/certifications", es: "/es/certificaciones" },
};
export default EIPASS;
