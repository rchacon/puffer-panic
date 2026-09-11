import { Shark } from "../Shark";

// Megalodon: the shark shape, scaled up and darkened -- accurate, even: a
// megalodon really is just an enormous, extinct shark.
export function Megalodon() {
  return (
    <g className="megalodon" transform="scale(1.5)">
      <Shark bodyFill="#5b6b78" bodyStroke="#2e3a42" bellyFill="#aab7c0" finFill="#3a464e" />
    </g>
  );
}
