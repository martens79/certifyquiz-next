import React from "react";
import { Link, useParams } from "react-router-dom";
import { getLabel, getCurrentLang } from "../utils/langUtils";
import { GraduationCap, Lock, Network, Cloud, Database, Code } from "lucide-react";

// costruisce "/<lang>/<relative>"
function buildLangPath(relative) {
  const lang = (getCurrentLang() || "it").replace(/^\/+|\/+$/g, "");
  const rel  = String(relative || "").replace(/^\/+/, "");
  return `/${lang}/${rel}`;
}

// Dati statici; i testi sono oggetti i18n e verranno risolti a runtime
const CATEGORIES = [
  {
    id: 1,
    i18n: { it: "Base", en: "Fundamentals", fr: "Bases", es: "Básicos" },
    icon: <GraduationCap size={24} />,
    accent: "ring-blue-300",
    path: "quiz/1/mixed",
  },
  {
    id: 2,
    i18n: { it: "Sicurezza", en: "Security", fr: "Sécurité", es: "Seguridad" },
    icon: <Lock size={24} />,
    accent: "ring-red-300",
    path: "quiz/2/mixed",
  },
  {
    id: 3,
    i18n: { it: "Reti", en: "Networking", fr: "Réseaux", es: "Redes" },
    icon: <Network size={24} />,
    accent: "ring-green-300",
    path: "quiz/3/mixed",
  },
  {
    id: 4,
    i18n: { it: "Cloud", en: "Cloud", fr: "Cloud", es: "Cloud" },
    icon: <Cloud size={24} />,
    accent: "ring-purple-300",
    path: "quiz/4/mixed",
  },
  {
    id: 5,
    i18n: { it: "Database", en: "Database", fr: "Bases de données", es: "Bases de datos" },
    icon: <Database size={24} />,
    accent: "ring-yellow-300",
    path: "quiz/5/mixed",
  },
  {
    id: 6,
    i18n: { it: "Programmazione", en: "Programming", fr: "Programmation", es: "Programación" },
    icon: <Code size={24} />,
    accent: "ring-indigo-300",
    path: "quiz/6/mixed",
  },
];

export default function SuggestedQuizzes() {
  // facoltativo: assicura il re-render quando cambia /:lang
  useParams();

  return (
    <div className="min-h-screen relative">
      {/* Sfondo blu sito */}
      <div className="absolute inset-0 -z-10 bg-[#0a1f44]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_55%)]" />

      <div className="max-w-6xl mx-auto px-4 pt-[calc(2vh+env(safe-area-inset-top))] pb-28">
        <div className="text-center mb-6">
          <h1 className="text-white text-2xl font-semibold mb-2">
            {getLabel({
              it: "Quiz suggeriti",
              en: "Suggested quizzes",
              fr: "Quiz suggérés",
              es: "Cuestionarios sugeridos",
            })}
          </h1>
          <p className="text-white/80 text-sm max-w-xl mx-auto">
            {getLabel({
              it: "Scopri i quiz misti consigliati per ciascuna categoria e inizia ad allenarti subito.",
              en: "Discover mixed quizzes for each category and start practicing now.",
              fr: "Découvrez des quiz mixtes par catégorie et commencez à vous entraîner.",
              es: "Descubre cuestionarios mixtos por categoría y empieza a practicar.",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const name = getLabel(cat.i18n); // <-- risolto a ogni render
            return (
              <div
                key={cat.id}
                className={`bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-md ring-1 ${cat.accent} hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="shrink-0 text-[#0a1f44]">{cat.icon}</div>
                  <h2 className="text-lg font-bold text-[#0a1f44]">{name}</h2>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  {getLabel({
                    it: "Domande miste prese da tutte le certificazioni della categoria.",
                    en: "Mixed questions from all certifications in this category.",
                    fr: "Questions mixtes de toutes les certifications de cette catégorie.",
                    es: "Preguntas mixtas de todas las certificaciones de esta categoría.",
                  })}
                </p>

                <Link
                  to={buildLangPath(cat.path)}
                  className="inline-flex items-center justify-center bg-[#fff] text-[#0a1f44] border border-slate-200 hover:bg-slate-50 font-semibold py-2 px-4 rounded-md text-sm transition"
                  aria-label={getLabel({ it: `Inizia ${name}`, en: `Start ${name}`, fr: `Commencer ${name}`, es: `Empezar ${name}` })}
                >
                  {getLabel({ it: "Inizia ora", en: "Start now", fr: "Commencer", es: "Empezar" })}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
