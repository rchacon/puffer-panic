import eelArt from "../../assets/electric-eel.png";

// Level 6's electric eel (school of 3) -- a raster illustration (not
// vendored/licensed; user-provided, see AGENTS.md), replacing the old
// hand-drawn S-curve. Already drawn nose-left in its native orientation,
// same convention as every other creature here, so no mirroring needed.
// Imported as a URL (not `?raw`) so Vite emits it as its own cacheable
// file instead of inlining a base64 string into the JS bundle.
//
// x/y center the image on the local origin, same convention as every
// other raster predator (Mosasaurus, Anglerfish...) -- the art was cropped
// tight to its own content first, so centering the box puts the head/mouth
// near the shared left edge every other creature's nose lands on.
export function Eel() {
  return (
    <g className="eel">
      <image href={eelArt} x={-95} y={-47.5} width={190} height={95} />
    </g>
  );
}
