import sharkPrincessArt from "../../assets/shark-princess.png";

// Level 3 (previously a recolored Shark playing the orca, see git history)
// -- a cheerful crowned whale shark, provided by the user as a large raster
// illustration with a white background (src/assets/shark-princess.png is the
// processed result: background removed, cropped to content, downscaled; see
// AGENTS.md for details and why it isn't the original file). Imported as a
// URL (not `?raw` like Kraken.tsx) so Vite emits it as its own cacheable
// file instead of inlining a ~300KB base64 string into the JS bundle.
export function SharkPrincess() {
  return (
    <g className="shark-princess">
      <image
        href={sharkPrincessArt}
        x={-54}
        y={-30}
        width={108}
        height={60.5}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}
