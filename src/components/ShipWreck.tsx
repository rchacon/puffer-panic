// A sunken ship, half-buried in the seabed -- background scenery for the
// Kraken's lair (level 10), the reward for playing 10 games in a row.
// Positioned in scene-absolute coordinates (not around an origin like the
// predators/Puffer, since it never moves or scales).
export function ShipWreck() {
  return (
    <g className="shipwreck" opacity={0.85}>
      <path d="M298 178 L303 96 L307 178 Z" fill="#3a2c22" />
      <path d="M303 108 L324 121 L303 127 Z" fill="#2a2018" opacity={0.85} />
      <path
        d="M250 178 Q 260 150 310 148 Q 368 148 388 171 Q 390 181 368 185 Q 300 193 260 186 Q 248 184 250 178 Z"
        fill="#4a3a2c"
        stroke="#2a2018"
        strokeWidth={2}
      />
      <path
        d="M268 160 Q 318 152 368 161"
        fill="none"
        stroke="#2a2018"
        strokeWidth={1.6}
        opacity={0.6}
      />
      <circle cx={323} cy={168} r={7} fill="#1a2a33" stroke="#2a2018" strokeWidth={2} />
      <circle cx={323} cy={168} r={3} fill="#2f4a55" />
      <path
        d="M354 150 Q 359 168 349 185"
        fill="none"
        stroke="#2a2018"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.7}
      />
    </g>
  );
}
