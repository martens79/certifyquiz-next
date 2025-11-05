// src/components/QuizTitle.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { getCurrentLang, getLabel } from "../utils/langUtils";

const motivationalQuotes = [
  {
    it: "Ogni quiz ti avvicina al traguardo 💪",
    en: "Every quiz brings you closer to your goal 💪",
    fr: "Chaque quiz te rapproche de ton objectif 💪",
    es: "Cada quiz te acerca a tu objetivo 💪",
  },
  {
    it: "Studia oggi, vinci domani 🚀",
    en: "Study today, win tomorrow 🚀",
    fr: "Étudie aujourd’hui, gagne demain 🚀",
    es: "Estudia hoy, gana mañana 🚀",
  },
  {
    it: "Anche 10 minuti fanno la differenza ⏱️",
    en: "Even 10 minutes make a difference ⏱️",
    fr: "Même 10 minutes font la différence ⏱️",
    es: "Incluso 10 minutos marcan la diferencia ⏱️",
  },
  {
    it: "Fai qualcosa oggi per il tuo futuro 🔧",
    en: "Do something today for your future 🔧",
    fr: "Fais quelque chose aujourd’hui pour ton avenir 🔧",
    es: "Haz algo hoy por tu futuro 🔧",
  },
  {
    it: "Sfida te stesso, un quiz alla volta 🧠",
    en: "Challenge yourself, one quiz at a time 🧠",
    fr: "Défie-toi, un quiz à la fois 🧠",
    es: "Desafíate, un quiz a la vez 🧠",
  },
  {
    it: "È l’impegno quotidiano che fa la differenza 📘",
    en: "Daily effort makes the difference 📘",
    fr: "L’effort quotidien fait la différence 📘",
    es: "El esfuerzo diario marca la diferencia 📘",
  },
];

const QuizTitle = () => {
  const lang = getCurrentLang();
  const location = useLocation();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const random = Math.floor(Math.random() * motivationalQuotes.length);
    const candidate = motivationalQuotes[random];
    // fallback sicuro se mancasse una lingua
    setQuote(candidate[lang] ?? candidate.it);
  }, [lang, location.pathname]); // 🔁 cambia al cambio lingua/route

  return (
    <div className="text-center mb-10 animate-fadeInDown overflow-visible">
      <div className="flex justify-center items-end gap-2 mb-2">
        <GraduationCap size={32} className="text-blue-600" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 tracking-tight leading-[1.35] pb-[10px]">
          {getLabel({
            it: "Scegli da dove iniziare",
            en: "Choose where to start",
            fr: "Choisissez par où commencer",
            es: "Elige por dónde empezar",
          })}
        </h1>
      </div>
      <p className="mt-4 text-sm md:text-base text-gray-600 italic">{quote}</p>
    </div>
  );
};

export default QuizTitle;
