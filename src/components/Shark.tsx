// Shark drawn around the origin, nose pointing left (toward the puffer fish).
// Roughly 60 units from nose to tail tip.
export function Shark() {
  return (
    <g className="shark">
      <path d="M40 0 L60 -16 L53 0 L60 16 Z" fill="#4f6d7e" />
      <path
        d="M-46 0 Q -18 -21 30 -11 Q 48 -5 48 0 Q 48 5 30 11 Q -18 21 -46 0 Z"
        fill="#7f9dae"
        stroke="#4f6d7e"
        strokeWidth={2}
      />
      <path d="M-38 7 Q -8 17 30 8 Q 6 13 -38 11 Z" fill="#d6e0e6" opacity={0.85} />
      <path d="M2 -12 L15 -31 L23 -12 Z" fill="#6a8898" />
      <path d="M-2 9 L9 27 L18 10 Z" fill="#6a8898" />
      <circle cx={-34} cy={-3} r={2.7} fill="#04121a" />
      <path
        d="M-46 4 Q -33 12 -17 10"
        fill="none"
        stroke="#04121a"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <g fill="#fff">
        <path d="M-42 5 l3 5 l3 -4 Z" />
        <path d="M-34 7 l3 5 l3 -4 Z" />
        <path d="M-26 8 l3 4 l3 -3 Z" />
      </g>
    </g>
  );
}
