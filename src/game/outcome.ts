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

/** Lowercase just the first letter, for mid-sentence use ("The Kraken" -> "the Kraken"). */
export function toMidSentence(label: string): string {
  return label.charAt(0).toLowerCase() + label.slice(1);
}

/**
 * `predator` is the current level's subject phrase (see predators.ts),
 * e.g. "The shark" or "The two sharks" -- ready to drop into a sentence.
 * Only defeat/victory mention it; the survive outcomes only talk about the
 * puffer fish either way.
 */
export function outcomeText(outcome: Outcome, predator: string): { title: string; body: string } {
  switch (outcome) {
    case "defeat":
      return {
        title: "Chomp!",
        body: `${predator} caught the puffer fish this time. Try again!`,
      };
    case "survive-barely":
      return {
        title: "Phew — barely!",
        body: "The puffer fish took a big hit but wriggled away just in time.",
      };
    case "survive-hurt":
      return {
        title: "Close one!",
        body: "The puffer fish got away with only a little scratch.",
      };
    case "victory":
      return {
        title: "PUFFER POWER!",
        body: `The puffer fish puffed up huge and sent ${toMidSentence(predator)} packing!`,
      };
  }
}
