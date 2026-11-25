// src/app/admin/question-preview/page.tsx — noindex ereditato da src/app/admin/layout.tsx
import { Suspense } from "react";
import QuestionPreviewClient from "./QuestionPreviewClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuestionPreviewClient />
    </Suspense>
  );
}
