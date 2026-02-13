import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

export const ibmVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "ibm",
  vendorKey: "ibm",

  title: {
    it: "Certificazioni IBM: percorsi, quiz e pratica d’esame",
    en: "IBM Certifications: paths, quizzes and exam practice",
    fr: "Certifications IBM : parcours, quiz et entraînement",
    es: "Certificaciones IBM: rutas, quizzes y práctica",
  },

  description: {
    it: "Hub centrale per le certificazioni IBM: scegli un percorso e vai ai quiz.",
    en: "Central hub for IBM certifications: choose a path and jump to quizzes.",
    fr: "Hub central pour les certifications IBM : choisissez un parcours et accédez aux quiz.",
    es: "Hub central de certificaciones IBM: elige una ruta y ve a los quizzes.",
  },

  sections: [
    {
      title: { it: "Cloud (V5)", en: "Cloud (V5)", fr: "Cloud (V5)", es: "Cloud (V5)" },
      description: {
        it: "Percorso certificazione IBM Cloud V5.",
        en: "IBM Cloud V5 certification path.",
        fr: "Parcours certification IBM Cloud V5.",
        es: "Ruta certificación IBM Cloud V5.",
      },
      hrefByLang: hubHref("ibm-cloud"),
    },
    {
      title: { it: "AI (in arrivo)", en: "AI (coming soon)", fr: "IA (bientôt)", es: "IA (próximamente)" },
      description: {
        it: "Percorso AI IBM in sviluppo.",
        en: "IBM AI certification path coming soon.",
        fr: "Parcours IA IBM bientôt disponible.",
        es: "Ruta IA IBM próximamente.",
      },
      hrefByLang: hubHref("ibm-ai"),
    },
    {
      title: { it: "Sicurezza (in arrivo)", en: "Security (coming soon)", fr: "Sécurité (bientôt)", es: "Seguridad (próximamente)" },
      description: {
        it: "Percorso Sicurezza IBM in sviluppo.",
        en: "IBM Security certification path coming soon.",
        fr: "Parcours Sécurité IBM bientôt disponible.",
        es: "Ruta Seguridad IBM próximamente.",
      },
      hrefByLang: hubHref("ibm-security"),
    },
  ],
};
