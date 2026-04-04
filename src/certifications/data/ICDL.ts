// src/certifications/data/ICDL.ts
// Pagina certificazione ICDL (ex ECDL)
// Slug canonico: "icdl"
// Nota: in italiano mostriamo ancora ECDL (ICDL)

import type { CertificationData } from "../types";

const ICDL: CertificationData = {
  slug: "icdl",

  imageUrl: "/images/certifications/ecdl.png",

  officialUrl: "https://icdl.org/icdl-modules-programs/",

  title: {
    it: "ECDL (ICDL)",
    en: "ICDL",
    fr: "ICDL",
    es: "ICDL",
  },

  level: {
    it: "Base",
    en: "Basic",
    fr: "Base",
    es: "Básico",
  },

  description: {
    it: "La certificazione ECDL (oggi ICDL) attesta le competenze informatiche di base riconosciute a livello internazionale.",
    en: "The ICDL certification proves internationally recognized basic computer skills.",
    fr: "La certification ICDL atteste des compétences informatiques de base reconnues au niveau international.",
    es: "La certificación ICDL acredita competencias informáticas básicas reconocidas internacionalmente.",
  },

  topics: [
  {
    title: {
      it: "Concetti di base dell’ICT",
      en: "Basic ICT Concepts",
      fr: "Concepts de base de l'ICT",
      es: "Conceptos básicos de las TIC",
    },
    slug: {
      it: "concetti-di-base-dellict",
      en: "basic-ict-concepts",
      fr: "concepts-de-base-de-lict",
      es: "conceptos-basicos-de-las-tic",
    },
  },
  {
    title: {
      it: "Uso del computer e gestione dei file",
      en: "Computer Use and File Management",
      fr: "Utilisation de l’ordinateur et gestion des fichiers",
      es: "Uso de la computadora y gestión de archivos",
    },
    slug: {
      it: "uso-del-computer-e-gestione-dei-file",
      en: "computer-use-and-file-management",
      fr: "utilisation-de-lordinateur-et-gestion-des-fichiers",
      es: "uso-de-la-computadora-y-gestion-de-archivos",
    },
  },
  {
    title: {
      it: "Elaborazione testi",
      en: "Text Processing",
      fr: "Traitement de texte",
      es: "Procesamiento de texto",
    },
    slug: {
      it: "elaborazione-testi",
      en: "text-processing",
      fr: "traitement-de-texte",
      es: "procesamiento-de-texto",
    },
  },
  {
    title: {
      it: "Foglio elettronico",
      en: "Spreadsheet",
      fr: "Feuille de calcul",
      es: "Hoja de cálculo",
    },
    slug: {
      it: "foglio-elettronico",
      en: "spreadsheet",
      fr: "feuille-de-calcul",
      es: "hoja-de-calculo",
    },
  },
  {
    title: {
      it: "Uso delle basi di dati",
      en: "Use of Databases",
      fr: "Utilisation des bases de données",
      es: "Uso de bases de datos",
    },
    slug: {
      it: "uso-delle-basi-di-dati",
      en: "use-of-databases",
      fr: "utilisation-des-bases-de-donnees",
      es: "uso-de-bases-de-datos",
    },
  },
  {
    title: {
      it: "Navigazione e comunicazione",
      en: "Navigation and Communication",
      fr: "Navigation et communication",
      es: "Navegación y comunicación",
    },
    slug: {
      it: "navigazione-e-comunicazione",
      en: "navigation-and-communication",
      fr: "navigation-et-communication",
      es: "navegacion-y-comunicacion",
    },
  },
  {
    title: {
      it: "Strumenti di presentazione",
      en: "Presentation Tools",
      fr: "Outils de présentation",
      es: "Herramientas de presentación",
    },
    slug: {
      it: "strumenti-di-presentazione",
      en: "presentation-tools",
      fr: "outils-de-presentation",
      es: "herramientas-de-presentacion",
    },
  },
],

  quizRoute: {
    it: "/it/quiz/icdl",
    en: "/en/quiz/icdl",
    fr: "/fr/quiz/icdl",
    es: "/es/quiz/icdl",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
};

export default ICDL;
