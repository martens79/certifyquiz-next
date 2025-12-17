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
    { it: "Installazione di Hyper-V", en: "Installing Hyper-V", fr: "Installation de Hyper-V", es: "Instalación de Hyper-V" },
    { it: "Creazione di VM", en: "Creating VMs", fr: "Création de VM", es: "Creación de VM" },
    { it: "Gestione risorse virtuali", en: "Managing virtual resources", fr: "Gestion des ressources virtuelles", es: "Gestión de recursos virtuales" },
    { it: "Virtualizzazione storage e rete", en: "Storage and network virtualization", fr: "Virtualisation du stockage et du réseau", es: "Virtualización de almacenamiento y red" },
    { it: "Strumenti avanzati Microsoft", en: "Advanced Microsoft tools", fr: "Outils Microsoft avancés", es: "Herramientas avanzadas de Microsoft" },
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
    en: "/quiz/microsoft-virtualization",
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
