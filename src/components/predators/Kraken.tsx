import krakenArtwork from "../../assets/kraken.svg?raw";

// The level-10 finale deliberately breaks from every other creature's flat
// cartoon style: a detailed, public-domain illustration (see
// src/assets/kraken.svg for source/license) embedded as-is via
// dangerouslySetInnerHTML. Unlike the other creatures this one isn't drawn
// in profile with a clear nose-left "front" -- it's a radial "attacking from
// above" pose. Used at its native orientation (no mirror/rotate): of the
// options tried, this is the one that reads as facing the puffer.
export function Kraken() {
  return (
    <g className="kraken">
      <svg
        x={-75}
        y={-68}
        width={150}
        height={150}
        viewBox="0 0 600 600"
        dangerouslySetInnerHTML={{ __html: krakenArtwork }}
      />
    </g>
  );
}
