// Puffer fish drawn around the origin, facing right (toward the shark).
// Roughly 24 units radius including spikes.
export function Puffer() {
  const spikes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return {
      x1: Math.cos(a) * 16,
      y1: Math.sin(a) * 16,
      x2: Math.cos(a) * 24,
      y2: Math.sin(a) * 24,
    };
  });

  return (
    <g className="puffer">
      <g
        className="puffer__spikes"
        stroke="#e8952f"
        strokeWidth={2.4}
        strokeLinecap="round"
      >
        {spikes.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
        ))}
      </g>
      <path d="M-14 0 L-27 -9 L-27 9 Z" fill="#f2ad4d" />
      <circle r={17} fill="#ffd680" stroke="#e8952f" strokeWidth={2.4} />
      <circle r={17} fill="#ffffff" opacity={0.15} transform="translate(-4 -5) scale(0.6)" />
      <circle cx={8} cy={-3} r={3.4} fill="#123" />
      <circle cx={9} cy={-4} r={1.1} fill="#fff" />
      <path
        d="M8 7 q 5 4 10 0"
        fill="none"
        stroke="#a85f1a"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </g>
  );
}
