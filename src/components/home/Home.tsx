"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

import { withLang } from "@/lib/i18n";
import { categoryPath, certificationsPath, type CategoryKey, type Locale } from "@/lib/paths";
import { trackEvent } from "@/lib/analytics";

import BlogTeaser from "@/components/BlogTeaser";
import logo from "@/../public/images/logo-certifyquiz.png";
import PathBox from "@/components/home/PathBox";
import HomeFeatureCarousel from "@/components/home/HomeFeatureCarousel";
import ResourceTypesSection from "@/components/home/ResourceTypesSection";
import BrandLineBand from "@/components/home/BrandLineBand";
import NextChapterSection from "@/components/home/NextChapterSection";
import AssessmentEntrySection from "@/components/home/AssessmentEntrySection";
import MethodSection from "@/components/home/MethodSection";
import {
  BrainCircuit,
  LockKeyhole,
  Network,
  Cloud,
  Database,
  Code,
  Layers,
  Cpu,
  BriefcaseBusiness,
  BarChart3,
  Boxes,
} from "lucide-react";

/* Helpers */
function L(o: { it: string; en: string; fr: string; es: string }, lang: Locale) {
  return o[lang] ?? o.it;
}

/* Colori coerenti (statici, no classi dinamiche Tailwind) */
const CATEGORY_UI: Record<
  Exclude<CategoryKey, "default">,
  { bg: string; border: string; ring: string }
> = {
  base: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    ring: "hover:ring-2 hover:ring-blue-200/60",
  },
  sicurezza: {
    bg: "bg-red-50",
    border: "border-red-200",
    ring: "hover:ring-2 hover:ring-red-200/60",
  },
  reti: {
    bg: "bg-green-50",
    border: "border-green-200",
    ring: "hover:ring-2 hover:ring-green-200/60",
  },
  cloud: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    ring: "hover:ring-2 hover:ring-purple-200/60",
  },
  database: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    ring: "hover:ring-2 hover:ring-yellow-200/60",
  },
  programmazione: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    ring: "hover:ring-2 hover:ring-indigo-200/60",
  },
  virtualizzazione: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    ring: "hover:ring-2 hover:ring-orange-200/60",
  },
  ai: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    ring: "hover:ring-2 hover:ring-cyan-200/60",
  },
    management: {
    bg: "bg-slate-50",
    border: "border-slate-300",
    ring: "hover:ring-2 hover:ring-slate-300/60",

    },
  "data-analytics": {
    bg: "bg-teal-50",
    border: "border-teal-200",
    ring: "hover:ring-2 hover:ring-teal-200/60",
  },
  "business-applications": {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    ring: "hover:ring-2 hover:ring-emerald-200/60",
  },
  foundations: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    ring: "hover:ring-2 hover:ring-indigo-200/60",
  },
} as const;

export type HomeStats = {
  questions: number;
  topics: number;
  certifications: number;
};

type Props = {
  lang?: Locale;
  isLoggedIn?: boolean;
  stats?: HomeStats;
};

export default function Home({ lang, isLoggedIn = false, stats }: Props) {
  const safeLang: Locale =
    lang === "it" || lang === "en" || lang === "fr" || lang === "es"
      ? lang
      : "en";

  const allCategories: Array<{
    key: Exclude<CategoryKey, "default">;
    icon: React.ReactNode;
    title: string;
    desc: string;
  }> = [
    {
      key: "base",
      icon: <BrainCircuit size={20} aria-hidden="true" />,
      title: L({ it: "Base", en: "Basic", fr: "Bases", es: "Básico" }, safeLang),
      desc: L(
        {
          it: "Competenze digitali di base e alfabetizzazione informatica.",
          en: "Basic digital and computer literacy skills.",
          fr: "Compétences numériques de base et culture informatique.",
          es: "Competencias digitales básicas y alfabetización informatica.",
        },
        safeLang
      ),
    },
    {
      key: "sicurezza",
      icon: <LockKeyhole size={20} aria-hidden="true" />,
      title: L(
        { it: "Sicurezza", en: "Security", fr: "Sécurité", es: "Seguridad" },
        safeLang
      ),
      desc: L(
        {
          it: "Protezione dei dati, minacce informatiche e prevenzione.",
          en: "Data protection, cyber threats and prevention.",
          fr: "Protection des données, menaces et prévention.",
          es: "Protección de datos, amenazas cibernéticas y prevención.",
        },
        safeLang
      ),
    },
    {
      key: "reti",
      icon: <Network size={20} aria-hidden="true" />,
      title: L(
        { it: "Reti", en: "Networking", fr: "Réseaux", es: "Redes" },
        safeLang
      ),
      desc: L(
        {
          it: "Fondamenti di reti, protocolli e infrastrutture.",
          en: "Networking fundamentals, protocols and infrastructure.",
          fr: "Bases des réseaux, protocoles et infrastructures.",
          es: "Fundamentos de redes, protocolos e infraestructuras.",
        },
        safeLang
      ),
    },
    {
      key: "ai",
      icon: <Cpu size={20} aria-hidden="true" />,
      title: L(
        {
          it: "Intelligenza Artificiale",
          en: "Artificial Intelligence",
          fr: "Intelligence Artificielle",
          es: "Inteligencia Artificial",
        },
        safeLang
      ),
      desc: L(
        {
          it: "Concetti base di AI, machine learning e applicazioni.",
          en: "Basics of AI, machine learning and applications.",
          fr: "Bases de l'IA, apprentissage automatique et applications.",
          es: "Conceptos básicos de IA, aprendizaje automático y aplicaciones.",
        },
        safeLang
      ),
    },
    {
      key: "cloud",
      icon: <Cloud size={20} aria-hidden="true" />,
      title: "Cloud",
      desc: L(
        {
          it: "Servizi cloud, modelli di distribuzione e sicurezza.",
          en: "Cloud services, deployment models and security.",
          fr: "Services cloud, modèles de déploiement et sécurité.",
          es: "Servicios en la nube, modelos de implementación y seguridad.",
        },
        safeLang
      ),
    },
    {
      key: "database",
      icon: <Database size={20} aria-hidden="true" />,
      title: "Database",
      desc: L(
        {
          it: "Modellazione, interrogazione e gestione dei dati.",
          en: "Modeling, querying and managing data.",
          fr: "Modélisation, requêtes et gestion des données.",
          es: "Modelado, consultas y gestión de datos.",
        },
        safeLang
      ),
    },
    {
      key: "programmazione",
      icon: <Code size={20} aria-hidden="true" />,
      title: L(
        {
          it: "Programmazione",
          en: "Programming",
          fr: "Programmation",
          es: "Programación",
        },
        safeLang
      ),
      desc: L(
        {
          it: "Logica di programmazione e linguaggi moderni.",
          en: "Programming logic and modern languages.",
          fr: "Logique de programmation et langages modernes.",
          es: "Lógica de programación y lenguajes modernos.",
        },
        safeLang
      ),
    },
    {
      key: "virtualizzazione",
      icon: <Layers size={20} aria-hidden="true" />,
      title: L(
        {
          it: "Virtualizzazione",
          en: "Virtualization",
          fr: "Virtualisation",
          es: "Virtualización",
        },
        safeLang
      ),
      desc: L(
        {
          it: "Tecnologie di virtualizzazione e ambienti cloud-native.",
          en: "Virtualization technologies and cloud-native environments.",
          fr: "Technologies de virtualisation et environnements cloud-native.",
          es: "Tecnologías de virtualización y entornos cloud-native.",
        },
        safeLang
      ),
    },
        {
      key: "management",
      icon: <BriefcaseBusiness size={20} aria-hidden="true" />,
      title: L(
        {
          it: "Management",
          en: "Management",
          fr: "Management",
          es: "Management",
        },
        safeLang
      ),
      desc: L(
        {
          it: "Project management, leadership, Agile e organizzazione aziendale.",
          en: "Project management, leadership, Agile and business organization.",
          fr: "Gestion de projet, leadership, Agile et organisation d’entreprise.",
          es: "Gestión de proyectos, liderazgo, Agile y organización empresarial.",
        },
        safeLang
      ),
    },
    {
      key: "business-applications",
      icon: <Boxes size={20} aria-hidden="true" />,
      title: "Business Applications",
      desc: L(
        {
          it: "ERP, CRM, finanza, HR, analytics e processi aziendali.",
          en: "ERP, CRM, finance, HR, analytics and business processes.",
          fr: "ERP, CRM, finance, RH, analytique et processus métier.",
          es: "ERP, CRM, finanzas, RR. HH., analítica y procesos empresariales.",
        },
        safeLang
      ),
    },
    {
  key: "data-analytics",
  icon: <BarChart3 size={20} aria-hidden="true" />,
  title: L(
    {
      it: "Data & Analytics",
      en: "Data & Analytics",
      fr: "Data & Analytics",
      es: "Datos y Analítica",
    },
    safeLang
  ),
  desc: L(
    {
      it: "Power BI, SQL, dashboard, KPI, analisi dati e business intelligence.",
      en: "Power BI, SQL, dashboards, KPI, data analysis and business intelligence.",
      fr: "Power BI, SQL, tableaux de bord, KPI et analyse de données.",
      es: "Power BI, SQL, dashboards, KPI y análisis de datos.",
    },
    safeLang
  ),
},
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 overflow-x-hidden min-h-[100dvh]">
      {/* HERO */}
      <header className="text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-3">
          <Image
            src={logo}
            alt="CertifyQuiz"
            width={40}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
          {L(
            {
              it: "Quiz e simulazioni per le certificazioni IT",
              en: "Practice Quizzes and Exam Simulations for IT Certifications",
              fr: "Quiz et simulations d'examen pour les certifications IT",
              es: "Tests y simulacros de examen para certificaciones IT",
            },
            safeLang
          )}
        </h1>

        <p className="mt-3 text-lg md:text-xl font-medium text-slate-700">
          {L(
            {
              it: "Sei davvero pronto per l'esame? Non scoprirlo il giorno dell'esame.",
              en: "Are you really ready for the exam? Don't find out on exam day.",
              fr: "Êtes-vous vraiment prêt pour l'examen ? Ne l'apprenez pas le jour J.",
              es: "¿Estás realmente preparado para el examen? No lo descubras el día del examen.",
            },
            safeLang
          )}
        </p>

        <p className="mt-3 text-sm md:text-base text-slate-600">
          {L(
            {
              it: "Mettiti alla prova prima: quiz, simulazioni, assessment e pratica per capire dove sei preparato — e dove no.",
              en: "Test yourself first: quizzes, simulations, assessments and hands-on practice to see where you're ready — and where you're not.",
              fr: "Testez-vous avant : quiz, simulations, évaluations et pratique pour savoir où vous êtes prêt — et où vous ne l'êtes pas.",
              es: "Ponte a prueba antes: tests, simulacros, evaluaciones y práctica para saber dónde estás preparado — y dónde no.",
            },
            safeLang
          )}
        </p>

        {stats && (
          <p className="mt-4 text-xs md:text-sm text-slate-600">
            {L(
              {
                it: `${stats.questions.toLocaleString("it-IT")} domande • ${stats.topics.toLocaleString(
                  "it-IT"
                )} topic • ${stats.certifications.toLocaleString("it-IT")} certificazioni`,
                en: `${stats.questions.toLocaleString("en-US")} questions • ${stats.topics.toLocaleString(
                  "en-US"
                )} topics • ${stats.certifications.toLocaleString("en-US")} certifications`,
                fr: `${stats.questions.toLocaleString("fr-FR")} questions • ${stats.topics.toLocaleString(
                  "fr-FR"
                )} sujets • ${stats.certifications.toLocaleString("fr-FR")} certifications`,
                es: `${stats.questions.toLocaleString("es-ES")} preguntas • ${stats.topics.toLocaleString(
                  "es-ES"
                )} temas • ${stats.certifications.toLocaleString("es-ES")} certificaciones`,
              },
              safeLang
            )}
          </p>
        )}

        <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          <Link
            href={`/${safeLang}/quiz-home`}
            onClick={() => trackEvent("homepage_primary_cta_clicked", {
              language: safeLang,
              user_state: isLoggedIn ? "free" : "anonymous",
              source_page: "homepage",
              content_type: "readiness_assessment",
            })}
            className="inline-flex justify-center bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-transform hover:scale-[1.02]"
          >
            {L(
              {
                it: "Scopri se sei pronto",
                en: "Find out if you're ready",
                fr: "Découvrez si vous êtes prêt",
                es: "Descubre si estás preparado",
              },
              safeLang
            )}
          </Link>

          {!isLoggedIn && (
            <Link
              href={certificationsPath(safeLang)}
              className="inline-flex justify-center items-center rounded-xl border px-6 py-3 font-bold hover:bg-neutral-50 transition"
            >
              {L(
                {
                  it: "Esplora le certificazioni",
                  en: "Browse certifications",
                  fr: "Explorer les certifications",
                  es: "Explorar certificaciones",
                },
                safeLang
              )}
            </Link>
          )}
        </div>

        <p className="mt-3 text-sm text-neutral-600">
          {L(
            {
              it: "Inizi gratis. Ogni risposta sbagliata arriva con il ragionamento, non solo con la correzione.",
              en: "Start free. Every wrong answer comes with the reasoning, not just the correction.",
              fr: "Commencez gratuitement. Chaque mauvaise réponse est accompagnée du raisonnement, pas seulement de la correction.",
              es: "Empieza gratis. Cada respuesta incorrecta viene con el razonamiento, no solo con la corrección.",
            },
            safeLang
          )}
        </p>
      </header>

      <BrandLineBand lang={safeLang} />

      <NextChapterSection lang={safeLang} />

      <AssessmentEntrySection lang={safeLang} />

      <MethodSection lang={safeLang} />

      <ResourceTypesSection lang={safeLang} />

{/* PATH BOX — guida l’utente che non sa da dove iniziare */}
<PathBox lang={safeLang} />

      <HomeFeatureCarousel lang={safeLang} />


      {/* BLOG SECTION — spostata più in alto e resa più visibile */}
      <section className="mt-5 md:mt-6 max-w-5xl mx-auto" aria-label="Blog">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide">
                📝{" "}
                {L(
                  {
                    it: "Dal blog",
                    en: "From the blog",
                    fr: "Depuis le blog",
                    es: "Del blog",
                  },
                  safeLang
                )}
              </div>

              <h2 className="text-lg md:text-xl font-extrabold text-slate-800">
                {L(
                  {
                    it: "Guide e articoli per imparare meglio",
                    en: "Guides and articles to learn faster",
                    fr: "Guides et articles pour mieux apprendre",
                    es: "Guías y artículos para aprender mejor",
                  },
                  safeLang
                )}
              </h2>

              <p className="text-xs md:text-sm text-slate-600 mt-1">
                {L(
                  {
                    it: "Approfondimenti pratici collegati ai topic e alle certificazioni del sito.",
                    en: "Practical articles connected to your certification topics and quiz paths.",
                    fr: "Articles pratiques liés aux sujets et parcours de certification du site.",
                    es: "Artículos prácticos conectados con los temas y rutas de certificación del sitio.",
                  },
                  safeLang
                )}
              </p>
            </div>

            <Link
              href={withLang(safeLang, "/blog")}
              className="text-sm font-semibold text-blue-700 hover:underline whitespace-nowrap"
            >
              {L(
                {
                  it: "Vedi tutti →",
                  en: "See all →",
                  fr: "Voir tout →",
                  es: "Ver todos →",
                },
                safeLang
              )}
            </Link>
          </div>

          <BlogTeaser
  lang={safeLang}
  variant="home"
  limit={2}
/>
        </div>
      </section>

     {/* CATEGORIE */}
<section className="mt-5 md:mt-6" aria-label="Categories">
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {allCategories
      .filter(
  (cat) =>
    cat.key !== "management" &&
    cat.key !== "business-applications" &&
    cat.key !== "data-analytics"
)
      .map((cat) => {
        const ui = CATEGORY_UI[cat.key];

        return (
          <Link
            key={cat.key}
            href={categoryPath(safeLang, cat.key)}
            className={`transition p-3 rounded-xl shadow border ${ui.bg} ${ui.border} ${ui.ring} text-left`}
          >
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
              {cat.icon}
              <span className="text-sm leading-tight">{cat.title}</span>
            </div>

            <div className="text-xs text-slate-600 leading-tight line-clamp-2">
              {cat.desc}
            </div>
          </Link>
        );
      })}
  </div>

  <div className="grid md:grid-cols-3 gap-3 mt-3">
  {allCategories
    .filter(
      (cat) =>
        cat.key === "management" ||
        cat.key === "business-applications" ||
        cat.key === "data-analytics"
    )
    .map((cat) => {
      const ui = CATEGORY_UI[cat.key];

      return (
  <Link
    key={cat.key}
    href={categoryPath(safeLang, cat.key)}
    className={`mt-3 flex items-center justify-between gap-4 transition p-4 rounded-xl shadow border ${ui.bg} ${ui.border} ${ui.ring} text-left`}
  >
    <div className="flex items-center gap-3">
      <div className="shrink-0 text-slate-800">{cat.icon}</div>

      <div>
        <div className="text-sm font-bold text-slate-800">
          {cat.title}
        </div>

        <div className="text-xs text-slate-600 leading-tight">
          {cat.desc}
        </div>
      </div>
    </div>

    <span className="hidden sm:inline text-xs font-semibold text-slate-600">
      {cat.key === "management"
        ? L(
            {
              it: "Project manager, Agile, leadership →",
              en: "Project managers, Agile, leadership →",
              fr: "Gestion de projet, Agile, leadership →",
              es: "Gestión de proyectos, Agile, liderazgo →",
            },
            safeLang
          )
        : cat.key === "business-applications"
        ? L(
            {
              it: "ERP, CRM, HR e analytics →",
              en: "ERP, CRM, HR and analytics →",
              fr: "ERP, CRM, RH et analytique →",
              es: "ERP, CRM, RR. HH. y analítica →",
            },
            safeLang
          )
        : L(
            {
              it: "Power BI, SQL, KPI, dashboard →",
              en: "Power BI, SQL, KPI, dashboards →",
              fr: "Power BI, SQL, KPI, dashboards →",
              es: "Power BI, SQL, KPI, dashboards →",
            },
            safeLang
          )}
    </span>
  </Link>
);
    })}
    </div>
{/* FOUNDATIONS */}
<Link
  href={categoryPath(safeLang, "foundations")}
  className="mt-4 block w-full rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 shadow-sm hover:ring-2 hover:ring-indigo-200/60 transition"
>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div className="max-w-3xl">
      <div className="text-xs font-bold uppercase tracking-wide text-indigo-700">
        {L(
          {
            it: "GRATIS • CERTIFYQUIZ",
            en: "FREE • CERTIFYQUIZ",
            fr: "GRATUIT • CERTIFYQUIZ",
            es: "GRATIS • CERTIFYQUIZ",
          },
          safeLang
        )}
      </div>

      <h3 className="mt-1 text-xl font-extrabold text-slate-800">
        🚀 Foundations by CertifyQuiz
      </h3>

      <p className="mt-2 text-sm text-slate-600">
        {L(
          {
            it: "Parti dalle basi con le certificazioni gratuite create da CertifyQuiz.",
            en: "Start with free beginner certifications created by CertifyQuiz.",
            fr: "Commencez par les bases avec des certifications gratuites créées par CertifyQuiz.",
            es: "Empieza desde lo básico con certificaciones gratuitas creadas por CertifyQuiz.",
          },
          safeLang
        )}
      </p>
    </div>

    <span className="shrink-0 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white">
      {L(
        {
          it: "Esplora Foundations →",
          en: "Explore Foundations →",
          fr: "Explorer Foundations →",
          es: "Explorar Foundations →",
        },
        safeLang
      )}
    </span>
  </div>
</Link>
  <div className="text-center mt-5">
    <Link
      href={withLang(safeLang, "/quiz-suggeriti")}
      className="text-blue-600 font-semibold hover:underline text-sm"
    >
      ⭐{" "}
      {L(
        {
          it: "Prova i nostri migliori quiz →",
          en: "Try our best quizzes →",
          fr: "Essayez nos meilleurs quiz →",
          es: "Prueba nuestros mejores quizzes →",
        },
        safeLang
      )}
    </Link>
  </div>
</section>
    </div>
  );
}
