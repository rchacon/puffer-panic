import sharkPrincessArt from "../../assets/shark-princess.png";

// Level 3's cheerful crowned whale shark -- a raster illustration (not
// hand-drawn like most of the others; see AGENTS.md for provenance and
// processing notes). Imported as a URL (not `?raw` like Kraken.tsx) so Vite
// emits it as its own cacheable file instead of inlining a base64 string
// into the JS bundle.
export function SharkPrincess() {
  return (
    <g className="shark-princess">
      <image
        href={sharkPrincessArt}
        x={-54}
        y={-30.5}
        width={108}
        height={61}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}
