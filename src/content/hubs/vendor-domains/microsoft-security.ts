import type { HubData } from "./google-cloud";

export const microsoftSecurityHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "microsoft-security",
  vendorKey: "microsoft",
  domainKey: "security",
  title: {
    it: "Microsoft Security: quiz e preparazione",
    en: "Microsoft Security: quizzes and preparation",
    fr: "Microsoft Sécurité : quiz et préparation",
    es: "Microsoft Seguridad: quizzes y preparación",
  },
  description: {
    it: "Identità, accesso, protezione endpoint e cloud security in ecosistema Microsoft. In arrivo.",
    en: "Identity, access, endpoint protection and cloud security in the Microsoft ecosystem. Coming soon.",
    fr: "Identité, accès, protection endpoint et cloud security dans l’écosystème Microsoft. Bientôt.",
    es: "Identidad, acceso, protección endpoint y cloud security en el ecosistema Microsoft. Próximamente.",
  },
  certs: [],
};
