import { useScopedSvg } from "./scopeIds";
import { stripRootSvgDimensions } from "./vendoredSvg";
import rawRockArtwork from "../assets/rock.svg?raw";

// Its source's root <svg> carries width="800px" height="800px" alongside
// its viewBox -- stripRootSvgDimensions strips those before this gets
// nested inside the two sized wrappers below (see vendoredSvg.ts for why).
const rockArtwork = stripRootSvgDimensions(rawRockArtwork);

// Two rocks resting on the seabed -- background scenery, positioned in
// scene-absolute coordinates (not around an origin like the predators/
// Puffer, since they never move or scale). Vendored real vector art (a
// detailed shaded boulder, "🪨" Rock from the Noto Emoji set via SVG Repo,
// same bot-detection-checkpoint provenance caveat as the Puffer/kraken-icon
// -- see AGENTS.md) rather than the hand-drawn flat-ellipse rocks this
// replaced. The same artwork rendered twice at once, at two different
// sizes (one bigger) side by side, so its gradient ids need scoping per
// instance just like Piranha/Shark's schools -- two separate
// `useScopedSvg` calls, one per instance, rather than one call reused
// twice (each call consumes its own `useId()` slot, so the two results
// are already uniquely suffixed against each other).
//
// Both kept on the left half (under/around the puffer) so they never
// compete with the Kraken's ShipWreck, which occupies roughly x=250-390 on
// the right. Their top edges are kept below y=160, comfortably clear of
// the Puffer's own lowest reach even at its biggest -- pufferScale(score)
// maxes out at 2.2 (score 5), and Puffer.tsx's local box extends to
// y=+18, so at PUFFER_Y=116 its bottom edge can reach 116+18*2.2=155.6,
// plus the idle `bob` keyframe's +3px, for 158.6. Since that's *below*
// each rock's top edge, the two can never visually overlap regardless of
// how their x ranges relate -- disjoint y-ranges alone rule it out, no
// need to also dodge the Puffer horizontally. (An earlier version had the
// big rock's top at y=148, inside that reach -- caught by /code-review
// actually rendering the victory screen at max score, not by inspection.)
export function Rocks() {
  const bigRock = useScopedSvg(rockArtwork);
  const smallRock = useScopedSvg(rockArtwork);

  return (
    <g className="rocks">
      <svg
        x={20}
        y={163}
        width={42}
        height={42}
        viewBox="0 0 128 128"
        dangerouslySetInnerHTML={{ __html: bigRock }}
      />
      <svg
        x={66}
        y={175}
        width={28}
        height={28}
        viewBox="0 0 128 128"
        dangerouslySetInnerHTML={{ __html: smallRock }}
      />
    </g>
  );
}
