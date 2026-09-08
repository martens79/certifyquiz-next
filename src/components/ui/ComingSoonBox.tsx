"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;

  /** Motivo per cui il quiz non è disponibile. */
  reason?: "translation" | "content";

  /** lingua fallback per studiare subito (di solito "en") */
  fallbackLang?: Locale;

  /**
   * link “continua comunque” (es: pagina EN della stessa cosa)
   * Consigliato passarlo SEMPRE dalla pagina chiamante, es:
   *  fallbackHref={`/en/quiz/${slug}/mixed`}
   */
  fallbackHref?: string;

  /** link alternativo (es: lista certificazioni nella lingua attuale) */
  browseHref?: string;

  /** opzionale: titolo custom per casi specifici */
  title?: string;

  /** opzionale: descrizione custom per casi specifici */
  description?: string;
};

const COPY: Record<
  Locale,
  {
    title: string;
    desc: string;
    bullets: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  }
> = {
  it: {
    title: "🚧 Contenuto in arrivo",
    desc: "Questa pagina non è ancora disponibile in italiano: stiamo lavorando alla traduzione.",
    bullets: [
      "Torna tra poco: il contenuto sta arrivando.",
      "Nel frattempo puoi usare una lingua alternativa.",
      "I tuoi progressi saranno salvati se sei loggato.",
    ],
    ctaPrimary: "Vai alla versione alternativa",
    ctaSecondary: "Sfoglia altre certificazioni",
  },
  en: {
    title: "🚧 Coming soon",
    desc: "This content isn’t available in English yet — we’re working on the translation.",
    bullets: [
      "Check back soon: it’s on the way.",
      "In the meantime you can use another language.",
      "Your progress is saved if you’re logged in.",
    ],
    ctaPrimary: "Open the alternative version",
    ctaSecondary: "Browse other certifications",
  },
  fr: {
    title: "🚧 Bientôt disponible",
    desc: "Ce contenu n’est pas encore disponible en français : la traduction est en cours.",
    bullets: [
      "Revenez bientôt : ça arrive.",
      "En attendant, vous pouvez utiliser une autre langue.",
      "Vos progrès sont sauvegardés si vous êtes connecté.",
    ],
    ctaPrimary: "Ouvrir la version alternative",
    ctaSecondary: "Voir d’autres certifications",
  },
  es: {
    title: "🚧 Próximamente",
    desc: "Este contenido aún no está disponible en español: la traducción está en marcha.",
    bullets: [
      "Vuelve pronto: ya llega.",
      "Mientras tanto, puedes usar otro idioma.",
      "Tu progreso se guarda si has iniciado sesión.",
    ],
    ctaPrimary: "Abrir la versión alternativa",
    ctaSecondary: "Ver otras certificaciones",
  },
};

const CONTENT_COPY: Record<
  Locale,
  { title: string; desc: string; bullets: string[]; ctaSecondary: string }
> = {
  it: {
    title: "🚧 Quiz in preparazione",
    desc: "Le domande per questa certificazione sono in preparazione e saranno pubblicate prossimamente.",
    bullets: [
      "Le pagine degli argomenti sono già disponibili per consultare il programma.",
      "Stiamo preparando domande e spiegazioni in stile esame.",
      "Torna presto per iniziare ad allenarti.",
    ],
    ctaSecondary: "Sfoglia altre certificazioni",
  },
  en: {
    title: "🚧 Quiz in preparation",
    desc: "Questions for this certification are being prepared and will be published soon.",
    bullets: [
      "The topic pages are already available for reviewing the syllabus.",
      "We are preparing exam-style questions and explanations.",
      "Check back soon to start practicing.",
    ],
    ctaSecondary: "Browse other certifications",
  },
  fr: {
    title: "🚧 Quiz en préparation",
    desc: "Les questions pour cette certification sont en cours de préparation et seront bientôt publiées.",
    bullets: [
      "Les pages des sujets sont déjà disponibles pour consulter le programme.",
      "Nous préparons des questions et des explications de type examen.",
      "Revenez bientôt pour commencer à vous entraîner.",
    ],
    ctaSecondary: "Voir d'autres certifications",
  },
  es: {
    title: "🚧 Cuestionario en preparación",
    desc: "Las preguntas para esta certificación se están preparando y se publicarán próximamente.",
    bullets: [
      "Las páginas de los temas ya están disponibles para consultar el programa.",
      "Estamos preparando preguntas y explicaciones de estilo examen.",
      "Vuelve pronto para empezar a practicar.",
    ],
    ctaSecondary: "Ver otras certificaciones",
  },
};

export default function ComingSoonBox({
  lang,
  reason = "translation",
  fallbackLang = "en",
  fallbackHref,
  browseHref,
  title,
  description,
}: Props) {
  const t = COPY[lang] ?? COPY.en;
  const content = CONTENT_COPY[lang] ?? CONTENT_COPY.en;
  const isContentPending = reason === "content";

  // ✅ IMPORTANTE: nei quiz TUTTE le lingue hanno prefisso (/en, /fr, /es, /it)
  // Quindi il default sensato è mandare all’homepage quiz della lingua fallback (se non passi fallbackHref).
  const primaryHref = fallbackHref ?? `/${fallbackLang}/quiz`;
  const secondaryHref = browseHref ?? `/${lang}/certificazioni`;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-10 w-10 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center">
            <span className="text-lg">✨</span>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">
              {title ?? (isContentPending ? content.title : t.title)}
            </h2>

            <p className="mt-2 text-slate-600">
              {description ?? (isContentPending ? content.desc : t.desc)}
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {(isContentPending ? content.bullets : t.bullets).map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 text-slate-400">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-3">
              {!isContentPending && (
                <Link
                  href={primaryHref}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  {t.ctaPrimary}
                </Link>
              )}

              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                {isContentPending ? content.ctaSecondary : t.ctaSecondary}
              </Link>
            </div>

            <div className="mt-3 text-xs text-slate-500">
              {!isContentPending && lang !== fallbackLang ? (
                <>
                  {lang.toUpperCase()} → {fallbackLang.toUpperCase()}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
