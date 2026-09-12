import type { Outcome } from "../game/outcome";
import type { PredatorLevel } from "../game/predators";
import { Puffer } from "./Puffer";
import { ShipWreck } from "./ShipWreck";
import { PREDATOR_COMPONENTS, getSchoolOffsets } from "./predators";

interface Props {
  sharkProgress: number; // 0..1 -- approach progress
  pufferScale: number;
  outcome: Outcome | null;
  predator: PredatorLevel;
}

const PUFFER_X = 96;
const PUFFER_Y = 116;
const PREDATOR_Y = 94;

// Mosasaurus is deliberately drawn much bigger than every other predator
// (see Mosasaurus.tsx) and starts much farther off the right edge -- a
// plain linear approach at that scale makes each round-to-round step a big,
// fast-looking jump (the bigger the runway, the bigger each equal-progress
// slice of it is). A single smooth power curve keeps every step small and
// only closes most of the distance on the very last one -- unlike a
// hand-tuned multi-point checkpoint table (the previous approach here),
// this has no seams between differently-sloped segments for consecutive
// steps to look inconsistent across, so it doesn't have the mobile
// "jumpiness" that table caused.
//
// A pure cube (progress**3) pushes the round 1 move down to a couple of
// pixels -- imperceptible, reads as not moving at all. Blending in a small
// linear component keeps that first move visible (the linear term's slope
// is nonzero at t=0, unlike the cube's) while the cube term still
// dominates for the rest of the approach, so later rounds still build up
// gradually and contact still lands on the final reveal, not sooner.
const MOSASAURUS_APPROACH_EXPONENT = 3;
const MOSASAURUS_LINEAR_BLEND = 0.2;

function mosasaurusApproach(t: number): number {
  return MOSASAURUS_LINEAR_BLEND * t + (1 - MOSASAURUS_LINEAR_BLEND) * t ** MOSASAURUS_APPROACH_EXPONENT;
}

export function BattleScene({ sharkProgress, pufferScale, outcome, predator }: Props) {
  const startX = predator.kind === "mosasaurus" ? 460 : 350;
  const approachProgress =
    predator.kind === "mosasaurus" ? mosasaurusApproach(sharkProgress) : sharkProgress;
  const sharkX = startX - approachProgress * (startX - 150);
  const className = outcome ? `scene scene--${outcome}` : "scene";
  const Creature = PREDATOR_COMPONENTS[predator.kind];
  const offsets = getSchoolOffsets(predator.count);

  return (
    <div className={className}>
      <svg
        className="scene__svg"
        viewBox="0 0 400 200"
        role="img"
        aria-label={`${predator.label} swimming toward a puffer fish`}
      >
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#37b0dd" />
            <stop offset="1" stopColor="#0a3a63" />
          </linearGradient>
          {/* Recolors the Kraken's mostly-grey vendored art purple (see
              .kraken in index.css for why: sepia injects chroma a plain
              hue-rotate can't). Built from the same primitives the CSS
              `filter: sepia(1) saturate(3) hue-rotate(220deg) brightness(0.64)`
              shorthand expands to, but spelled out explicitly with
              color-interpolation-filters="sRGB" forced -- reported as
              rendering grey instead of purple on iOS Safari/Chrome (same
              WebKit engine), which strongly suggests that combo was
              landing in linearRGB there instead. Chaining 4 shorthand
              filter functions on near-zero-chroma source art is fragile
              even when color space matches: there's very little chroma
              for rounding differences between engines to work with. This
              removes the ambiguity outright instead of guessing further --
              unverified on a real device, since none is available here. */}
          <filter id="krakenPurple" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.393 0.769 0.189 0 0
                      0.349 0.686 0.168 0 0
                      0.272 0.534 0.131 0 0
                      0     0     0     1 0"
            />
            <feColorMatrix type="saturate" values="3" />
            <feColorMatrix type="hueRotate" values="220" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.64" />
              <feFuncG type="linear" slope="0.64" />
              <feFuncB type="linear" slope="0.64" />
            </feComponentTransfer>
          </filter>
        </defs>

        <rect width="400" height="200" fill="url(#sea)" />
        <path
          d="M0 186 Q 100 172 200 186 T 400 184 V200 H0 Z"
          fill="#0b5a3d"
          opacity="0.75"
        />
        {predator.kind === "kraken" && <ShipWreck />}

        <g className="scene__bubbles" fill="#c7ecff" opacity="0.5">
          <circle cx="58" cy="60" r="3" />
          <circle cx="128" cy="42" r="2" />
          <circle cx="92" cy="150" r="2.5" />
          <circle cx="300" cy="120" r="2.5" />
        </g>

        {outcome === "victory" && (
          <g
            className="scene__burst"
            transform={`translate(${PUFFER_X} ${PUFFER_Y})`}
            fill="#ffd447"
          >
            <g className="scene__burst-spin">
              <path d="M0 -60 L9 -20 L0 -34 L-9 -20 Z" />
              <path d="M60 0 L20 9 L34 0 L20 -9 Z" />
              <path d="M-60 0 L-20 -9 L-34 0 L-20 9 Z" />
              <path d="M0 60 L-9 20 L0 34 L9 20 Z" />
              <path d="M42 -42 L18 -12 L30 -30 L12 -18 Z" />
              <path d="M-42 42 L-18 12 L-30 30 L-12 18 Z" />
            </g>
          </g>
        )}

        <g
          className="scene__puffer"
          transform={`translate(${PUFFER_X} ${PUFFER_Y}) scale(${pufferScale})`}
        >
          <g className="scene__puffer-bob">
            <Puffer />
          </g>
        </g>

        <g className="scene__predator" transform={`translate(${sharkX} ${PREDATOR_Y})`}>
          {offsets.map((o, i) => (
            <g key={i} transform={`translate(${o.dx} ${o.dy}) scale(${o.scale})`}>
              <g className="scene__predator-bob">
                <Creature />
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
