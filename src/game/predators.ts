// Which threat the puffer fish faces each playthrough. Purely visual/thematic
// -- TOTAL_ROUNDS, getOutcome and pufferScale in outcome.ts never change with
// the level; only what's drawn in BattleScene and the result-screen wording do.

export type PredatorKind =
  | "shark"
  | "eel"
  | "piranha"
  | "anglerfish"
  | "catfish"
  | "sharkprincess"
  | "megalodon"
  | "mosasaurus"
  | "kraken";

/** Per-instance position jitter -- same shape as (and structurally
 *  compatible with) components/predators/index.ts's own `SchoolOffset`,
 *  redeclared here instead of imported so this file stays component-free
 *  game logic (see AGENTS.md's "src/game/" layout note). */
export interface PredatorOffset {
  dx: number;
  dy: number;
  scale: number;
}

export interface PredatorLevel {
  level: number; // 1-10
  /** Primary kind -- drives the approach curve lookup, ShipWreck/Kraken
   *  check, and (for a mixed-kind level like the Shark Princess's escort)
   *  is the one `kinds` doesn't need to repeat for every instance. */
  kind: PredatorKind;
  /** How many instances BattleScene renders (only >1 for levels 2, 4, 7). */
  count: number;
  /**
   * Per-instance kind override, same length as `count`, for a level that
   * mixes creatures instead of rendering `count` copies of `kind` (the
   * Shark Princess's two escort sharks). Omit for every plain same-kind
   * school; BattleScene falls back to `count` copies of `kind` when this
   * isn't set.
   */
  kinds?: PredatorKind[];
  /**
   * Per-instance position/scale override, same length as `count`, for a
   * level that wants different relative sizing/prominence between its
   * instances instead of `getSchoolOffsets(count)`'s generic same-size
   * formation (the Shark Princess kept large and up front, her escort
   * sharks smaller and behind her). Array order is also draw order --
   * later entries render on top. Omit to use the generic formation.
   */
  offsets?: PredatorOffset[];
  /** Ready-to-use sentence subject, e.g. "The shark", "The two sharks". */
  label: string;
}

export const PREDATOR_LEVELS: PredatorLevel[] = [
  { level: 1, kind: "shark", count: 1, label: "The shark" },
  { level: 2, kind: "shark", count: 2, label: "The two sharks" },
  { level: 3, kind: "sharkprincess", count: 1, label: "The Shark Princess" },
  {
    level: 4,
    kind: "sharkprincess",
    count: 3,
    // Order is also draw order (later = on top): the two brothers first
    // (smaller, tucked behind), the Princess last (full size, in front --
    // she's the one this level is actually named for).
    kinds: ["shark", "shark", "sharkprincess"],
    offsets: [
      { dx: 16, dy: -34, scale: 0.55 },
      { dx: 12, dy: 34, scale: 0.55 },
      { dx: -8, dy: 0, scale: 1 },
    ],
    label: "The Shark Princess and her two brothers",
  },
  { level: 5, kind: "piranha", count: 4, label: "The four piranhas" },
  { level: 6, kind: "anglerfish", count: 1, label: "The anglerfish" },
  { level: 7, kind: "eel", count: 3, label: "The three electric eels" },
  { level: 8, kind: "megalodon", count: 1, label: "The Megalodon" },
  { level: 9, kind: "mosasaurus", count: 1, label: "The Mosasaurus" },
  { level: 10, kind: "kraken", count: 1, label: "The Kraken" },
];

/**
 * Resolve the predator for the `playCount`-th game started this session
 * (1 = the very first game). Cycles back to level 1 after the Kraken.
 */
export function getPredatorLevel(playCount: number): PredatorLevel {
  const idx = (Math.max(1, Math.trunc(playCount)) - 1) % PREDATOR_LEVELS.length;
  return PREDATOR_LEVELS[idx];
}

/**
 * The kind to render at each of `predator.count` instance positions --
 * `predator.kinds` if this level mixes creatures, else `count` copies of
 * `predator.kind`. BattleScene indexes this in lockstep with
 * `getSchoolOffsets(predator.count)`.
 */
export function getInstanceKinds(predator: PredatorLevel): PredatorKind[] {
  return predator.kinds ?? Array(predator.count).fill(predator.kind);
}
