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
      it: "Concetti di base dell'ICT",
      en: "ICT fundamentals",
      fr: "Notions de base des TIC",
      es: "Conceptos básicos de las TIC",
    },
    {
      it: "Uso del computer e gestione dei file",
      en: "Computer use and file management",
      fr: "Utilisation de l’ordinateur et gestion des fichiers",
      es: "Uso del ordenador y gestión de archivos",
    },
    {
      it: "Elaborazione testi",
      en: "Word processing",
      fr: "Traitement de texte",
      es: "Procesador de textos",
    },
    {
      it: "Foglio elettronico",
      en: "Spreadsheets",
      fr: "Tableurs",
      es: "Hojas de cálculo",
    },
    {
      it: "Uso delle basi di dati",
      en: "Using databases",
      fr: "Utilisation des bases de données",
      es: "Uso de bases de datos",
    },
  ],

  quizRoute: {
    it: "/it/quiz/ecdl",
    en: "/en/quiz/ecdl",
    fr: "/fr/quiz/ecdl",
    es: "/es/quiz/ecdl",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
};

export default ICDL;
