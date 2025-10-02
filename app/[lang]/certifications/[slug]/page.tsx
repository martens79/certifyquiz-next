import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCertSlugs, getCertBySlug } from "@/lib/data";

const SUPPORTED = ["it", "en", "fr", "es"] as const;
type Lang = typeof SUPPORTED[number];

export const revalidate = 86400;

// ✅ parallelizza lo scraping degli slug per tutte le lingue
export async function generateStaticParams() {
  const lists = await Promise.all(
    (SUPPORTED as readonly Lang[]).map(async (lang) => {
      const slugs = await getAllCertSlugs(lang);
      return slugs.map((slug: string) => ({ lang, slug }));
    })
  );
  return lists.flat();
}

// ✅ params non è una Promise
export async function generateMetadata(
  { params }: { params: { lang: string; slug: string } }
): Promise<Metadata> {
  const lang = (SUPPORTED as readonly string[]).includes(params.lang)
    ? (params.lang as Lang)
    : "it";

  const data = await getCertBySlug(params.slug, lang);
  if (!data) return {};

  // Se hai messo le rewrites "belle" in next.config.ts, i canonical localizzati non daranno 404
  const url =
    lang === "it" ? `https://www.certifyquiz.com/it/certificazioni/${data.slug}` :
    lang === "es" ? `https://www.certifyquiz.com/es/certificaciones/${data.slug}` :
    `https://www.certifyquiz.com/${lang}/certifications/${data.slug}`;

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

// ✅ params non è una Promise
export default async function CertPage(
  { params }: { params: { lang: string; slug: string } }
) {
  const langOk = (SUPPORTED as readonly string[]).includes(params.lang);
  if (!langOk) return notFound();
  const lang = params.lang as Lang;

  const data = await getCertBySlug(params.slug, lang);
  if (!data) return notFound();

  const cta: Record<Lang, string> = {
    it: "Inizia il quiz",
    en: "Start the quiz",
    fr: "Commencer le quiz",
    es: "Comenzar el quiz",
  };

  // FAQ JSON-LD (opzionale)
  const faqJsonLd = data.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.faq.map((f: { q: string; a: string }) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }
    : null;

  return (
    <article className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{data.h1}</h1>
      <p>{data.intro}</p>

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
