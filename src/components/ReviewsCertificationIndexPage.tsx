import type { Metadata } from "next";
import Link from "next/link";
import { getCertTopicReviews, type Locale } from "@/lib/data";
import { cleanReviewTitle } from "@/lib/text";
import { reviewsCertPath, reviewsPath } from "@/lib/paths";

type Props = {
  lang: Locale;
  certSlug: string;
};

const locales: readonly Locale[] = ["it", "en", "fr", "es"];

const RAW_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE = RAW_SITE.replace(/\/+$/, "");

const labels = {
  it: {
    badge: "CertifyQuiz Reviews",
    available: (n: number) => `${n} ripassi disponibili`,
    keyConcepts: "Concetti chiave",
    open: "Apri ripasso",
    backToList: "← Tutti i ripassi",
    notFoundTitle: "Certificazione non trovata",
    notFoundText: "Non abbiamo trovato questa certificazione tra i ripassi disponibili.",
    emptyText: "Nessun ripasso disponibile per questa certificazione al momento.",
    metaDescription: (name: string) =>
      `Ripassi rapidi per la certificazione ${name}: rivedi i concetti chiave prima del quiz.`,
  },
  en: {
    badge: "CertifyQuiz Reviews",
    available: (n: number) => `${n} reviews available`,
    keyConcepts: "Key concepts",
    open: "Open review",
    backToList: "← All reviews",
    notFoundTitle: "Certification not found",
    notFoundText: "We couldn't find this certification among the available reviews.",
    emptyText: "No reviews available for this certification yet.",
    metaDescription: (name: string) =>
      `Quick reviews for ${name}: go through the key concepts before the quiz.`,
  },
  fr: {
    badge: "CertifyQuiz Reviews",
    available: (n: number) => `${n} révisions disponibles`,
    keyConcepts: "Concepts clés",
    open: "Ouvrir la révision",
    backToList: "← Toutes les révisions",
    notFoundTitle: "Certification introuvable",
    notFoundText: "Nous n'avons pas trouvé cette certification parmi les révisions disponibles.",
    emptyText: "Aucune révision disponible pour cette certification pour le moment.",
    metaDescription: (name: string) =>
      `Révisions rapides pour la certification ${name} : repassez les concepts clés avant le quiz.`,
  },
  es: {
    badge: "CertifyQuiz Reviews",
    available: (n: number) => `${n} repasos disponibles`,
    keyConcepts: "Conceptos clave",
    open: "Abrir repaso",
    backToList: "← Todos los repasos",
    notFoundTitle: "Certificación no encontrada",
    notFoundText: "No hemos encontrado esta certificación entre los repasos disponibles.",
    emptyText: "Todavía no hay repasos disponibles para esta certificación.",
    metaDescription: (name: string) =>
      `Repasos rápidos de la certificación ${name}: repasa los conceptos clave antes del quiz.`,
  },
} satisfies Record<Locale, Record<string, unknown>>;

const ogLocale = (lang: Locale) =>
  lang === "it" ? "it-IT" : lang === "en" ? "en-US" : lang === "fr" ? "fr-FR" : "es-ES";

export async function generateReviewsCertificationMetadata({
  lang,
  certSlug,
}: Props): Promise<Metadata> {
  const t = labels[lang];
  const { certification } = await getCertTopicReviews(certSlug, lang);

  if (!certification) {
    return { title: t.notFoundTitle, robots: { index: false, follow: true } };
  }

  const title = `${t.badge} — ${certification.name}`;
  const description = t.metaDescription(certification.name);
  const canonicalPath = reviewsCertPath(lang, certSlug);
  const canonical = `${SITE}${canonicalPath}`;

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    const localeKey =
      loc === "it" ? "it-IT" : loc === "en" ? "en-US" : loc === "fr" ? "fr-FR" : "es-ES";
    languages[localeKey] = `${SITE}${reviewsCertPath(loc, certSlug)}`;
  }
  languages["x-default"] = `${SITE}${reviewsCertPath("en", certSlug)}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CertifyQuiz",
      locale: ogLocale(lang),
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ReviewsCertificationIndexPage({ lang, certSlug }: Props) {
  const t = labels[lang];
  const { certification, items } = await getCertTopicReviews(certSlug, lang);

  if (!certification) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-950">{t.notFoundTitle}</h1>
        <p className="mt-3 text-slate-600">{t.notFoundText}</p>
        <Link href={reviewsPath(lang)} className="mt-6 inline-block text-blue-700 underline">
          {t.backToList}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-3xl bg-slate-950 px-5 py-6 text-white shadow-sm md:px-8 md:py-8">
        <p className="mb-3 inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-200">
          {t.badge}
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {certification.name}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
          {t.available(items.length)}
        </p>
      </section>

      <div className="mt-4">
        <Link href={reviewsPath(lang)} className="text-sm font-semibold text-blue-700 hover:text-blue-900">
          {t.backToList}
        </Link>
      </div>

      {items.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          {t.emptyText}
        </section>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const title = cleanReviewTitle(item.title, certification.name);

            return (
              <li
                key={item.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-5"
              >
                <div className="font-semibold text-slate-950">{title}</div>

                {item.keyConcepts.length > 0 && (
                  <div className="mt-1 text-sm text-slate-600">
                    {t.keyConcepts}: {item.keyConcepts.join(", ")}
                  </div>
                )}

                <Link
                  href={item.href}
                  className="mt-3 inline-flex text-sm font-extrabold text-blue-700 hover:text-blue-900"
                >
                  {t.open} →
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
