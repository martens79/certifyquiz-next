// src/content/hubs/vendors/google.ts
import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";


// helper: /hub/... per EN, /{lang}/hub/... per le altre
const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

export const googleVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "google",
  vendorKey: "google",
  title: {
    it: "Certificazioni Google",
    en: "Google Certifications",
    fr: "Certifications Google",
    es: "Certificaciones de Google",
  },
  description: {
    it: "Scegli un percorso Google: Cloud, Data, AI… e vai direttamente ai quiz.",
    en: "Choose a Google path: Cloud, Data, AI… and jump straight to quizzes.",
    fr: "Choisissez un parcours Google : Cloud, Data, IA… et accédez directement aux quiz.",
    es: "Elige una ruta de Google: Cloud, Datos, IA… y ve directo a los quizzes.",
  },
  sections: [
    {
      title: {
        it: "Google Cloud",
        en: "Google Cloud",
        fr: "Google Cloud",
        es: "Google Cloud",
      },
      description: {
        it: "Certificazioni cloud Google (da fundamentals a professional).",
        en: "Google Cloud certifications (from fundamentals to professional).",
        fr: "Certifications Google Cloud (du niveau débutant au professionnel).",
        es: "Certificaciones Google Cloud (de fundamentals a professional).",
      },
      hrefByLang: hubHref("google-cloud"),
    },
    // placeholder futuri (li lasci anche senza contenuti reali se vuoi)
    // { title: {...}, hrefByLang: hubHref("google-data") },
    // { title: {...}, hrefByLang: hubHref("google-ai") },
  ],
};
