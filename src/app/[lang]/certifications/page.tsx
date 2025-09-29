import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCertList } from "@/lib/data";

const SUPPORTED = ["it", "en", "fr", "es"] as const;
type Lang = typeof SUPPORTED[number];

type CertListItem = {
  slug: string;
  title: string;
  intro?: string;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  return SUPPORTED.map((lang) => ({ lang }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: Lang }> }
): Promise<Metadata> {
  const { lang } = await params;
  if (!SUPPORTED.includes(lang)) return {};

  const canonical =
    lang === "it" ? "/it/certificazioni" :
    lang === "es" ? "/es/certificaciones" :
    `/${lang}/certifications`;

  return {
    title: lang === "it" ? "Certificazioni IT — CertifyQuiz" : "IT Certifications — CertifyQuiz",
    description:
      lang === "it"
        ? "Elenco delle certificazioni con quiz e spiegazioni in italiano."
        : "List of certifications with quizzes and explanations.",
    alternates: {
      canonical,
      languages: {
        it: "/it/certificazioni",
        en: "/en/certifications",
        fr: "/fr/certifications",
        es: "/es/certificaciones",
        "x-default": "/en/certifications",
      },
    },
  };
}

export default async function ListPage(
  { params }: { params: Promise<{ lang: Lang }> }
) {
  const { lang } = await params;
  if (!SUPPORTED.includes(lang)) return notFound();

  // tipizziamo il risultato del fetch
  const certs = (await getCertList(lang)) as CertListItem[];

  const toDetail = (l: Lang, slug: string) =>
    l === "it" ? `/it/certificazioni/${slug}` :
    l === "es" ? `/es/certificaciones/${slug}` :
    `/${l}/certifications/${slug}`;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {lang === "it" ? "Certificazioni (IT)" :
         lang === "fr" ? "Certifications (FR)" :
         lang === "es" ? "Certificaciones (ES)" : "Certifications (EN)"}
      </h1>
      <ul className="space-y-2">
        {certs.map((c) => (
          <li key={c.slug} className="border p-3 rounded">
            <Link href={toDetail(lang, c.slug)} className="font-semibold hover:underline">
              {c.title}
            </Link>
            {c.intro ? <p className="text-sm text-gray-600 mt-1">{c.intro}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
