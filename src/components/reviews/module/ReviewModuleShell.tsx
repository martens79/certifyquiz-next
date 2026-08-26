"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useReviewModuleProgress } from "@/lib/use-review-module-progress";
import { summarizeModuleProgress } from "@/lib/review-module-progress";
import { trackEventOnce, trackReviewModuleEvent, analyticsUserStateFrom } from "@/lib/analytics";
import ReviewModuleProgressHeader from "./ReviewModuleProgressHeader";
import ReviewModuleNav from "./ReviewModuleNav";
import ReviewModuleSectionCard from "./ReviewModuleSectionCard";
import { moduleLabels } from "./reviewModuleLabels";
import type { Locale } from "@/lib/quiz-types";
import type { ReviewModuleSection } from "@/lib/review-module-types";
import type { TopicReviewPage } from "@/lib/data";

type Props = {
  lang: Locale;
  review: TopicReviewPage;
  certSlug: string;
};

/**
 * Nuova UX Review a moduli: indice + lezione corrente + progresso, al posto
 * del blob Markdown unico. Renderizzato SOLO quando review.structure è
 * presente e review.locked === false (chiamante garantisce entrambe le
 * condizioni, vedi TopicReviewPageShell.tsx / ReviewPremiumContent.tsx) —
 * per una review locked il backend non manda mai body/microQuiz/assessment,
 * solo l'outline, quindi qui non c'è alcuna decisione di gating da
 * duplicare: se siamo qui, il contenuto è già legittimamente sbloccato.
 */
export default function ReviewModuleShell({ lang, review, certSlug }: Props) {
  const t = moduleLabels[lang];
  const { user } = useAuth();
  const sections = useMemo(() => (review.structure?.sections ?? []) as ReviewModuleSection[], [review.structure]);
  const progress = useReviewModuleProgress(review.id);

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!progress.ready || activeId) return;
    const resume = progress.state.currentSectionId;
    const valid = resume && sections.some((s) => s.id === resume);
    setActiveId(valid ? resume! : sections[0]?.id ?? null);
  }, [progress.ready, progress.state.currentSectionId, sections, activeId]);

  useEffect(() => {
    trackEventOnce(`review-module-started:${review.id}`, "review_module_started", {
      certification_slug: certSlug,
      review_slug: review.reviewSlug,
      language: lang,
      user_state: analyticsUserStateFrom(user),
    });
  }, [review.id, review.reviewSlug, certSlug, lang, user]);

  useEffect(() => {
    if (!activeId) return;
    trackReviewModuleEvent("review_section_started", {
      certification_slug: certSlug,
      review_slug: review.reviewSlug,
      section_id: activeId,
      language: lang,
      user_state: analyticsUserStateFrom(user),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  if (!progress.ready || !activeId) {
    return <div className="not-prose mt-5 h-40 animate-pulse rounded-2xl bg-slate-100" aria-hidden="true" />;
  }

  const completedIds = new Set(progress.state.completedSectionIds);
  const activeIndex = sections.findIndex((s) => s.id === activeId);
  const activeSection = sections[activeIndex] ?? sections[0];
  const { completed: completedCount, total: totalCount } = summarizeModuleProgress(
    sections.map((s) => s.id),
    progress.state.completedSectionIds
  );

  function goTo(id: string) {
    setActiveId(id);
    progress.setCurrentSection(id);
  }

  function markComplete(sectionId: string = activeSection.id) {
    progress.markSectionComplete(sectionId);
    trackReviewModuleEvent("review_section_completed", {
      certification_slug: certSlug,
      review_slug: review.reviewSlug,
      section_id: sectionId,
      language: lang,
      user_state: analyticsUserStateFrom(user),
    });
  }

  // "Successiva" segna completata la sezione che si sta lasciando prima di
  // avanzare: senza questo, chi naviga solo con Successiva non vede mai
  // avanzare il progresso (serviva un click separato su "Segna come
  // completato" per ogni sezione, non intuitivo). Il pulsante esplicito
  // resta comunque disponibile per chi vuole segnare senza spostarsi.
  function goNext() {
    if (activeIndex >= sections.length - 1) return;
    markComplete(activeSection.id);
    goTo(sections[activeIndex + 1].id);
  }

  return (
    <div>
      <ReviewModuleProgressHeader lang={lang} completed={completedCount} total={totalCount} />

      {progress.state.completed && (
        <p className="not-prose mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
          ✓ {t.moduleCompletedBadge}
        </p>
      )}

      <ReviewModuleNav lang={lang} sections={sections} activeId={activeSection.id} completedIds={completedIds} onSelect={goTo} />

      <ReviewModuleSectionCard
        lang={lang}
        section={activeSection}
        isCompleted={completedIds.has(activeSection.id)}
        isFirst={activeIndex === 0}
        isLast={activeIndex === sections.length - 1}
        reviewId={review.id}
        certSlug={certSlug}
        pageTopicId={review.topicId}
        pageCertificationId={review.certificationId}
        onPrev={() => activeIndex > 0 && goTo(sections[activeIndex - 1].id)}
        onNext={goNext}
        onMarkComplete={() => markComplete(activeSection.id)}
        onAssessmentFinish={(score, total) => {
          progress.setAssessmentResult(score, total);
          progress.markSectionComplete(activeSection.id);
          trackReviewModuleEvent("review_module_assessment_completed", {
            certification_slug: certSlug,
            review_slug: review.reviewSlug,
            section_id: activeSection.id,
            score,
            total,
            language: lang,
            user_state: analyticsUserStateFrom(user),
          });
        }}
        onFinishModule={() => {
          progress.markSectionComplete(activeSection.id);
          progress.markModuleComplete();
          trackReviewModuleEvent("review_module_completed", {
            certification_slug: certSlug,
            review_slug: review.reviewSlug,
            language: lang,
            user_state: analyticsUserStateFrom(user),
          });
        }}
      />
    </div>
  );
}
