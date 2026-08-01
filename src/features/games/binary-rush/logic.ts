import type { Direction, GameMode, Question } from "./types";

export const GAME_DURATION_MS = 60_000;

export function difficultyMax(elapsedMs: number): number {
  if (elapsedMs < 12_000) return 15;
  if (elapsedMs < 24_000) return 31;
  if (elapsedMs < 36_000) return 63;
  if (elapsedMs < 48_000) return 127;
  return 255;
}

export function toBinary(value: number): string { return value.toString(2); }

export function directionFor(mode: GameMode, random = Math.random): Direction {
  return mode === "mixed"
    ? (random() < 0.5 ? "binary-to-decimal" : "decimal-to-binary")
    : mode;
}

export function generateQuestion(
  mode: GameMode,
  elapsedMs: number,
  previous?: Question,
  random = Math.random
): Question {
  const max = difficultyMax(elapsedMs);
  const direction = directionFor(mode, random);
  let value = 1 + Math.floor(random() * max);
  if (previous && previous.value === value && previous.direction === direction) {
    value = value === max ? Math.max(1, value - 1) : value + 1;
  }
  const answer = direction === "binary-to-decimal" ? String(value) : toBinary(value);
  const prompt = direction === "binary-to-decimal" ? toBinary(value) : String(value);
  return { id: `${direction}-${value}-${elapsedMs}`, direction, value, prompt, answer };
}

export function normalizeAnswer(raw: string): string { return raw.trim().replace(/^0+(?=\d)/, ""); }
export function isCorrect(question: Question, raw: string): boolean {
  return normalizeAnswer(raw) === question.answer;
}

export function scoreAnswer(combo: number, responseMs: number): number {
  const speedBonus = Math.max(0, Math.round(50 * (1 - Math.min(responseMs, 10_000) / 10_000)));
  const multiplier = Math.min(2, 1 + Math.floor(combo / 5) * 0.25);
  return Math.round((100 + speedBonus) * multiplier);
}

export function binaryExplanation(value: number): string {
  const binary = toBinary(value);
  const powers = [...binary].flatMap((bit, index) =>
    bit === "1" ? [2 ** (binary.length - index - 1)] : []
  );
  return `${binary}₂ = ${powers.join(" + ")} = ${value}`;
}

export function decimalExplanation(value: number): string {
  return `${value}₁₀ = ${toBinary(value)}₂`;
}
