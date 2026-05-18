import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

/**
 * Microsoft Vendor Hub (central)
 */
export const microsoftVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "microsoft",
  vendorKey: "microsoft",

  title: {
    it: "Certificazioni Microsoft: Azure, AI, Data e Developer",
    en: "Microsoft Certifications: Azure, AI, Data and Developer",
    fr: "Certifications Microsoft : Azure, IA, Data et Développement",
    es: "Certificaciones Microsoft: Azure, IA, Datos y Desarrollo",
  },

  description: {
    it: "Hub Microsoft su CertifyQuiz per prepararti ai percorsi Azure, AI, Data, SQL Server, Power BI e sviluppo. Parti da Azure Fundamentals, passa a Microsoft AI, DP-900, PL-300 e rafforza competenze cloud, data e developer.",
    en: "Microsoft hub on CertifyQuiz to prepare for Azure, AI, Data, SQL Server, Power BI and developer paths. Start from Azure Fundamentals, move into Microsoft AI, DP-900, PL-300 and build cloud, data and developer skills.",
    fr: "Hub Microsoft sur CertifyQuiz pour préparer les parcours Azure, IA, Data, SQL Server, Power BI et développement. Commencez par Azure Fundamentals, puis Microsoft AI, DP-900, PL-300 et développez vos compétences cloud, data et developer.",
    es: "Hub Microsoft en CertifyQuiz para preparar rutas de Azure, IA, Datos, SQL Server, Power BI y desarrollo. Empieza con Azure Fundamentals, avanza hacia Microsoft AI, DP-900, PL-300 y refuerza habilidades cloud, data y developer.",
  },

  sections: [
    {
      title: {
        it: "Microsoft Azure Fundamentals",
        en: "Microsoft Azure Fundamentals",
        fr: "Microsoft Azure Fundamentals",
        es: "Microsoft Azure Fundamentals",
      },
      description: {
        it: "Il punto di partenza per Azure: servizi core, cloud concepts, governance, sicurezza, pricing e gestione delle risorse.",
        en: "The starting point for Azure: core services, cloud concepts, governance, security, pricing and resource management.",
        fr: "Le point de départ pour Azure : services principaux, concepts cloud, gouvernance, sécurité, pricing et gestion des ressources.",
        es: "El punto de partida para Azure: servicios core, conceptos cloud, governance, seguridad, pricing y gestión de recursos.",
      },
      hrefByLang: hubHref("microsoft-azure"),
    },

    {
      title: {
        it: "Microsoft AI Fundamentals",
        en: "Microsoft AI Fundamentals",
        fr: "Microsoft AI Fundamentals",
        es: "Microsoft AI Fundamentals",
      },
      description: {
        it: "Percorso introduttivo su intelligenza artificiale, machine learning, AI generativa e servizi Microsoft collegati all’AI.",
        en: "Introductory path covering artificial intelligence, machine learning, generative AI and Microsoft AI-related services.",
        fr: "Parcours introductif sur intelligence artificielle, machine learning, IA générative et services Microsoft liés à l’IA.",
        es: "Ruta introductoria sobre inteligencia artificial, machine learning, IA generativa y servicios Microsoft relacionados con IA.",
      },
      hrefByLang: hubHref("microsoft-ai"),
    },

    {
      title: {
        it: "Microsoft SQL Server",
        en: "Microsoft SQL Server",
        fr: "Microsoft SQL Server",
        es: "Microsoft SQL Server",
      },
      description: {
        it: "Database, query SQL, modellazione dati, gestione tabelle, relazioni e concetti fondamentali per lavorare con dati strutturati.",
        en: "Databases, SQL queries, data modeling, table management, relationships and core concepts for structured data.",
        fr: "Bases de données, requêtes SQL, modélisation des données, gestion des tables, relations et concepts clés des données structurées.",
        es: "Bases de datos, consultas SQL, modelado de datos, gestión de tablas, relaciones y conceptos clave de datos estructurados.",
      },
      hrefByLang: hubHref("microsoft-data"),
    },

    {
      title: {
        it: "DP-900 Azure Data Fundamentals",
        en: "DP-900 Azure Data Fundamentals",
        fr: "DP-900 Azure Data Fundamentals",
        es: "DP-900 Azure Data Fundamentals",
      },
      description: {
        it: "Fondamenti dati su Azure: database relazionali e non relazionali, analytics, servizi dati cloud e concetti moderni di data platform.",
        en: "Azure data fundamentals: relational and non-relational databases, analytics, cloud data services and modern data platform concepts.",
        fr: "Fondamentaux data Azure : bases relationnelles et non relationnelles, analytics, services data cloud et concepts de data platform.",
        es: "Fundamentos de datos en Azure: bases relacionales y no relacionales, analytics, servicios cloud de datos y conceptos de data platform.",
      },
      hrefByLang: hubHref("microsoft-data"),
    },

    {
      title: {
        it: "PL-300 Power BI Data Analyst",
        en: "PL-300 Power BI Data Analyst",
        fr: "PL-300 Power BI Data Analyst",
        es: "PL-300 Power BI Data Analyst",
      },
      description: {
        it: "Power BI, dashboard, DAX, modellazione dati, visualizzazione e reporting per trasformare dati grezzi in insight aziendali.",
        en: "Power BI, dashboards, DAX, data modeling, visualization and reporting to turn raw data into business insights.",
        fr: "Power BI, dashboards, DAX, modélisation des données, visualisation et reporting pour transformer les données en insights business.",
        es: "Power BI, dashboards, DAX, modelado de datos, visualización y reporting para transformar datos en insights de negocio.",
      },
      hrefByLang: hubHref("microsoft-data"),
    },

    {
      title: {
        it: "Microsoft Developer",
        en: "Microsoft Developer",
        fr: "Microsoft Developer",
        es: "Microsoft Developer",
      },
      description: {
        it: "Percorso developer Microsoft: C#, API, app moderne, backend, strumenti di sviluppo e integrazione con servizi cloud.",
        en: "Microsoft developer path: C#, APIs, modern apps, backend, development tools and cloud service integration.",
        fr: "Parcours développeur Microsoft : C#, API, apps modernes, backend, outils de développement et intégration cloud.",
        es: "Ruta developer Microsoft: C#, APIs, apps modernas, backend, herramientas de desarrollo e integración cloud.",
      },
      hrefByLang: hubHref("microsoft-dev"),
    },

    {
      title: {
        it: "Cloud Roadmap",
        en: "Cloud Roadmap",
        fr: "Roadmap Cloud",
        es: "Roadmap Cloud",
      },
      description: {
        it: "Non sai da dove iniziare? Segui la roadmap Cloud: foundations, Azure, AWS, Google Cloud, Kubernetes e operations.",
        en: "Not sure where to start? Follow the Cloud roadmap: foundations, Azure, AWS, Google Cloud, Kubernetes and operations.",
        fr: "Vous ne savez pas par où commencer ? Suivez la roadmap Cloud : foundations, Azure, AWS, Google Cloud, Kubernetes et operations.",
        es: "¿No sabes por dónde empezar? Sigue la roadmap Cloud: foundations, Azure, AWS, Google Cloud, Kubernetes y operations.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en" ? "/roadmap-cloud" : `/${lang}/roadmap-cloud`,
    },

    {
      title: {
        it: "Data & Analytics Roadmap",
        en: "Data & Analytics Roadmap",
        fr: "Roadmap Data & Analytics",
        es: "Roadmap Datos y Analítica",
      },
      description: {
        it: "Percorso dati completo: Data Foundations, SQL, DP-900, PL-300, Power BI e analytics.",
        en: "Complete data path: Data Foundations, SQL, DP-900, PL-300, Power BI and analytics.",
        fr: "Parcours data complet : Data Foundations, SQL, DP-900, PL-300, Power BI et analytics.",
        es: "Ruta completa de datos: Data Foundations, SQL, DP-900, PL-300, Power BI y analítica.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en"
          ? "/roadmap-data-analytics"
          : `/${lang}/roadmap-data-analytics`,
    },

    {
      title: {
        it: "AI Roadmap",
        en: "AI Roadmap",
        fr: "Roadmap IA",
        es: "Roadmap IA",
      },
      description: {
        it: "Percorso AI: AI Foundations, Microsoft AI, AWS AI Practitioner, Google Cloud e TensorFlow.",
        en: "AI path: AI Foundations, Microsoft AI, AWS AI Practitioner, Google Cloud and TensorFlow.",
        fr: "Parcours IA : AI Foundations, Microsoft AI, AWS AI Practitioner, Google Cloud et TensorFlow.",
        es: "Ruta IA: AI Foundations, Microsoft AI, AWS AI Practitioner, Google Cloud y TensorFlow.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en" ? "/roadmap-ai" : `/${lang}/roadmap-ai`,
    },
  ],
};