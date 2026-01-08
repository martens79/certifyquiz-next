// src/certifications/data/cisco-ccst-networking.ts
// Data-only per CertificationPage (server). Nessun JSX/Router.

const CISCO_CCST_NETWORKING = {
  slug: "cisco-ccst-networking",
  imageUrl: "/images/certifications/ccst_networking.png", // copia il logo in /public/images/certifications/ccst_networking.png
  officialUrl:
    "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-networking.html",

  title: {
    it: "Cisco CCST – Networking",
    en: "Cisco CCST – Networking",
    fr: "Cisco CCST – Réseaux",
    es: "Cisco CCST – Redes",
  },
  level: {
    it: "Base",
    en: "Entry-level",
    fr: "Débutant",
    es: "Inicial",
  },
  description: {
    it: "La certificazione Cisco CCST Networking convalida le competenze di base nella rete, inclusi protocolli, dispositivi, risoluzione problemi e sicurezza.",
    en: "The Cisco CCST Networking certification validates entry-level networking skills, including protocols, devices, troubleshooting, and security.",
    fr: "La certification Cisco CCST Networking valide les compétences de base en réseaux, y compris les protocoles, les dispositifs, le dépannage et la sécurité.",
    es: "La certificación Cisco CCST Networking valida habilidades básicas de redes, incluidos protocolos, dispositivos, resolución de problemas y seguridad.",
  },

  topics: [
    { it: "Fondamenti di rete", en: "Networking fundamentals", fr: "Bases du réseau", es: "Fundamentos de redes" },
    { it: "Dispositivi e cablaggio", en: "Devices and cabling", fr: "Appareils et câblage", es: "Dispositivos y cableado" },
    { it: "Protocolli e servizi", en: "Protocols and services", fr: "Protocoles et services", es: "Protocolos y servicios" },
    { it: "Indirizzamento IP", en: "IP addressing", fr: "Adressage IP", es: "Direcciones IP" },
    { it: "Sicurezza di rete", en: "Network security", fr: "Sécurité réseau", es: "Seguridad de red" },
    { it: "Risoluzione dei problemi", en: "Troubleshooting", fr: "Dépannage", es: "Resolución de problemas" },
  ],

  extraContent: {
    learn: {
      it: [
        "Capire i concetti fondamentali delle reti.",
        "Identificare i dispositivi e il cablaggio usati nelle reti.",
        "Comprendere i protocolli e i servizi di rete più comuni.",
        "Applicare le basi dell'indirizzamento IP.",
        "Riconoscere i concetti di sicurezza delle reti.",
        "Affrontare problematiche comuni tramite tecniche di troubleshooting.",
      ],
      en: [
        "Understand fundamental networking concepts.",
        "Identify devices and cabling used in networks.",
        "Understand common networking protocols and services.",
        "Apply basic IP addressing concepts.",
        "Recognize basic network security principles.",
        "Use basic troubleshooting techniques.",
      ],
      fr: [
        "Comprendre les concepts fondamentaux des réseaux.",
        "Identifier les appareils et le câblage utilisés dans les réseaux.",
        "Comprendre les protocoles et services réseau courants.",
        "Appliquer les concepts de base de l’adressage IP.",
        "Reconnaître les principes de base de la sécurité réseau.",
        "Utiliser les techniques de dépannage de base.",
      ],
      es: [
        "Comprender los conceptos básicos de redes.",
        "Identificar dispositivos y cableado en redes.",
        "Comprender protocolos y servicios de red comunes.",
        "Aplicar los conceptos básicos del direccionamiento IP.",
        "Reconocer principios básicos de seguridad de red.",
        "Usar técnicas básicas de resolución de problemas.",
      ],
    },
    examReference: {
      it: [
        {
          text: "100-150 • CCST Networking — Pagina ufficiale d’esame",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-networking.html",
        },
      ],
      en: [
        {
          text: "100-150 • CCST Networking — Official exam page",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-networking.html",
        },
      ],
      fr: [
        {
          text: "100-150 • CCST Networking — Page officielle de l’examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-networking.html",
        },
      ],
      es: [
        {
          text: "100-150 • CCST Networking — Página oficial del examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-networking.html",
        },
      ],
    },
    whyChoose: {
      it: [
        "Certificazione ufficiale Cisco entry-level.",
        "Ideale per iniziare una carriera nel networking.",
        "Contenuti pratici e immediatamente applicabili.",
        "Utile anche per chi prepara il CCNA.",
      ],
      en: [
        "Official Cisco entry-level certification.",
        "Ideal for starting a networking career.",
        "Practical and directly applicable knowledge.",
        "Also useful as preparation for the CCNA.",
      ],
      fr: [
        "Certification d’entrée officielle de Cisco.",
        "Idéale pour débuter une carrière en réseau.",
        "Connaissances pratiques et applicables immédiatement.",
        "Utile aussi comme préparation au CCNA.",
      ],
      es: [
        "Certificación oficial básica de Cisco.",
        "Ideal para comenzar una carrera en redes.",
        "Conocimientos prácticos y aplicables.",
        "Útil también como preparación para el CCNA.",
      ],
    },
    faq: {
      it: [
        {
          q: "Qual è la differenza tra CCST e CCNA?",
          a: "La CCST è pensata per principianti assoluti, mentre la CCNA è più avanzata e approfondisce la configurazione dei dispositivi di rete.",
        },
      ],
      en: [
        {
          q: "What’s the difference between CCST and CCNA?",
          a: "CCST is aimed at absolute beginners, while CCNA is more advanced and focuses on configuring network devices.",
        },
      ],
      fr: [
        {
          q: "Quelle est la différence entre CCST et CCNA ?",
          a: "La CCST s’adresse aux débutants, tandis que la CCNA est plus avancée et se concentre sur la configuration des équipements réseau.",
        },
      ],
      es: [
        {
          q: "¿Cuál es la diferencia entre CCST y CCNA?",
          a: "CCST está dirigida a principiantes, mientras que CCNA es más avanzada y se enfoca en configurar dispositivos de red.",
        },
      ],
    },
  },

  // rotte localizzate per i pulsanti
  quizRoute: {
    it: "/it/quiz/cisco-ccst-networking",
    en: "/quiz/cisco-ccst-networking",
    fr: "/fr/quiz/cisco-ccst-networking",
    es: "/es/quiz/cisco-ccst-networking",
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default CISCO_CCST_NETWORKING;
