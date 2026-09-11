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

export interface PredatorLevel {
  level: number; // 1-10
  kind: PredatorKind;
  /** How many instances BattleScene renders (only >1 for levels 2-4). */
  count: number;
  /** Ready-to-use sentence subject, e.g. "The shark", "The two sharks". */
  label: string;
}

export const PREDATOR_LEVELS: PredatorLevel[] = [
  { level: 1, kind: "shark", count: 1, label: "The shark" },
  { level: 2, kind: "shark", count: 2, label: "The two sharks" },
  { level: 3, kind: "eel", count: 3, label: "The three electric eels" },
  { level: 4, kind: "piranha", count: 4, label: "The four piranhas" },
  { level: 5, kind: "anglerfish", count: 1, label: "The anglerfish" },
  { level: 6, kind: "catfish", count: 1, label: "The Tapah catfish" },
  { level: 7, kind: "sharkprincess", count: 1, label: "The Shark Princess" },
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
