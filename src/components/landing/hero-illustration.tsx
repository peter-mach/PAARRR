type HeroIllustrationProps = {
  accent?: string;
};

/**
 * Hero illustration — paper-boat-on-a-code-wave-sea variant.
 * Ship is the production default per the design handoff;
 * Map and Bottle variants from the prototype's tweaks panel are intentionally dropped.
 */
export function HeroIllustration({ accent = "var(--accent)" }: HeroIllustrationProps) {
  return (
    <svg
      viewBox="0 0 520 480"
      style={{ width: "100%", height: "auto", display: "block" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1f6ff" />
          <stop offset="1" stopColor="#fdfcf8" />
        </linearGradient>
        <linearGradient id="hero-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe0ff" />
          <stop offset="1" stopColor="#7fa3e6" />
        </linearGradient>
        <linearGradient id="hero-sail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#f3ead4" />
        </linearGradient>
      </defs>

      {/* Backdrop circle */}
      <circle cx="260" cy="220" r="200" fill="url(#hero-sky)" />
      <circle
        cx="260"
        cy="220"
        r="200"
        fill="none"
        stroke="#e6efff"
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {/* Sun */}
      <circle cx="380" cy="120" r="36" fill={accent} opacity="0.18" />
      <circle cx="380" cy="120" r="22" fill={accent} opacity="0.3" />
      <circle cx="380" cy="120" r="12" fill={accent} />

      {/* Clouds */}
      <g fill="#fff" opacity="0.95">
        <ellipse cx="120" cy="110" rx="34" ry="11" />
        <ellipse cx="140" cy="105" rx="22" ry="9" />
        <ellipse cx="430" cy="180" rx="28" ry="9" />
      </g>

      {/* Sea waves */}
      <g>
        <path
          d="M60 320 Q130 300 200 320 T340 320 T480 320 L480 410 L60 410 Z"
          fill="url(#hero-sea)"
        />
        <path
          d="M60 340 Q130 322 200 340 T340 340 T480 340"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          opacity="0.6"
        />
        <path
          d="M60 365 Q130 350 200 365 T340 365 T480 365"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          opacity="0.4"
        />
        <path
          d="M60 390 Q130 378 200 390 T340 390 T480 390"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          opacity="0.3"
        />
      </g>

      {/* Ship — animated rocking */}
      <g
        style={{
          transformOrigin: "260px 320px",
          animation: "ship-rock 4s ease-in-out infinite",
        }}
      >
        {/* Hull */}
        <path d="M170 305 L350 305 L325 360 L195 360 Z" fill="var(--ink-900)" />
        <path d="M180 312 L340 312 L322 318 L198 318 Z" fill={accent} />
        <rect x="215" y="328" width="14" height="14" rx="2" fill="#f8f3e7" />
        <rect x="245" y="328" width="14" height="14" rx="2" fill="#f8f3e7" />
        <rect x="275" y="328" width="14" height="14" rx="2" fill="#f8f3e7" />
        <rect x="305" y="328" width="14" height="14" rx="2" fill="#f8f3e7" />

        {/* Mast */}
        <rect x="258" y="170" width="4" height="135" fill="var(--ink-800)" />

        {/* Big sail */}
        <path
          d="M262 175 L262 295 L335 295 Q325 235 262 175 Z"
          fill="url(#hero-sail)"
          stroke="var(--ink-300)"
          strokeWidth="1"
        />
        <path d="M262 200 L320 270" stroke="var(--ink-200)" strokeWidth="1" fill="none" />
        <path d="M262 230 L312 285" stroke="var(--ink-200)" strokeWidth="1" fill="none" />

        {/* Small sail */}
        <path
          d="M258 180 L258 280 L195 280 Q205 230 258 180 Z"
          fill="url(#hero-sail)"
          stroke="var(--ink-300)"
          strokeWidth="1"
        />

        {/* Pirate flag */}
        <rect x="260" y="155" width="40" height="22" fill="var(--ink-900)" />
        <g fill="white" transform="translate(280 166)">
          <circle cx="0" cy="0" r="4" />
          <circle cx="-1.5" cy="-0.5" r="0.6" fill="var(--ink-900)" />
          <circle cx="1.5" cy="-0.5" r="0.6" fill="var(--ink-900)" />
        </g>
        <line x1="262" y1="155" x2="299" y2="177" stroke="white" strokeWidth="1.2" />
        <line x1="299" y1="155" x2="262" y2="177" stroke="white" strokeWidth="1.2" />
      </g>

      {/* Floating bits — code symbols on waves */}
      <g fontFamily="var(--font-mono-stack)" fontSize="14" fontWeight="700" fill="var(--ink-700)">
        <text x="80" y="260" style={{ animation: "float-y 3s ease-in-out infinite" }}>
          {"</>"}
        </text>
        <text x="430" y="270" style={{ animation: "float-y 3.5s ease-in-out infinite .5s" }}>
          PR
        </text>
        <text x="100" y="380" opacity="0.5" fill="white">
          git
        </text>
      </g>

      {/* Compass rose corner */}
      <g transform="translate(70 70)" opacity="0.6">
        <circle r="22" fill="none" stroke={accent} strokeWidth="1" />
        <circle r="14" fill="none" stroke={accent} strokeWidth="0.8" strokeDasharray="2 2" />
        <path d="M0 -16 L4 0 L0 16 L-4 0 Z" fill={accent} />
        <path d="M-16 0 L0 -4 L16 0 L0 4 Z" fill={accent} opacity="0.5" />
      </g>
    </svg>
  );
}
