"use client";

import { useEffect, useState } from "react";
import { CountUp } from "@/components/charts/count-up";

type ScoreBarProps = {
  value: number;
  label?: string;
  color?: string;
  delay?: number;
};

export function ScoreBar({ value, label, color = "var(--primary)", delay = 0 }: ScoreBarProps) {
  const [w, setW] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setW(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {label !== undefined && (
        <div
          style={{
            minWidth: 90,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--ink-700)",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          flex: 1,
          height: 8,
          background: "var(--ink-100)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${w}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
            transition: "width 1.2s cubic-bezier(.2,.7,.2,1)",
          }}
        />
      </div>
      <div
        className="num-mono"
        style={{
          minWidth: 32,
          textAlign: "right",
          fontWeight: 700,
          fontSize: 13,
          color: "var(--ink-900)",
        }}
      >
        <CountUp value={value} duration={1200} delay={delay} />
      </div>
    </div>
  );
}
