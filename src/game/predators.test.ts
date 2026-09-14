import { describe, expect, it } from "vitest";
import { getInstanceKinds, getPredatorLevel, PREDATOR_LEVELS } from "./predators";
import { getSchoolOffsets, PREDATOR_COMPONENTS } from "../components/predators";

describe("getPredatorLevel", () => {
  it("returns level 1 through level 11 for playCount 1..11", () => {
    for (let i = 1; i <= 11; i++) {
      expect(getPredatorLevel(i).level).toBe(i);
    }
  });

  it("cycles back to level 1 after the Kraken", () => {
    expect(getPredatorLevel(12).level).toBe(1);
    expect(getPredatorLevel(22).level).toBe(11);
    expect(getPredatorLevel(23).level).toBe(1);
  });

  it("treats 0 or negative playCount as the first game", () => {
    expect(getPredatorLevel(0).level).toBe(1);
    expect(getPredatorLevel(-5).level).toBe(1);
  });
});

describe("PREDATOR_LEVELS", () => {
  it("has exactly 11 levels, numbered 1..11 in order", () => {
    expect(PREDATOR_LEVELS.map((p) => p.level)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it("only levels 2, 4, 7 and 8 have more than one instance", () => {
    const multiLevels = new Set([2, 4, 7, 8]);
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

  it("every level's instance kinds match its count and have a component", () => {
    // getInstanceKinds() is what BattleScene actually indexes alongside
    // getSchoolOffsets() -- a `kinds` array shorter/longer than `count`
    // (or naming a kind with no illustration) would render the wrong
    // creature, or none, at some position rather than failing loudly.
    for (const p of PREDATOR_LEVELS) {
      const kinds = getInstanceKinds(p);
      expect(kinds).toHaveLength(p.count);
      for (const kind of kinds) {
        expect(PREDATOR_COMPONENTS[kind]).toBeTypeOf("function");
      }
    }
  });

  it("every level's custom offsets (if any) match its count", () => {
    // Mirrors the school-offset-length check above, for the levels that
    // opt out of the generic getSchoolOffsets() formation via their own
    // `offsets` -- BattleScene indexes this by position too, so a
    // mismatched length would leave some instance without a position.
    for (const p of PREDATOR_LEVELS) {
      if (p.offsets) expect(p.offsets).toHaveLength(p.count);
    }
  });

  it("the Shark Princess's escort level keeps her bigger and drawn on top", () => {
    // BattleScene draws `offsets` in array order, later on top -- and
    // indexes `kinds` in lockstep with it. This pins both assumptions
    // together so reordering one without the other doesn't silently draw
    // a brother shark on top at full size instead of the Princess.
    const level4 = PREDATOR_LEVELS.find((p) => p.level === 4);
    expect(level4).toBeDefined();
    expect(getInstanceKinds(level4!)).toEqual(["shark", "shark", "sharkprincess"]);
    const offsets = level4!.offsets ?? getSchoolOffsets(level4!.count);
    expect(offsets.at(-1)!.scale).toBeGreaterThan(offsets[0].scale);
    expect(offsets.at(-1)!.scale).toBeGreaterThan(offsets[1].scale);
  });
});
