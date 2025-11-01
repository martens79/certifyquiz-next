// app/[lang]/certifications/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCertList } from "@/lib/data";
import { prettyDetail } from "@/lib/prettyPaths";

const SUPPORTED = ["it", "en", "fr", "es"] as const;
type Lang = (typeof SUPPORTED)[number];
const isLang = (v: string): v is Lang =>
  (SUPPORTED as readonly string[]).includes(v as Lang);

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";

function prettyList(lang: Lang) {
  return lang === "it" ? "/it/certificazioni"
       : lang === "es" ? "/es/certificaciones"
       : lang === "fr" ? "/fr/certifications"
       : "/en/certifications";
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : "it";

  const canonicalRel = prettyList(lang);
  const title =
    lang === "it" ? "Certificazioni IT — CertifyQuiz" : "IT Certifications — CertifyQuiz";
  const description =
    lang === "it"
      ? "Elenco delle certificazioni con quiz aggiornati, spiegazioni e badge."
      : "List of certifications with updated quizzes and explanations.";
  const abs = `${ORIGIN}${canonicalRel}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalRel, // relativo → assoluto via metadataBase
      languages: {
        "it-IT": `${ORIGIN}${prettyList("it")}`,
        "en-US": `${ORIGIN}${prettyList("en")}`,
        "fr-FR": `${ORIGIN}${prettyList("fr")}`,
        "es-ES": `${ORIGIN}${prettyList("es")}`,
        "x-default": `${ORIGIN}${prettyList("en")}`,
      },
    },
    openGraph: {
      type: "website",
      url: canonicalRel,
      title,
      description,
      siteName: "CertifyQuiz",
      images: ["/og-home.jpg"],
    },
    other: {
      "og:url": abs,
      "og:title": title,
      "og:description": description,
      "og:site_name": "CertifyQuiz",
      "og:type": "website",
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": `${ORIGIN}/og-home.jpg`,
      "x-og-url": abs,
    },
  };
}

type CertListItem = { slug: string; title: string; intro?: string };

export default async function ListPage(
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang: raw } = await params;
  if (!isLang(raw)) return notFound();
  const lang = raw;

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
