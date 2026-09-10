export const TOTAL_ROUNDS = 5;

export type Outcome = "defeat" | "survive-barely" | "survive-hurt" | "victory";

/** Map a final score (0..5) to the end-of-game outcome. */
export function getOutcome(score: number): Outcome {
  if (score >= 5) return "victory";
  if (score === 4) return "survive-hurt";
  if (score === 3) return "survive-barely";
  return "defeat";
}

/**
 * Puffer fish scale as a function of correct answers so far. Used both while
 * playing (it grows on each correct answer) and to size the final animation.
 */
export function pufferScale(score: number): number {
  return 1 + 0.24 * score;
}

export const OUTCOME_TEXT: Record<Outcome, { title: string; body: string }> = {
  defeat: {
    title: "Chomp!",
    body: "The shark caught the puffer fish this time. Try again!",
  },
  "survive-barely": {
    title: "Phew — barely!",
    body: "The puffer fish took a big hit but wriggled away just in time.",
  },
  "survive-hurt": {
    title: "Close one!",
    body: "The puffer fish got away with only a little scratch.",
  },
  victory: {
    title: "PUFFER POWER!",
    body: "The puffer fish puffed up huge and sent that shark packing!",
  },
};
