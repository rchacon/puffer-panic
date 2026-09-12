import mosasaurusArtwork from "../../assets/mosasaurus.svg?raw";

// Level 9's Mosasaurus -- hand-authored vector art (not a trace of any
// reference image; see AGENTS.md), embedded the same way as Kraken.tsx:
// `?raw` + dangerouslySetInnerHTML. No internal ids, so unlike
// Piranha/Shark it doesn't need scopeIds -- it only ever renders once
// (count: 1). Already drawn nose-left in its native orientation.
export function Mosasaurus() {
  return (
    <g className="mosasaurus">
      <svg
        x={-72}
        y={-29}
        width={120}
        height={57}
        viewBox="0 0 800 380"
        dangerouslySetInnerHTML={{ __html: mosasaurusArtwork }}
      />
    </g>
  );
}
