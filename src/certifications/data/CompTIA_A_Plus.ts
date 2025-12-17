// src/certifications/data/comptia-a-plus.ts
// Data consumabile dal renderer server (nessun JSX/router).

const CompTIAAPlus = {
  slug: "comptia-a-plus",
  imageUrl: "/images/certifications/comptia-a-plus.png", // metti l’icona in /public/images/certifications/
  officialUrl: "https://www.comptia.org/en-us/certifications/a/",

  title: {
    it: "CompTIA A+",
    en: "CompTIA A+",
    fr: "CompTIA A+",
    es: "CompTIA A+",
  },
  level: { it: "Intermedio", en: "Intermediate", fr: "Intermédiaire", es: "Intermedio" },

  description: {
    it: "CompTIA A+ è lo standard per i professionisti dell’assistenza IT: installazione, configurazione e manutenzione di hardware/software su sistemi moderni. Ottima per ruoli help desk e supporto tecnico.",
    en: "CompTIA A+ is the industry standard for IT support pros: install, configure, and maintain hardware/software on modern OSes. Great for help desk and support roles.",
    fr: "CompTIA A+ est la norme du support IT : installation, configuration et maintenance du matériel/logiciel sur systèmes modernes. Idéale pour le help desk.",
    es: "CompTIA A+ es el estándar del soporte TI: instalar, configurar y mantener hardware/software en sistemas modernos. Ideal para help desk y soporte.",
  },

  // Allineato a V15 (220-1201 / 220-1202)
  topics: [
    {
      it: "220-1201: Dispositivi mobili, Reti, Hardware, Virtualizzazione & Cloud, Troubleshooting hardware",
      en: "220-1201: Mobile Devices, Networking, Hardware, Virtualization & Cloud, Hardware Troubleshooting",
      fr: "220-1201 : Appareils mobiles, Réseaux, Matériel, Virtualisation & Cloud, Dépannage matériel",
      es: "220-1201: Dispositivos móviles, Redes, Hardware, Virtualización & Cloud, Resolución de problemas de hardware",
    },
    {
      it: "220-1202: Sistemi Operativi, Sicurezza, Troubleshooting software, Procedure operative",
      en: "220-1202: Operating Systems, Security, Software Troubleshooting, Operational Procedures",
      fr: "220-1202 : Systèmes d’exploitation, Sécurité, Dépannage logiciel, Procédures opérationnelles",
      es: "220-1202: Sistemas operativos, Seguridad, Resolución de problemas de software, Procedimientos operativos",
    },
  ],

  extraContent: {
    learn: {
      it: [
        "Installare e configurare dispositivi e periferiche.",
        "Gestire Windows, Linux e macOS.",
        "Risoluzione problemi hardware/software.",
        "Nozioni base di cybersecurity.",
        "Procedure operative IT professionali.",
      ],
      en: [
        "Install and configure devices and peripherals.",
        "Manage Windows, Linux, and macOS.",
        "Troubleshoot hardware/software issues.",
        "Foundational cybersecurity concepts.",
        "Professional IT operational procedures.",
      ],
      fr: [
        "Installer et configurer appareils et périphériques.",
        "Gérer Windows, Linux et macOS.",
        "Dépanner matériel/logiciel.",
        "Notions de cybersécurité.",
        "Procédures opérationnelles IT.",
      ],
      es: [
        "Instalar y configurar dispositivos y periféricos.",
        "Gestionar Windows, Linux y macOS.",
        "Solucionar problemas de hardware/software.",
        "Conceptos básicos de ciberseguridad.",
        "Procedimientos operativos de TI.",
      ],
    },

    examReference: {
      it: [
        { text: "A+ Core 1 (220-1201) — Pagina ufficiale (V15)", url: "https://www.comptia.org/en-us/certifications/a/core-1-v15/" },
        { text: "A+ Core 2 (220-1202) — Pagina ufficiale (V15)", url: "https://www.comptia.org/en-us/certifications/a/core-2-v15/" },
      ],
      en: [
        { text: "A+ Core 1 (220-1201) — Official page (V15)", url: "https://www.comptia.org/en-us/certifications/a/core-1-v15/" },
        { text: "A+ Core 2 (220-1202) — Official page (V15)", url: "https://www.comptia.org/en-us/certifications/a/core-2-v15/" },
      ],
      fr: [
        { text: "A+ Core 1 (220-1201) — Page officielle (V15)", url: "https://www.comptia.org/en-us/certifications/a/core-1-v15/" },
        { text: "A+ Core 2 (220-1202) — Page officielle (V15)", url: "https://www.comptia.org/en-us/certifications/a/core-2-v15/" },
      ],
      es: [
        { text: "A+ Core 1 (220-1201) — Página oficial (V15)", url: "https://www.comptia.org/en-us/certifications/a/core-1-v15/" },
        { text: "A+ Core 2 (220-1202) — Página oficial (V15)", url: "https://www.comptia.org/en-us/certifications/a/core-2-v15/" },
      ],
    },

    whyChoose: {
      it: [
        "Riconosciuta globalmente dal settore IT.",
        "Ottimo ingresso per ruoli di supporto.",
        "Aggiornata alle tecnologie recenti.",
        "Valida per concorsi/crediti.",
        "Materiali ufficiali CompTIA.",
      ],
      en: [
        "Globally recognized in IT.",
        "Great entry to support roles.",
        "Covers modern technologies.",
        "Valid for public/academic credits.",
        "Official CompTIA prep resources.",
      ],
      fr: [
        "Reconnue mondialement.",
        "Excellent point d’entrée support.",
        "Technologies modernes.",
        "Valable pour concours/crédits.",
        "Ressources officielles CompTIA.",
      ],
      es: [
        "Reconocida mundialmente.",
        "Gran entrada a soporte TI.",
        "Tecnologías actuales.",
        "Válida para exámenes/créditos.",
        "Recursos oficiales CompTIA.",
      ],
    },

    faq: {
      it: [
        { q: "Prerequisiti?", a: "Nessuno ufficiale; consigliati 9–12 mesi di pratica e basi IT." },
        { q: "Durata validità?", a: "3 anni; rinnovabile via CEUs o nuovi esami." },
      ],
      en: [
        { q: "Prerequisites?", a: "No formal ones; 9–12 months hands-on and basic IT knowledge recommended." },
        { q: "Validity?", a: "3 years; renewable via CEUs or retakes." },
      ],
      fr: [
        { q: "Prérequis ?", a: "Aucun officiel ; 9–12 mois de pratique et bases IT recommandés." },
        { q: "Validité ?", a: "3 ans ; renouvelable via CEUs ou nouvel examen." },
      ],
      es: [
        { q: "¿Prerrequisitos?", a: "Ninguno oficial; se recomiendan 9–12 meses y bases de TI." },
        { q: "¿Validez?", a: "3 años; renovable con CEUs o reexámenes." },
      ],
    },
  },

  // rotte localizzate per pulsante/indietro
  quizRoute: {
    it: "/it/quiz/comptia-a-plus",
    en: "/quiz/comptia-a-plus",
    fr: "/fr/quiz/comptia-a-plus",
    es: "/es/quiz/comptia-a-plus",
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default CompTIAAPlus;
