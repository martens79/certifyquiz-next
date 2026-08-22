import type { Metadata } from "next";
import Link from "next/link";
import { getCertTopicReviews, type Locale } from "@/lib/data";
import { certPath, reviewsCertPath, reviewsPath, roadmapPath } from "@/lib/paths";
import ReviewAccessList from "@/components/reviews/ReviewAccessList";

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
    heading: (name: string) => `${name}: ripassi rapidi`,
    intro: (name: string) => `Rivedi i concetti chiave di ${name}, poi verifica la preparazione con i quiz dedicati.`,
    certificationLink: "Pagina certificazione",
    quizLink: "Quiz della certificazione",
    roadmapLink: "Roadmap correlata",
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
    heading: (name: string) => `${name} Quick Reviews`,
    intro: (name: string) => `Review the key ${name} concepts, then test your understanding with the related practice quizzes.`,
    certificationLink: "Certification page",
    quizLink: "Practice quizzes",
    roadmapLink: "Related roadmap",
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
    heading: (name: string) => `${name} : révisions rapides`,
    intro: (name: string) => `Révisez les concepts clés de ${name}, puis testez vos connaissances avec les quiz associés.`,
    certificationLink: "Page de certification",
    quizLink: "Quiz de certification",
    roadmapLink: "Roadmap associée",
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
    heading: (name: string) => `${name}: repasos rápidos`,
    intro: (name: string) => `Repasa los conceptos clave de ${name} y después comprueba tu preparación con los cuestionarios relacionados.`,
    certificationLink: "Página de certificación",
    quizLink: "Cuestionarios de certificación",
    roadmapLink: "Roadmap relacionada",
  },
} satisfies Record<Locale, Record<string, unknown>>;

const ogLocale = (lang: Locale) =>
  lang === "it" ? "it-IT" : lang === "en" ? "en-US" : lang === "fr" ? "fr-FR" : "es-ES";

function relatedRoadmap(certSlug: string): "networking" | "cybersecurity" | null {
  if (["ccna", "cisco-ccst-networking", "comptia-network-plus", "ccnp-enterprise", "networking-foundations"].includes(certSlug)) return "networking";
  if (["isc2-cc", "cisco-ccst-cybersecurity", "security-plus", "ceh", "cissp", "cybersecurity-foundations"].includes(certSlug)) return "cybersecurity";
  return null;
}

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

  const roadmap = relatedRoadmap(certSlug);
  const quizSlug = certSlug === "ccna" ? "ccna" : certSlug;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-3xl bg-slate-950 px-5 py-6 text-white shadow-sm md:px-8 md:py-8">
        <p className="mb-3 inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-200">
          {t.badge}
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {t.heading(certification.name)}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
          {t.intro(certification.name)} {t.available(items.length)}.
        </p>

        <nav className="mt-4 flex flex-wrap gap-4 text-sm font-semibold" aria-label={certification.name}>
          <Link href={certPath(lang, certSlug)} className="text-blue-200 hover:text-white">{t.certificationLink} →</Link>
          <Link href={`/${lang}/quiz/${quizSlug}`} className="text-blue-200 hover:text-white">{t.quizLink} →</Link>
          {roadmap && <Link href={roadmapPath(lang, roadmap)} className="text-blue-200 hover:text-white">{t.roadmapLink} →</Link>}
        </nav>
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
        <ReviewAccessList lang={lang} certSlug={certSlug} certificationName={certification.name} initialItems={items} keyConceptsLabel={t.keyConcepts} openLabel={t.open} />
      )}
    </main>
  );
}
