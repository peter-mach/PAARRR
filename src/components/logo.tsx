import { CompassIcon } from "@/components/icons";

type LogoProps = { size?: number; color?: string };

export function Logo({ size = 32, color = "var(--ink-900)" }: LogoProps) {
  return (
    <div className="inline-flex items-center" style={{ gap: 10 }}>
      <div
        className="flex items-center justify-center text-white"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "var(--ink-900)",
          position: "relative",
          boxShadow: "0 2px 0 var(--accent-600), 0 4px 10px rgba(11,24,48,0.18)",
        }}
      >
        <CompassIcon size={size * 0.7} />
      </div>
      <span
        style={{
          fontFamily: "var(--font-display-stack)",
          fontWeight: 800,
          fontSize: size * 0.72,
          letterSpacing: "-0.04em",
          color,
        }}
      >
        PAARRR
      </span>
    </div>
  );
}
