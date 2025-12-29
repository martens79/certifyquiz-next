// src/app/suggested/page.tsx
// EN root alias for Suggested Quizzes (SEO-friendly URL: /suggested)
// Reuses the existing localized page implementation at /[lang]/quiz-suggeriti

import SuggestedQuizzesPage from "@/app/[lang]/quiz-suggeriti/page";

export default function SuggestedEN() {
  // We render the same page forcing lang="en"
  return <SuggestedQuizzesPage params={Promise.resolve({ lang: "en" })} />;
}
