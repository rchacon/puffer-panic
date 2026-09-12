import type { ComponentType } from "react";
import type { PredatorKind } from "../../game/predators";
import { Shark } from "../Shark";
import { Eel } from "./Eel";
import { Piranha } from "./Piranha";
import { Anglerfish } from "./Anglerfish";
import { TapahCatfish } from "./TapahCatfish";
import { SharkPrincess } from "./SharkPrincess";
import { Megalodon } from "./Megalodon";
import { Mosasaurus } from "./Mosasaurus";
import { Kraken } from "./Kraken";

export const PREDATOR_COMPONENTS: Record<PredatorKind, ComponentType> = {
  shark: Shark,
  eel: Eel,
  piranha: Piranha,
  anglerfish: Anglerfish,
  catfish: TapahCatfish,
  sharkprincess: SharkPrincess,
  megalodon: Megalodon,
  mosasaurus: Mosasaurus,
  kraken: Kraken,
};

export interface SchoolOffset {
  dx: number;
  dy: number;
  scale: number;
}

/**
 * Per-instance position jitter for a "school" of `count` predators (levels
 * 2, 4 and 7), applied relative to the shared approach position so the
 * group retreats/flees together on an outcome while keeping its formation.
 */
const SCHOOL_OFFSETS: Record<number, SchoolOffset[]> = {
  1: [{ dx: 0, dy: 0, scale: 1 }],
  2: [
    { dx: 9, dy: -21, scale: 0.92 },
    { dx: -15, dy: 21, scale: 0.92 },
  ],
  3: [
    { dx: 10, dy: -20, scale: 0.8 },
    { dx: -6, dy: 2, scale: 0.85 },
    { dx: 6, dy: 22, scale: 0.8 },
  ],
  4: [
    { dx: 18, dy: -32, scale: 0.72 },
    { dx: -12, dy: -9, scale: 0.72 },
    { dx: 15, dy: 15, scale: 0.72 },
    { dx: -9, dy: 37, scale: 0.72 },
  ],
};

export function getSchoolOffsets(count: number): SchoolOffset[] {
  return SCHOOL_OFFSETS[count] ?? SCHOOL_OFFSETS[1];
}
