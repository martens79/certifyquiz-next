// src/components/home/HomeFeatureCarousel.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Lang = "it" | "en" | "fr" | "es";

type FeatureCard = {
  eyebrow: string;
  badge?: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  items: string[];
  tone: "red" | "blue" | "green" | "purple" | "orange" | "slate";
};

type Props = {
  lang?: Lang;
};

const localizedPrefix = (lang: Lang) => (lang === "en" ? "" : `/${lang}`);

function T(o: { it: string; en: string; fr: string; es: string }, lang: Lang) {
  return o[lang] ?? o.it;
}

const getSlides = (lang: Lang): FeatureCard[][] => {
  const p = localizedPrefix(lang);

  const certSegment = T(
    {
      it: "certificazioni",
      en: "certifications",
      fr: "certifications",
      es: "certificaciones",
    },
    lang
  );

  const categorySegment = T(
    {
      it: "categorie",
      en: "categories",
      fr: "categories",
      es: "categorias",
    },
    lang
  );

  const pathsSegment = T(
    {
      it: "percorsi",
      en: "paths",
      fr: "parcours",
      es: "rutas",
    },
    lang
  );

  return [
    [
      {
        eyebrow: "🔥 TRENDING",
        badge: "HOT",
        title: T(
          {
            it: "Trending Cybersecurity Exams",
            en: "Trending Cybersecurity Exams",
            fr: "Examens Cybersecurity en tendance",
            es: "Exámenes de Ciberseguridad en tendencia",
          },
          lang
        ),
        description: T(
          {
            it: "Le certificazioni che stanno generando più interesse in questo periodo.",
            en: "The certifications getting the most attention right now.",
            fr: "Les certifications qui attirent le plus d’intérêt actuellement.",
            es: "Las certificaciones que están generando más interés actualmente.",
          },
          lang
        ),
        href: `${p}/${categorySegment}/sicurezza`,
        cta: T(
          {
            it: "Vedi sicurezza →",
            en: "See security →",
            fr: "Voir sécurité →",
            es: "Ver seguridad →",
          },
          lang
        ),
        items: ["CISSP", "Cisco CCST Cyber", "CEH", "Security+"],
        tone: "red",
      },
      {
        eyebrow: "🎯 TRENDING PATHS",
        title: T(
          {
            it: "Percorsi certificazioni",
            en: "Certification paths",
            fr: "Parcours de certifications",
            es: "Rutas de certificación",
          },
          lang
        ),
        description: T(
          {
            it: "Scegli una roadmap chiara e capisci quale certificazione seguire.",
            en: "Choose a clear roadmap and understand which certification to follow.",
            fr: "Choisissez une roadmap claire et comprenez quelle certification suivre.",
            es: "Elige una roadmap clara y descubre qué certificación seguir.",
          },
          lang
        ),
        href: `${p}/${pathsSegment}`,
        cta: T(
          {
            it: "Vedi tutti →",
            en: "See all →",
            fr: "Voir tout →",
            es: "Ver todo →",
          },
          lang
        ),
        items: ["Cybersecurity", "Cloud", "Networking", "AI"],
        tone: "blue",
      },
    ],

    [
      {
        eyebrow: "🆓 FREE FOUNDATIONS",
        badge: "FREE",
        title: T(
          {
            it: "Nuove Foundations gratuite",
            en: "New free Foundations",
            fr: "Nouvelles Foundations gratuites",
            es: "Nuevas Foundations gratuitas",
          },
          lang
        ),
        description: T(
          {
            it: "Parti dalle basi con certificazioni gratuite by CertifyQuiz.",
            en: "Start from the basics with free CertifyQuiz certifications.",
            fr: "Commencez par les bases avec des certifications gratuites CertifyQuiz.",
            es: "Empieza desde lo básico con certificaciones gratuitas de CertifyQuiz.",
          },
          lang
        ),
        href: `${p}/${certSegment}/ai-foundations`,
        cta: T(
          {
            it: "Inizia gratis →",
            en: "Start free →",
            fr: "Commencer gratuitement →",
            es: "Empezar gratis →",
          },
          lang
        ),
        items: ["AI", "Cloud", "Cybersecurity", "Networking", "Data Analytics"],
        tone: "green",
      },
      {
        eyebrow: "📊 NEW AREA",
        badge: "NEW",
        title: "Data & Analytics",
        description: T(
          {
            it: "Nuova area con Data Analytics Foundations, DP-900 e PL-300 Power BI.",
            en: "New area with Data Analytics Foundations, DP-900 and PL-300 Power BI.",
            fr: "Nouvelle section avec Data Analytics Foundations, DP-900 et PL-300 Power BI.",
            es: "Nueva área con Data Analytics Foundations, DP-900 y PL-300 Power BI.",
          },
          lang
        ),
        href: `${p}/${categorySegment}/data-analytics`,
        cta: T(
          {
            it: "Esplora Data →",
            en: "Explore Data →",
            fr: "Explorer Data →",
            es: "Explorar Data →",
          },
          lang
        ),
        items: ["Data Foundations", "DP-900", "PL-300", "SQL"],
        tone: "purple",
      },
    ],

    [
      {
        eyebrow: "🧭 START HERE",
        title: T(
          {
            it: "Scopri il tuo livello",
            en: "Discover your level",
            fr: "Découvrez votre niveau",
            es: "Descubre tu nivel",
          },
          lang
        ),
        description: T(
          {
            it: "Fai un test gratuito e capisci da dove iniziare senza perdere tempo.",
            en: "Take a free test and understand where to start.",
            fr: "Faites un test gratuit et découvrez par où commencer.",
            es: "Haz una prueba gratuita y descubre por dónde empezar.",
          },
          lang
        ),
        href: `${p}/free-test`,
        cta: T(
          {
            it: "Avvia il test →",
            en: "Start the test →",
            fr: "Commencer le test →",
            es: "Iniciar el test →",
          },
          lang
        ),
        items: [
          T(
            {
              it: "Test gratuito",
              en: "Free test",
              fr: "Test gratuit",
              es: "Test gratuito",
            },
            lang
          ),
          T(
            {
              it: "Risultato immediato",
              en: "Instant result",
              fr: "Résultat immédiat",
              es: "Resultado inmediato",
            },
            lang
          ),
          T(
            {
              it: "Percorso consigliato",
              en: "Suggested path",
              fr: "Parcours conseillé",
              es: "Ruta sugerida",
            },
            lang
          ),
        ],
        tone: "orange",
      },
      {
        eyebrow: "🏢 VENDOR HUBS",
        title: T(
          {
            it: "Hub vendor",
            en: "Vendor hubs",
            fr: "Hubs fournisseurs",
            es: "Hubs de vendors",
          },
          lang
        ),
        description: T(
          {
            it: "Trova rapidamente certificazioni Microsoft, Cisco, AWS, Google e Oracle.",
            en: "Quickly find Microsoft, Cisco, AWS, Google and Oracle certifications.",
            fr: "Trouvez rapidement les certifications Microsoft, Cisco, AWS, Google et Oracle.",
            es: "Encuentra rápidamente certificaciones Microsoft, Cisco, AWS, Google y Oracle.",
          },
          lang
        ),
        href: `${p}/hub`,
        cta: T(
          {
            it: "Apri gli hub →",
            en: "Open hubs →",
            fr: "Ouvrir les hubs →",
            es: "Abrir hubs →",
          },
          lang
        ),
        items: ["Microsoft", "Cisco", "AWS", "Google", "Oracle"],
        tone: "slate",
      },
    ],
  ];
};

const toneClasses: Record<FeatureCard["tone"], string> = {
  red: "border-red-200 shadow-red-100/70 hover:border-red-300",
  blue: "border-blue-200 shadow-blue-100/70 hover:border-blue-300",
  green: "border-emerald-200 shadow-emerald-100/70 hover:border-emerald-300",
  purple: "border-violet-200 shadow-violet-100/70 hover:border-violet-300",
  orange: "border-orange-200 shadow-orange-100/70 hover:border-orange-300",
  slate: "border-slate-200 shadow-slate-100/70 hover:border-slate-300",
};

export default function HomeFeatureCarousel({ lang = "it" }: Props) {
  const slides = useMemo(() => getSlides(lang), [lang]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[active];

  return (
    <section className="mx-auto mt-8 w-full max-w-6xl px-4">
      <div className="grid gap-4 md:grid-cols-2">
        {currentSlide.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`group rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${toneClasses[card.tone]}`}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-blue-700">
                {card.eyebrow}
              </span>

              {card.badge && (
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  {card.badge}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
              {card.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {card.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {card.items.map((item) => (
                <span
                  key={item}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 text-right text-sm font-bold text-blue-700 transition group-hover:text-blue-800">
              {card.cta}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            aria-label={T(
              {
                it: `Vai alla slide ${index + 1}`,
                en: `Go to slide ${index + 1}`,
                fr: `Aller à la slide ${index + 1}`,
                es: `Ir a la slide ${index + 1}`,
              },
              lang
            )}
            className={`h-2.5 rounded-full transition-all ${
              active === index ? "w-8 bg-blue-600" : "w-2.5 bg-slate-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}