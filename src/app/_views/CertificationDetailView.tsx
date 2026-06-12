// src/app/_views/CertificationDetailView.tsx
import { notFound, redirect } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { CERTS_BY_SLUG, type CertificationData } from "@/certifications/registry";
import CertificationPage from "@/components/CertificationPage";
import { getCertBySlug, getTopicsByCertSlug, type Cert } from "@/lib/data";

type Lang = Locale;

/* ------------------------------- Slug redirects ---------------------------------- */

const SLUG_REDIRECTS: Record<string, string> = {
  "cisco-ccst-security": "cisco-ccst-cybersecurity",
  "microsoft-ai-fundamentals": "microsoft-ai",
  "csharp-certification": "microsoft-csharp",
};

/* ------------------------------- DB/API slug aliases ---------------------------------- */

const normalizeDbSlug = (slug: string) => {
  if (slug === "network-plus") return "comptia-network-plus";
  if (slug === "tensorflow") return "google-tensorflow";
  if (slug === "tensorflow-developer") return "google-tensorflow";
  if (slug === "python-developer") return "python";
  return slug;
};

/* ------------------------------- Adapter ---------------------------------- */

const allLocales = (s: string) => ({ it: s, en: s, fr: s, es: s } as const);

const makeQuizRoute = (slug: string) =>
  ({
    it: `/it/quiz/${slug}`,
    en: `/en/quiz/${slug}`,
    fr: `/fr/quiz/${slug}`,
    es: `/es/quiz/${slug}`,
  } as const);

const makeBackRoute = () =>
  ({
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  } as const);

type DynamicCertData = CertificationData & {
  questionCount?: number;
  questionCountByLang?: Partial<Record<Lang, number>>;
};

function adaptCertToRegistryShape(cert: Cert): DynamicCertData {
  const title = cert.title || cert.h1 || "Certification";
  const desc = cert.seoDescription || cert.intro || cert.title || "";
  const img = cert.imageUrl ?? "/og/cert-default.png";

  return {
    slug: cert.slug,
    imageUrl: img,
    officialUrl: "",

    title: allLocales(title),
    level: allLocales(""),
    description: allLocales(desc),

    topics: [] as const,
    extraContent: undefined,

    quizRoute: makeQuizRoute(cert.slug),
    backRoute: makeBackRoute(),

    questionCount: cert.questionCount,
    questionCountByLang: cert.questionCountByLang,
  };
}

/* ------------------------------------------------------------------------ */
/*                                  VIEW                                    */
/* ------------------------------------------------------------------------ */

export async function CertificationDetailView({
  lang,
  slug,
}: {
  lang: Lang;
  slug: string;
}) {
  if (SLUG_REDIRECTS[slug]) {
    const target = SLUG_REDIRECTS[slug];
    const prefix = lang === "en" ? "" : `/${lang}`;
    const seg =
      lang === "it"
        ? "certificazioni"
        : lang === "es"
        ? "certificaciones"
        : "certifications";

    redirect(`${prefix}/${seg}/${target}`);
  }

  const dbSlug = normalizeDbSlug(slug);

  const reg =
    (CERTS_BY_SLUG as Record<string, CertificationData | undefined>)[slug] ??
    (CERTS_BY_SLUG as Record<string, CertificationData | undefined>)[dbSlug];

  const [dbTopics, cert] = await Promise.all([
    
    getTopicsByCertSlug(dbSlug, lang),
    getCertBySlug(dbSlug, lang),
  ]);

  if (reg) {
    const data: DynamicCertData = {
      ...reg,
      questionCount: cert?.questionCount,
      questionCountByLang: cert?.questionCountByLang,
    };

    return <CertificationPage lang={lang} data={data} dbTopics={dbTopics} />;
  }

  if (!cert) return notFound();

  const data = adaptCertToRegistryShape(cert);

  return <CertificationPage lang={lang} data={data} dbTopics={dbTopics} />;
}