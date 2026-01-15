// src/lib/cert-descriptions.ts
// Centralized short, technical card descriptions for certification boxes inside category pages.
// Goals: better UX + "non-empty" SEO perception, without DB/API/parse.
// Style: 1–2 lines, technical, not marketing.
// Locales supported: it / en / fr / es with safe fallback.

export type CertDescLocale = "it" | "en" | "fr" | "es";

type LangMap = Record<CertDescLocale, string>;

type DescRegistry = Record<string, LangMap>;

/** Keep these strings short (1–2 lines). */
const CERT_CARD_DESCRIPTIONS: DescRegistry = {
  /* ------------------------------ CompTIA ------------------------------ */
  "comptia-itf-plus": {
    it: "Fondamenti IT: hardware, software, reti, sicurezza di base e best practice.",
    en: "IT fundamentals: hardware, software, networking, basic security and best practices.",
    fr: "Fondamentaux IT : matériel, logiciel, réseaux, sécurité de base et bonnes pratiques.",
    es: "Fundamentos de TI: hardware, software, redes, seguridad básica y buenas prácticas.",
  },
  "comptia-a-plus": {
    it: "Competenze core IT: PC, sistemi operativi, troubleshooting, reti e sicurezza operativa.",
    en: "Core IT skills: PCs, operating systems, troubleshooting, networking and operational security.",
    fr: "Compétences IT essentielles : PC, OS, dépannage, réseaux et sécurité opérationnelle.",
    es: "Habilidades TI core: PCs, sistemas operativos, troubleshooting, redes y seguridad operativa.",
  },
  "comptia-network-plus": {
    it: "Reti end-to-end: switching/routing, subnetting, troubleshooting, security e operatività.",
    en: "End-to-end networking: switching/routing, subnetting, troubleshooting, security and operations.",
    fr: "Réseaux de bout en bout : switching/routing, subnetting, dépannage, sécurité et exploitation.",
    es: "Redes end-to-end: switching/routing, subnetting, troubleshooting, seguridad y operaciones.",
  },
  "security-plus": {
    it: "Cybersecurity pratica: minacce, hardening, IAM, network security, incident response e governance.",
    en: "Hands-on cybersecurity: threats, hardening, IAM, network security, incident response and governance.",
    fr: "Cybersécurité pratique : menaces, durcissement, IAM, sécurité réseau, réponse à incident et gouvernance.",
    es: "Ciberseguridad práctica: amenazas, hardening, IAM, seguridad de red, respuesta a incidentes y gobierno.",
  },
  "cloud-plus": {
    it: "Cloud operations: deployment, networking, storage, security, troubleshooting e governance multi-cloud.",
    en: "Cloud operations: deployment, networking, storage, security, troubleshooting and multi-cloud governance.",
    fr: "Opérations cloud : déploiement, réseau, stockage, sécurité, dépannage et gouvernance multi-cloud.",
    es: "Operaciones cloud: despliegue, redes, almacenamiento, seguridad, troubleshooting y gobierno multi-cloud.",
  },

  /* -------------------------------- Cisco ------------------------------ */
  "ccna": {
    it: "Networking Cisco: switching, routing, IPv4/IPv6, VLAN, OSPF base, security e troubleshooting.",
    en: "Cisco networking: switching, routing, IPv4/IPv6, VLANs, basic OSPF, security and troubleshooting.",
    fr: "Réseaux Cisco : switching, routing, IPv4/IPv6, VLAN, OSPF de base, sécurité et dépannage.",
    es: "Redes Cisco: switching, routing, IPv4/IPv6, VLAN, OSPF básico, seguridad y troubleshooting.",
  },
  "cisco-ccst-networking": {
    it: "Entry-level networking: cablaggio, switching base, addressing, Wi-Fi e troubleshooting essenziale.",
    en: "Entry-level networking: cabling, basic switching, addressing, Wi-Fi and essential troubleshooting.",
    fr: "Réseaux niveau débutant : câblage, switching de base, adressage, Wi-Fi et dépannage essentiel.",
    es: "Networking inicial: cableado, switching básico, direccionamiento, Wi-Fi y troubleshooting esencial.",
  },
  "cisco-ccst-cybersecurity": {
    it: "Fondamenti cyber: concetti di sicurezza, minacce, controlli, awareness e risposta di base.",
    en: "Cyber fundamentals: security concepts, threats, controls, awareness and basic response.",
    fr: "Fondamentaux cyber : concepts, menaces, contrôles, sensibilisation et réponse de base.",
    es: "Fundamentos cyber: conceptos, amenazas, controles, concienciación y respuesta básica.",
  },

  /* -------------------------- Security (advanced) ----------------------- */
  "ceh": {
    it: "Ethical hacking: recon, scanning, exploitation, web/app attacks, post-exploitation e reporting.",
    en: "Ethical hacking: recon, scanning, exploitation, web/app attacks, post-exploitation and reporting.",
    fr: "Hacking éthique : reco, scan, exploitation, attaques web/app, post-exploitation et reporting.",
    es: "Hacking ético: reconocimiento, escaneo, explotación, ataques web/app, post-explotación e informes.",
  },
  "cissp": {
    it: "Security leadership: risk management, architecture, IAM, operations, SDLC e compliance (8 domains).",
    en: "Security leadership: risk management, architecture, IAM, operations, SDLC and compliance (8 domains).",
    fr: "Leadership sécurité : gestion du risque, architecture, IAM, opérations, SDLC et conformité (8 domaines).",
    es: "Liderazgo en seguridad: riesgos, arquitectura, IAM, operaciones, SDLC y compliance (8 dominios).",
  },
  "isc2-cc": {
    it: "Fondamenti ISC2: sicurezza, risk, network, access control, operations e continuità.",
    en: "ISC2 fundamentals: security, risk, networks, access control, operations and continuity.",
    fr: "Fondamentaux ISC2 : sécurité, risque, réseaux, contrôle d’accès, opérations et continuité.",
    es: "Fundamentos ISC2: seguridad, riesgo, redes, control de acceso, operaciones y continuidad.",
  },

  /* -------------------------------- Cloud ------------------------------ */
  "aws-cloud-practitioner": {
    it: "AWS fundamentals: concetti cloud, servizi core, pricing, security basics e best practice.",
    en: "AWS fundamentals: cloud concepts, core services, pricing, security basics and best practices.",
    fr: "Fondamentaux AWS : concepts cloud, services clés, tarification, sécurité de base et bonnes pratiques.",
    es: "Fundamentos AWS: conceptos cloud, servicios core, precios, seguridad básica y buenas prácticas.",
  },
  "aws-solutions-architect": {
    it: "Progettazione su AWS: architetture resilienti, networking, storage, security, cost optimization.",
    en: "AWS design: resilient architectures, networking, storage, security and cost optimization.",
    fr: "Conception AWS : architectures résilientes, réseau, stockage, sécurité et optimisation des coûts.",
    es: "Diseño en AWS: arquitecturas resilientes, redes, almacenamiento, seguridad y optimización de costos.",
  },
  "azure-fundamentals": {
    it: "Azure basics: servizi principali, identity, governance, pricing e concetti di cloud computing.",
    en: "Azure basics: core services, identity, governance, pricing and cloud computing concepts.",
    fr: "Bases Azure : services principaux, identité, gouvernance, tarification et concepts cloud.",
    es: "Azure básico: servicios core, identidad, gobierno, precios y conceptos de cloud.",
  },
  "google-cloud": {
    it: "Google Cloud overview: servizi core, security, data/AI, operations e modernizzazione applicativa.",
    en: "Google Cloud overview: core services, security, data/AI, operations and app modernization.",
    fr: "Vue d’ensemble Google Cloud : services clés, sécurité, data/IA, opérations et modernisation.",
    es: "Visión general Google Cloud: servicios core, seguridad, datos/IA, operaciones y modernización.",
  },
  "ibm-cloud": {
    it: "IBM Cloud: modelli cloud, servizi core, sicurezza, integrazione e scenari enterprise/ibridi.",
    en: "IBM Cloud: cloud models, core services, security, integration and enterprise/hybrid scenarios.",
    fr: "IBM Cloud : modèles, services clés, sécurité, intégration et scénarios entreprise/hybrides.",
    es: "IBM Cloud: modelos, servicios core, seguridad, integración y escenarios enterprise/híbridos.",
  },

  /* ------------------------------ Database ------------------------------ */
  "mongodb-developer": {
    it: "MongoDB dev: document model, schema design, CRUD, indexing, aggregation e performance.",
    en: "MongoDB dev: document model, schema design, CRUD, indexing, aggregation and performance.",
    fr: "Dev MongoDB : modèle document, design de schéma, CRUD, index, agrégation et performance.",
    es: "MongoDB dev: modelo documental, diseño de esquema, CRUD, índices, agregación y rendimiento.",
  },
  "mysql": {
    it: "MySQL: SQL, query tuning, indici, relazioni, transazioni e gestione dati in ambienti reali.",
    en: "MySQL: SQL, query tuning, indexes, relations, transactions and real-world data management.",
    fr: "MySQL : SQL, optimisation requêtes, index, relations, transactions et gestion des données.",
    es: "MySQL: SQL, optimización de queries, índices, relaciones, transacciones y gestión de datos.",
  },
  "oracle-sql": {
    it: "Oracle SQL: query avanzate, join, funzioni, DDL/DML e concetti di performance su Oracle DB.",
    en: "Oracle SQL: advanced queries, joins, functions, DDL/DML and performance concepts on Oracle DB.",
    fr: "Oracle SQL : requêtes avancées, jointures, fonctions, DDL/DML et notions de performance.",
    es: "Oracle SQL: consultas avanzadas, joins, funciones, DDL/DML y conceptos de rendimiento.",
  },
  "microsoft-sql-server": {
    it: "SQL Server: T-SQL, query avanzate, indici, stored procedures e amministrazione di base.",
    en: "SQL Server: T-SQL, advanced queries, indexing, stored procedures and basic administration.",
    fr: "SQL Server : T-SQL, requêtes avancées, index, procédures stockées et admin de base.",
    es: "SQL Server: T-SQL, consultas avanzadas, índices, stored procedures y administración básica.",
  },

  /* --------------------------------- Dev ------------------------------- */
  "java-se": {
    it: "Java SE: OOP, collections, exceptions, I/O, concurrency basics e best practice di codice.",
    en: "Java SE: OOP, collections, exceptions, I/O, concurrency basics and coding best practices.",
    fr: "Java SE : POO, collections, exceptions, I/O, bases de concurrence et bonnes pratiques.",
    es: "Java SE: POO, colecciones, excepciones, I/O, concurrencia básica y buenas prácticas.",
  },
  "javascript-developer": {
    it: "JavaScript: ES6+, async, DOM, tooling, patterns e fondamentali per web app moderne.",
    en: "JavaScript: ES6+, async, DOM, tooling, patterns and fundamentals for modern web apps.",
    fr: "JavaScript : ES6+, async, DOM, outillage, patterns et bases des web apps modernes.",
    es: "JavaScript: ES6+, async, DOM, tooling, patrones y bases para web apps modernas.",
  },
  "python": {
    it: "Python: sintassi, funzioni, OOP, moduli, file/exception handling e scripting pratico.",
    en: "Python: syntax, functions, OOP, modules, file/exception handling and practical scripting.",
    fr: "Python : syntaxe, fonctions, POO, modules, fichiers/exceptions et scripting pratique.",
    es: "Python: sintaxis, funciones, POO, módulos, archivos/excepciones y scripting práctico.",
  },
  "csharp": {
    it: "C#: .NET basics, OOP, LINQ, async/await, gestione errori e pattern comuni.",
    en: "C#: .NET basics, OOP, LINQ, async/await, error handling and common patterns.",
    fr: "C# : bases .NET, POO, LINQ, async/await, gestion d’erreurs et patterns courants.",
    es: "C#: bases .NET, POO, LINQ, async/await, manejo de errores y patrones comunes.",
  },
  "tensorflow": {
    it: "TensorFlow: basi ML, training/inference, dataset pipeline, tuning e deployment concettuale.",
    en: "TensorFlow: ML basics, training/inference, dataset pipelines, tuning and conceptual deployment.",
    fr: "TensorFlow : bases ML, entraînement/inférence, pipelines de données, tuning et déploiement.",
    es: "TensorFlow: bases de ML, entrenamiento/inferencia, pipelines de datos, tuning y despliegue.",
  },

  /* --------------------------- Base / Digital --------------------------- */
  "ecdl": {
    it: "Competenze digitali: computer & online essentials, office base, sicurezza e cittadinanza digitale.",
    en: "Digital skills: computer & online essentials, basic office tools, safety and digital citizenship.",
    fr: "Compétences numériques : essentiels PC & web, bureautique de base, sécurité et citoyenneté numérique.",
    es: "Competencias digitales: esenciales PC & web, ofimática básica, seguridad y ciudadanía digital.",
  },
  "eipass-basic": {
    it: "Competenze digitali pratiche: uso PC, internet, produttività, sicurezza e strumenti quotidiani.",
    en: "Practical digital skills: PC use, internet, productivity, security and everyday tools.",
    fr: "Compétences numériques pratiques : PC, internet, productivité, sécurité et outils du quotidien.",
    es: "Habilidades digitales prácticas: PC, internet, productividad, seguridad y herramientas diarias.",
  },
  "pekit-base": {
    it: "Alfabetizzazione digitale: operazioni al PC, gestione file, internet, sicurezza e produttività.",
    en: "Digital literacy: PC operations, file management, internet, security and productivity.",
    fr: "Littératie numérique : opérations PC, gestion de fichiers, internet, sécurité et productivité.",
    es: "Alfabetización digital: operaciones PC, gestión de archivos, internet, seguridad y productividad.",
  },

  /* ------------------------ Networking (advanced) ------------------------ */
  "jncie": {
    it: "Juniper expert: routing avanzato, troubleshooting complesso e design/operations su Junos.",
    en: "Juniper expert: advanced routing, complex troubleshooting and Junos design/operations.",
    fr: "Expert Juniper : routage avancé, dépannage complexe et design/exploitation Junos.",
    es: "Experto Juniper: routing avanzado, troubleshooting complejo y diseño/operaciones en Junos.",
  },
  "f5": {
    it: "F5 / ADC: load balancing, L4–L7 traffic management, SSL/TLS, security e app delivery.",
    en: "F5 / ADC: load balancing, L4–L7 traffic management, SSL/TLS, security and app delivery.",
    fr: "F5 / ADC : load balancing, gestion trafic L4–L7, SSL/TLS, sécurité et delivery applicative.",
    es: "F5 / ADC: balanceo de carga, gestión de tráfico L4–L7, SSL/TLS, seguridad y entrega de apps.",
  },

  /* --------------------------- Virtualization --------------------------- */
  "vmware-vcp": {
    it: "VMware vSphere: installazione, configurazione, networking/storage virtuale e gestione operativa.",
    en: "VMware vSphere: installation, configuration, virtual networking/storage and operational management.",
    fr: "VMware vSphere : installation, configuration, réseau/stockage virtuels et gestion opérationnelle.",
    es: "VMware vSphere: instalación, configuración, redes/almacenamiento virtual y gestión operativa.",
  },

  /* ---------------------------------- AI -------------------------------- */
  "microsoft-ai-fundamentals": {
    it: "AI basics: machine learning, computer vision, NLP, responsible AI e servizi cloud correlati.",
    en: "AI basics: machine learning, computer vision, NLP, responsible AI and related cloud services.",
    fr: "Bases IA : machine learning, vision, NLP, IA responsable et services cloud associés.",
    es: "Bases de IA: machine learning, visión, NLP, IA responsable y servicios cloud relacionados.",
  },
};

/**
 * Get the card description for a certification slug in a given locale.
 * Fallback order: requested lang → it → en → empty string.
 */
export function getCertCardDesc(slug: string, lang: CertDescLocale): string {
  const entry = CERT_CARD_DESCRIPTIONS[slug];
  if (!entry) return "";
  return entry[lang] || entry.it || entry.en || "";
}

/**
 * Optional: expose the registry for debugging / tests (read-only usage).
 */
export function hasCertCardDesc(slug: string): boolean {
  return Boolean(CERT_CARD_DESCRIPTIONS[slug]);
}

