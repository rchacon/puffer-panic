import { describe, expect, it } from "vitest";
import { getOutcome, pufferScale } from "./outcome";

describe("getOutcome", () => {
  it.each([
    [0, "defeat"],
    [1, "defeat"],
    [2, "defeat"],
    [3, "survive-barely"],
    [4, "survive-hurt"],
    [5, "victory"],
  ] as const)("score %i maps to %s", (score, expected) => {
    expect(getOutcome(score)).toBe(expected);
  });
});

describe("pufferScale", () => {
  it("starts at 1 with no correct answers", () => {
    expect(pufferScale(0)).toBe(1);
  });

  it("grows with every correct answer", () => {
    for (let s = 1; s <= 5; s++) {
      expect(pufferScale(s)).toBeGreaterThan(pufferScale(s - 1));
    }
  });
});
