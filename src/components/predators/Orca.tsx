import { Shark } from "../Shark";

// Orca: the shark shape recolored black/white with an eye patch -- an orca's
// body plan (torpedo body, tall dorsal fin) is close enough to a shark's that
// a fresh illustration would look near-identical anyway.
export function Orca() {
  return (
    <g className="orca">
      <Shark bodyFill="#1c2733" bodyStroke="#0a0f14" bellyFill="#f2f6f8" finFill="#1c2733" />
      <ellipse
        cx={-27}
        cy={-10}
        rx={5}
        ry={2.6}
        fill="#f2f6f8"
        transform="rotate(-25 -27 -10)"
      />
    </g>
  );
}
