// src/app/[lang]/quiz/[slug]/ClientQuizRuntime.tsx
"use client";

import QuizPage, { type QuizPageProps } from "@/components/QuizPage";
// In alternativa, se preferisci il dynamic:
// import dynamic from "next/dynamic";
// const QuizPage = dynamic<QuizPageProps>(() => import("@/components/QuizPage"), { ssr: false });

export default function ClientQuizRuntime(props: QuizPageProps) {
  return <QuizPage {...props} />;
}
