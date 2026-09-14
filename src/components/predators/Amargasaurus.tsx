import amargasaurusArt from "../../assets/amargasaurus-foreground.png";

interface Props {
  /** 0 at round 1, sliding toward 1 as the game's rounds are answered --
   *  see BattleScene's own `sharkProgress` prop, which this is fed
   *  straight from. Unlike every other predator, the Amargasaurus never
   *  moves horizontally toward the puffer at all (see this file's own
   *  entry in BattleScene.tsx's `PREDATOR_APPROACH`, whose `ease: () => 0`
   *  pins its x position instead of closing in) -- it's a stationary
   *  lakeside grazer, not a swimming hunter. What "getting closer" means
   *  for it instead is its head dipping further down into the water each
   *  round, as if taking an ever-deeper drink toward the puffer's own
   *  depth -- this prop drives that dip.
   */
  progress?: number;
}

// Level 11 -- a departure from every prior predator: not an ocean animal
// at all, but a long-necked sauropod standing at the shallow lake the
// Puffer's been swept into (see AGENTS.md and BattleScene.tsx's `isShore`
// branch for the rest of that scene). Two source photos came with this
// level -- this is the close-up "foreground" one (the actual threat,
// standing closer to the viewer than the second, permanently-drinking
// Amargasaurus off in the distance -- see AmargasaurusBackground.tsx,
// not this component); it starts the level with its head up (grazing
// normally) and lowers it a little further every round, ending the level
// with its head dipped low into the water right at the puffer's own
// depth -- tension built through proximity of depth, not of distance.
//
// User-provided raster art (not vendored/licensed, see AGENTS.md; this is
// a replacement for an earlier, straighter-necked source photo -- its own
// much sharper natural neck curve already reads as "leaning down for a
// drink" on its own, which is why this component now adds only a small
// amount of extra rotation on top instead of doing most of the work
// itself). Processed the same way as Bloop.tsx's source: real alpha
// already (no flood-fill fake-transparency trap), cropped to content,
// downscaled, palette-quantized (checked for banding on its smoothest
// gradients -- the throat/neck shading -- and found none).
//
// The nose tip sits at roughly (15, 695) in the saved 700x816 file --
// found via the usual coordinate-grid overlay technique. At this
// component's own display scale (150/700), that's (3, 149), hence the
// <image>'s x/y below: the unrotated, unscaled nose lands at local
// (0, 0), the same shared reference point every other predator's mouth
// would land on, before the transforms around it move it away from that
// on purpose (see next).
//
// Three progress-driven transforms wrap the image, in this order
// (innermost first):
//   1. `rotate`, a small extra downward tip around a pivot near the
//      neck's own exit point (the image's top-right corner, where the
//      spikes run off-frame) -- rotating around the nose itself would
//      just spin the head in place instead of angling the whole neck the
//      way a real drink does. Kept modest since the source art's own
//      curve already supplies most of the "leaning down" angle.
//   2. `scale`, a gentle zoom that grows the whole creature slightly each
//      round -- since it never approaches horizontally (see
//      BattleScene.tsx's `PREDATOR_APPROACH.amargasaurus`), this is what
//      reads as "looming a little larger," on top of the dip below.
//   3. An outer `translate` does the main work of "closer to the puffer"
//      -- sliding the whole group down as `progress` climbs, from just
//      above the water's surface at round 1 to past the predator
//      anchor's own y=94 (matching the puffer's own depth) by the last
//      round, i.e. the head visibly submerging round over round.
export function Amargasaurus({ progress = 0 }: Props) {
  const angle = progress * 14;
  const scale = 0.85 + progress * 0.35;
  const dy = -24 + progress * 60;
  return (
    <g className="amargasaurus" transform={`translate(0 ${dy})`}>
      <g transform={`scale(${scale})`}>
        <g transform={`rotate(${angle} 145 -145)`}>
          <image href={amargasaurusArt} x={-3} y={-149} width={150} height={175} />
        </g>
      </g>
    </g>
  );
}
