import { expect, test } from "@playwright/test";
import { generateHexQuestion, hexDifficultyMax, isHexCorrect, toHex } from "../src/features/games/hex-blitz/logic";

test("Hex Blitz converts and validates answers", () => {
  expect(toHex(255)).toBe("FF");
  const question = generateHexQuestion("decimal-to-hex", 0, undefined, () => 0.5);
  expect(isHexCorrect(question, `0x${question.answer.toLowerCase()}`)).toBeTruthy();
});

test("Hex Blitz difficulty increases", () => {
  expect(hexDifficultyMax(0)).toBeLessThan(hexDifficultyMax(50_000));
});
