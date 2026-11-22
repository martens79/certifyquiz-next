// Risorse correlate mostrate SOLO sulla landing EN /certifications/ccna.
// Solo URL canoniche gia' indicizzabili (200, index, canonical su se stesse); nessun duplicato dei link gia' presenti
// nella landing (es. /blog/ccna-practice-questions-200-301, mock exam, quiz, roadmap). Nessuna modifica a IT/FR/ES.

export type CcnaRelatedResource = { href: string; label: string; description: string };

export const CCNA_EN_RELATED_RESOURCES_TITLE = "Related CCNA resources";

export const CCNA_EN_RELATED_RESOURCES: ReadonlyArray<CcnaRelatedResource> = [
  {
    href: "/blog/ccna-practice-test-free-2026",
    label: "CCNA practice test: free exam-style questions",
    description: "Free CCNA 200-301 practice with exam-style questions.",
  },
  {
    href: "/blog/best-free-ccna-practice-tests-in-2026-or-certifyquiz",
    label: "Best free CCNA practice tests in 2026",
    description: "Realistic CCNA quizzes, subnetting exercises and exam-style training.",
  },
  {
    href: "/blog/ccna-quiz-2026-test-your-200-301-knowledge",
    label: "CCNA quiz: test your 200-301 knowledge",
    description: "A free CCNA quiz with 20 original 200-301 questions.",
  },
  {
    href: "/blog/cisco-ccna-200-301-how-to-prepare-practice-and-pass-the-exam",
    label: "How to prepare for the CCNA 200-301 exam",
    description: "Practice quizzes, clear explanations and a study strategy.",
  },
];

export const CCNA_EN_REVIEWS_LINK: CcnaRelatedResource = {
  href: "/reviews/ccna",
  label: "CCNA quick reviews",
  description: "Key concepts to go through before the quiz.",
};
