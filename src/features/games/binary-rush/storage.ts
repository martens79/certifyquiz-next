import type { GameMode } from "./types";

const KEY = "certifyquiz:games:binary-rush:v1";
type Stored = { bestOverall: number; bestByMode: Partial<Record<GameMode, number>>; lastMode: GameMode };
const defaults: Stored = { bestOverall: 0, bestByMode: {}, lastMode: "mixed" };

export function loadGameStorage(): Stored {
  if (typeof window === "undefined") return defaults;
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<Stored> }; }
  catch { return defaults; }
}

export function saveResult(mode: GameMode, score: number): { data: Stored; isNewRecord: boolean } {
  const old = loadGameStorage();
  const isNewRecord = score > old.bestOverall;
  const data: Stored = {
    bestOverall: Math.max(old.bestOverall, score),
    bestByMode: { ...old.bestByMode, [mode]: Math.max(old.bestByMode[mode] ?? 0, score) },
    lastMode: mode,
  };
  localStorage.setItem(KEY, JSON.stringify(data));
  return { data, isNewRecord };
}

export function saveLastMode(mode: GameMode): void {
  const data = loadGameStorage();
  localStorage.setItem(KEY, JSON.stringify({ ...data, lastMode: mode }));
}
