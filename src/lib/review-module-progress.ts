// src/lib/review-module-progress.ts
//
// Persistenza del progresso di una Review strutturata a moduli.
// - Utente anonimo: solo localStorage (stesso principio di quiz-storage.ts).
// - Utente autenticato: server (via apiFetch, /reviews/:id/progress) come
//   sorgente di verità, con localStorage come cache/fallback best-effort.
// Nessuna nuova infrastruttura: riusa il pattern già in uso per il resume
// del quiz (autosave locale) e per le altre chiamate autenticate del sito.

import { apiFetch } from "@/lib/auth";

export type ReviewModuleProgressState = {
  completedSectionIds: string[];
  currentSectionId: string | null;
  completed: boolean;
  assessmentScore: number | null;
  assessmentTotal: number | null;
};

export const EMPTY_PROGRESS: ReviewModuleProgressState = {
  completedSectionIds: [],
  currentSectionId: null,
  completed: false,
  assessmentScore: null,
  assessmentTotal: null,
};

const KEY = (reviewId: number) => `cq:review-progress:${reviewId}`;

export function loadLocalProgress(reviewId: number): ReviewModuleProgressState | null {
  try {
    const raw = localStorage.getItem(KEY(reviewId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.completedSectionIds)) return null;
    return { ...EMPTY_PROGRESS, ...parsed };
  } catch {
    return null;
  }
}

export function saveLocalProgress(reviewId: number, state: ReviewModuleProgressState) {
  try {
    localStorage.setItem(KEY(reviewId), JSON.stringify(state));
  } catch {
    // best-effort, come quiz-storage.ts
  }
}

export async function fetchServerProgress(reviewId: number): Promise<ReviewModuleProgressState | null> {
  try {
    const res = await apiFetch(`/reviews/${reviewId}/progress`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      completedSectionIds: Array.isArray(data.completedSectionIds) ? data.completedSectionIds : [],
      currentSectionId: data.currentSectionId ?? null,
      completed: !!data.completed,
      assessmentScore: data.assessmentScore ?? null,
      assessmentTotal: data.assessmentTotal ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Quante sezioni di un modulo risultano completate, tra quelle che
 * ESISTONO ANCORA nella struttura corrente. Ignora id "orfani" rimasti in
 * completedSectionIds da una versione precedente della struttura (es. dopo
 * una modifica editoriale che rimuove/rinomina una sezione) invece di
 * gonfiare il conteggio o dividere per zero.
 */
export function summarizeModuleProgress(sectionIds: string[], completedSectionIds: string[]) {
  const completedSet = new Set(completedSectionIds);
  const completed = sectionIds.filter((id) => completedSet.has(id)).length;
  const total = sectionIds.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}

export async function saveServerProgress(reviewId: number, state: ReviewModuleProgressState): Promise<boolean> {
  try {
    const res = await apiFetch(`/reviews/${reviewId}/progress`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    return res.ok;
  } catch {
    return false;
  }
}
