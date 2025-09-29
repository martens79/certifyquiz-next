import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCertSlugs, getCertBySlug } from "@/lib/data";

const SUPPORTED = ["it","en","fr","es"] as const;
type Lang = typeof SUPPORTED[number];

export const revalidate = 86400;

export async function generateStaticParams() {
  const out: { lang: Lang; slug: string }[] = [];
  for (const lang of SUPPORTED) {
    const slugs = await getAllCertSlugs(lang);
    slugs.forEach((slug: string) => out.push({ lang, slug }));
  }
  return out;
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: Lang; slug: string }> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!SUPPORTED.includes(lang)) return {};
  const data = await getCertBySlug(slug, lang);
  if (!data) return {};

  const url =
    lang === "it" ? `https://www.certifyquiz.com/it/certificazioni/${data.slug}` :
    lang === "es" ? `https://www.certifyquiz.com/es/certificaciones/${data.slug}` :
    `https://www.certifyquiz.com/${lang}/certifications/${data.slug}`;

  return {
    title: `Quiz ${data.title} – Simulatore d’Esame | CertifyQuiz`,
    description: data.seoDescription,
    alternates: {
      canonical: url,
      languages: {
        it: `https://www.certifyquiz.com/it/certificazioni/${data.slug}`,
        en: `https://www.certifyquiz.com/en/certifications/${data.slug}`,
        fr: `https://www.certifyquiz.com/fr/certifications/${data.slug}`,
        es: `https://www.certifyquiz.com/es/certificaciones/${data.slug}`,
        "x-default": `https://www.certifyquiz.com/en/certifications/${data.slug}`,
      },
    },
    openGraph: {
      type: "article",
      url,
      title: `Quiz ${data.title}`,
      description: data.seoDescription,
    },
  };
}

export default async function CertPage(
  { params }: { params: Promise<{ lang: Lang; slug: string }> }
) {
  const { lang, slug } = await params;
  if (!SUPPORTED.includes(lang)) return notFound();

  const data = await getCertBySlug(slug, lang);
  if (!data) return notFound();

  // FAQ JSON-LD (opzionale, come nella tua IT)
  const faqJsonLd = data.faq?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faq.map((f: { q: string; a: string }) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  } : null;

  const cta =
    lang === "it" ? "Inizia il quiz" :
    lang === "fr" ? "Commencer le quiz" :
    lang === "es" ? "Comenzar el quiz" : "Start the quiz";

  return (
    <article className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{data.h1}</h1>
      <p>{data.intro}</p>

      <a
        href={`https://app.certifyquiz.com/${lang}/quiz/cert/${data.slug}`}
        className="inline-block px-4 py-2 rounded bg-black text-white"
      >
        {cta}
      </a>

      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </article>
  );
}
