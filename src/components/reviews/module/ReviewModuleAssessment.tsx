"use client";

import QuizEngine from "@/components/quiz/QuizEngine";
import { useAuth } from "@/components/auth/AuthProvider";
import { getQuestionsByTopic, type Question as ApiQuestion } from "@/lib/apiClient";
import type { Question as UiQuestion, QuizSummary, Locale } from "@/lib/quiz-types";

function normalizeQuestion(q: ApiQuestion): UiQuestion {
  return {
    id: Number(q.id),
    question: q.question ?? "",
    explanation: q.explanation ?? undefined,
    questionType: q.question_type,
    blueprintDomain: q.blueprint_domain,
    blueprintObjectiveId: q.blueprint_objective_id,
    skillType: q.skill_type,
    exhibit: q.exhibit,
    answers: (q.answers ?? []).map((a) => ({
      id: Number(a.id),
      text: a.text ?? "",
      isCorrect: a.is_correct === true || a.is_correct === 1,
    })),
  };
}

type Props = {
  lang: Locale;
  reviewId: number;
  topicId: number;
  certificationId: number;
  certSlug: string;
  topicTitle: string;
  questionLimit: number;
  onFinish: (summary: { total: number; correct: number; scorePct: number }) => void;
};

/**
 * Valutazione finale del modulo: NON è un motore quiz nuovo, è lo stesso
 * QuizEngine già usato per topic/mixed/mock-exam, in modalità "assessment"
 * (la stessa già cablata in QuizTopicClient per /quiz/topic/:id?mode=assessment)
 * scoped alle domande del topic della review. Nessun comportamento degli
 * altri simulatori viene toccato: stessi props, stesso componente.
 */
export default function ReviewModuleAssessment({
  lang,
  reviewId,
  topicId,
  certificationId,
  certSlug,
  topicTitle,
  questionLimit,
  onFinish,
}: Props) {
  const { isPremiumUser, premiumLocked, user } = useAuth();

  return (
    <QuizEngine
      lang={lang}
      storageScope={`review-assessment:${reviewId}:${lang}`}
      mode="assessment"
      hideModeSwitch
      blockSize={questionLimit}
      limitsByMode={{ assessment: questionLimit }}
      durationsByMode={{ assessment: null }}
      context={{
        kind: "topic",
        certificationName: certSlug.toUpperCase(),
        certificationSlug: certSlug,
        certificationId,
        topicId,
        topicTitle,
        isPremiumUser,
        premiumLocked,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
      fetchQuestions={async (): Promise<UiQuestion[]> => {
        try {
          const res = await getQuestionsByTopic(topicId, lang, { limit: 500, shuffle: true, strict: lang !== "it" });
          const raw: ApiQuestion[] = Array.isArray(res) ? res : res.questions;
          return (raw ?? []).map(normalizeQuestion);
        } catch {
          return [];
        }
      }}
      onFinish={async (summary: QuizSummary & { mode: "training" | "exam" | "assessment" }) => {
        if (summary.mode !== "assessment") return;
        onFinish({ total: summary.total ?? 0, correct: summary.correct ?? 0, scorePct: summary.scorePct ?? 0 });
      }}
    />
  );
}
