export type GameMode = "mixed" | "binary-to-decimal" | "decimal-to-binary";
export type Direction = Exclude<GameMode, "mixed">;

export type Question = {
  id: string;
  direction: Direction;
  value: number;
  prompt: string;
  answer: string;
};

export type GameResult = {
  score: number;
  correct: number;
  wrong: number;
  maxCombo: number;
  mode: GameMode;
  isNewRecord: boolean;
};
