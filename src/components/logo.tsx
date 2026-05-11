import type { CSSProperties } from "react";

type LogoProps = { size?: number; color?: string; detailColor?: string };
type LogoMarkProps = LogoProps & { className?: string; style?: CSSProperties };

export function LogoMark({
  size = 32,
  color = "var(--ink-900)",
  detailColor = "white",
  className,
  style,
}: LogoMarkProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        color,
        transform: "rotate(-12deg)",
        ...style,
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
          stroke={detailColor}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="13.5" cy="24.7" r="3.1" fill={detailColor} />
        <circle cx="13.5" cy="10.2" r="3.1" fill={detailColor} />
        <path
          d="m20.1 11 2.3-2.3 2.3 2.3"
          stroke={detailColor}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function Logo({ size = 32, color = "var(--ink-900)", detailColor = "white" }: LogoProps) {
  return (
    <div className="inline-flex items-center" style={{ gap: 9, color }}>
      <LogoMark size={size} color={color} detailColor={detailColor} />
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
