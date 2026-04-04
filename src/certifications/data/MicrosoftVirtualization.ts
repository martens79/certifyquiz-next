// src/certifications/data/microsoft-virtualization.ts
// Modulo dati puro per "Virtualizzazione Microsoft" (no React/JSX).

const MicrosoftVirtualization = {
  slug: "microsoft-virtualization",
  imageUrl: "/images/certifications/microsoft-virtualization-logo.png",

  // Pagina ufficiale di prodotto/tecnologia (doc Hyper-V/virtualization)
  officialUrl: "https://learn.microsoft.com/en-us/virtualization/",

  title: {
    it: "Virtualizzazione Microsoft",
    en: "Microsoft Virtualization",
    fr: "Virtualisation Microsoft",
    es: "Virtualización Microsoft",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "Scopri come utilizzare Hyper-V e gli strumenti Microsoft per creare ambienti virtualizzati efficienti e professionali.",
    en: "Learn how to use Hyper-V and Microsoft tools to create efficient, professional virtualized environments.",
    fr: "Apprenez à utiliser Hyper-V et les outils Microsoft pour créer des environnements virtualisés efficaces et professionnels.",
    es: "Aprende a usar Hyper-V y herramientas de Microsoft para crear entornos virtualizados eficientes y profesionales.",
  },

  topics: [
  {
    title: {
      it: "Introduzione e gestione di Hyper-V",
      en: "Introduction and Management of Hyper-V",
      fr: "Introduction et gestion de Hyper-V",
      es: "Introducción y gestión de Hyper-V",
    },
    slug: {
      it: "introduzione-e-gestione-di-hyper-v",
      en: "introduction-and-management-of-hyper-v",
      fr: "introduction-et-gestion-de-hyper-v",
      es: "introduccion-y-gestion-de-hyper-v",
    },
  },
  {
    title: {
      it: "Configurazione di switch virtuali",
      en: "Configuration of Virtual Switches",
      fr: "Configuration des commutateurs virtuels",
      es: "Configuración de switches virtuales",
    },
    slug: {
      it: "configurazione-di-switch-virtuali",
      en: "configuration-of-virtual-switches",
      fr: "configuration-des-commutateurs-virtuels",
      es: "configuracion-de-switches-virtuales",
    },
  },
  {
    title: {
      it: "Opzioni di archiviazione in ambienti virtuali",
      en: "Storage Options in Virtual Environments",
      fr: "Options de stockage dans les environnements virtuels",
      es: "Opciones de almacenamiento en entornos virtuales",
    },
    slug: {
      it: "opzioni-di-archiviazione-in-ambienti-virtuali",
      en: "storage-options-in-virtual-environments",
      fr: "options-de-stockage-dans-les-environnements-virtuels",
      es: "opciones-de-almacenamiento-en-entornos-virtuales",
    },
  },
  {
    title: {
      it: "Funzionalità di replica per alta disponibilità",
      en: "Replication Features for High Availability",
      fr: "Fonctionnalités de réplication pour une haute disponibilité",
      es: "Funcionalidades de replicación para alta disponibilidad",
    },
    slug: {
      it: "funzionalita-di-replica-per-alta-disponibilita",
      en: "replication-features-for-high-availability",
      fr: "fonctionnalites-de-replication-pour-une-haute-disponibilite",
      es: "funcionalidades-de-replicacion-para-alta-disponibilidad",
    },
  },
  {
    title: {
      it: "Creazione e gestione dei checkpoint",
      en: "Creation and Management of Checkpoints",
      fr: "Création et gestion des points de contrôle",
      es: "Creación y gestión de puntos de control",
    },
    slug: {
      it: "creazione-e-gestione-dei-checkpoint",
      en: "creation-and-management-of-checkpoints",
      fr: "creation-et-gestion-de-points-de-controle",
      es: "creacion-y-gestion-de-puntos-de-control",
    },
  },
  {
    title: {
      it: "Servizi di integrazione per macchine virtuali",
      en: "Integration Services for Virtual Machines",
      fr: "Services d'intégration pour les machines virtuelles",
      es: "Servicios de integración para máquinas virtuales",
    },
    slug: {
      it: "servizi-di-integrazione-per-macchine-virtuali",
      en: "integration-services-for-virtual-machines",
      fr: "services-dintegration-pour-les-machines-virtuelles",
      es: "servicios-de-integracion-para-maquinas-virtuales",
    },
  },
  {
    title: {
      it: "Soluzioni di backup e disaster recovery",
      en: "Backup and Disaster Recovery Solutions",
      fr: "Solutions de sauvegarde et de reprise après sinistre",
      es: "Soluciones de respaldo y recuperación de desastres",
    },
    slug: {
      it: "soluzioni-di-backup-e-disaster-recovery",
      en: "backup-and-disaster-recovery-solutions",
      fr: "solutions-de-sauvegarde-et-de-reprise-apres-sinistre",
      es: "soluciones-de-respaldo-y-recuperacion-de-desastres",
    },
  },
],

  extraContent: {
    // ✅ SOLO pagine d’esame ufficiali Microsoft
    examReference: {
      it: [
        { text: "AZ-800 • Administering Windows Server Hybrid Core Infrastructure", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-800/" },
        { text: "AZ-801 • Configuring Windows Server Hybrid Advanced Services", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-801/" },
        { text: "AZ-104 • Microsoft Azure Administrator", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-104/" },
      ],
      en: [
        { text: "AZ-800 • Administering Windows Server Hybrid Core Infrastructure", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-800/" },
        { text: "AZ-801 • Configuring Windows Server Hybrid Advanced Services", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-801/" },
        { text: "AZ-104 • Microsoft Azure Administrator", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-104/" },
      ],
      fr: [
        { text: "AZ-800 • Administration de l’infrastructure Windows Server hybride", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-800/" },
        { text: "AZ-801 • Configuration des services Windows Server hybrides avancés", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-801/" },
        { text: "AZ-104 • Administrateur Microsoft Azure", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-104/" },
      ],
      es: [
        { text: "AZ-800 • Administración de infraestructura híbrida de Windows Server", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-800/" },
        { text: "AZ-801 • Configuración de servicios avanzados híbridos de Windows Server", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-801/" },
        { text: "AZ-104 • Administrador de Microsoft Azure", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-104/" },
      ],
    },

    learn: {
      it: [
        "Configurare Hyper-V e macchine virtuali Windows.",
        "Gestire dischi, snapshot e risorse virtuali.",
        "Utilizzare strumenti Microsoft per il monitoraggio.",
        "Comprendere la virtualizzazione di rete e storage.",
        "Preparare ambienti virtualizzati per test e produzione.",
      ],
      en: [
        "Configure Hyper-V and Windows virtual machines.",
        "Manage disks, snapshots, and virtual resources.",
        "Use Microsoft tools for monitoring.",
        "Understand network and storage virtualization.",
        "Prepare virtualized environments for test and production.",
      ],
      fr: [
        "Configurer Hyper-V et des machines virtuelles Windows.",
        "Gérer les disques, instantanés et ressources virtuelles.",
        "Utiliser les outils Microsoft pour la supervision.",
        "Comprendre la virtualisation réseau et stockage.",
        "Préparer des environnements virtualisés pour tests et production.",
      ],
      es: [
        "Configurar Hyper-V y máquinas virtuales de Windows.",
        "Gestionar discos, instantáneas y recursos virtuales.",
        "Usar herramientas de Microsoft para la monitorización.",
        "Comprender la virtualización de red y almacenamiento.",
        "Preparar entornos virtualizados para pruebas y producción.",
      ],
    },

    whyChoose: {
      it: [
        "Diffusa in molte aziende con infrastruttura Windows.",
        "Integrazione perfetta con Active Directory e Azure.",
        "Disponibile su Windows Pro e Server.",
        "Utile per testing, sviluppo e ambienti enterprise.",
        "Competenza richiesta per ruoli IT e DevOps.",
      ],
      en: [
        "Widely used in Windows-based enterprises.",
        "Seamless integration with Active Directory and Azure.",
        "Available on Windows Pro and Server.",
        "Great for testing, development, and enterprise environments.",
        "In-demand skill for IT and DevOps roles.",
      ],
      fr: [
        "Très répandue dans les entreprises Windows.",
        "Intégration parfaite avec Active Directory et Azure.",
        "Disponible sur Windows Pro et Server.",
        "Utile pour tests, développement et environnements d’entreprise.",
        "Compétence recherchée pour les rôles IT et DevOps.",
      ],
      es: [
        "Muy utilizada en empresas con Windows.",
        "Integración con Active Directory y Azure.",
        "Disponible en Windows Pro y Server.",
        "Útil para pruebas, desarrollo y entornos empresariales.",
        "Habilidad demandada en TI y DevOps.",
      ],
    },

    faq: {
      it: [
        { q: "Devo avere Windows Server per usare Hyper-V?", a: "No, Hyper-V è disponibile anche su Windows 10/11 Pro." },
        { q: "È una tecnologia open source?", a: "No, è tecnologia proprietaria Microsoft." },
        { q: "Serve una certificazione Microsoft?", a: "Non obbligatoria, ma consigliata per ambienti aziendali." },
      ],
      en: [
        { q: "Do I need Windows Server to use Hyper-V?", a: "No, Hyper-V is also available on Windows 10/11 Pro." },
        { q: "Is it open-source technology?", a: "No, it’s proprietary Microsoft technology." },
        { q: "Is a Microsoft certification required?", a: "Not mandatory, but recommended for enterprise roles." },
      ],
      fr: [
        { q: "Faut-il Windows Server pour utiliser Hyper-V ?", a: "Non, Hyper-V est aussi disponible sur Windows 10/11 Pro." },
        { q: "Est-ce une technologie open source ?", a: "Non, c’est une technologie propriétaire Microsoft." },
        { q: "Une certification Microsoft est-elle requise ?", a: "Pas obligatoire, mais recommandée en entreprise." },
      ],
      es: [
        { q: "¿Necesito Windows Server para usar Hyper-V?", a: "No, Hyper-V también está en Windows 10/11 Pro." },
        { q: "¿Es tecnología open source?", a: "No, es tecnología propietaria de Microsoft." },
        { q: "¿Hace falta certificación Microsoft?", a: "No es obligatoria, pero recomendable en empresas." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/microsoft-virtualization",
    en: "/en/quiz/microsoft-virtualization",
    fr: "/fr/quiz/microsoft-virtualization",
    es: "/es/quiz/microsoft-virtualization",
  },

  // Rotta “indietro” (categoria Virtualizzazione) localizzata
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default MicrosoftVirtualization;
