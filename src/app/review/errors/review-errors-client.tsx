"use client";

import { useMemo } from "react";
import QuizEngine from "@/components/quiz/QuizEngine";
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
  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (certificationId) p.set("certificationId", certificationId);
    if (topicId) p.set("topicId", topicId);
    p.set("limit", limit || "20");
    return p.toString();
  }, [certificationId, topicId, limit]);

  const fetchQuestions = async (): Promise<Question[]> => {
    const token = typeof window !== "undefined" ? getAccessToken() : "";

    const r = await fetch(`/api/backend/user/error-review?${qs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

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
