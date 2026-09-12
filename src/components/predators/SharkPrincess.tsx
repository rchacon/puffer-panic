import sharkPrincessArtwork from "../../assets/shark-princess.svg?raw";

// Level 3's cheerful crowned whale shark -- real vector art (unlike the
// raster PNG this used at first, see git history for why that didn't
// stick), embedded the same way as Kraken.tsx: `?raw` + dangerouslySetInnerHTML.
// The source's internal gradient ids were hand-prefixed (sp-body, sp-fin,
// etc.) the same way Kraken's were, so they can't collide with another
// embedded SVG's own same-named ids if one ever ends up in the DOM at once.
export function SharkPrincess() {
  return (
    <g className="shark-princess">
      <svg
        x={-54}
        y={-34}
        width={108}
        height={68}
        viewBox="0 0 1200 760"
        dangerouslySetInnerHTML={{ __html: sharkPrincessArtwork }}
      />
    </g>
  );
}
