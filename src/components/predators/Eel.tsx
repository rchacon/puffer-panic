// Electric eel: a long S-curve tube, no fins to speak of, a few spark marks.
export function Eel() {
  return (
    <g className="eel">
      <path
        d="M46 0 Q 20 -18 0 0 Q -20 18 -46 0"
        fill="none"
        stroke="#3f8f5f"
        strokeWidth={11}
        strokeLinecap="round"
      />
      <path d="M2 -9 L11 -19 L15 -7 Z" fill="#2c6b45" />
      <circle cx={-40} cy={0} r={2.4} fill="#04121a" />
      <path
        d="M-46 2 Q -42 7 -35 6"
        fill="none"
        stroke="#04121a"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <g stroke="#ffe066" strokeWidth={1.6} strokeLinecap="round" fill="none">
        <path d="M-8 -8 l4 4 l-2 2 l4 4" />
        <path d="M18 6 l4 -4 l-2 -2 l4 -4" />
      </g>
    </g>
  );
}
