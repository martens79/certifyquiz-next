// Editorial adapter only: no IDs, slugs, question payloads or entitlements are changed.
import type { Locale } from "@/lib/i18n";
export const EIPASS_USER_ID = 3;
export const EIPASS_USER_SLUG = "eipass";
export const EIPASS_USER_OFFICIAL_URL = "https://it.eipass.com/certificazioni-informatiche/7-moduli-user/";
export const EIPASS_USER_COPY = {
  "name": {
    "it": "EIPASS 7 Moduli User",
    "en": "EIPASS 7 Moduli User",
    "fr": "EIPASS 7 Moduli User",
    "es": "EIPASS 7 Moduli User"
  },
  "metaTitle": {
    "it": "EIPASS 7 Moduli User: quiz di preparazione | CertifyQuiz",
    "en": "EIPASS 7 Moduli User: practice quizzes | CertifyQuiz",
    "fr": "EIPASS 7 Moduli User : quiz de préparation | CertifyQuiz",
    "es": "EIPASS 7 Moduli User: quizzes de preparación | CertifyQuiz"
  },
  "description": {
    "it": "Preparati a EIPASS 7 Moduli User con quiz su ICT, web, collaborazione, sicurezza, documenti, fogli di calcolo e presentazioni. Preparazione indipendente.",
    "en": "Prepare for EIPASS 7 Moduli User with quizzes on ICT, the web, collaboration, security, documents, spreadsheets and presentations. Independent preparation.",
    "fr": "Préparez EIPASS 7 Moduli User : quiz sur les TIC, le web, la collaboration, la sécurité et la bureautique. Préparation indépendante.",
    "es": "Prepara EIPASS 7 Moduli User con quizzes sobre TIC, web, colaboración, seguridad y ofimática. Preparación independiente."
  },
  "notice": {
    "it": "CertifyQuiz offre preparazione indipendente per EIPASS 7 Moduli User. Non rilascia la certificazione; questo percorso non sostituisce EIPASS Standard / CIAD. La disponibilità delle domande varia per lingua.",
    "en": "CertifyQuiz provides independent preparation for EIPASS 7 Moduli User and does not issue the certification. This path does not replace EIPASS Standard / CIAD. Question availability varies by language.",
    "fr": "CertifyQuiz propose une préparation indépendante à EIPASS 7 Moduli User et ne délivre pas la certification. Ce parcours ne remplace pas EIPASS Standard / CIAD. Les questions disponibles varient selon la langue.",
    "es": "CertifyQuiz ofrece preparación independiente para EIPASS 7 Moduli User y no emite la certificación. Este itinerario no sustituye EIPASS Standard / CIAD. Las preguntas disponibles varían según el idioma."
  },
  "practiceTitle": {
    "it": "Esercitazione a tempo",
    "en": "Timed practice",
    "fr": "Entraînement chronométré",
    "es": "Práctica cronometrada"
  },
  "practiceNotice": {
    "it": "Esercitazione indipendente con timer e punteggio di allenamento. Il formato attuale non è una replica verificata dei sette esami modulari EIPASS 7 Moduli User e non attribuisce un livello certificato.",
    "en": "Independent timed practice with a training score. The current format is not a verified replica of the seven EIPASS 7 Moduli User module exams and does not award a certified level.",
    "fr": "Entraînement indépendant avec chronomètre et score. Le format actuel n’est pas une reproduction vérifiée des sept examens modulaires EIPASS 7 Moduli User et n’attribue aucun niveau certifié.",
    "es": "Práctica independiente con temporizador y puntuación. El formato actual no es una réplica verificada de los siete exámenes modulares EIPASS 7 Moduli User y no otorga un nivel certificado."
  },
  "premiumTitle": {
    "it": "Allenati con Premium su EIPASS 7 Moduli User",
    "en": "Practise EIPASS 7 Moduli User with Premium",
    "fr": "Entraînez-vous à EIPASS 7 Moduli User avec Premium",
    "es": "Practica EIPASS 7 Moduli User con Premium"
  },
  "premiumNotice": {
    "it": "Accesso Premium ai quiz e alle spiegazioni disponibili. La copertura del programma e le traduzioni sono in revisione.",
    "en": "Premium access to the available quizzes and explanations. Syllabus coverage and translations are under review.",
    "fr": "Accès Premium aux quiz et explications disponibles. La couverture du programme et les traductions sont en cours de révision.",
    "es": "Acceso Premium a los quizzes y explicaciones disponibles. La cobertura del programa y las traducciones están en revisión."
  }
} as const;
export const EIPASS_USER_MODULES = [
  {
    "id": 17,
    "title": {
      "it": "ICT Fundamentals — Fondamenti ICT",
      "en": "ICT Fundamentals",
      "fr": "ICT Fundamentals — Fondamentaux des TIC",
      "es": "ICT Fundamentals — Fundamentos TIC"
    },
    "description": {
      "it": "Hardware, sistema operativo, file, reti e uso accessibile del computer.",
      "en": "Hardware, operating systems, files, networks and accessible computer use.",
      "fr": "Matériel, systèmes, fichiers, réseaux et utilisation accessible de l’ordinateur.",
      "es": "Hardware, sistemas operativos, archivos, redes y uso accesible del ordenador."
    }
  },
  {
    "id": 20,
    "title": {
      "it": "Web Browsing — Navigazione web e posta elettronica",
      "en": "Web Browsing — Web navigation and email",
      "fr": "Web Browsing — Navigation web et messagerie",
      "es": "Web Browsing — Navegación web y correo electrónico"
    },
    "description": {
      "it": "Browser, ricerca delle informazioni, valutazione delle fonti e posta elettronica.",
      "en": "Browsers, information search, source evaluation and email.",
      "fr": "Navigateurs, recherche d’informations, évaluation des sources et messagerie.",
      "es": "Navegadores, búsqueda de información, evaluación de fuentes y correo electrónico."
    }
  },
  {
    "id": 19,
    "title": {
      "it": "Web Collaboration — Collaborazione online e dispositivi mobili",
      "en": "Web Collaboration — Online collaboration and mobile devices",
      "fr": "Web Collaboration — Collaboration en ligne et appareils mobiles",
      "es": "Web Collaboration — Colaboración en línea y dispositivos móviles"
    },
    "description": {
      "it": "Cloud, documenti condivisi, calendari, riunioni online e dispositivi mobili.",
      "en": "Cloud services, shared documents, calendars, online meetings and mobile devices.",
      "fr": "Cloud, documents partagés, calendriers, réunions en ligne et appareils mobiles.",
      "es": "Servicios en la nube, documentos compartidos, calendarios, reuniones y dispositivos móviles."
    }
  },
  {
    "id": 18,
    "title": {
      "it": "IT Security — Sicurezza informatica",
      "en": "IT Security",
      "fr": "IT Security — Sécurité informatique",
      "es": "IT Security — Seguridad informática"
    },
    "description": {
      "it": "Protezione di dispositivi, reti e dati; privacy, minacce e copie di sicurezza.",
      "en": "Device, network and data protection; privacy, threats and backups.",
      "fr": "Protection des appareils, réseaux et données ; confidentialité, menaces et sauvegardes.",
      "es": "Protección de dispositivos, redes y datos; privacidad, amenazas y copias de seguridad."
    }
  },
  {
    "id": 23,
    "title": {
      "it": "Word Processing — Elaborazione testi",
      "en": "Word Processing",
      "fr": "Word Processing — Traitement de texte",
      "es": "Word Processing — Procesamiento de textos"
    },
    "description": {
      "it": "Creazione e formattazione di documenti, tabelle, immagini, stampa unione ed esportazione.",
      "en": "Creating and formatting documents, tables, images, mail merge and export.",
      "fr": "Création et mise en forme de documents, tableaux, images, publipostage et export.",
      "es": "Creación y formato de documentos, tablas, imágenes, combinación de correspondencia y exportación."
    }
  },
  {
    "id": 22,
    "title": {
      "it": "Spreadsheets — Fogli di calcolo",
      "en": "Spreadsheets",
      "fr": "Spreadsheets — Tableurs",
      "es": "Spreadsheets — Hojas de cálculo"
    },
    "description": {
      "it": "Gestione dei dati, formule, funzioni, grafici e stampa dei fogli di calcolo.",
      "en": "Managing data, formulas, functions, charts and spreadsheet printing.",
      "fr": "Gestion des données, formules, fonctions, graphiques et impression de feuilles de calcul.",
      "es": "Gestión de datos, fórmulas, funciones, gráficos e impresión de hojas de cálculo."
    }
  },
  {
    "id": 21,
    "title": {
      "it": "Presentations — Presentazioni",
      "en": "Presentations",
      "fr": "Presentations — Présentations",
      "es": "Presentations — Presentaciones"
    },
    "description": {
      "it": "Creazione di diapositive, testi, tabelle, grafici e oggetti per le presentazioni.",
      "en": "Creating slides, text, tables, charts and presentation objects.",
      "fr": "Création de diapositives, textes, tableaux, graphiques et objets de présentation.",
      "es": "Creación de diapositivas, textos, tablas, gráficos y objetos de presentación."
    }
  }
] as const;

export function getEipassUserModule(id: number) {
  return EIPASS_USER_MODULES.find((userModule) => userModule.id === id);
}

// Handles the observed JSON-encoded localized description without rendering JSON.
// Plain content, including HTML, stays unchanged. Malformed structured values are hidden.
export function eipassLocalizedText(value: unknown, lang: Locale, depth = 0): string {
  if (depth > 2 || value == null) return "";
  if (typeof value === "string") {
    const text = value.trim();
    if (!text.startsWith("{")) return value;
    try { return eipassLocalizedText(JSON.parse(text), lang, depth + 1); }
    catch { return ""; }
  }
  if (typeof value !== "object" || Array.isArray(value)) return "";
  const localized = value as Record<string, unknown>;
  return eipassLocalizedText(localized[lang] ?? localized.it ?? localized.en ?? localized.fr ?? localized.es, lang, depth + 1);
}

type TopicIdentity = { id: number; certification_id?: number };
export function eipassTopicRow<T extends TopicIdentity>(row: T): T {
  const userModule = row.certification_id === EIPASS_USER_ID ? getEipassUserModule(Number(row.id)) : undefined;
  if (!userModule) return row;
  return { ...row, title: userModule.title.it, description: userModule.description.it,
    title_it: userModule.title.it, title_en: userModule.title.en, title_fr: userModule.title.fr, title_es: userModule.title.es,
    description_it: userModule.description.it, description_en: userModule.description.en,
    description_fr: userModule.description.fr, description_es: userModule.description.es };
}

export function orderEipassTopics<T extends { id: number }>(rows: readonly T[]): T[] {
  const rank = (id: number) => { const index = EIPASS_USER_MODULES.findIndex((m) => m.id === Number(id)); return index < 0 ? 999 : index; };
  return [...rows].sort((a, b) => rank(a.id) - rank(b.id));
}
