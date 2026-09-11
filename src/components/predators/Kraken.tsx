// Kraken: a round, dome-topped octopus head -- not the elongated fish-like
// blob the earlier version used -- with glowing red eyes and thick, textured
// tentacles radiating from underneath it. Two reach toward the puffer, four
// trail below. The one deliberately bigger, more elaborate asset -- it's the
// level-10 finale.
export function Kraken() {
  const tentacles = [
    "M-30 -4 Q -58 -14 -78 -2 Q -86 4 -76 12",
    "M-26 10 Q -54 14 -68 30 Q -74 38 -64 44",
    "M-14 22 Q -22 44 -8 62 Q 0 74 -14 84",
    "M4 25 Q 2 48 18 62 Q 30 72 20 86",
    "M18 22 Q 22 42 36 52 Q 48 58 42 74",
    "M30 6 Q 50 0 58 16 Q 62 26 50 28",
  ];
  const suckers = [
    [-24, 34], [-12, 54],
    [12, 40], [20, 60],
    [30, 40], [38, 56],
  ];

  return (
    <g className="kraken">
      <g fill="none" strokeLinecap="round">
        {tentacles.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="#8a3d6e" strokeWidth={9} />
            <path d={d} stroke="#4a1f3a" strokeWidth={3} />
          </g>
        ))}
      </g>
      <g fill="#3a1830" opacity={0.8}>
        {suckers.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2} />
        ))}
      </g>

      {/* Round, dome-topped head -- the classic octopus silhouette. */}
      <path
        d="M-32 2 Q -36 -28 0 -32 Q 36 -28 32 2 Q 30 22 0 26 Q -30 22 -32 2 Z"
        fill="#7a3563"
        stroke="#5c2a4a"
        strokeWidth={2.4}
      />

      <circle cx={-14} cy={-8} r={7.5} fill="#ff2d2d" opacity={0.35} />
      <circle cx={-14} cy={-8} r={4.2} fill="#ff2d2d" />
      <circle cx={-13} cy={-9} r={1.5} fill="#2a0000" />
      <circle cx={4} cy={-6} r={7.5} fill="#ff2d2d" opacity={0.35} />
      <circle cx={4} cy={-6} r={4.2} fill="#ff2d2d" />
      <circle cx={5} cy={-7} r={1.5} fill="#2a0000" />

      <path
        d="M-18 10 Q 0 16 16 8"
        fill="none"
        stroke="#2a0f22"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <g fill="#fff">
        <path d="M-14 11 l3 5 l3 -4 Z" />
        <path d="M-4 13 l3 5 l3 -4 Z" />
        <path d="M6 12 l3 4 l3 -3 Z" />
      </g>
    </g>
  );
}
