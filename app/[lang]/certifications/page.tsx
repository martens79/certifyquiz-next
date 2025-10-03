import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCertList } from "@/lib/data";
import { prettyDetail } from "@/lib/prettyPaths";

const SUPPORTED = ["it", "en", "fr", "es"] as const;
type Lang = (typeof SUPPORTED)[number];

export const dynamic = "force-dynamic"; // SSR: niente SSG in build
export const revalidate = 0;            // no cache a build-time

// Evita SSG dei /{lang}/certifications in build
export async function generateStaticParams() { return []; }

// Per canonical/hreflang usiamo le pretty URL
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";

function prettyList(lang: Lang) {
  return lang === "it" ? "/it/certificazioni"
       : lang === "es" ? "/es/certificaciones"
       : /* fr usa la tecnica */ lang === "fr" ? "/fr/certifications"
       : "/en/certifications";
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Lang = (SUPPORTED as readonly string[]).includes(raw) ? (raw as Lang) : "it";

  const canonicalRel = prettyList(lang);

  return {
    title: lang === "it" ? "Certificazioni IT — CertifyQuiz" : "IT Certifications — CertifyQuiz",
    description:
      lang === "it"
        ? "Elenco delle certificazioni con quiz aggiornati, spiegazioni e badge."
        : "List of certifications with updated quizzes and explanations.",
    alternates: {
      canonical: canonicalRel,
      languages: {
        "it-IT": `${ORIGIN}${prettyList("it")}`,
        "en-US": `${ORIGIN}${prettyList("en")}`,
        "fr-FR": `${ORIGIN}${prettyList("fr")}`,
        "es-ES": `${ORIGIN}${prettyList("es")}`,
        "x-default": `${ORIGIN}${prettyList("en")}`,
      },
    },
  };
}

type CertListItem = { slug: string; title: string; intro?: string };

export default async function ListPage(
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang: raw } = await params;
  if (!(SUPPORTED as readonly string[]).includes(raw)) return notFound();
  const lang = raw as Lang;

  // fetch a runtime (SSR), non in build
  const certs = (await getCertList(lang)) as CertListItem[];

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {lang === "it"
          ? "Certificazioni (IT)"
          : lang === "fr"
          ? "Certifications (FR)"
          : lang === "es"
          ? "Certificaciones (ES)"
          : "Certifications (EN)"}
      </h1>

      <ul className="space-y-2">
        {certs.map((c) => (
          <li key={c.slug} className="border p-3 rounded">
            <Link href={prettyDetail(lang, c.slug)} className="font-semibold hover:underline">
              {c.title}
            </Link>
            {c.intro ? <p className="text-sm text-gray-600 mt-1">{c.intro}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
