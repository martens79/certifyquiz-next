import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

export const comptiaVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "comptia",
  vendorKey: "comptia",

  title: {
    it: "Certificazioni CompTIA: percorsi e quiz",
    en: "CompTIA Certifications: paths and quizzes",
    fr: "Certifications CompTIA : parcours et quiz",
    es: "Certificaciones CompTIA: rutas y quizzes",
  },

  description: {
    it: "Hub ufficiale CompTIA su CertifyQuiz: scegli l’ambito e allenati con quiz in stile esame.",
    en: "Official CompTIA hub on CertifyQuiz: choose your domain and train with exam-style quizzes.",
    fr: "Hub CompTIA sur CertifyQuiz : choisissez votre domaine et entraînez-vous avec des quiz type examen.",
    es: "Hub CompTIA en CertifyQuiz: elige tu área y practica con quizzes estilo examen.",
  },

  sections: [
    {
      title: { it: "Fondamenta (ITF+)", en: "Foundations (ITF+)", fr: "Fondations (ITF+)", es: "Fundamentos (ITF+)" },
      description: {
        it: "Basi dell’IT con CompTIA ITF+ e A+.",
        en: "IT basics with CompTIA ITF+ and A+.",
        fr: "Bases IT avec CompTIA ITF+ et A+.",
        es: "Bases IT con CompTIA ITF+ y A+.",
      },
      hrefByLang: hubHref("comptia-foundations"),
    },
    {
      title: { it: "Security", en: "Security", fr: "Sécurité", es: "Seguridad" },
      description: {
        it: "CompTIA Security+ per sicurezza IT e cybersecurity.",
        en: "CompTIA Security+ for IT security and cybersecurity.",
        fr: "CompTIA Security+ pour la sécurité IT et cybersécurité.",
        es: "CompTIA Security+ para seguridad IT y ciberseguridad.",
      },
      hrefByLang: hubHref("comptia-security"),
    },
    {
      title: { it: "Networking", en: "Networking", fr: "Réseau", es: "Redes" },
      description: {
        it: "CompTIA Network+ per reti e infrastrutture.",
        en: "CompTIA Network+ for networking fundamentals.",
        fr: "CompTIA Network+ pour les réseaux.",
        es: "CompTIA Network+ para redes.",
      },
      hrefByLang: hubHref("comptia-networking"),
    },
    {
      title: { it: "Cloud", en: "Cloud", fr: "Cloud", es: "Cloud" },
      description: {
        it: "CompTIA Cloud+ per competenze cloud e infrastruttura.",
        en: "CompTIA Cloud+ for cloud and infrastructure skills.",
        fr: "CompTIA Cloud+ pour compétences cloud et infrastructure.",
        es: "CompTIA Cloud+ para habilidades cloud e infraestructura.",
      },
      hrefByLang: hubHref("comptia-cloud"),
    },
  ],
};
