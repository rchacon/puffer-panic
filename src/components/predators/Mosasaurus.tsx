import mosasaurusArt from "../../assets/mosasaurus.png";

// Level 9's Mosasaurus -- a raster illustration (not vendored/licensed;
// user-provided, see AGENTS.md), imported as a URL (not `?raw`) so Vite
// emits it as its own cacheable file instead of inlining a base64 string
// into the JS bundle. Already drawn nose-left in its native orientation.
//
// Deliberately drawn bigger than every other predator (Shark is 159 wide) --
// it's the last stop before the Kraken finale and is meant to look
// imposing. BattleScene compensates in the approach curve, not by shrinking
// this back down (see the MOSASAURUS_APPROACH comment there).
export function Mosasaurus() {
  return (
    <g className="mosasaurus">
      <image
        href={mosasaurusArt}
        x={-130}
        y={-48}
        width={200}
        height={97}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}
