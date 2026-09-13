import krakenArtwork from "../../assets/kraken.svg?raw";

// The level-10 finale deliberately breaks from every other creature's flat
// cartoon style: a detailed, public-domain illustration (see
// src/assets/kraken.svg for source/license) embedded as-is via
// dangerouslySetInnerHTML. Unlike the other creatures this one isn't drawn
// in profile with a clear nose-left "front" -- it's a radial "attacking from
// above" pose. Used at its native orientation (no mirror/rotate): of the
// options tried, this is the one that reads as facing the puffer.
//
// Sized 1.3x its original footprint (was 150 wide) to feel more like the
// final boss -- x/y are scaled by the same factor so the art stays
// centered the same way relative to the shared approach position, not
// just grown from a corner. Checked round-by-round (including the
// closest approach, sharkX=150) that this doesn't clip its tentacle tips
// against the scene's top/bottom edges in a way that looks like a mistake
// rather than the creature simply filling more of the frame.
export function Kraken() {
  return (
    <g className="kraken">
      <svg
        x={-97.5}
        y={-88.4}
        width={195}
        height={195}
        viewBox="0 0 600 600"
        dangerouslySetInnerHTML={{ __html: krakenArtwork }}
      />
    </g>
  );
}
