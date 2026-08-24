"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  EMPTY_PROGRESS,
  type ReviewModuleProgressState,
  loadLocalProgress,
  saveLocalProgress,
  fetchServerProgress,
  saveServerProgress,
} from "@/lib/review-module-progress";

/**
 * Stato di progresso di UN modulo review (sezioni completate, sezione
 * corrente, punteggio valutazione), con la stessa politica del resto del
 * sito: anonimo -> solo localStorage, autenticato -> server come sorgente
 * di verità (con localStorage come cache/fallback se la request fallisce).
 */
export function useReviewModuleProgress(reviewId: number) {
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;

  const [state, setState] = useState<ReviewModuleProgressState>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (authLoading) return;
    let alive = true;
    setReady(false);

    (async () => {
      const local = loadLocalProgress(reviewId);
      const initial = isAuthenticated ? (await fetchServerProgress(reviewId)) ?? local ?? EMPTY_PROGRESS : local ?? EMPTY_PROGRESS;
      if (!alive) return;
      setState(initial);
      stateRef.current = initial;
      setReady(true);
    })();

    return () => {
      alive = false;
    };
  }, [reviewId, isAuthenticated, authLoading]);

  const persist = useCallback(
    (next: ReviewModuleProgressState) => {
      setState(next);
      stateRef.current = next;
      saveLocalProgress(reviewId, next);
      if (isAuthenticated) void saveServerProgress(reviewId, next);
    },
    [reviewId, isAuthenticated]
  );

  const setCurrentSection = useCallback(
    (sectionId: string) => {
      persist({ ...stateRef.current, currentSectionId: sectionId });
    },
    [persist]
  );

  const markSectionComplete = useCallback(
    (sectionId: string) => {
      const prev = stateRef.current;
      const completedSectionIds = prev.completedSectionIds.includes(sectionId)
        ? prev.completedSectionIds
        : [...prev.completedSectionIds, sectionId];
      persist({ ...prev, completedSectionIds, currentSectionId: sectionId });
    },
    [persist]
  );

  const markModuleComplete = useCallback(() => {
    persist({ ...stateRef.current, completed: true });
  }, [persist]);

  const setAssessmentResult = useCallback(
    (score: number, total: number) => {
      persist({ ...stateRef.current, assessmentScore: score, assessmentTotal: total });
    },
    [persist]
  );

  return {
    ready,
    state,
    setCurrentSection,
    markSectionComplete,
    markModuleComplete,
    setAssessmentResult,
  };
}
