// src/lib/readiness.ts
export type ReadinessInputs = {
  // 0..100
  accuracyPct: number;          // es: avgScorePct
  // 0..100
  coveragePct: number;          // es: seen/total * 100
  // 0..100
  consistencyPct: number;       // es: sessionsLast14d -> normalizzato
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const clamp100 = (n: number) => Math.max(0, Math.min(100, n));

export function computeConsistencyPct(opts: {
  sessionsLast14d: number; // quante sessioni (o giorni attivi) negli ultimi 14 giorni
  targetSessions14d?: number; // default 10
}) {
  const target = opts.targetSessions14d ?? 10;
  const ratio = clamp01(opts.sessionsLast14d / target);
  return Math.round(ratio * 100);
}

export function computeReadiness(inputs: ReadinessInputs) {
  const accuracy = clamp100(inputs.accuracyPct) / 100;
  const coverage = clamp100(inputs.coveragePct) / 100;
  const consistency = clamp100(inputs.consistencyPct) / 100;

  // pesi: accuracy conta di più (se sbagli tanto, non sei pronto anche se hai “visto tutto”)
  const score = (0.55 * accuracy + 0.30 * coverage + 0.15 * consistency) * 100;

  // “confidence” (quanto il numero è affidabile): se coverage è bassa, abbassiamo fiducia
  const confidence = Math.round((0.4 + 0.6 * coverage) * 100);

  return {
    score: Math.round(score),
    confidence, // 40..100 circa
    parts: {
      accuracyPct: Math.round(accuracy * 100),
      coveragePct: Math.round(coverage * 100),
      consistencyPct: Math.round(consistency * 100),
    },
  };
}
