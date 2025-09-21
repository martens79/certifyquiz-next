import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCertSlugs, getCertBySlug } from "@/lib/data";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getAllCertSlugs("it");
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const data = await getCertBySlug(params.slug, "it");
  if (!data) return {};
  const url = `https://www.certifyquiz.com/it/certificazioni/${data.slug}`;
  return {
    title: `Quiz ${data.title} – Simulatore d’Esame | CertifyQuiz`,
    description: data.seoDescription,
    alternates: {
      canonical: url,
      languages: {
        it: url,
        "x-default": url,
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

export default async function CertPage({ params }: { params: { slug: string } }) {
  const data = await getCertBySlug(params.slug, "it");
  if (!data) return notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return (
    <article className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{data.h1}</h1>
      <p>{data.intro}</p>

      <h2 className="text-xl font-semibold">FAQ</h2>
      <ul className="list-disc ml-5">
        {data.faq.map(f => (
          <li key={f.q}><strong>{f.q}</strong> — {f.a}</li>
        ))}
      </ul>

      <a
        href={`https://app.certifyquiz.com/it/quiz/cert/${data.slug}`}
        className="inline-block px-4 py-2 rounded bg-black text-white"
      >
        Inizia il quiz
      </a>

      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </article>
  );
}
