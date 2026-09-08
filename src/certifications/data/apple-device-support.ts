// src/certifications/data/apple-device-support.ts
// Apple Device Support exam (9L0-3023) -> Apple Certified Support Professional
// (ACSP) badge. Registry contract only — publicationStatus:"planned" keeps the
// page 404'd (CertificationDetailView) and out of the category listing until
// there is real quiz content.
// DB: certification id 74, category "Sistemi Operativi" id 12, 9 topics
// (id 499-507) inserted with is_active=0. See
// migrations/2026-09-08-add-lfs101-apple-device-support.up.sql.
// Topics follow the official Apple course (it-training.apple.com/tutorials/apt-support/),
// chapters 1-9; chapter 10 "Next Steps" is a recap, not content, so it's excluded.
// Note: the current official cert covers iPhone/iPad/Mac together, not macOS alone —
// there is no "macOS-only" Apple support certification anymore.

import type { CertificationData } from "../types";

const AppleDeviceSupport: CertificationData = {
  slug: "apple-device-support",
  publicationStatus: "planned",
  imageUrl: "/images/certifications/apple-device-support.svg",
  officialUrl: "https://it-training.apple.com/tutorials/apt-support/",
  lifecycleStatus: "active",

  title: {
    it: "Apple Device Support (ACSP)",
    en: "Apple Device Support (ACSP)",
    fr: "Apple Device Support (ACSP)",
    es: "Apple Device Support (ACSP)",
  },
  level: { it: "Associate", en: "Associate", fr: "Associé", es: "Asociado" },
  description: {
    it: "Preparazione per l'esame Apple Device Support (9L0-3023), il percorso ufficiale Apple per ottenere il badge Apple Certified Support Professional (ACSP). Copre assistenza e risoluzione problemi su iPhone, iPad e Mac in un contesto aziendale: gestione dispositivi, Managed Apple Account e iCloud, setup e recovery, aggiornamenti software, rete, privacy e sicurezza, strumenti diagnostici.",
    en: "Preparation for the Apple Device Support exam (9L0-3023), Apple's official path to earning the Apple Certified Support Professional (ACSP) badge. Covers support and troubleshooting for iPhone, iPad, and Mac in an organizational context: device management, Managed Apple Accounts and iCloud, setup and recovery, software updates, networking, privacy and security, and diagnostic tools.",
    fr: "Préparation à l'examen Apple Device Support (9L0-3023), le parcours officiel Apple pour obtenir le badge Apple Certified Support Professional (ACSP). Couvre l'assistance et le dépannage sur iPhone, iPad et Mac en contexte professionnel : gestion des appareils, comptes Apple gérés et iCloud, configuration et récupération, mises à jour logicielles, réseau, confidentialité et sécurité, outils de diagnostic.",
    es: "Preparación para el examen Apple Device Support (9L0-3023), la vía oficial de Apple para obtener la insignia Apple Certified Support Professional (ACSP). Cubre asistencia y resolución de problemas en iPhone, iPad y Mac en un contexto organizativo: gestión de dispositivos, Cuentas de Apple gestionadas e iCloud, configuración y recuperación, actualizaciones de software, redes, privacidad y seguridad, y herramientas de diagnóstico.",
  },

  topics: [
    {
      title: {
        it: "Come iniziare e prepararsi all'esame",
        en: "Getting Started",
        fr: "Bien démarrer",
        es: "Primeros pasos",
      },
      slug: {
        it: "come-iniziare-prepararsi-esame",
        en: "getting-started",
        fr: "bien-demarrer",
        es: "primeros-pasos",
      },
    },
    {
      title: {
        it: "Fondamenti delle piattaforme Apple",
        en: "Apple Platform Fundamentals",
        fr: "Fondamentaux des plateformes Apple",
        es: "Fundamentos de las plataformas Apple",
      },
      slug: {
        it: "fondamenti-piattaforme-apple",
        en: "apple-platform-fundamentals",
        fr: "fondamentaux-plateformes-apple",
        es: "fundamentos-plataformas-apple",
      },
    },
    {
      title: {
        it: "Gestione dei dispositivi, Managed Apple Account e iCloud",
        en: "Device Management, Managed Apple Accounts, and iCloud",
        fr: "Gestion des appareils, comptes Apple gérés et iCloud",
        es: "Gestión de dispositivos, Cuentas de Apple gestionadas e iCloud",
      },
      slug: {
        it: "gestione-dispositivi-managed-apple-account-icloud",
        en: "device-management-managed-apple-accounts-icloud",
        fr: "gestion-appareils-comptes-apple-geres-icloud",
        es: "gestion-dispositivos-cuentas-apple-gestionadas-icloud",
      },
    },
    {
      title: {
        it: "Configurazione, backup e ripristino di iPhone o iPad",
        en: "Setup, Backup, and Recovery for iPhone or iPad",
        fr: "Configuration, sauvegarde et récupération d'iPhone ou iPad",
        es: "Configuración, copia de seguridad y recuperación de iPhone o iPad",
      },
      slug: {
        it: "configurazione-backup-ripristino-iphone-ipad",
        en: "setup-backup-recovery-iphone-ipad",
        fr: "configuration-sauvegarde-recuperation-iphone-ipad",
        es: "configuracion-copia-seguridad-recuperacion-iphone-ipad",
      },
    },
    {
      title: {
        it: "Configurazione, backup e ripristino del Mac",
        en: "Setup, Backup, and Recovery for Mac",
        fr: "Configuration, sauvegarde et récupération du Mac",
        es: "Configuración, copia de seguridad y recuperación de Mac",
      },
      slug: {
        it: "configurazione-backup-ripristino-mac",
        en: "setup-backup-recovery-mac",
        fr: "configuration-sauvegarde-recuperation-mac",
        es: "configuracion-copia-seguridad-recuperacion-mac",
      },
    },
    {
      title: {
        it: "Aggiornamenti software, spazio di archiviazione e Continuity",
        en: "Software Updates, Device Storage, and Continuity",
        fr: "Mises à jour logicielles, stockage et Continuity",
        es: "Actualizaciones de software, almacenamiento y Continuity",
      },
      slug: {
        it: "aggiornamenti-software-spazio-archiviazione-continuity",
        en: "software-updates-device-storage-continuity",
        fr: "mises-a-jour-logicielles-stockage-continuity",
        es: "actualizaciones-software-almacenamiento-continuity",
      },
    },
    {
      title: {
        it: "Configurazioni e connessioni di rete",
        en: "Network Configurations and Connections",
        fr: "Configurations et connexions réseau",
        es: "Configuraciones y conexiones de red",
      },
      slug: {
        it: "configurazioni-connessioni-rete",
        en: "network-configurations-connections",
        fr: "configurations-connexions-reseau",
        es: "configuraciones-conexiones-red",
      },
    },
    {
      title: {
        it: "Privacy e sicurezza",
        en: "Privacy and Security",
        fr: "Confidentialité et sécurité",
        es: "Privacidad y seguridad",
      },
      slug: {
        it: "privacy-sicurezza",
        en: "privacy-security",
        fr: "confidentialite-securite",
        es: "privacidad-seguridad",
      },
    },
    {
      title: {
        it: "Strumenti diagnostici",
        en: "Diagnostic Tools",
        fr: "Outils de diagnostic",
        es: "Herramientas de diagnóstico",
      },
      slug: {
        it: "strumenti-diagnostici",
        en: "diagnostic-tools",
        fr: "outils-diagnostic",
        es: "herramientas-diagnostico",
      },
    },
  ],

  quizRoute: {
    it: "/it/quiz/apple-device-support",
    en: "/en/quiz/apple-device-support",
    fr: "/fr/quiz/apple-device-support",
    es: "/es/quiz/apple-device-support",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
};

export default AppleDeviceSupport;
