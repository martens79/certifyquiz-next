// src/certifications/data/f5.ts
// ✅ Versione data-only (nessun JSX/router). Coerente con gli altri file.
// 🖼️ Metti l'immagine in /public/images/certifications/f5-icon.png

const F5Certification = {
  slug: "f5",
  imageUrl: "/images/certifications/f5-icon.png",
  officialUrl: "https://www.f5.com/learn/certification",

  title: {
    it: "F5 Certified Administrator, BIG-IP (F5-CA)",
    en: "F5 Certified Administrator, BIG-IP (F5-CA)",
    fr: "Administrateur certifié F5, BIG-IP (F5-CA)",
    es: "Administrador certificado F5, BIG-IP (F5-CA)",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "La certificazione F5 Certified Administrator, BIG-IP (F5-CA) convalida le competenze di base per la gestione operativa quotidiana di BIG-IP: installazione, configurazione, gestione del traffico, sicurezza e troubleshooting.",
    en: "The F5 Certified Administrator, BIG-IP (F5-CA) certification validates the foundational skills for day-to-day BIG-IP operations: installation, configuration, traffic management, security, and troubleshooting.",
    fr: "La certification F5 Certified Administrator, BIG-IP (F5-CA) valide les compétences de base pour la gestion opérationnelle quotidienne de BIG-IP : installation, configuration, gestion du trafic, sécurité et dépannage.",
    es: "La certificación F5 Certified Administrator, BIG-IP (F5-CA) valida las habilidades básicas para la gestión operativa diaria de BIG-IP: instalación, configuración, gestión del tráfico, seguridad y solución de problemas.",
  },

  topics: [
  {
    title: {
      it: "Fondamenti di F5 e BIG-IP",
      en: "F5 and BIG-IP Fundamentals",
      fr: "Fondamentaux de F5 et BIG-IP",
      es: "Fundamentos de F5 y BIG-IP",
    },
    slug: {
      it: "fondamenti-di-f5-e-big-ip",
      en: "f5-and-big-ip-fundamentals",
      fr: "fondamentaux-de-f5-et-big-ip",
      es: "fundamentos-de-f5-y-big-ip",
    },
  },
  {
    title: {
      it: "Installazione e configurazione di BIG-IP",
      en: "Installation and Configuration of BIG-IP",
      fr: "Installation et configuration de BIG-IP",
      es: "Instalación y configuración de BIG-IP",
    },
    slug: {
      it: "installazione-e-configurazione-di-big-ip",
      en: "installation-and-configuration-of-big-ip",
      fr: "installation-et-configuration-de-big-ip",
      es: "instalacion-y-configuracion-de-big-ip",
    },
  },
  {
    title: {
      it: "Gestione del traffico con Virtual Server",
      en: "Traffic Management with Virtual Server",
      fr: "Gestion du trafic avec Virtual Server",
      es: "Gestión del tráfico con Servidor Virtual",
    },
    slug: {
      it: "gestione-del-traffico-con-virtual-server",
      en: "traffic-management-with-virtual-server",
      fr: "gestion-du-trafic-avec-virtual-server",
      es: "gestion-del-trafico-con-servidor-virtual",
    },
  },
  {
    title: {
      it: "Monitoraggio dello stato dei server",
      en: "Server Status Monitoring",
      fr: "Surveillance de l'état du serveur",
      es: "Monitoreo del estado del servidor",
    },
    slug: {
      it: "monitoraggio-dello-stato-dei-server",
      en: "server-status-monitoring",
      fr: "surveillance-de-letat-du-serveur",
      es: "monitoreo-del-estado-del-servidor",
    },
  },
  {
    title: {
      it: "Gestione del traffico Layer 4 e Layer 7",
      en: "Layer 4 and Layer 7 Traffic Management",
      fr: "Gestion du trafic Layer 4 et Layer 7",
      es: "Gestión del tráfico de Capa 4 y Capa 7",
    },
    slug: {
      it: "gestione-del-traffico-layer-4-e-layer-7",
      en: "layer-4-and-layer-7-traffic-management",
      fr: "gestion-du-trafic-layer-4-et-layer-7",
      es: "gestion-del-trafico-de-capa-4-y-capa-7",
    },
  },
  {
    title: {
      it: "Creazione di iRules personalizzate",
      en: "Creation of Custom iRules",
      fr: "Création de iRules personnalisées",
      es: "Creación de iRules personalizadas",
    },
    slug: {
      it: "creazione-di-irules-personalizzate",
      en: "creation-of-custom-irules",
      fr: "creation-de-irules-personnalisees",
      es: "creacion-de-irules-personalizadas",
    },
  },
  {
    title: {
      it: "Sicurezza e SSL Offloading",
      en: "Security and SSL Offloading",
      fr: "Sécurité et déchargement SSL",
      es: "Seguridad y Descarga SSL",
    },
    slug: {
      it: "sicurezza-e-ssl-offloading",
      en: "security-and-ssl-offloading",
      fr: "securite-et-dechargement-ssl",
      es: "seguridad-y-descarga-ssl",
    },
  },
  {
    title: {
      it: "DNS e GSLB (Global Server Load Balancing)",
      en: "DNS and GSLB (Global Server Load Balancing)",
      fr: "DNS et GSLB (Global Server Load Balancing)",
      es: "DNS y GSLB (Balanceo de Carga de Servidores Globales)",
    },
    slug: {
      it: "dns-e-gslb-global-server-load-balancing",
      en: "dns-and-gslb-global-server-load-balancing",
      fr: "dns-et-gslb-global-server-load-balancing",
      es: "dns-y-gslb-balanceo-de-carga-de-servidores-globales",
    },
  },
  {
    title: {
      it: "Gestione utenti, ruoli e accessi",
      en: "User, Role and Access Management",
      fr: "Gestion des utilisateurs, des rôles et des accès",
      es: "Gestión de usuarios, roles y accesos",
    },
    slug: {
      it: "gestione-utenti-ruoli-e-accessi",
      en: "user-role-and-access-management",
      fr: "gestion-des-utilisateurs-des-roles-et-des-acces",
      es: "gestion-de-usuarios-roles-y-accesos",
    },
  },
  {
    title: {
      it: "Backup, aggiornamenti e troubleshooting",
      en: "Backup, Updates and Troubleshooting",
      fr: "Sauvegarde, mises à jour et dépannage",
      es: "Respaldo, actualizaciones y solución de problemas",
    },
    slug: {
      it: "backup-aggiornamenti-e-troubleshooting",
      en: "backup-updates-and-troubleshooting",
      fr: "sauvegarde-mises-a-jour-et-depannage",
      es: "respaldo-actualizaciones-y-solucion-de-problemas",
    },
  },
],

  extraContent: {
    // 🔗 SOLO pagine ufficiali degli ESAMI (niente guide/study non ufficiali)
    examReference: {
      it: [
        { text: "F5CAB1 – BIG-IP Administration: installazione, configurazione iniziale e aggiornamento", url: "https://support.education.f5.com/hc/en-us/articles/35052524386075-BIG-IP-Administration-Install-Initial-Configuration-and-Upgrade-F5CAB1-exam" },
        { text: "F5CAB2 – BIG-IP Administration: concetti del data plane", url: "https://support.education.f5.com/hc/en-us/articles/35052643024027-BIG-IP-Administration-Data-Plane-Concepts-F5CAB2-exam" },
        { text: "F5CAB3 – BIG-IP Administration: configurazione del data plane", url: "https://support.education.f5.com/hc/en-us/articles/35053786283675-BIG-IP-Administration-Data-Plane-Configuration-F5CAB3-exam" },
        { text: "F5CAB4 – BIG-IP Administration: amministrazione del control plane", url: "https://support.education.f5.com/hc/en-us/articles/35053918642843-BIG-IP-Administration-Control-Plane-Administration-F5CAB4-exam" },
        { text: "F5CAB5 – BIG-IP Administration: supporto e troubleshooting", url: "https://support.education.f5.com/hc/en-us/articles/35053988598939-BIG-IP-Administration-Support-and-Troubleshooting-F5CAB5-exam" },
      ],
      en: [
        { text: "F5CAB1 – BIG-IP Administration: Install, Initial Configuration, and Upgrade", url: "https://support.education.f5.com/hc/en-us/articles/35052524386075-BIG-IP-Administration-Install-Initial-Configuration-and-Upgrade-F5CAB1-exam" },
        { text: "F5CAB2 – BIG-IP Administration: Data Plane Concepts", url: "https://support.education.f5.com/hc/en-us/articles/35052643024027-BIG-IP-Administration-Data-Plane-Concepts-F5CAB2-exam" },
        { text: "F5CAB3 – BIG-IP Administration: Data Plane Configuration", url: "https://support.education.f5.com/hc/en-us/articles/35053786283675-BIG-IP-Administration-Data-Plane-Configuration-F5CAB3-exam" },
        { text: "F5CAB4 – BIG-IP Administration: Control Plane Administration", url: "https://support.education.f5.com/hc/en-us/articles/35053918642843-BIG-IP-Administration-Control-Plane-Administration-F5CAB4-exam" },
        { text: "F5CAB5 – BIG-IP Administration: Support and Troubleshooting", url: "https://support.education.f5.com/hc/en-us/articles/35053988598939-BIG-IP-Administration-Support-and-Troubleshooting-F5CAB5-exam" },
      ],
      fr: [
        { text: "F5CAB1 – BIG-IP Administration : installation, configuration initiale et mise à jour", url: "https://support.education.f5.com/hc/en-us/articles/35052524386075-BIG-IP-Administration-Install-Initial-Configuration-and-Upgrade-F5CAB1-exam" },
        { text: "F5CAB2 – BIG-IP Administration : concepts du plan de données", url: "https://support.education.f5.com/hc/en-us/articles/35052643024027-BIG-IP-Administration-Data-Plane-Concepts-F5CAB2-exam" },
        { text: "F5CAB3 – BIG-IP Administration : configuration du plan de données", url: "https://support.education.f5.com/hc/en-us/articles/35053786283675-BIG-IP-Administration-Data-Plane-Configuration-F5CAB3-exam" },
        { text: "F5CAB4 – BIG-IP Administration : administration du plan de contrôle", url: "https://support.education.f5.com/hc/en-us/articles/35053918642843-BIG-IP-Administration-Control-Plane-Administration-F5CAB4-exam" },
        { text: "F5CAB5 – BIG-IP Administration : support et dépannage", url: "https://support.education.f5.com/hc/en-us/articles/35053988598939-BIG-IP-Administration-Support-and-Troubleshooting-F5CAB5-exam" },
      ],
      es: [
        { text: "F5CAB1 – BIG-IP Administration: instalación, configuración inicial y actualización", url: "https://support.education.f5.com/hc/en-us/articles/35052524386075-BIG-IP-Administration-Install-Initial-Configuration-and-Upgrade-F5CAB1-exam" },
        { text: "F5CAB2 – BIG-IP Administration: conceptos del plano de datos", url: "https://support.education.f5.com/hc/en-us/articles/35052643024027-BIG-IP-Administration-Data-Plane-Concepts-F5CAB2-exam" },
        { text: "F5CAB3 – BIG-IP Administration: configuración del plano de datos", url: "https://support.education.f5.com/hc/en-us/articles/35053786283675-BIG-IP-Administration-Data-Plane-Configuration-F5CAB3-exam" },
        { text: "F5CAB4 – BIG-IP Administration: administración del plano de control", url: "https://support.education.f5.com/hc/en-us/articles/35053918642843-BIG-IP-Administration-Control-Plane-Administration-F5CAB4-exam" },
        { text: "F5CAB5 – BIG-IP Administration: soporte y resolución de problemas", url: "https://support.education.f5.com/hc/en-us/articles/35053988598939-BIG-IP-Administration-Support-and-Troubleshooting-F5CAB5-exam" },
      ],
    },

    learn: {
      it: [
        "La certificazione F5-CA valida le competenze pratiche per l'amministrazione quotidiana di BIG-IP: installazione, configurazione, gestione del traffico e supporto, in ambienti aziendali reali.",
      ],
      en: [
        "F5-CA validates practical skills for day-to-day BIG-IP administration: installation, configuration, traffic management, and support in real enterprise environments.",
      ],
      fr: [
        "F5-CA valide des compétences pratiques pour l'administration quotidienne de BIG-IP : installation, configuration, gestion du trafic et support, dans des environnements d'entreprise réels.",
      ],
      es: [
        "F5-CA valida habilidades prácticas para la administración diaria de BIG-IP: instalación, configuración, gestión del tráfico y soporte, en entornos empresariales reales.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione molto richiesta in networking e security presso aziende enterprise che usano F5.",
      ],
      en: [
        "Highly valued in networking/security roles at enterprises using F5.",
      ],
      fr: [
        "Très recherchée pour les rôles réseau/sécurité dans les entreprises utilisant F5.",
      ],
      es: [
        "Muy valorada en roles de redes/seguridad en empresas que usan F5.",
      ],
    },

    faq: {
      it: [
        { q: "Chi può sostenere la certificazione F5 Certified Administrator, BIG-IP?", a: "Chiunque lavori con BIG-IP in ruoli di amministrazione, networking o sicurezza: non sono richiesti prerequisiti formali, ma è utile una conoscenza pratica di base della piattaforma." },
        { q: "Come si svolge l'esame?", a: "Il percorso richiede il superamento di 5 esami (F5CAB1-F5CAB5), erogati ufficialmente da F5 tramite Pearson VUE o il proctor online Certiverse." },
      ],
      en: [
        { q: "Who can take the F5 Certified Administrator, BIG-IP certification?", a: "Anyone working with BIG-IP in administration, networking, or security roles: there are no formal prerequisites, though basic hands-on familiarity with the platform helps." },
        { q: "How are the exams delivered?", a: "The path requires passing 5 exams (F5CAB1-F5CAB5), officially delivered by F5 via Pearson VUE or the Certiverse online proctor." },
      ],
      fr: [
        { q: "Qui peut passer la certification F5 Certified Administrator, BIG-IP ?", a: "Toute personne travaillant avec BIG-IP dans des rôles d'administration, de réseau ou de sécurité : aucun prérequis formel n'est exigé, mais une familiarité pratique de base avec la plateforme est utile." },
        { q: "Comment se déroulent les examens ?", a: "Le parcours nécessite de réussir 5 examens (F5CAB1-F5CAB5), délivrés officiellement par F5 via Pearson VUE ou le proctor en ligne Certiverse." },
      ],
      es: [
        { q: "¿Quién puede obtener la certificación F5 Certified Administrator, BIG-IP?", a: "Cualquier persona que trabaje con BIG-IP en roles de administración, redes o seguridad: no se exigen requisitos formales, aunque ayuda tener familiaridad práctica básica con la plataforma." },
        { q: "¿Cómo se realizan los exámenes?", a: "El itinerario requiere superar 5 exámenes (F5CAB1-F5CAB5), impartidos oficialmente por F5 a través de Pearson VUE o el proctor en línea Certiverse." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/f5",
    en: "/en/quiz/f5",
    fr: "/fr/quiz/f5",
    es: "/es/quiz/f5",
  },

  // Rotta “indietro”: lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default F5Certification;
