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
  BadgeCheck,
  BarChart3,
  Lock,
  Sparkles,
} from "lucide-react";

/* Helpers */
function L(
  o: { it: string; en: string; fr: string; es: string },
  lang: Locale
) {
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

type Props = {
  lang?: Locale; // ✅ runtime-safe
  isLoggedIn?: boolean;
};

export default function Home({ lang, isLoggedIn = false }: Props) {
  // ✅ fallback sicuro: se per un render arriva undefined, non crasha
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

  const infoBoxes = [
    {
      icon: <BadgeCheck size={24} className="text-blue-600" aria-hidden="true" />,
      title: L(
        { it: "Quiz ufficiali", en: "Official quizzes", fr: "Quiz officiels", es: "Cuestionarios oficiales" },
        safeLang
      ),
      text: L(
        { it: "Contenuti sempre aggiornati e realistici.", en: "Always up-to-date and realistic content.", fr: "Contenu toujours à jour et réaliste.", es: "Contenido siempre actualizado y realista." },
        safeLang
      ),
    },
    {
      icon: <BarChart3 size={24} className="text-purple-600" aria-hidden="true" />,
      title: L(
        { it: "Progresso tracciato", en: "Progress tracking", fr: "Suivi des progrès", es: "Seguimiento del progreso" },
        safeLang
      ),
      text: L(
        { it: "Visualizza l'avanzamento per ogni categoria.", en: "Track your progress in each category.", fr: "Suivez vos progrès par catégorie.", es: "Consulta tu progreso por categoría." },
        safeLang
      ),
    },
    {
      icon: <Sparkles size={24} className="text-yellow-500" aria-hidden="true" />,
      title: L(
        { it: "Badge ufficiali", en: "Official badges", fr: "Badges officiels", es: "Insignias oficiales" },
        safeLang
      ),
      text: L(
        { it: "Raggiungi traguardi e condividili.", en: "Achieve and share milestones.", fr: "Atteignez et partagez vos objectifs.", es: "Alcanza y comparte tus logros." },
        safeLang
      ),
    },
    {
      icon: <Lock size={24} className="text-red-500" aria-hidden="true" />,
      title: L(
        { it: "3 argomenti inclusi", en: "3 topics included", fr: "3 sujets inclus", es: "3 temas incluidos" },
        safeLang
      ),
      text: L(
        { it: "Ogni certificazione inizia con 3 argomenti sbloccati.", en: "Each certification starts with 3 unlocked topics.", fr: "Chaque certification commence avec 3 sujets débloqués.", es: "Cada certificación empieza con 3 temas desbloqueados." },
        safeLang
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 overflow-x-hidden min-h-[100dvh]">
      {/* Header */}
      <header className="text-center">
        <div className="flex justify-center items-center gap-3 mb-2">
          <Image src={logo} alt="CertifyQuiz" width={40} height={40} className="h-10 w-auto" priority />
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">CertifyQuiz</h1>
        </div>

        <p className="text-base italic text-slate-500 mb-1">
          <span className="font-medium text-slate-600">Competence makes the difference</span>
        </p>
        <p className="text-xs md:text-sm font-semibold text-slate-600 mb-6">
          CompTIA ITF+, A+, Network+, Security+, CEH, CISSP, CCNA, Azure, AWS, EIPASS, ECDL, PEKIT e molte altre.
        </p>

        {/* CTA */}
        <div className="mt-6 mb-8 flex justify-center gap-4">
          <Link
            href={withLang(safeLang as any, "/quiz-home")}
            className="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-transform hover:scale-105"
          >
            {L({ it: "Esplora i quiz", en: "Explore quizzes", fr: "Explorer les quiz", es: "Explorar cuestionarios" }, safeLang)}
          </Link>

          {!isLoggedIn && (
            <Link
              href={withLang(safeLang as any, "/login")}
              className="inline-flex items-center rounded-xl border px-6 py-3 font-bold hover:bg-neutral-50 transition"
            >
              {L({ it: "Accedi", en: "Login", fr: "Se connecter", es: "Iniciar sesión" }, safeLang)}
            </Link>
          )}
        </div>
      </header>

      <BlogTeaser lang={safeLang as any} variant="inline" className="mb-4" />

      {/* Categorie */}
      <main className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 justify-center">
          {allCategories.map((cat) => {
            const ui = CATEGORY_UI[cat.key];
            return (
              <Link
                key={cat.key}
                href={categoryPath(safeLang, cat.key)}
                className={`transition p-3 rounded-xl shadow border ${ui.bg} ${ui.border} ${ui.ring} text-left text-sm`}
              >
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
                  {cat.icon}
                  <span className="text-sm leading-tight">{cat.title}</span>
                </div>
                <div className="text-xs text-slate-600 leading-tight line-clamp-2">{cat.desc}</div>
              </Link>
            );
          })}
        </div>

        {/* Link suggeriti */}
        <div className="text-center">
          <Link href={withLang(safeLang as any, "/quiz-suggeriti")} className="text-blue-600 font-medium hover:underline text-sm">
            ⭐{" "}
            {L({ it: "Prova i nostri migliori quiz →", en: "Try our best quizzes →", fr: "Essayez nos meilleurs quiz →", es: "Prueba nuestros mejores quizzes →" }, safeLang)}
          </Link>
        </div>
      </main>

      {/* Info boxes */}
      <section
        className="mt-6"
        aria-label={L({ it: "Perché scegliere CertifyQuiz", en: "Why choose CertifyQuiz", fr: "Pourquoi choisir CertifyQuiz", es: "Por qué elegir CertifyQuiz" }, safeLang)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {infoBoxes.map((box, i) => (
            <div key={i} className="bg-white border rounded-xl p-4 shadow-sm text-left flex items-start gap-3">
              {box.icon}
              <div>
                <h3 className="font-bold text-slate-800 text-sm md:text-base mb-1">{box.title}</h3>
                <p className="text-sm text-slate-600 leading-tight">{box.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
