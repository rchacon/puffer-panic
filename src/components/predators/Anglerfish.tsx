import anglerfishArt from "../../assets/anglerfish.png";

// Level 8's Anglerfish -- a vendored illustration (see AGENTS.md for
// provenance/processing), replacing the old hand-drawn version. Already
// drawn nose-left in its native orientation, same convention as every
// creature here, so no mirroring needed. Imported as a URL (not `?raw`)
// so Vite emits it as its own cacheable file instead of inlining a
// base64 string into the JS bundle.
export function Anglerfish() {
  return (
    <g className="anglerfish">
      <image
        href={anglerfishArt}
        x={-70}
        y={-44}
        width={140}
        height={88}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}
