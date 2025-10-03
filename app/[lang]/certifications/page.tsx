import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCertList } from "@/lib/data";
import { prettyList, prettyDetail } from "@/lib/prettyPaths";

const SUPPORTED = ["it", "en", "fr", "es"] as const;
type Lang = (typeof SUPPORTED)[number];

type CertListItem = {
  slug: string;
  title: string;
  intro?: string;
};

export const revalidate = 3600;

// Usa NEXT_PUBLIC_SITE_URL in prod (Vercel); fallback al dominio live
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";

export function generateStaticParams() {
  return (SUPPORTED as readonly string[]).map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Lang = (SUPPORTED as readonly string[]).includes(raw)
    ? (raw as Lang)
    : "it";

  const canonicalRel = prettyList(lang);

  const titleByLang: Record<Lang, string> = {
    it: "Certificazioni IT — CertifyQuiz",
    en: "IT Certifications — CertifyQuiz",
    fr: "Certifications IT — CertifyQuiz",
    es: "Certificaciones IT — CertifyQuiz",
  };

  const descByLang: Record<Lang, string> = {
    it: "Elenco delle certificazioni con quiz aggiornati, spiegazioni e badge.",
    en: "Browse certifications with updated quizzes, explanations, and badges.",
    fr: "Parcourez les certifications avec des quiz à jour, explications et badges.",
    es: "Explora certificaciones con cuestionarios actualizados, explicaciones y credenciales.",
  };

  return {
    title: titleByLang[lang],
    description: descByLang[lang],
    alternates: {
      canonical: canonicalRel, // relativo ok; gli hrefLang sotto sono assoluti
      languages: {
        "it-IT": `${ORIGIN}${prettyList("it")}`,
        "en-US": `${ORIGIN}${prettyList("en")}`,
        "fr-FR": `${ORIGIN}${prettyList("fr")}`,
        "es-ES": `${ORIGIN}${prettyList("es")}`,
        "x-default": `${ORIGIN}${prettyList("en")}`,
      },
    },
    openGraph: {
      url: `${ORIGIN}${canonicalRel}`,
      title: titleByLang[lang],
      description: descByLang[lang],
      siteName: "CertifyQuiz",
      type: "website",
    },
  };
}

export default async function CertListPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  if (!(SUPPORTED as readonly string[]).includes(raw)) return notFound();
  const lang = raw as Lang;

  const certs = (await getCertList(lang)) as CertListItem[];

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {lang === "it"
          ? "Certificazioni (IT)"
          : lang === "fr"
          ? "Certifications (FR)"
          : lang === "es"
          ? "Certifications (ES)"
          : "Certifications (EN)"}
      </h1>
      <ul className="space-y-2">
        {certs.map((c) => (
          <li key={c.slug} className="border p-3 rounded">
            <Link
              href={prettyDetail(lang, c.slug)}
              className="font-semibold hover:underline"
            >
              {c.title}
            </Link>
            {c.intro ? (
              <p className="text-sm text-gray-600 mt-1">{c.intro}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
