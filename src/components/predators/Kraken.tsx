// Kraken: modeled on classic "release the kraken" silhouette art -- a
// smaller, twin-peaked head (not a plain circle) dominated by thick
// tentacles that radiate outward, each with a visible row of suction cups.
// Glowing red eyes. The one deliberately bigger, more elaborate asset --
// it's the level-10 finale.
export function Kraken() {
  const tentacles = [
    {
      d: "M-30 -2 Q -58 -12 -78 0 Q -86 6 -76 14",
      suckers: [
        [-46, -6, 2.3],
        [-64, -2, 1.9],
        [-78, 4, 1.4],
      ],
    },
    {
      d: "M-26 12 Q -54 16 -68 32 Q -74 40 -64 46",
      suckers: [
        [-46, 16, 2.3],
        [-62, 26, 1.9],
        [-70, 38, 1.4],
      ],
    },
    {
      d: "M-14 22 Q -22 44 -8 62 Q 0 74 -14 84",
      suckers: [
        [-18, 38, 2.3],
        [-10, 56, 1.9],
        [-8, 72, 1.4],
      ],
    },
    {
      d: "M4 25 Q 2 48 18 62 Q 30 72 20 86",
      suckers: [
        [4, 42, 2.3],
        [14, 58, 1.9],
        [22, 74, 1.4],
      ],
    },
    {
      d: "M18 22 Q 22 42 36 52 Q 48 58 42 74",
      suckers: [
        [24, 36, 2.3],
        [36, 50, 1.9],
        [42, 64, 1.4],
      ],
    },
    {
      d: "M30 6 Q 50 0 58 16 Q 62 26 50 28",
      suckers: [
        [40, 4, 2.1],
        [54, 10, 1.8],
        [54, 22, 1.4],
      ],
    },
  ];

  return (
    <g className="kraken">
      <g fill="none" strokeLinecap="round">
        {tentacles.map((t, i) => (
          <path key={i} d={t.d} stroke="#8a3d6e" strokeWidth={9} />
        ))}
      </g>
      <g fill="none" strokeLinecap="round">
        {tentacles.map((t, i) => (
          <path key={i} d={t.d} stroke="#4a1f3a" strokeWidth={3} />
        ))}
      </g>
      {tentacles.map((t, i) => (
        <g key={i} fill="#e9c9dd" stroke="#4a1f3a" strokeWidth={0.6}>
          {t.suckers.map(([cx, cy, r], j) => (
            <circle key={j} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      ))}

      {/* Twin-peaked head -- narrower and less circular than a plain dome,
          like classic kraken silhouette art. */}
      <path
        d="M-32 6 Q -36 -20 -16 -34 Q -6 -40 -2 -24 Q 2 -40 14 -34
           Q 34 -22 32 6 Q 30 24 0 26 Q -30 24 -32 6 Z"
        fill="#7a3563"
        stroke="#5c2a4a"
        strokeWidth={2.4}
      />

      <circle cx={-12} cy={-8} r={7.5} fill="#ff2d2d" opacity={0.35} />
      <circle cx={-12} cy={-8} r={4.2} fill="#ff2d2d" />
      <circle cx={-11} cy={-9} r={1.5} fill="#2a0000" />
      <circle cx={6} cy={-6} r={7.5} fill="#ff2d2d" opacity={0.35} />
      <circle cx={6} cy={-6} r={4.2} fill="#ff2d2d" />
      <circle cx={7} cy={-7} r={1.5} fill="#2a0000" />

      <path
        d="M-16 10 Q 0 16 14 8"
        fill="none"
        stroke="#2a0f22"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <g fill="#fff">
        <path d="M-12 11 l3 5 l3 -4 Z" />
        <path d="M-2 13 l3 5 l3 -4 Z" />
        <path d="M8 12 l3 4 l3 -3 Z" />
      </g>
    </g>
  );
}
