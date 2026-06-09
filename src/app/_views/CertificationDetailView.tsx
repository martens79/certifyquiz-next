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
  "tensorflow-developer": "google-tensorflow",
};

/* ------------------------------- Slug aliases ---------------------------------- */

const normalizeCertSlug = (slug: string) => {
  if (slug === "network-plus") return "comptia-network-plus";
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

function adaptCertToRegistryShape(cert: Cert): CertificationData {
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
  // ✅ Redirect slug legacy → slug canonico, tutte le lingue
  // ❌ NON mettere network-plus qui, altrimenti può creare loop.
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

  // ✅ Alias interni senza redirect: evita loop tra network-plus e comptia-network-plus.
  const canonicalSlug = normalizeCertSlug(slug);

  // ✅ Recupera i topic reali dal DB/API usando lo slug canonico.
  const dbTopics = await getTopicsByCertSlug(canonicalSlug, lang);

  const reg = CERTS_BY_SLUG[canonicalSlug];

  // ✅ Se presente nel registry statico, usa pagina ricca.
  if (reg) {
    return <CertificationPage lang={lang} data={reg} dbTopics={dbTopics} />;
  }

  // ✅ Fallback backend.
  const cert = await getCertBySlug(canonicalSlug, lang);
  if (!cert) return notFound();

  const data = adaptCertToRegistryShape(cert);

  return <CertificationPage lang={lang} data={data} dbTopics={dbTopics} />;
}