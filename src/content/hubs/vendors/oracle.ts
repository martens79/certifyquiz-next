import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

export const oracleVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "oracle",
  vendorKey: "oracle",

  title: {
    it: "Certificazioni Oracle: Database, SQL e Cloud",
    en: "Oracle Certifications: Database, SQL and Cloud",
    fr: "Certifications Oracle : Database, SQL et Cloud",
    es: "Certificaciones Oracle: Database, SQL y Cloud",
  },

  description: {
    it: "Hub Oracle su CertifyQuiz per prepararti ai percorsi Database, SQL e Oracle Cloud. Parti dalle query SQL, comprendi database relazionali e approfondisci infrastrutture enterprise e cloud.",
    en: "Oracle hub on CertifyQuiz to prepare for Database, SQL and Oracle Cloud paths. Start from SQL queries, understand relational databases and explore enterprise infrastructure and cloud.",
    fr: "Hub Oracle sur CertifyQuiz pour préparer les parcours Database, SQL et Oracle Cloud. Commencez par les requêtes SQL, comprenez les bases relationnelles puis explorez infrastructure enterprise et cloud.",
    es: "Hub Oracle en CertifyQuiz para preparar rutas de Database, SQL y Oracle Cloud. Empieza desde consultas SQL, comprende bases de datos relacionales y explora infraestructura enterprise y cloud.",
  },

  sections: [
    {
      title: {
        it: "Oracle Database SQL",
        en: "Oracle Database SQL",
        fr: "Oracle Database SQL",
        es: "Oracle Database SQL",
      },
      description: {
        it: "Query SQL, SELECT, JOIN, subquery, funzioni, modellazione dati e concetti fondamentali dei database relazionali.",
        en: "SQL queries, SELECT, JOIN, subqueries, functions, data modeling and core relational database concepts.",
        fr: "Requêtes SQL, SELECT, JOIN, sous-requêtes, fonctions, modélisation des données et concepts fondamentaux des bases relationnelles.",
        es: "Consultas SQL, SELECT, JOIN, subconsultas, funciones, modelado de datos y conceptos fundamentales de bases relacionales.",
      },
      hrefByLang: hubHref("oracle-database"),
    },

    {
      title: {
        it: "SQL Foundations",
        en: "SQL Foundations",
        fr: "SQL Foundations",
        es: "SQL Foundations",
      },
      description: {
        it: "Percorso introduttivo per comprendere database, tabelle, relazioni, query e gestione dei dati.",
        en: "Introductory path to understand databases, tables, relationships, queries and data management.",
        fr: "Parcours introductif pour comprendre bases de données, tables, relations, requêtes et gestion des données.",
        es: "Ruta introductoria para comprender bases de datos, tablas, relaciones, consultas y gestión de datos.",
      },
      hrefByLang: hubHref("oracle-database"),
    },

    {
      title: {
        it: "Oracle Cloud",
        en: "Oracle Cloud",
        fr: "Oracle Cloud",
        es: "Oracle Cloud",
      },
      description: {
        it: "Area Oracle Cloud dedicata a infrastruttura, deployment, virtualizzazione, database cloud e servizi enterprise.",
        en: "Oracle Cloud area focused on infrastructure, deployment, virtualization, cloud databases and enterprise services.",
        fr: "Zone Oracle Cloud dédiée à infrastructure, déploiement, virtualisation, bases cloud et services enterprise.",
        es: "Área Oracle Cloud enfocada en infraestructura, deployment, virtualización, bases cloud y servicios enterprise.",
      },
      hrefByLang: hubHref("oracle-cloud"),
    },

    {
      title: {
        it: "Data & Analytics Roadmap",
        en: "Data & Analytics Roadmap",
        fr: "Roadmap Data & Analytics",
        es: "Roadmap Datos y Analítica",
      },
      description: {
        it: "Segui il percorso Data & Analytics: SQL Foundations, Oracle SQL, DP-900, PL-300 e analytics.",
        en: "Follow the Data & Analytics path: SQL Foundations, Oracle SQL, DP-900, PL-300 and analytics.",
        fr: "Suivez le parcours Data & Analytics : SQL Foundations, Oracle SQL, DP-900, PL-300 et analytics.",
        es: "Sigue la ruta Data & Analytics: SQL Foundations, Oracle SQL, DP-900, PL-300 y analítica.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en"
          ? "/roadmap-data-analytics"
          : `/${lang}/roadmap-data-analytics`,
    },

    {
      title: {
        it: "Cloud Roadmap",
        en: "Cloud Roadmap",
        fr: "Roadmap Cloud",
        es: "Roadmap Cloud",
      },
      description: {
        it: "Percorso cloud completo: foundations, AWS, Azure, Google Cloud, Oracle Cloud e operations.",
        en: "Complete cloud path: foundations, AWS, Azure, Google Cloud, Oracle Cloud and operations.",
        fr: "Parcours cloud complet : foundations, AWS, Azure, Google Cloud, Oracle Cloud et operations.",
        es: "Ruta cloud completa: foundations, AWS, Azure, Google Cloud, Oracle Cloud y operations.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en" ? "/roadmap-cloud" : `/${lang}/roadmap-cloud`,
    },
  ],
};