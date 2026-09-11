// Piranha: small, deep-bodied, all teeth.
export function Piranha() {
  return (
    <g className="piranha">
      <path d="M18 0 L30 -10 L25 0 L30 10 Z" fill="#5c7a2a" />
      <path
        d="M-22 0 Q -10 -16 16 -8 Q 24 -2 24 0 Q 24 2 16 8 Q -10 16 -22 0 Z"
        fill="#8fae3f"
        stroke="#5c7a2a"
        strokeWidth={2}
      />
      <path d="M-16 4 Q -2 12 14 6 Q 2 9 -16 8 Z" fill="#e8724f" opacity={0.85} />
      <circle cx={-12} cy={-3} r={2.4} fill="#04121a" />
      <path
        d="M-22 3 Q -14 9 -4 7"
        fill="none"
        stroke="#04121a"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <g fill="#fff">
        <path d="M-19 4 l2.4 4 l2.4 -3.2 Z" />
        <path d="M-13 6 l2.4 4 l2.4 -3.2 Z" />
      </g>
    </g>
  );
}
