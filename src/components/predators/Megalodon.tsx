import { Shark } from "../Shark";

// Megalodon: the shark shape, scaled up and darkened -- accurate, even: a
// megalodon really is just an enormous, extinct shark. Shark.tsx is now
// vendored art with its colors baked in, not simple fill props, so the
// darkening happens via the .megalodon CSS filter (index.css) instead of
// passing color overrides the way the old hand-drawn Shark took them.
export function Megalodon() {
  return (
    <g className="megalodon" transform="scale(1.5)">
      <Shark />
    </g>
  );
}
