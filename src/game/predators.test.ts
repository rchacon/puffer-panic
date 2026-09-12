import { describe, expect, it } from "vitest";
import { getPredatorLevel, PREDATOR_LEVELS } from "./predators";
import { getSchoolOffsets, PREDATOR_COMPONENTS } from "../components/predators";

describe("getPredatorLevel", () => {
  it("returns level 1 through level 10 for playCount 1..10", () => {
    for (let i = 1; i <= 10; i++) {
      expect(getPredatorLevel(i).level).toBe(i);
    }
  });

  it("cycles back to level 1 after the Kraken", () => {
    expect(getPredatorLevel(11).level).toBe(1);
    expect(getPredatorLevel(20).level).toBe(10);
    expect(getPredatorLevel(21).level).toBe(1);
  });

  it("treats 0 or negative playCount as the first game", () => {
    expect(getPredatorLevel(0).level).toBe(1);
    expect(getPredatorLevel(-5).level).toBe(1);
  });
});

describe("PREDATOR_LEVELS", () => {
  it("has exactly 10 levels, numbered 1..10 in order", () => {
    expect(PREDATOR_LEVELS.map((p) => p.level)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("only levels 2, 4 and 7 have more than one instance", () => {
    const multiLevels = new Set([2, 4, 7]);
    for (const p of PREDATOR_LEVELS) {
      expect(p.count > 1).toBe(multiLevels.has(p.level));
    }
  });

  it("every kind has a matching illustration component", () => {
    for (const p of PREDATOR_LEVELS) {
      expect(PREDATOR_COMPONENTS[p.kind]).toBeTypeOf("function");
    }
  });

  it("every level's count has a matching school offset entry", () => {
    // getSchoolOffsets() silently falls back to SCHOOL_OFFSETS[1] for any
    // count it doesn't recognize -- which would render every instance of a
    // school stacked on top of each other instead of failing loudly. This
    // catches a new/edited level whose count outgrew the offset table.
    for (const p of PREDATOR_LEVELS) {
      expect(getSchoolOffsets(p.count)).toHaveLength(p.count);
    }
  });
});
