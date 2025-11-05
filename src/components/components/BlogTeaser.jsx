import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, CalendarDays } from "lucide-react";

function getLangFromPath(pathname = window.location.pathname) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return ["it", "en", "fr", "es"].includes(seg) ? seg : "it";
}
function t(lang, map) {
  return map[lang] ?? map.it;
}
function formatDate(iso, lang) {
  try {
    const loc = lang === "en" ? "en-GB" : lang === "fr" ? "fr-FR" : lang === "es" ? "es-ES" : "it-IT";
    return new Date(iso).toLocaleDateString(loc, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return iso;
  }
}

// ⚠️ Metti qui SOLO post che esistono davvero nel tuo blog interno
const DEFAULT_POSTS = [
  {
    slug: "come-funziona-certifyquiz", // -> /it/blog/come-funziona-certifyquiz
    date: "2025-08-29",
    titles: {
      it: "Come funziona CertifyQuiz",
      en: "How CertifyQuiz works",
      fr: "Comment fonctionne CertifyQuiz",
      es: "Cómo funciona CertifyQuiz",
    },
    excerpt: {
      it: "Quiz online, spiegazioni e simulazioni d’esame: come funziona CertifyQuiz.",
      en: "Online quizzes, explanations and mock exams: how CertifyQuiz works.",
      fr: "Quiz en ligne, explications et examens blancs : fonctionnement de CertifyQuiz.",
      es: "Cuestionarios, explicaciones y simulacros: cómo funciona CertifyQuiz.",
    },
  },
];

export default function BlogTeaser({
  variant = "inline",    // "inline" | "cards"
  limit = 1,
  posts = DEFAULT_POSTS,
  className = "",
}) {
  const lang = getLangFromPath();
  const base = `/${lang}/blog`;
  const items = posts.slice(0, limit);

  if (!items.length) return null;

  /* ---------- Variante minimale: una riga elegante sotto l’hero ---------- */
  if (variant === "inline") {
    const p = items[0];
    return (
      <div
        className={
          "max-w-3xl mx-auto flex items-center justify-between rounded-xl border bg-white/70 px-3 py-2 text-sm " +
          className
        }
      >
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-slate-700 shrink-0">
            {t(lang, { it: "Dal blog", en: "From the blog", fr: "Du blog", es: "Del blog" })}:
          </span>
          <Link
            to={`${base}/${p.slug}`}
            className="font-medium text-blue-700 hover:underline truncate"
            title={t(lang, p.titles)}
          >
            {t(lang, p.titles)}
          </Link>
        </div>
        <Link
          to={base}
          className="hidden sm:inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 shrink-0"
        >
          {t(lang, { it: "Vedi tutti", en: "See all", fr: "Tout voir", es: "Ver todos" })}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  /* ---------- Variante a card compatte (per sidebar o griglia) ---------- */
  return (
    <section className={className}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          {t(lang, { it: "Dal blog", en: "From the blog", fr: "Du blog", es: "Del blog" })}
        </h2>
        <Link to={base} className="text-xs inline-flex items-center gap-1 hover:underline">
          {t(lang, {
            it: "Vedi tutti gli articoli",
            en: "See all posts",
            fr: "Voir tous les articles",
            es: "Ver todos los artículos",
          })}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link
            key={p.slug}
            to={`${base}/${p.slug}`}
            className="block rounded-xl border p-3 hover:shadow-md transition bg-white"
          >
            <div className="text-[11px] text-gray-500 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              <time dateTime={p.date}>{formatDate(p.date, lang)}</time>
            </div>
            <h3 className="mt-1 text-base font-semibold leading-snug">{t(lang, p.titles)}</h3>
            {p.excerpt && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{t(lang, p.excerpt)}</p>
            )}
            <span className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600">
              {t(lang, { it: "Leggi", en: "Read", fr: "Lire", es: "Leer" })}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
