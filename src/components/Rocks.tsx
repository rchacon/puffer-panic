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
// Both kept on the left half (under/around the puffer, well clear of the
// Puffer's own ~18-unit radius) so they never compete with the Kraken's
// ShipWreck, which occupies roughly x=250-390 on the right.
export function Rocks() {
  const bigRock = useScopedSvg(rockArtwork);
  const smallRock = useScopedSvg(rockArtwork);

  return (
    <g className="rocks">
      <svg
        x={38}
        y={148}
        width={52}
        height={52}
        viewBox="0 0 128 128"
        dangerouslySetInnerHTML={{ __html: bigRock }}
      />
      <svg
        x={92}
        y={166}
        width={34}
        height={34}
        viewBox="0 0 128 128"
        dangerouslySetInnerHTML={{ __html: smallRock }}
      />
    </g>
  );
}
