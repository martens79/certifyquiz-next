import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

/**
 * Microsoft Vendor Hub (central)
 */
export const microsoftVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "microsoft",
  vendorKey: "microsoft",

  title: {
    it: "Certificazioni Microsoft: percorsi, quiz e pratica d’esame",
    en: "Microsoft Certifications: paths, quizzes and exam practice",
    fr: "Certifications Microsoft : parcours, quiz et entraînement",
    es: "Certificaciones de Microsoft: rutas, quizzes y práctica",
  },

  description: {
    it: "Hub centrale per prepararti alle certificazioni Microsoft: scegli un percorso (Azure, Security, Data, Developer) e vai ai quiz. Contenuti in crescita e organizzati per area.",
    en: "Central hub for Microsoft certifications: choose a path (Azure, Security, Data, Developer) and jump to quizzes. Growing content organized by domain.",
    fr: "Hub central pour les certifications Microsoft : choisissez un parcours (Azure, Sécurité, Data, Développement) et accédez aux quiz. Contenu en croissance, organisé par domaine.",
    es: "Hub central de certificaciones Microsoft: elige una ruta (Azure, Seguridad, Datos, Desarrollo) y ve a los quizzes. Contenido en crecimiento, organizado por área.",
  },

  sections: [
    {
      title: { it: "Azure (Cloud)", en: "Azure (Cloud)", fr: "Azure (Cloud)", es: "Azure (Cloud)" },
      description: {
        it: "Percorsi Azure da fundamentals a ruoli avanzati: servizi core, governance, architettura e pratica d’esame.",
        en: "Azure paths from fundamentals to advanced roles: core services, governance, architecture and exam practice.",
        fr: "Parcours Azure du niveau débutant aux rôles avancés : services, gouvernance, architecture et entraînement.",
        es: "Rutas Azure de fundamentals a roles avanzados: servicios core, gobernanza, arquitectura y práctica.",
      },
      hrefByLang: hubHref("microsoft-azure"),
    },

    {
      title: { it: "Security", en: "Security", fr: "Sécurité", es: "Seguridad" },
      description: {
        it: "Identità, accesso, protezione endpoint, cloud security e incident response (in arrivo).",
        en: "Identity, access, endpoint protection, cloud security and incident response (coming soon).",
        fr: "Identité, accès, protection endpoint, cloud security et réponse à incident (bientôt).",
        es: "Identidad, acceso, protección endpoint, cloud security y respuesta a incidentes (próximamente).",
      },
      hrefByLang: hubHref("microsoft-security"),
    },

    {
      title: { it: "Data (SQL & Analytics)", en: "Data (SQL & Analytics)", fr: "Data (SQL & Analytics)", es: "Datos (SQL y Analítica)" },
      description: {
        it: "Database, SQL Server, analytics e data platform (in arrivo / in crescita).",
        en: "Databases, SQL Server, analytics and data platforms (coming soon / growing).",
        fr: "Bases de données, SQL Server, analytics et plateformes data (bientôt / en croissance).",
        es: "Bases de datos, SQL Server, analítica y plataformas de datos (próximamente / en crecimiento).",
      },
      hrefByLang: hubHref("microsoft-data"),
    },

    {
      title: { it: "Developer", en: "Developer", fr: "Développeur", es: "Desarrollo" },
      description: {
        it: "Sviluppo, API, app modern e toolchain Microsoft (in arrivo).",
        en: "Development, APIs, modern apps and Microsoft toolchain (coming soon).",
        fr: "Développement, API, apps modernes et toolchain Microsoft (bientôt).",
        es: "Desarrollo, APIs, apps modernas y herramientas Microsoft (próximamente).",
      },
      hrefByLang: hubHref("microsoft-dev"),
    },
  ],
};
