import type { HubData } from "./google-cloud";

export const awsSecurityHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "aws-security",
  vendorKey: "aws",
  domainKey: "security",
  title: {
    it: "AWS Security: quiz e preparazione",
    en: "AWS Security: quizzes and preparation",
    fr: "AWS Security : quiz et préparation",
    es: "AWS Security: quizzes y preparación",
  },
  description: {
    it: "Identity, logging, incident response e best practice di sicurezza su AWS. In arrivo.",
    en: "Identity, logging, incident response and AWS security best practices. Coming soon.",
    fr: "Identité, logs, réponse à incident et bonnes pratiques de sécurité AWS. Bientôt.",
    es: "Identidad, logs, respuesta a incidentes y buenas prácticas de seguridad en AWS. Próximamente.",
  },
  certs: [],
};
