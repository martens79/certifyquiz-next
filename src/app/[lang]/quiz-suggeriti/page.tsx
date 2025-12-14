// src/app/[lang]/quiz-suggeriti/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { withLang, type Locale, isLocale, locales } from "@/lib/i18n";
import {
  BookOpen,
  Laptop2,
  ShieldCheck,
  GraduationCap,
  School,
} from "lucide-react";

/* --------------------------- Config di pagina --------------------------- */

const SEO = {
  it: {
    title: "Quiz suggeriti — Da dove iniziare",
    description:
      "Non sai da dove iniziare? Ecco una selezione di certificazioni e quiz consigliati per livello e argomento, basata sui contenuti già presenti su CertifyQuiz.",
  },
  en: {
    title: "Suggested quizzes — Where to start",
    description:
      "Not sure where to start? Here is a selection of recommended certifications and quizzes by level and topic, based on the content already available on CertifyQuiz.",
  },
  fr: {
    title: "Quiz suggérés — Par où commencer",
    description:
      "Vous ne savez pas par où commencer ? Voici une sélection de certifications et de quiz recommandés par niveau et par thème, basée sur le contenu déjà disponible sur CertifyQuiz.",
  },
  es: {
    title: "Quiz sugeridos — Por dónde empezar",
    description:
      "¿No sabes por dónde empezar? Aquí tienes una selección de certificaciones y cuestionarios recomendados por nivel y tema, basada en el contenido ya disponible en CertifyQuiz.",
  },
} satisfies Record<Locale, { title: string; description: string }>;

/* ------------------------- Dati card suggerite ------------------------- */

type IconCode = "starter" | "pc" | "office" | "school" | "security";

type SuggestedItem = {
  slug: string;
  badge: Record<Locale, string>;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  // tag aggiuntivo (es. "Consigliato per chi inizia")
  tag?: Record<Locale, string>;
  icon: IconCode;
};

const SUGGESTED: SuggestedItem[] = [
  {
    slug: "comptia-itf-plus",
    icon: "starter",
    badge: {
      it: "Principianti",
      en: "Beginners",
      fr: "Débutants",
      es: "Principiantes",
    },
    title: {
      it: "CompTIA ITF+",
      en: "CompTIA ITF+",
      fr: "CompTIA ITF+",
      es: "CompTIA ITF+",
    },
    subtitle: {
      it: "Fondamenti assoluti di informatica.",
      en: "Absolute fundamentals of IT.",
      fr: "Bases absolues de l’informatique.",
      es: "Fundamentos absolutos de la informática.",
    },
    tag: {
      it: "Consigliato per chi inizia",
      en: "Perfect if you're starting",
      fr: "Idéal pour commencer",
      es: "Perfecto para empezar",
    },
  },
  {
    slug: "comptia-a-plus",
    icon: "pc",
    badge: {
      it: "Tecnico PC",
      en: "PC Technician",
      fr: "Technicien PC",
      es: "Técnico PC",
    },
    title: {
      it: "CompTIA A+",
      en: "CompTIA A+",
      fr: "CompTIA A+",
      es: "CompTIA A+",
    },
    subtitle: {
      it: "Supporto tecnico, hardware e troubleshooting.",
      en: "Technical support, hardware and troubleshooting.",
      fr: "Support technique, matériel et dépannage.",
      es: "Soporte técnico, hardware y resolución de problemas.",
    },
    tag: {
      it: "Per help desk e supporto",
      en: "For help desk & support",
      fr: "Pour le support technique",
      es: "Para soporte y help desk",
    },
  },
  {
    slug: "eipass-basic",
    icon: "office",
    badge: {
      it: "Utente office",
      en: "Digital skills",
      fr: "Compétences bureautiques",
      es: "Competencias digitales",
    },
    title: {
      it: "EIPASS Basic",
      en: "EIPASS Basic",
      fr: "EIPASS Basic",
      es: "EIPASS Basic",
    },
    subtitle: {
      it: "Competenze digitali di base per la scuola e il lavoro.",
      en: "Basic digital skills for school and work.",
      fr: "Compétences numériques de base pour l’école et le travail.",
      es: "Competencias digitales básicas para el estudio y el trabajo.",
    },
    tag: {
      it: "Consigliato per studenti",
      en: "Great for students",
      fr: "Parfait pour les étudiants",
      es: "Ideal para estudiantes",
    },
  },
  {
    slug: "ecdl",
    icon: "office",
    badge: {
      it: "Office",
      en: "Office",
      fr: "Office",
      es: "Office",
    },
    title: {
      it: "ECDL / ICDL",
      en: "ECDL / ICDL",
      fr: "ECDL / ICDL",
      es: "ECDL / ICDL",
    },
    subtitle: {
      it: "Percorso classico sulle competenze digitali.",
      en: "Classic path for essential digital skills.",
      fr: "Parcours classique pour les compétences numériques.",
      es: "Recorrido clásico sobre competencias digitales.",
    },
  },
  {
    slug: "pekit",
    icon: "school",
    badge: {
      it: "Scuola",
      en: "School",
      fr: "École",
      es: "Escuela",
    },
    title: {
      it: "PEKIT",
      en: "PEKIT",
      fr: "PEKIT",
      es: "PEKIT",
    },
    subtitle: {
      it: "Moduli sui fondamenti dell’uso del computer.",
      en: "Modules on basic computer usage.",
      fr: "Modules sur l’utilisation de base de l’ordinateur.",
      es: "Módulos sobre el uso básico del ordenador.",
    },
    tag: {
      it: "Adatto a ragazzi e scuole",
      en: "Good for schools & kids",
      fr: "Adapté aux écoles et aux jeunes",
      es: "Apto para escuelas y jóvenes",
    },
  },
  {
    slug: "comptia-security-plus",
    icon: "security",
    badge: {
      it: "Sicurezza",
      en: "Security",
      fr: "Sécurité",
      es: "Seguridad",
    },
    title: {
      it: "CompTIA Security+",
      en: "CompTIA Security+",
      fr: "CompTIA Security+",
      es: "CompTIA Security+",
    },
    subtitle: {
      it: "Primo passo per la sicurezza informatica.",
      en: "First step into cybersecurity.",
      fr: "Premier pas vers la cybersécurité.",
      es: "Primer paso en ciberseguridad.",
    },
    tag: {
      it: "Per chi ama la cybersecurity",
      en: "If you like cybersecurity",
      fr: "Si vous aimez la cybersécurité",
      es: "Si te gusta la ciberseguridad",
    },
  },
];

/* -------------------------- Helpers di traduzione -------------------------- */

function tr(obj: Record<Locale, string>, lang: Locale): string {
  return obj[lang] ?? obj.it;
}

function renderIcon(kind: IconCode) {
  const common = "h-5 w-5";
  switch (kind) {
    case "starter":
      return <BookOpen className={common} />;
    case "pc":
      return <Laptop2 className={common} />;
    case "office":
      return <GraduationCap className={common} />;
    case "school":
      return <School className={common} />;
    case "security":
      return <ShieldCheck className={common} />;
    default:
      return <BookOpen className={common} />;
  }
}

/* ------------------------------ Metadata ------------------------------ */

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> },
): Promise<Metadata> {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";
  const { title, description } = SEO[L];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* --------------------------- Static params SSG --------------------------- */

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/* --------------------------------- Page --------------------------------- */

export default async function SuggestedQuizzesPage(
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";
  const seo = SEO[L];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* HERO */}
        <section className="mb-6 rounded-3xl bg-gradient-to-r from-sky-100 via-indigo-50 to-emerald-50 border border-slate-200 px-6 py-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            {seo.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-slate-700">
            {seo.description}
          </p>
        </section>

        {/* GRID SUGGERITI */}
        <section className="space-y-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {L === "it" && "Percorsi consigliati"}
            {L === "en" && "Recommended paths"}
            {L === "fr" && "Parcours recommandés"}
            {L === "es" && "Recorridos recomendados"}
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SUGGESTED.map((item) => {
              const certHref = withLang(L, `/certificazioni/${item.slug}`);
              const quizHref = withLang(L, `/quiz/${item.slug}`);

              return (
                <article
                  key={item.slug}
                  className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200 shadow-sm px-5 py-4"
                >
                  <div className="flex items-start gap-3">
                    {/* Icona circolare */}
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90 text-white">
                      {renderIcon(item.icon)}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700">
                          {tr(item.badge, L)}
                        </span>
                        {item.tag && (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                            {tr(item.tag, L)}
                          </span>
                        )}
                      </div>

                      <h2 className="text-base font-semibold text-slate-900">
                        {tr(item.title, L)}
                      </h2>
                      <p className="text-sm text-slate-600">
                        {tr(item.subtitle, L)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={certHref}
                      className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                    >
                      {L === "it" && "Vai alla certificazione"}
                      {L === "en" && "View certification"}
                      {L === "fr" && "Voir la certification"}
                      {L === "es" && "Ver certificación"}
                    </Link>
                    <Link
                      href={quizHref}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
                    >
                      {L === "it" && "Vai ai quiz"}
                      {L === "en" && "Go to quizzes"}
                      {L === "fr" && "Aller aux quiz"}
                      {L === "es" && "Ir a los cuestionarios"}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CTA finale */}
        <section className="mt-8 flex flex-wrap gap-3">
          <Link
            href={withLang(L, "/quiz-home")}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            {L === "it" && "Vai alla pagina quiz"}
            {L === "en" && "Go to quiz page"}
            {L === "fr" && "Aller à la page quiz"}
            {L === "es" && "Ir a la página de quiz"}
          </Link>
          <Link
            href={withLang(L, "/certificazioni")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {L === "it" && "Vedi tutte le certificazioni"}
            {L === "en" && "View all certifications"}
            {L === "fr" && "Voir toutes les certifications"}
            {L === "es" && "Ver todas las certificaciones"}
          </Link>
        </section>
      </div>
    </main>
  );
}
