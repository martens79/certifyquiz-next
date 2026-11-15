const MILESTONES = new Set([1, 5, 10, 20, 40]);

/** Observe the question itself, so loading, error and gate screens cannot report it. */
export function observeQuizQuestionMilestone(
  question: HTMLElement,
  milestone: number,
  tracked: Set<number>,
  emit: (milestone: number) => void,
): (() => void) | undefined {
  if (!MILESTONES.has(milestone) || tracked.has(milestone) || typeof IntersectionObserver !== "function") return;

  let active = true;
  let intersecting = false;
  const doc = question.ownerDocument;
  const stop = () => {
    active = false;
    observer.disconnect();
    doc.removeEventListener("visibilitychange", report);
  };
  const report = () => {
    if (!active || !intersecting || doc.visibilityState !== "visible" || !question.isConnected) return;
    stop();
    if (tracked.has(milestone)) return;
    tracked.add(milestone);
    emit(milestone);
  };
  const observer = new IntersectionObserver(entries => {
    intersecting = entries.some(entry => entry.target === question && entry.isIntersecting && entry.intersectionRatio > 0);
    report();
  });
  doc.addEventListener("visibilitychange", report);
  observer.observe(question);
  return stop;
}
