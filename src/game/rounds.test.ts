import { describe, expect, it } from "vitest";
import { buildRound, buildRounds } from "./rounds";
import { WORDS } from "../data/words";

describe("buildRounds", () => {
  it("creates the requested number of rounds", () => {
    expect(buildRounds(5)).toHaveLength(5);
  });

  it("uses distinct target words", () => {
    const targets = buildRounds(5).map((r) => r.target);
    expect(new Set(targets).size).toBe(5);
  });

  it("gives each round 3 unique known options with the target at correctIndex", () => {
    for (const round of buildRounds(5)) {
      expect(round.options).toHaveLength(3);
      expect(new Set(round.options).size).toBe(3);
      expect(round.options).toContain(round.target);
      expect(round.options[round.correctIndex]).toBe(round.target);
      for (const option of round.options) {
        expect(WORDS).toContain(option);
      }
    }
  });
});

describe("buildRound", () => {
  it("prefers distractors with the same letter count when available", () => {
    const pool = ["cat", "dog", "run", "big", "a", "I"];
    const round = buildRound(pool, "cat");
    for (const option of round.options) {
      expect(option).toHaveLength(3);
    }
  });
});
