// src/components/quiz/QuizTutorContext.tsx
"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type QuizTutorData = {
  question: string | null;
  userAnswer: string | null;
  correctAnswer: string | null;
  topicTitle: string | null;
  certificationName: string | null;
};

type QuizTutorContextValue = {
  quizTutorData: QuizTutorData | null;
  setQuizTutorData: (data: QuizTutorData | null) => void;
};

const QuizTutorCtx = createContext<QuizTutorContextValue | null>(null);

export function QuizTutorProvider({ children }: { children: React.ReactNode }) {
  const [quizTutorData, setQuizTutorData] = useState<QuizTutorData | null>(null);

  const value = useMemo(
    () => ({ quizTutorData, setQuizTutorData }),
    [quizTutorData]
  );

  return <QuizTutorCtx.Provider value={value}>{children}</QuizTutorCtx.Provider>;
}

export function useQuizTutor() {
  const ctx = useContext(QuizTutorCtx);
  if (!ctx) throw new Error("useQuizTutor must be used inside <QuizTutorProvider>");
  return ctx;
}
