"use client";

import { CountUp } from "@/components/charts/count-up";

type ScoreCellProps = {
  value: number;
  delay: number;
  color: string;
  label: string;
};

export function ScoreCell({ value, delay, color, label }: ScoreCellProps) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        className="pr-cell-label"
        style={{
          display: "none",
          fontSize: 10,
          fontWeight: 700,
          color: "var(--ink-500)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div className="num-mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--ink-900)" }}>
        <CountUp value={value} duration={1000} delay={delay} />
      </div>
      <div
        style={{
          height: 3,
          background: "var(--ink-100)",
          borderRadius: 2,
          marginTop: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: color,
            borderRadius: 2,
            width: `${value}%`,
            transition: `width 1s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
