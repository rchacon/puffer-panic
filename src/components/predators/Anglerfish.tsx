// Anglerfish: round dark body, glowing lure, a big toothy grin.
export function Anglerfish() {
  return (
    <g className="anglerfish">
      <path
        d="M-28 -32 Q -20 -48 -10 -38"
        fill="none"
        stroke="#2b2547"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <circle cx={-10} cy={-38} r={7} fill="#ffe066" opacity={0.35} />
      <circle cx={-10} cy={-38} r={3.4} fill="#ffe066" />
      <path
        d="M-40 0 Q -30 -26 10 -18 Q 34 -8 34 0 Q 34 8 10 18 Q -30 26 -40 0 Z"
        fill="#4a4166"
        stroke="#2b2547"
        strokeWidth={2}
      />
      <circle cx={-20} cy={-8} r={3} fill="#04121a" />
      <circle cx={-19} cy={-9} r={1} fill="#fff" />
      <path
        d="M-40 6 Q -20 22 8 14"
        fill="none"
        stroke="#2b2547"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <g fill="#fff">
        <path d="M-34 8 l3 6 l3 -5 Z" />
        <path d="M-25 12 l3 6 l3 -5 Z" />
        <path d="M-15 14 l3 5 l3 -4 Z" />
      </g>
    </g>
  );
}
