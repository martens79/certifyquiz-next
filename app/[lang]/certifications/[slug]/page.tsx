import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCertSlugs, getCertBySlug } from "@/lib/data";
import { prettyDetail } from "@/lib/prettyPaths";

const SUPPORTED = ["it", "en", "fr", "es"] as const;
type Lang = (typeof SUPPORTED)[number];

export const revalidate = 86400;

// Usa l'ENV in prod (Vercel): NEXT_PUBLIC_SITE_URL=https://www.certifyquiz.com
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";

export async function generateStaticParams() {
  const lists = await Promise.all(
    (SUPPORTED as readonly Lang[]).map(async (lang) => {
      const slugs = await getAllCertSlugs(lang);
      return slugs.map((slug: string) => ({ lang, slug }));
    })
  );
  return lists.flat();
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; slug: string }> }
): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang: Lang = (SUPPORTED as readonly string[]).includes(raw) ? (raw as Lang) : "it";

  const data = await getCertBySlug(slug, lang);
  if (!data) return {};

  // Canonical/hreflang con PRETTY URL
  const canonicalRel = prettyDetail(lang, data.slug);
  const hrefs = {
    it: prettyDetail("it", data.slug),
    en: prettyDetail("en", data.slug),
    fr: prettyDetail("fr", data.slug),
    es: prettyDetail("es", data.slug),
  };

  const titleByLang: Record<Lang, string> = {
    it: `Quiz ${data.title} – Simulatore d’Esame | CertifyQuiz`,
    en: `Quiz ${data.title} – Exam Simulator | CertifyQuiz`,
    fr: `Quiz ${data.title} – Simulateur d’examen | CertifyQuiz`,
    es: `Quiz ${data.title} – Simulador de examen | CertifyQuiz`,
  };

  return {
    title: titleByLang[lang],
    description: data.seoDescription,
    alternates: {
      // Canonical può essere relativo (Next lo risolve) — gli hrefLang meglio assoluti per chiarezza
      canonical: canonicalRel,
      languages: {
        "it-IT": `${ORIGIN}${hrefs.it}`,
        "en-US": `${ORIGIN}${hrefs.en}`,
        "fr-FR": `${ORIGIN}${hrefs.fr}`,
        "es-ES": `${ORIGIN}${hrefs.es}`,
        "x-default": `${ORIGIN}${hrefs.en}`,
      },
    },
    openGraph: {
      type: "article",
      url: `${ORIGIN}${canonicalRel}`,
      title: `Quiz ${data.title}`,
      description: data.seoDescription,
      siteName: "CertifyQuiz",
    },
  };
}

export default async function CertPage(
  { params }: { params: Promise<{ lang: string; slug: string }> }
) {
  const { lang: raw, slug } = await params;
  if (!(SUPPORTED as readonly string[]).includes(raw)) return notFound();
  const lang = raw as Lang;

  const data = await getCertBySlug(slug, lang);
  if (!data) return notFound();

  const cta: Record<Lang, string> = {
    it: "Inizia il quiz",
    en: "Start the quiz",
    fr: "Commencer le quiz",
    es: "Comenzar el quiz",
  };

  const faqJsonLd = data.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.faq.map((f: { q: string; a: string }) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <article className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{data.h1 ?? data.title}</h1>
      {data.intro && <p>{data.intro}</p>}

      <a
        href={`https://app.certifyquiz.com/${lang}/quiz/cert/${data.slug}`}
        className="inline-block px-4 py-2 rounded bg-black text-white"
      >
        {cta[lang]}
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
