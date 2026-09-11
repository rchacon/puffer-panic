// Mosasaurus: a long marine reptile -- paddle flippers instead of fins, a
// low dorsal ridge, a crocodile-like jaw full of teeth.
export function Mosasaurus() {
  return (
    <g className="mosasaurus">
      <path d="M50 0 Q 30 -10 12 0 Q 30 10 50 0 Z" fill="#3c5a4a" />
      <path
        d="M-56 0 Q -20 -18 30 -8 Q 46 -3 46 0 Q 46 3 30 8 Q -20 18 -56 0 Z"
        fill="#5d8069"
        stroke="#3c5a4a"
        strokeWidth={2}
      />
      <path d="M-4 -12 Q 6 -20 18 -14 Q 8 -12 2 -6 Z" fill="#3c5a4a" />
      <path d="M-24 9 L-14 22 L-6 8 Z" fill="#4c6b58" />
      <path d="M14 7 L24 17 L18 3 Z" fill="#4c6b58" />
      <circle cx={-46} cy={-3} r={2.6} fill="#04121a" />
      <path
        d="M-56 2 Q -40 11 -14 8"
        fill="none"
        stroke="#04121a"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <g fill="#fff">
        <path d="M-54 4 l3 5 l3 -4 Z" />
        <path d="M-46 6 l3 5 l3 -4 Z" />
        <path d="M-38 7 l3 5 l3 -4 Z" />
        <path d="M-30 8 l3 4 l3 -3 Z" />
      </g>
    </g>
  );
}
