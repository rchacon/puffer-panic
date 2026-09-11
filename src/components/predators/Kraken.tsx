// Kraken: a bulbous mantle with big eyes and curling tentacles reaching left,
// toward the puffer. The one deliberately bigger, more elaborate asset --
// it's the level-10 finale.
export function Kraken() {
  const reaching = [
    "M-10 -6 Q -40 -20 -60 -6 Q -46 2 -30 0",
    "M-8 0 Q -42 4 -58 14",
    "M-6 8 Q -38 22 -52 34",
    "M-4 14 Q -30 30 -40 46",
  ];
  return (
    <g className="kraken">
      <g stroke="#5c2a4a" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.95}>
        {reaching.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <path
        d="M-10 -30 Q 30 -34 46 -10 Q 54 6 40 20 Q 20 32 -10 26 Q -26 16 -26 0 Q -26 -18 -10 -30 Z"
        fill="#7a3563"
        stroke="#5c2a4a"
        strokeWidth={2.4}
      />
      <circle cx={4} cy={-8} r={6} fill="#fff" />
      <circle cx={6} cy={-8} r={3} fill="#04121a" />
      <circle cx={22} cy={-4} r={6} fill="#fff" />
      <circle cx={24} cy={-4} r={3} fill="#04121a" />
      <path
        d="M-6 12 Q 10 22 26 12"
        fill="none"
        stroke="#3a1830"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </g>
  );
}
