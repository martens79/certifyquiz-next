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
  {
    title: {
      it: "Concetti di cloud e IBM Cloud",
      en: "Cloud concepts and IBM Cloud",
      fr: "Concepts de cloud et IBM Cloud",
      es: "Conceptos de nube e IBM Cloud",
    },
    slug: {
      it: "concetti-di-cloud-e-ibm-cloud",
      en: "cloud-concepts-and-ibm-cloud",
      fr: "concepts-de-cloud-et-ibm-cloud",
      es: "conceptos-de-nube-e-ibm-cloud",
    },
  },
  {
    title: {
      it: "Architetture IBM Cloud",
      en: "IBM Cloud Architectures",
      fr: "Architectures IBM Cloud",
      es: "Arquitecturas de IBM Cloud",
    },
    slug: {
      it: "architetture-ibm-cloud",
      en: "ibm-cloud-architectures",
      fr: "architectures-ibm-cloud",
      es: "arquitecturas-de-ibm-cloud",
    },
  },
  {
    title: {
      it: "Concetti di hybrid e multicloud",
      en: "Hybrid and multicloud concepts",
      fr: "Concepts d'hybride et de multicloud",
      es: "Conceptos de nube híbrida y multicloud",
    },
    slug: {
      it: "concetti-di-hybrid-e-multicloud",
      en: "hybrid-and-multicloud-concepts",
      fr: "concepts-dhybride-et-de-multicloud",
      es: "conceptos-de-nube-hibrida-y-multicloud",
    },
  },
  {
    title: {
      it: "Architetture IT e modelli di riferimento",
      en: "IT Architectures and Reference Models",
      fr: "Architectures IT et modèles de référence",
      es: "Arquitecturas de TI y modelos de referencia",
    },
    slug: {
      it: "architetture-it-e-modelli-di-riferimento",
      en: "it-architectures-and-reference-models",
      fr: "architectures-it-et-modeles-de-reference",
      es: "arquitecturas-de-ti-y-modelos-de-referencia",
    },
  },
  {
    title: {
      it: "DevOps e SRE",
      en: "DevOps and SRE",
      fr: "DevOps et SRE",
      es: "DevOps y SRE",
    },
    slug: {
      it: "devops-e-sre",
      en: "devops-and-sre",
      fr: "devops-et-sre",
      es: "devops-y-sre",
    },
  },
  {
    title: {
      it: "Sicurezza e conformità nel cloud",
      en: "Security and compliance in the cloud",
      fr: "Sécurité et conformité dans le cloud",
      es: "Seguridad y cumplimiento en la nube",
    },
    slug: {
      it: "sicurezza-e-conformita-nel-cloud",
      en: "security-and-compliance-in-the-cloud",
      fr: "securite-et-conformite-dans-le-cloud",
      es: "seguridad-y-cumplimiento-en-la-nube",
    },
  },
  {
    title: {
      it: "Migrazione e modernizzazione cloud",
      en: "Cloud migration and modernization",
      fr: "Migration et modernisation du cloud",
      es: "Migración y modernización en la nube",
    },
    slug: {
      it: "migrazione-e-modernizzazione-cloud",
      en: "cloud-migration-and-modernization",
      fr: "migration-et-modernisation-du-cloud",
      es: "migracion-y-modernizacion-en-la-nube",
    },
  },
  {
    title: {
      it: "Gestione dei costi nel cloud",
      en: "Cost management in the cloud",
      fr: "Gestion des coûts dans le cloud",
      es: "Gestión de costos en la nube",
    },
    slug: {
      it: "gestione-dei-costi-nel-cloud",
      en: "cost-management-in-the-cloud",
      fr: "gestion-des-couts-dans-le-cloud",
      es: "gestion-de-costos-en-la-nube",
    },
  },
  {
    title: {
      it: "Governance e gestione dei rischi",
      en: "Governance and risk management",
      fr: "Gouvernance et gestion des risques",
      es: "Gobernanza y gestión de riesgos",
    },
    slug: {
      it: "governance-e-gestione-dei-rischi",
      en: "governance-and-risk-management",
      fr: "gouvernance-et-gestion-des-risques",
      es: "gobernanza-y-gestion-de-riesgos",
    },
  },
  {
    title: {
      it: "Monitoraggio e osservabilità",
      en: "Monitoring and observability",
      fr: "Surveillance et observabilité",
      es: "Monitoreo y observabilidad",
    },
    slug: {
      it: "monitoraggio-e-osservabilita",
      en: "monitoring-and-observability",
      fr: "surveillance-et-observabilite",
      es: "monitoreo-y-observabilidad",
    },
  },
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
    en: "/en/quiz/ibm-cloud",
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
