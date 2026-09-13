import rawPufferArtwork from "../assets/pufferfish.svg?raw";
import { stripRootSvgDimensions } from "./vendoredSvg";

// The source's own root <svg> carries width="800px" height="800px"
// alongside its viewBox -- see vendoredSvg.ts for why that has to come out
// before nesting this inside the wrapper below.
const pufferArtwork = stripRootSvgDimensions(rawPufferArtwork);

// Puffer fish, embedded around the origin -- a vendored illustration (see
// AGENTS.md for provenance) rather than hand-drawn like the previous spiky
// version. Already drawn facing right (toward the predator) in its native
// orientation, same convention as every creature here. Renders only once
// (never a school), so unlike Shark/Piranha this doesn't need scopeIds --
// its one internal id (`Layer_1`) is never duplicated on screen.
export function Puffer() {
  return (
    <g className="puffer">
      <svg
        x={-18}
        y={-18}
        width={36}
        height={36}
        viewBox="0 0 512.001 512.001"
        dangerouslySetInnerHTML={{ __html: pufferArtwork }}
      />
    </g>
  );
}
