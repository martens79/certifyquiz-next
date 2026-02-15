"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

import { withLang } from "@/lib/i18n";
import { categoryPath, type CategoryKey, type Locale } from "@/lib/paths";

import BlogTeaser from "@/components/BlogTeaser";
import logo from "@/../public/images/logo-certifyquiz.png";

import {
  BrainCircuit,
  LockKeyhole,
  Network,
  Cloud,
  Database,
  Code,
  Layers,
  Cpu,
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
  ];
const TRENDING_CERTS: Array<{
  key: string;
  title: string;
  desc: { it: string; en: string; fr: string; es: string };
  path: string; // path “base” senza prefisso lingua
}> = [
  {
    key: "ceh",
    title: "CEH",
    desc: {
      it: "Pensa come un hacker. Allenati con domande realistiche.",
      en: "Think like a hacker. Train with real exam questions.",
      fr: "Pensez comme un hacker. Entraînez-vous avec de vraies questions.",
      es: "Piensa como un hacker. Practica con preguntas reales.",
    },
    path: "/quiz/ceh",
  },
  {
    key: "securityplus",
    title: "Security+",
    desc: {
      it: "Costruisci solide basi di sicurezza informatica.",
      en: "Build strong cybersecurity foundations.",
      fr: "Construisez des bases solides en cybersécurité.",
      es: "Construye bases sólidas en ciberseguridad.",
    },
    path: "/quiz/security-plus",
  },
  {
    key: "isc2cc",
    title: "ISC2 CC",
    desc: {
      it: "Il primo passo nel mondo della cybersecurity.",
      en: "Your first step into cybersecurity.",
      fr: "Votre premier pas en cybersécurité.",
      es: "Tu primer paso en ciberseguridad.",
    },
    path: "/quiz/isc2-cc",
  },
];

  // ✅ helper hub href (coerente con la tua regola EN root)
  const hubHref = (slug: string) =>
    safeLang === "en" ? `/hub/${slug}` : `/${safeLang}/hub/${slug}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 overflow-x-hidden min-h-[100dvh]">
      {/* HERO (più compatta) */}
      <header className="text-center max-w-3xl mx-auto">
        <div className="flex justify-center items-center gap-3 mb-2">
          <Image
            src={logo}
            alt="CertifyQuiz"
            width={44}
            height={44}
            className="h-10 w-auto"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
            CertifyQuiz
          </h1>
        </div>

        <p className="text-sm md:text-base text-slate-600 font-semibold mb-2">
          {L(
            {
              it: "Allenati per le certificazioni IT con quiz realistici e spiegazioni chiare.",
              en: "Prepare for IT certifications with realistic quizzes and clear explanations.",
              fr: "Préparez vos certifications IT avec des quiz réalistes et des explications claires.",
              es: "Prepárate para certificaciones IT con cuestionarios realistas y explicaciones claras.",
            },
            safeLang
          )}
        </p>

        <p className="text-xs md:text-sm text-slate-500 mb-4">
          {L(
            {
              it: "AWS, CCNA, Security+, Azure, CompTIA e altre: scegli una categoria e inizia subito.",
              en: "AWS, CCNA, Security+, Azure, CompTIA and more: pick a category and start now.",
              fr: "AWS, CCNA, Security+, Azure, CompTIA et plus : choisissez une catégorie et commencez.",
              es: "AWS, CCNA, Security+, Azure, CompTIA y más: elige una categoría y empieza ya.",
            },
            safeLang
          )}
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          <Link
            href={`/${safeLang}/quiz-home`}
            className="inline-flex justify-center bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-transform hover:scale-[1.02]"
          >
            {L(
              {
                it: "Esplora i quiz",
                en: "Explore quizzes",
                fr: "Explorer les quiz",
                es: "Explorar cuestionarios",
              },
              safeLang
            )}
          </Link>

          {!isLoggedIn && (
            <Link
              href={withLang(safeLang as any, "/login")}
              className="inline-flex justify-center items-center rounded-xl border px-6 py-3 font-bold hover:bg-neutral-50 transition"
            >
              {L(
                {
                  it: "Accedi",
                  en: "Login",
                  fr: "Se connecter",
                  es: "Iniciar sesión",
                },
                safeLang
              )}
            </Link>
          )}
        </div>

        {/* Stats (compatte) */}
        {stats && (
          <p className="mt-3 text-xs md:text-sm text-slate-600">
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

        <p className="text-xs text-slate-500 mt-2">
          {L(
            {
              it: "I tuoi progressi vengono salvati nel profilo.",
              en: "Your progress is saved in your profile.",
              fr: "Vos progrès sont enregistrés dans votre profil.",
              es: "Tu progreso se guarda en tu perfil.",
            },
            safeLang
          )}
        </p>
      </header>

   {/* TRENDING CYBERSECURITY */}
<section className="mt-5 max-w-4xl mx-auto" aria-label="Trending cybersecurity">
  <div className="rounded-2xl border border-red-200 border-t-4 border-t-red-500 bg-white p-3 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-extrabold text-slate-800 flex items-center">
        🔥 {L(
          {
            it: "Trending Cybersecurity Exams",
            en: "Trending Cybersecurity Exams",
            fr: "Examens Cybersecurity en Tendance",
            es: "Exámenes de Ciberseguridad en Tendencia",
          },
          safeLang
        )}
        <span className="ml-2 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold tracking-wide">
          HOT
        </span>
      </h2>
    </div>

    <p className="text-xs text-slate-600 mb-3">
      {L(
        {
          it: "Le certificazioni che stanno generando più interesse in questo periodo.",
          en: "The certifications getting the most attention right now.",
          fr: "Les certifications qui attirent le plus d’intérêt en ce moment.",
          es: "Las certificaciones que más interés están generando ahora.",
        },
        safeLang
      )}
    </p>

    <div className="flex gap-3 overflow-x-auto pb-2">
      {TRENDING_CERTS.map((c) => (
        <Link
          key={c.key}
          href={withLang(safeLang as any, c.path)}
          className="min-w-[200px] bg-slate-50 border border-red-200 rounded-xl p-3 hover:shadow-md transition"
        >
          <div className="font-bold text-sm text-slate-800 mb-1">{c.title}</div>
          <div className="text-xs text-slate-600">{L(c.desc, safeLang)}</div>
        </Link>
      ))}
    </div>

    <div className="mt-2 text-right">
      <Link
        href={categoryPath(safeLang, "sicurezza")}
        className="text-xs font-semibold text-red-700 hover:underline"
      >
        {L(
          {
            it: "Vedi tutta la categoria Sicurezza →",
            en: "See the full Security category →",
            fr: "Voir toute la catégorie Sécurité →",
            es: "Ver toda la categoría Seguridad →",
          },
          safeLang
        )}
      </Link>
    </div>
  </div>
</section>




      {/* CATEGORIE (core) — margine ridotto per rientrare “sopra la piega” */}
      <section className="mt-5 md:mt-6" aria-label="Categories">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {allCategories.map((cat) => {
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

        {/* Link suggeriti */}
        <div className="text-center mt-5">
          <Link
            href={withLang(safeLang as any, "/quiz-suggeriti")}
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
{/* BLOG SECTION */}
<section className="mt-10 max-w-3xl mx-auto">
  <div className="rounded-xl border bg-slate-50 border-slate-200 p-4">
    <BlogTeaser
      lang={safeLang as any}
      variant="default"
      className="border-0 shadow-none w-full"
    />
  </div>
</section>

     
    </div>);
} 
