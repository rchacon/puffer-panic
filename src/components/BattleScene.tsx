import type { Outcome } from "../game/outcome";
import { Puffer } from "./Puffer";
import { Shark } from "./Shark";

interface Props {
  sharkProgress: number; // 0..1
  pufferScale: number;
  outcome: Outcome | null;
}

const PUFFER_X = 96;
const PUFFER_Y = 116;

export function BattleScene({ sharkProgress, pufferScale, outcome }: Props) {
  const sharkX = 350 - sharkProgress * 200;
  const className = outcome ? `scene scene--${outcome}` : "scene";

  return (
    <div className={className}>
      <svg
        className="scene__svg"
        viewBox="0 0 400 200"
        role="img"
        aria-label="A shark swimming toward a puffer fish"
      >
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#37b0dd" />
            <stop offset="1" stopColor="#0a3a63" />
          </linearGradient>
        </defs>

        <rect width="400" height="200" fill="url(#sea)" />
        <path
          d="M0 186 Q 100 172 200 186 T 400 184 V200 H0 Z"
          fill="#0b5a3d"
          opacity="0.75"
        />
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
            <path d="M0 -60 L9 -20 L0 -34 L-9 -20 Z" />
            <path d="M60 0 L20 9 L34 0 L20 -9 Z" />
            <path d="M-60 0 L-20 -9 L-34 0 L-20 9 Z" />
            <path d="M0 60 L-9 20 L0 34 L9 20 Z" />
            <path d="M42 -42 L18 -12 L30 -30 L12 -18 Z" />
            <path d="M-42 42 L-18 12 L-30 30 L-12 18 Z" />
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

        <g className="scene__shark" transform={`translate(${sharkX} 94)`}>
          <g className="scene__shark-bob">
            <Shark />
          </g>
        </g>
      </svg>
    </div>
  );
}
