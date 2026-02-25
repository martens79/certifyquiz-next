import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

/**
 * ISC2 Vendor Hub (central)
 */
export const isc2VendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "isc2",
  vendorKey: "isc2",

  title: {
    it: "Certificazioni ISC2: percorsi, quiz e pratica d’esame",
    en: "ISC2 Certifications: paths, quizzes and exam practice",
    fr: "Certifications ISC2 : parcours, quiz et entraînement",
    es: "Certificaciones ISC2: rutas, quizzes y práctica",
  },

  description: {
    it: "Hub centrale ISC2 per prepararti con quiz in stile esame: parti da ISC2 CC e sali fino a CISSP. Percorsi organizzati per area e livello.",
    en: "Central ISC2 hub for exam-style practice: start with ISC2 CC and level up to CISSP. Paths organized by domain and level.",
    fr: "Hub central ISC2 pour l’entraînement : commencez par ISC2 CC et progressez jusqu’au CISSP. Parcours par domaine et niveau.",
    es: "Hub central ISC2 para practicar: empieza con ISC2 CC y sube hasta CISSP. Rutas por área y nivel.",
  },

  sections: [
    {
      title: {
        it: "Security (core)",
        en: "Security (core)",
        fr: "Sécurité (core)",
        es: "Seguridad (core)",
      },
      description: {
        it: "Percorso ISC2 Security: basi con CC e percorso avanzato CISSP. Quiz realistici e spiegazioni chiare.",
        en: "ISC2 Security path: fundamentals with CC and advanced CISSP track. Realistic quizzes and clear explanations.",
        fr: "Parcours sécurité ISC2 : bases avec CC et parcours avancé CISSP. Quiz réalistes et explications claires.",
        es: "Ruta de seguridad ISC2: fundamentos con CC y ruta avanzada CISSP. Quizzes realistas y explicaciones claras.",
      },
      hrefByLang: hubHref("isc2-security"), // ✅ questo deve combaciare col vendor-domain che creiamo/abbiamo creato
    },
  ],
};