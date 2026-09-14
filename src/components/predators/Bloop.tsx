import bloopArt from "../../assets/bloop.png";

// Level 9's boss fight -- a raster illustration (not vendored/licensed;
// user-provided, see AGENTS.md), imported as a URL (not `?raw`) so Vite
// emits it as its own cacheable file. Already drawn nose-left, no
// mirroring needed.
//
// Sized so huge that only a fraction of the body ever fits on screen at
// once -- same "huuuge, don't even try to show the whole thing" brief as
// the Megalodon, but aimed at the eye instead of the nose/gills: the eye
// sits at this local origin (0, 0), the same shared reference point every
// other creature's mouth/nose lands on at the closest approach
// (sharkX=150), so it's what ends up centered on screen as this thing
// closes in, no matter how much of the rest of it -- the wide-open jaw,
// the whole back half of the body -- spills off every edge of the frame.
// Found by flood-filling the source PNG for its checkerboard background
// (same fake-transparency trap as SharkPrincess/Mosasaurus/Anglerfish
// before it -- confirmed via `im.mode`, not by eyeballing it) and cropping
// to content, then locating the pupil (a solid near-black blob distinct
// from the mouth interior's dark navy) via the same coordinate-hunting
// technique used for Megalodon's nose/gills.
export function Bloop() {
  return (
    <g className="bloop">
      <image href={bloopArt} x={-366} y={-54} width={1400} height={671} />
    </g>
  );
}
