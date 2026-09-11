import krakenArtwork from "../../assets/kraken.svg?raw";

// The level-10 finale deliberately breaks from every other creature's flat
// cartoon style: a detailed, public-domain illustration (see
// src/assets/kraken.svg for source/license) embedded as-is via
// dangerouslySetInnerHTML. Mirrored so it faces left, toward the puffer,
// matching every other creature's nose-left convention -- the source art
// faces right.
export function Kraken() {
  return (
    <g className="kraken" transform="scale(-1, 1)">
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
