// app/[lang]/certifications/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCertBySlug } from "@/lib/data";
import { prettyDetail } from "@/lib/prettyPaths";

const SUPPORTED = ["it", "en", "fr", "es"] as const;
type Lang = (typeof SUPPORTED)[number];
const isLang = (v: string): v is Lang =>
  (SUPPORTED as readonly string[]).includes(v);

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true; // ok anche se lo togli

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";

function prettyList(lang: Lang) {
  return lang === "it" ? "/it/certificazioni"
       : lang === "es" ? "/es/certificaciones"
       : lang === "fr" ? "/fr/certifications"
       : "/en/certifications";
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; slug: string }> }
): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang: Lang = isLang(raw) ? raw : "it";

  // SSR: ok fare fetch qui, non gira in build perché la route è dinamica
  const cert = await getCertBySlug(slug, lang);
  if (!cert) {
    return { robots: { index: false, follow: false } };
  }

  const canonicalRel = prettyDetail(lang, cert.slug);
  const abs = `${ORIGIN}${canonicalRel}`;
  const title = cert.h1 || cert.title || cert.slug.toUpperCase();
  const description =
    cert.seoDescription ||
    cert.intro ||
    (lang === "it"
      ? "Quiz e risorse per preparare la certificazione."
      : "Quizzes and resources to prepare for the certification.");

  return {
    title,
    description,
    alternates: {
      canonical: canonicalRel, // relativo → assoluto via metadataBase del root layout
      languages: {
        "it-IT": `${ORIGIN}${prettyDetail("it", cert.slug)}`,
        "en-US": `${ORIGIN}${prettyDetail("en", cert.slug)}`,
        "fr-FR": `${ORIGIN}${prettyDetail("fr", cert.slug)}`,
        "es-ES": `${ORIGIN}${prettyDetail("es", cert.slug)}`,
        "x-default": `${ORIGIN}${prettyDetail("en", cert.slug)}`,
      },
    },
    openGraph: {
      type: "article",
      url: canonicalRel,
      title,
      description,
      siteName: "CertifyQuiz",
      images: ["/og-cert.jpg"], // placeholder: poi puoi personalizzare per slug
    },
    other: {
      "og:url": abs,
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": `${ORIGIN}/og-cert.jpg`,
    },
  };
}

export default async function CertDetail({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: raw, slug } = await params;
  if (!isLang(raw)) return notFound();
  const lang = raw;

  const cert = await getCertBySlug(slug, lang);
  if (!cert) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{cert.h1 || cert.title}</h1>
      {cert.intro ? <p className="text-gray-700">{cert.intro}</p> : null}

      {/* TODO: contenuti reali (FAQ, CTA, ecc.) */}
      <p className="text-sm text-gray-500">Slug: {cert.slug}</p>

      <p className="text-sm">
        <a href={prettyList(lang)} className="underline">
          ← {lang === "it" ? "Torna all’elenco" : "Back to list"}
        </a>
      </p>
    </main>
  );
}
