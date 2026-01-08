// src/certifications/data/ibm-cloud-v5.ts
// ✅ Versione data-only (nessun JSX/router).
// 🖼️ Metti l'immagine in /public/images/certifications/ibmcloud-icon.png

const IBMCloudV5 = {
  slug: "ibm-cloud-v5",
  imageUrl: "/images/certifications/ibmcloud-icon.png",
  // Pagina overview certificazioni IBM Cloud
  officialUrl: "https://cloud.ibm.com/docs/overview?topic=overview-cloud-certifications",

  title: {
    it: "IBM Cloud v5",
    en: "IBM Cloud v5",
    fr: "IBM Cloud v5",
    es: "IBM Cloud v5",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "Certificazione sul cloud IBM che copre fondamenta, DevOps, sicurezza e automazione.",
    en: "Certification on IBM Cloud covering fundamentals, DevOps, security, and automation.",
    fr: "Certification sur IBM Cloud couvrant les fondamentaux, DevOps, sécurité et automatisation.",
    es: "Certificación sobre IBM Cloud que abarca fundamentos, DevOps, seguridad y automatización.",
  },

  topics: [
    { it: "Fondamenti del cloud IBM", en: "IBM Cloud fundamentals", fr: "Fondamentaux du cloud IBM", es: "Fundamentos de IBM Cloud" },
    { it: "Soluzioni cloud e DevOps", en: "Cloud solutions and DevOps", fr: "Solutions cloud et DevOps", es: "Soluciones cloud y DevOps" },
    { it: "Sicurezza e identità", en: "Security and identity", fr: "Sécurité et identité", es: "Seguridad e identidad" },
    { it: "Scalabilità e monitoraggio", en: "Scalability and monitoring", fr: "Scalabilité et surveillance", es: "Escalabilidad y monitorización" },
  ],

  extraContent: {
    // 🔗 SOLO pagine ufficiali IBM (esami specifici v5)
    examReference: {
      it: [
        { text: "IBM Certified Technical Advocate – Cloud v5 (C1000-170)", url: "https://www.ibm.com/training/certification/ibm-certified-technical-advocate-cloud-v5-C9005600" },
        { text: "IBM Certified Professional Architect – Cloud v5 (C1000-118)", url: "https://www.ibm.com/training/certification/ibm-certified-professional-architect-cloud-v5-C0001403" },
        { text: "IBM Certified Professional Developer – Cloud v5 (C1000-128)", url: "https://www.ibm.com/training/certification/ibm-certified-professional-developer-cloud-v5-C0001905" },
      ],
      en: [
        { text: "IBM Certified Technical Advocate – Cloud v5 (C1000-170)", url: "https://www.ibm.com/training/certification/ibm-certified-technical-advocate-cloud-v5-C9005600" },
        { text: "IBM Certified Professional Architect – Cloud v5 (C1000-118)", url: "https://www.ibm.com/training/certification/ibm-certified-professional-architect-cloud-v5-C0001403" },
        { text: "IBM Certified Professional Developer – Cloud v5 (C1000-128)", url: "https://www.ibm.com/training/certification/ibm-certified-professional-developer-cloud-v5-C0001905" },
      ],
      fr: [
        { text: "IBM Certified Technical Advocate – Cloud v5 (C1000-170)", url: "https://www.ibm.com/training/certification/ibm-certified-technical-advocate-cloud-v5-C9005600" },
        { text: "IBM Certified Professional Architect – Cloud v5 (C1000-118)", url: "https://www.ibm.com/training/certification/ibm-certified-professional-architect-cloud-v5-C0001403" },
        { text: "IBM Certified Professional Developer – Cloud v5 (C1000-128)", url: "https://www.ibm.com/training/certification/ibm-certified-professional-developer-cloud-v5-C0001905" },
      ],
      es: [
        { text: "IBM Certified Technical Advocate – Cloud v5 (C1000-170)", url: "https://www.ibm.com/training/certification/ibm-certified-technical-advocate-cloud-v5-C9005600" },
        { text: "IBM Certified Professional Architect – Cloud v5 (C1000-118)", url: "https://www.ibm.com/training/certification/ibm-certified-professional-architect-cloud-v5-C0001403" },
        { text: "IBM Certified Professional Developer – Cloud v5 (C1000-128)", url: "https://www.ibm.com/training/certification/ibm-certified-professional-developer-cloud-v5-C0001905" },
      ],
    },

    learn: {
      it: [
        "Concetti fondamentali del cloud computing con focus su IBM.",
        "Gestione delle risorse cloud e delle automazioni DevOps.",
        "Sicurezza, identità e scalabilità dei servizi cloud.",
      ],
      en: [
        "Fundamental cloud computing concepts with a focus on IBM.",
        "Managing cloud resources and DevOps automation.",
        "Security, identity, and scalability of cloud services.",
      ],
      fr: [
        "Concepts fondamentaux de l'informatique cloud centrés sur IBM.",
        "Gestion des ressources cloud et automatisation DevOps.",
        "Sécurité, identité et évolutivité des services cloud.",
      ],
      es: [
        "Conceptos fundamentales del cloud computing centrados en IBM.",
        "Gestión de recursos cloud y automatización DevOps.",
        "Seguridad, identidad y escalabilidad de los servicios cloud.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione ufficiale IBM molto apprezzata nel settore.",
        "Copre DevOps, sicurezza e automazione in ambienti cloud.",
        "Rilevante per ruoli come cloud engineer e architetti di sistema.",
      ],
      en: [
        "Official IBM certification highly regarded in the industry.",
        "Covers DevOps, security, and automation in cloud environments.",
        "Relevant for roles like cloud engineers and system architects.",
      ],
      fr: [
        "Certification officielle IBM très reconnue dans l'industrie.",
        "Couvre DevOps, sécurité et automatisation dans le cloud.",
        "Pertinente pour les ingénieurs cloud et architectes systèmes.",
      ],
      es: [
        "Certificación oficial de IBM muy valorada en la industria.",
        "Cubre DevOps, seguridad y automatización en entornos cloud.",
        "Relevante para ingenieros cloud y arquitectos de sistemas.",
      ],
    },

    faq: {
      it: [
        { q: "Qual è il livello della certificazione IBM Cloud v5?", a: "È una certificazione di livello intermedio pensata per chi ha una base nel cloud computing." },
        { q: "Serve conoscere DevOps per ottenere la certificazione?", a: "Conoscenze base di DevOps aiutano, ma non sono obbligatorie." },
      ],
      en: [
        { q: "What is the level of the IBM Cloud v5 certification?", a: "It is an intermediate-level certification intended for those with basic cloud computing knowledge." },
        { q: "Do I need to know DevOps to pass the certification?", a: "Basic DevOps knowledge helps but is not strictly required." },
      ],
      fr: [
        { q: "Quel est le niveau de la certification IBM Cloud v5 ?", a: "C'est une certification de niveau intermédiaire pour ceux qui ont des bases en cloud computing." },
        { q: "Faut-il connaître DevOps pour réussir la certification ?", a: "Des notions de base en DevOps sont utiles mais non obligatoires." },
      ],
      es: [
        { q: "¿Cuál es el nivel de la certificación IBM Cloud v5?", a: "Es una certificación de nivel intermedio para quienes tienen conocimientos básicos de cloud computing." },
        { q: "¿Es necesario saber DevOps para esta certificación?", a: "Tener conocimientos básicos de DevOps ayuda, pero no es obligatorio." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/ibm-cloud",
    en: "/quiz/ibm-cloud",
    fr: "/fr/quiz/ibm-cloud",
    es: "/es/quiz/ibm-cloud",
  },

  // Rotta “indietro”: lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default IBMCloudV5;
