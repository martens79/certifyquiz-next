// src/lib/review-module-types.ts
//
// Schema della struttura a moduli opzionale di una Review (vedi
// TopicReviewPage.structure in src/lib/data.ts). Mirror 1:1 di quanto il
// backend salva in topic_review_pages.structure_<lang> e restituisce (intero
// se sbloccata, redatto a {id,type,title} se locked — vedi
// publicStructurePreview in services/reviewFreemiumPolicy.js sul backend).
//
// Nessun campo qui è obbligatorio per la retrocompatibilità: una review
// legacy ha semplicemente structure = null e continua a renderizzare
// review.content come oggi.
//
// Contratto dati e regole editoriali complete: quiz_project/docs/review-structure-v1.md
// (source of truth, non duplicare qui). Golden sample: topic_id=229.

export type ReviewSectionType =
  | "intro"
  | "lesson"
  | "concept"
  | "comparison"
  | "practice"
  | "assessment"
  | "summary";

type ReviewSectionBase = {
  /** Stabile: usato come chiave di progresso (completedSectionIds), non ricalcolare da posizione/titolo. */
  id: string;
  type: ReviewSectionType;
  title: string;
};

export type ReviewMicroQuizRef = {
  /**
   * Topic da cui pescare UNA domanda reale a caso per il "verifica subito"
   * (nessuna domanda inventata). Opzionale dalla spec Review Structure v1:
   * se assente si deriva dal topic della pagina (vedi ReviewModuleShell).
   * Un JSON pre-v1 che lo valorizza esplicitamente resta valido.
   */
  topicId?: number;
};

export type ReviewIntroSection = ReviewSectionBase & {
  type: "intro";
  body: string; // markdown
};

/** Formato pre-v1 (pilota CCST Networking topic 229), superato da "concept" ma ancora renderizzato. */
export type ReviewLessonSection = ReviewSectionBase & {
  type: "lesson";
  body: string; // markdown
  microQuiz?: ReviewMicroQuizRef;
};

export type ReviewConceptSection = ReviewSectionBase & {
  type: "concept";
  body: string; // markdown ristretto, no heading/tabelle (vedi Review Structure v1 §2.4)
  microQuiz?: ReviewMicroQuizRef;
};

export type ReviewComparisonRow = { aspect: string; left: string; right: string };

export type ReviewComparisonSection = ReviewSectionBase & {
  type: "comparison";
  body?: string; // inquadramento opzionale, una o due frasi
  leftLabel: string;
  rightLabel: string;
  rows: ReviewComparisonRow[];
};

export type ReviewPracticeSection = ReviewSectionBase & {
  type: "practice";
  body: string; // markdown, scenario/caso pratico
  microQuiz?: ReviewMicroQuizRef;
};

export type ReviewAssessmentSection = ReviewSectionBase & {
  type: "assessment";
  /**
   * Opzionali dalla spec Review Structure v1: se assenti si derivano dal
   * topic/certificazione della pagina (vedi ReviewModuleShell). Un JSON
   * pre-v1 che li valorizza esplicitamente (come il pilota topic 229) resta
   * valido e ha precedenza.
   */
  topicId?: number;
  certificationId?: number;
  /** Numero di domande della valutazione finale (5-10 tipicamente). */
  questionLimit: number;
};

export type ReviewKeyTerm = { term: string; definition: string };

export type ReviewSummarySection = ReviewSectionBase & {
  type: "summary";
  keyPoints?: string[];
  keyTerms?: ReviewKeyTerm[];
  commonMistakes?: string[];
};

export type ReviewModuleSection =
  | ReviewIntroSection
  | ReviewLessonSection
  | ReviewConceptSection
  | ReviewComparisonSection
  | ReviewPracticeSection
  | ReviewAssessmentSection
  | ReviewSummarySection;

/**
 * Sezione redatta come arriva quando la review è locked: solo outline
 * (id/type/title), mai body/microQuiz/assessment/summary. Usata per
 * mostrare la nav anche a chi non ha ancora sbloccato la review.
 */
export type ReviewModuleSectionOutline = {
  id: string;
  type: ReviewSectionType;
  title: string;
};

export type ReviewModuleStructure = {
  version: number;
  sections: ReviewModuleSection[] | ReviewModuleSectionOutline[];
};

/** True solo se la sezione ha davvero un body renderizzabile (non un outline redatto). */
export function sectionHasBody(
  section: ReviewModuleSection | ReviewModuleSectionOutline
): section is ReviewIntroSection | ReviewLessonSection | ReviewConceptSection | ReviewPracticeSection {
  return (
    (section.type === "intro" || section.type === "lesson" || section.type === "concept" || section.type === "practice") &&
    "body" in section
  );
}
