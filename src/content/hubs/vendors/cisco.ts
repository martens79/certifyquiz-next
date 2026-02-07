import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

/**
 * Cisco Vendor Hub (central)
 */
export const ciscoVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "cisco",
  vendorKey: "cisco",

  title: {
    it: "Certificazioni Cisco: percorsi, quiz e pratica d’esame",
    en: "Cisco Certifications: paths, quizzes and exam practice",
    fr: "Certifications Cisco : parcours, quiz et entraînement",
    es: "Certificaciones de Cisco: rutas, quizzes y práctica",
  },

  description: {
    it: "Hub centrale per prepararti alle certificazioni Cisco: scegli un percorso (Networking, Entry-level, Security) e vai ai quiz. Contenuti in crescita e organizzati per area.",
    en: "Central hub for Cisco certifications: choose a path (Networking, Entry-level, Security) and jump to quizzes. Growing content organized by domain.",
    fr: "Hub central pour les certifications Cisco : choisissez un parcours (Réseau, Débutant, Sécurité) et accédez aux quiz. Contenu en croissance, organisé par domaine.",
    es: "Hub central para certificaciones Cisco: elige una ruta (Redes, Nivel inicial, Seguridad) y ve a los quizzes. Contenido en crecimiento, organizado por área.",
  },

  sections: [
    {
      title: { it: "Networking (CCNA)", en: "Networking (CCNA)", fr: "Réseau (CCNA)", es: "Redes (CCNA)" },
      description: {
        it: "Routing, switching, IP services e security basics: pratica d’esame in stile CCNA.",
        en: "Routing, switching, IP services and security basics: CCNA-style exam practice.",
        fr: "Routage, switching, services IP et bases sécurité : entraînement type CCNA.",
        es: "Routing, switching, servicios IP y bases de seguridad: práctica estilo CCNA.",
      },
      hrefByLang: hubHref("cisco-networking"),
    },

    {
      title: { it: "Cisco CCST", en: "Cisco CCST", fr: "Cisco CCST", es: "Cisco CCST" },
      description: {
        it: "Percorsi entry-level Cisco: networking e cybersecurity (in crescita).",
        en: "Cisco entry-level paths: networking and cybersecurity (growing).",
        fr: "Parcours Cisco niveau débutant : réseau et cybersécurité (en croissance).",
        es: "Rutas Cisco de nivel inicial: redes y ciberseguridad (en crecimiento).",
      },
      hrefByLang: hubHref("cisco-ccst"),
    },

    {
      title: { it: "Security", en: "Security", fr: "Sécurité", es: "Seguridad" },
      description: {
        it: "Tecnologie e concetti di security Cisco: VPN, AAA, hardening e practice (in arrivo).",
        en: "Cisco security concepts and tech: VPNs, AAA, hardening and practice (coming soon).",
        fr: "Concepts et technologies sécurité Cisco : VPN, AAA, durcissement et entraînement (bientôt).",
        es: "Conceptos y tecnologías de seguridad Cisco: VPN, AAA, hardening y práctica (próximamente).",
      },
      hrefByLang: hubHref("cisco-security"),
    },
  ],
};
