export type Cert = {
  slug: string;
  locale: "it" | "en" | "fr" | "es";
  title: string;
  h1: string;
  intro: string;
  seoDescription: string;
  faq: { q: string; a: string }[];
};

const CERTS: Cert[] = [
  {
    slug: "comptia-itf-plus",
    locale: "it",
    title: "CompTIA ITF+",
    h1: "Quiz CompTIA ITF+ (Simulatore d’esame)",
    intro:
      "Allenati all’esame CompTIA ITF+ con quiz aggiornati e spiegazioni passo-passo. Modalità allenamento ed esame, statistiche e badge.",
    seoDescription:
      "Allenati all’esame CompTIA ITF+ con quiz reali e spiegazioni chiare. Modalità allenamento/esame e progressi. Provalo gratis.",
    faq: [
      { q: "Quanto dura l’esame ITF+?", a: "Circa 60 minuti con domande a scelta multipla." },
      { q: "Quanti punti servono per superare?", a: "In genere intorno a 650 su 900." },
    ],
  },
];

export async function getAllCertSlugs(locale: Cert["locale"] = "it") {
  return CERTS.filter(c => c.locale === locale).map(c => c.slug);
}

export async function getCertBySlug(slug: string, locale: Cert["locale"] = "it") {
  return CERTS.find(c => c.slug === slug && c.locale === locale) || null;
}
