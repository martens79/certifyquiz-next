// src/app/_views/CertificationDetailView.tsx
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { CERTS_BY_SLUG, type CertificationData } from "@/certifications/registry";
import CertificationPage from "@/components/CertificationPage";
import { getCertBySlug, type Cert } from "@/lib/data";

type Lang = Locale;

/* ------------------------------- Adapter ---------------------------------- */

const allLocales = (s: string) => ({ it: s, en: s, fr: s, es: s } as const);

const makeQuizRoute = (slug: string) =>
  ({
    it: `/it/quiz/${slug}`,
    en: `/en/quiz/${slug}`, // ✅ quiz sempre con /en
    fr: `/fr/quiz/${slug}`,
    es: `/es/quiz/${slug}`,
  } as const);

const makeBackRoute = () =>
  ({
    it: "/it/certificazioni",
    en: "/certifications", // 🔥 torna all’elenco ufficiale EN root
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
  const reg = CERTS_BY_SLUG[slug];
  if (reg) return <CertificationPage lang={lang} data={reg} />;

  const cert = await getCertBySlug(slug, lang);
  if (!cert) return notFound();

  const data = adaptCertToRegistryShape(cert);
  return <CertificationPage lang={lang} data={data} />;
}
