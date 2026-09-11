// Kraken: a bulbous mantle with glowing red eyes and thick tentacles --
// two reaching toward the puffer, four trailing below/behind. The one
// deliberately bigger, more elaborate asset -- it's the level-10 finale.
export function Kraken() {
  const tentacles = [
    "M-20 4 Q -52 -8 -74 2 Q -82 8 -72 16",
    "M-22 12 Q -54 14 -70 30 Q -76 38 -66 44",
    "M-12 22 Q -24 44 -10 62 Q -2 74 -16 84",
    "M4 26 Q 0 48 16 62 Q 28 72 18 86",
    "M20 22 Q 22 42 36 52 Q 48 58 42 74",
    "M40 -14 Q 58 -18 64 -4 Q 66 6 56 8",
  ];
  const suckers = [
    [-30, 34], [-18, 54],
    [10, 40], [18, 60],
    [28, 40], [38, 56],
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

      <path
        d="M-10 -30 Q 30 -34 46 -10 Q 54 6 40 20 Q 20 32 -10 26 Q -26 16 -26 0 Q -26 -18 -10 -30 Z"
        fill="#7a3563"
        stroke="#5c2a4a"
        strokeWidth={2.4}
      />

      <circle cx={4} cy={-8} r={7.5} fill="#ff2d2d" opacity={0.35} />
      <circle cx={4} cy={-8} r={4.2} fill="#ff2d2d" />
      <circle cx={5} cy={-9} r={1.5} fill="#2a0000" />
      <circle cx={22} cy={-4} r={7.5} fill="#ff2d2d" opacity={0.35} />
      <circle cx={22} cy={-4} r={4.2} fill="#ff2d2d" />
      <circle cx={23} cy={-5} r={1.5} fill="#2a0000" />

      <path
        d="M-8 14 Q 10 20 28 12"
        fill="none"
        stroke="#2a0f22"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <g fill="#fff">
        <path d="M-4 15 l3 5 l3 -4 Z" />
        <path d="M6 17 l3 5 l3 -4 Z" />
        <path d="M16 16 l3 4 l3 -3 Z" />
      </g>
    </g>
  );
}
