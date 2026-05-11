type LogoProps = { size?: number; color?: string };

export function Logo({ size = 32, color = "var(--ink-900)" }: LogoProps) {
  return (
    <div className="inline-flex items-center" style={{ gap: 9, color }}>
      <div
        className="flex items-center justify-center"
        style={{
          width: size,
          height: size,
          transform: "rotate(-12deg)",
        }}
        aria-hidden
      >
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
          <path
            d="M6.8 8.9c0-2.1 1.7-3.8 3.8-3.8h14.8c2.1 0 3.8 1.7 3.8 3.8v18.2c0 2.1-1.7 3.8-3.8 3.8H10.6c-2.1 0-3.8-1.7-3.8-3.8V8.9Z"
            fill="currentColor"
          />
          <path
            d="M13.5 10.2v11.2M22.4 10.5v4.1c0 2.1-1.7 3.8-3.8 3.8h-5.1"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13.5" cy="24.7" r="3.1" fill="white" />
          <circle cx="13.5" cy="10.2" r="3.1" fill="white" />
          <path
            d="m20.1 11 2.3-2.3 2.3 2.3"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span
        style={{
          fontFamily: "var(--font-sans-stack)",
          fontWeight: 500,
          fontSize: size * 0.48,
          lineHeight: 0.86,
          letterSpacing: 0,
          color,
          display: "inline-flex",
          flexDirection: "column",
        }}
      >
        <span>paarrr</span>
        <span>.online</span>
      </span>
    </div>
  );
}
