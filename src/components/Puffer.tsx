import rawPufferArtwork from "../assets/pufferfish.svg?raw";
import { stripRootSvgDimensions } from "./vendoredSvg";

// The source's own root <svg> carries width="800px" height="800px"
// alongside its viewBox -- see vendoredSvg.ts for why that has to come out
// before nesting this inside the wrapper below.
const strippedPufferArtwork = stripRootSvgDimensions(rawPufferArtwork);

// A friendlier face than the source draws on its own: a white eye glint
// and a small smile, appended as new shapes rather than editing the
// source's own paths (its outline -- eye pupil included -- is one giant
// compound path, not individually addressable sub-shapes; adding on top
// is far less risky than trying to isolate and rewrite a piece of it).
// Coordinates are in the source's own viewBox (0 0 512.001 512.001):
// the eye glint is placed relative to the source's own
// `<circle cx="456" cy="172" r="32"/>` (the only element with a plain,
// easy-to-read coordinate near the eye -- the pupil itself isn't one),
// and the smile is placed by eye against a rendered preview, not derived
// from any other element's coordinates. Appended into the *source's own*
// nested `<svg>` (by string-inserting before its closing tag) rather than
// added as sibling JSX, so it shares that inner coordinate space directly
// without needing its own separate positioned wrapper.
const FRIENDLY_FACE =
  '<circle cx="448" cy="164" r="7" fill="#ffffff"/>' +
  '<path d="M460,244 Q480,264 502,242" fill="none" stroke="#1a1a1a" ' +
  'stroke-width="10" stroke-linecap="round"/>';
const pufferArtwork = strippedPufferArtwork.replace(
  /<\/svg>\s*$/,
  `${FRIENDLY_FACE}</svg>`,
);

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
