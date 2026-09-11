interface Props {
  bodyFill?: string;
  bodyStroke?: string;
  bellyFill?: string;
  finFill?: string;
}

// Shark drawn around the origin, nose pointing left (toward the puffer fish).
// Roughly 60 units from nose to tail tip. Palette is overridable so Megalodon
// can reuse this shape instead of hand-drawing a near-duplicate.
export function Shark({
  bodyFill = "#7f9dae",
  bodyStroke = "#4f6d7e",
  bellyFill = "#d6e0e6",
  finFill = "#6a8898",
}: Props = {}) {
  return (
    <g className="shark">
      <path d="M40 0 L60 -16 L53 0 L60 16 Z" fill={bodyStroke} />
      <path
        d="M-46 0 Q -18 -21 30 -11 Q 48 -5 48 0 Q 48 5 30 11 Q -18 21 -46 0 Z"
        fill={bodyFill}
        stroke={bodyStroke}
        strokeWidth={2}
      />
      <path d="M-38 7 Q -8 17 30 8 Q 6 13 -38 11 Z" fill={bellyFill} opacity={0.85} />
      <path d="M2 -12 L15 -31 L23 -12 Z" fill={finFill} />
      <path d="M-2 9 L9 27 L18 10 Z" fill={finFill} />
      <circle cx={-34} cy={-3} r={2.7} fill="#04121a" />
      <path
        d="M-46 4 Q -33 12 -17 10"
        fill="none"
        stroke="#04121a"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <g fill="#fff">
        <path d="M-42 5 l3 5 l3 -4 Z" />
        <path d="M-34 7 l3 5 l3 -4 Z" />
        <path d="M-26 8 l3 4 l3 -3 Z" />
      </g>
    </g>
  );
}
