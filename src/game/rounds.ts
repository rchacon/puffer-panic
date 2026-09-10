import { WORDS } from "../data/words";

export interface Round {
  target: string;
  options: string[];
  correctIndex: number;
}

function shuffle<T>(input: readonly T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build one round for `target`, drawing two distractors from `pool`. */
export function buildRound(pool: readonly string[], target: string): Round {
  const others = pool.filter((w) => w !== target);
  // Prefer distractors with the same letter count so the choice is a real
  // reading task, then fall back to any remaining word.
  const preferred = shuffle(others.filter((w) => w.length === target.length));
  const rest = shuffle(others.filter((w) => w.length !== target.length));

  const distractors: string[] = [];
  for (const w of [...preferred, ...rest]) {
    if (distractors.length === 2) break;
    if (!distractors.includes(w)) distractors.push(w);
  }

  const options = shuffle([target, ...distractors]);
  return { target, options, correctIndex: options.indexOf(target) };
}

/** Build `count` rounds with distinct target words. */
export function buildRounds(count = 5, pool: readonly string[] = WORDS): Round[] {
  return shuffle(pool)
    .slice(0, count)
    .map((target) => buildRound(pool, target));
}
