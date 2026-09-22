"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import QuizEngine from "@/components/quiz/QuizEngine";
import { pricingPath } from "@/lib/paths";
import type { Locale } from "@/lib/i18n";
import type { Question } from "@/lib/quiz-types";

type ApiAnswer = {
  id: number;
  answer_text: string;
  answer_text_en?: string | null;
  answer_text_fr?: string | null;
  answer_text_es?: string | null;

  // può arrivare dal DB come 0/1, "0"/"1", true/false
  is_correct?: boolean | number | string;

  // se un giorno lo mandi già camelCase
  isCorrect?: boolean;
};

type ApiQuestion = {
  id: number;

  // IT
  question: string;

  // traduzioni
  question_en?: string | null;
  question_fr?: string | null;
  question_es?: string | null;

  // IT + traduzioni
  explanation?: string | null;
  explanation_en?: string | null;
  explanation_fr?: string | null;
  explanation_es?: string | null;

  // evidenza tecnica: gia' normalizzata dal backend per `lang`
  exhibit?: Question["exhibit"];

  answers: ApiAnswer[];
};

function asBool(v: any) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") return v === "1" || v.toLowerCase() === "true";
  return !!v;
}

function pickLangText(
  lang: Locale,
  row: { it?: string | null; en?: string | null; fr?: string | null; es?: string | null },
  fallbackIt = ""
) {
  const v =
    lang === "it"
      ? row.it
      : lang === "fr"
      ? row.fr
      : lang === "es"
      ? row.es
      : row.en;

  return (v ?? "").trim() || (fallbackIt ?? "").trim() || "";
}

function getAccessToken(): string {
  try {
    return localStorage.getItem("cq:access") || "";
  } catch {
    return "";
  }
}

export default function ReviewErrorsClient({
  lang,
  certificationId,
  topicId,
  limit,
}: {
  lang: Locale;
  certificationId?: string;
  topicId?: string;
  limit?: string;
}) {
  // Paywall Phase 2: il Ripasso Errori e' Premium e lo decide il SERVER
  // (401 anonimo, 403 senza Premium). La pagina riflette la risposta del
  // server invece di mostrare un errore generico; non e' lei la protezione.
  const [denied, setDenied] = useState<401 | 403 | null>(null);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (certificationId) p.set("certificationId", certificationId);
    if (topicId) p.set("topicId", topicId);
    p.set("limit", limit || "20");
    p.set("lang", lang);
    return p.toString();
  }, [certificationId, topicId, limit, lang]);

  const fetchQuestions = async (): Promise<Question[]> => {
    const token = typeof window !== "undefined" ? getAccessToken() : "";

    const r = await fetch(`/api/backend/user/error-review?${qs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (r.status === 401 || r.status === 403) {
      setDenied(r.status);
      return [];
    }

    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.error || "Fetch error-review failed");

    const items: ApiQuestion[] = Array.isArray(data?.items) ? data.items : [];

    const mapped: Question[] = items.map((q) => {
      const questionText = pickLangText(
        lang,
        { it: q.question, en: q.question_en, fr: q.question_fr, es: q.question_es },
        q.question || ""
      );

      const explanationText = pickLangText(
        lang,
        {
          it: q.explanation ?? "",
          en: q.explanation_en ?? "",
          fr: q.explanation_fr ?? "",
          es: q.explanation_es ?? "",
        },
        q.explanation ?? ""
      );

      const answers = (Array.isArray(q.answers) ? q.answers : []).map((a) => {
        const text = pickLangText(
          lang,
          {
            it: a.answer_text,
            en: a.answer_text_en,
            fr: a.answer_text_fr,
            es: a.answer_text_es,
          },
          a.answer_text || ""
        );

        return {
          id: a.id,
          text,
          isCorrect: asBool(a.isCorrect ?? a.is_correct),
        };
      });

      return {
        id: q.id,
        question: questionText,
        explanation: explanationText ? explanationText : null,
        exhibit: q.exhibit ?? null,
        answers,
      } as unknown as Question;
    });

    return mapped;
  };

  const title =
    lang === "it"
      ? "Ripasso errori"
      : lang === "fr"
      ? "Révision des erreurs"
      : lang === "es"
      ? "Repaso de errores"
      : "Error review";

  const backLabel =
    lang === "it"
      ? "← Profilo"
      : lang === "fr"
      ? "← Profil"
      : lang === "es"
      ? "← Perfil"
      : "← Profile";

  if (denied) {
    const copy = {
      it: {
        title: "Il Ripasso errori è incluso in Premium",
        body: "Rivedi le domande che hai sbagliato con le spiegazioni complete e concentrati sui tuoi punti deboli.",
        login: "Accedi per continuare",
        cta: "Scopri Premium",
      },
      en: {
        title: "Error review is included in Premium",
        body: "Go back over the questions you got wrong with full explanations and focus on your weak spots.",
        login: "Log in to continue",
        cta: "Explore Premium",
      },
      fr: {
        title: "La révision des erreurs est incluse dans Premium",
        body: "Revois les questions ratées avec les explications complètes et concentre-toi sur tes points faibles.",
        login: "Connecte-toi pour continuer",
        cta: "Découvrir Premium",
      },
      es: {
        title: "El repaso de errores está incluido en Premium",
        body: "Repasa las preguntas que fallaste con las explicaciones completas y céntrate en tus puntos débiles.",
        login: "Inicia sesión para continuar",
        cta: "Ver Premium",
      },
    }[lang] ?? {
      title: "Error review is included in Premium",
      body: "Go back over the questions you got wrong with full explanations and focus on your weak spots.",
      login: "Log in to continue",
      cta: "Explore Premium",
    };
    const href =
      denied === 401
        ? `/${lang}/login?redirect=${encodeURIComponent(`/${lang}/review/errors`)}`
        : `${pricingPath(lang)}?source=error_review_gate`;
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="mt-3 font-semibold text-slate-900">{copy.title}</p>
          <p className="mt-2 text-sm text-slate-600">{copy.body}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={href}
              className="inline-flex min-h-11 items-center rounded-lg bg-emerald-600 px-4 font-semibold text-white hover:bg-emerald-700"
            >
              {denied === 401 ? copy.login : copy.cta}
            </Link>
            <Link
              href={`/${lang}/profile`}
              className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 font-semibold text-slate-700"
            >
              {backLabel}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <QuizEngine
      lang={lang}
      fetchQuestions={fetchQuestions}
      storageScope={`error-review:${lang}:${certificationId || "all"}:${topicId || "all"}`}
      initialMode="training"
      backToHref={`/${lang}/profile`}
      context={{
        kind: "mixed",
        certificationName: title,
        backHref: `/${lang}/profile`,
        backLabel,
      } as any}
    />
  );
}
