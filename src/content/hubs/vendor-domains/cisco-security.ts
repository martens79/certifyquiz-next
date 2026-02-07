import type { HubData } from "./google-cloud";

export const ciscoSecurityHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "cisco-security",
  vendorKey: "cisco",
  domainKey: "security",
  title: {
    it: "Cisco Security: quiz e preparazione",
    en: "Cisco Security: quizzes and preparation",
    fr: "Cisco Sécurité : quiz et préparation",
    es: "Cisco Seguridad: quizzes y preparación",
  },
  description: {
    it: "Concetti e tecnologie di sicurezza Cisco: AAA, VPN, hardening e best practice. In arrivo.",
    en: "Cisco security concepts and technologies: AAA, VPNs, hardening and best practices. Coming soon.",
    fr: "Concepts et technologies sécurité Cisco : AAA, VPN, durcissement et bonnes pratiques. Bientôt.",
    es: "Conceptos y tecnologías de seguridad Cisco: AAA, VPN, hardening y buenas prácticas. Próximamente.",
  },
  certs: [],
};
