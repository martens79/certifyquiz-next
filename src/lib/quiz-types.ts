// ============================================================
// 📘 Tipi condivisi per il motore quiz
// ============================================================

export type Locale = 'it' | 'en' | 'fr' | 'es';

export type Answer = {
  id: number | string;
  text: string;
  isCorrect?: boolean; // true solo per la risposta giusta (in training/exam)
};

export type Question = {
  id: number | string;
  question: string;
  explanation?: string | null;
  answers: Answer[];
};

export type QuizSummary = {
  total: number; // numero totale domande
  correct: number; // numero risposte corrette
  scorePct: number; // percentuale 0–100
  marked: Record<string | number, string | number | null>; // qId -> answerId scelto
  durationSec: number; // tempo totale in secondi
};
