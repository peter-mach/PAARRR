"use client";

import { useEffect, useState } from "react";

type RadarChartProps = {
  impact: number;
  aiLeverage: number;
  quality: number;
  size?: number;
  animated?: boolean;
  delay?: number;
};

export function RadarChart({
  impact,
  aiLeverage,
  quality,
  size = 280,
  animated = true,
  delay = 0,
}: RadarChartProps) {
  const [progress, setProgress] = useState(animated ? 0 : 1);

  useEffect(() => {
    if (!animated) return;
    let raf: number | undefined;
    const t = setTimeout(() => {
      const start = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - (1 - p) ** 3;
        setProgress(eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(t);
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, [animated, delay, impact, aiLeverage, quality]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const axes = [
    { label: "Impact", value: impact, angle: -Math.PI / 2 },
    { label: "AI-Leverage", value: aiLeverage, angle: -Math.PI / 2 + (2 * Math.PI) / 3 },
    { label: "Quality", value: quality, angle: -Math.PI / 2 + (4 * Math.PI) / 3 },
  ];

  const point = (a: number, v: number): [number, number] => [
    cx + Math.cos(a) * r * (v / 100),
    cy + Math.sin(a) * r * (v / 100),
  ];
  const ringPts = (frac: number) =>
    axes
      .map((a) => {
        const x = cx + Math.cos(a.angle) * r * frac;
        const y = cy + Math.sin(a.angle) * r * frac;
        return `${x},${y}`;
      })
      .join(" ");
  const dataPts = axes.map((a) => point(a.angle, a.value * progress).join(",")).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <polygon
          key={f}
          points={ringPts(f)}
          fill="none"
          stroke="var(--ink-200)"
          strokeWidth="1"
          strokeDasharray={i === 3 ? "0" : "3 3"}
        />
      ))}
      {axes.map((a) => {
        const [x, y] = [cx + Math.cos(a.angle) * r, cy + Math.sin(a.angle) * r];
        return (
          <line
            key={a.label}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--ink-200)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={dataPts}
        fill="var(--primary)"
        fillOpacity="0.18"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {axes.map((a) => {
        const [x, y] = point(a.angle, a.value * progress);
        return (
          <circle
            key={a.label}
            cx={x}
            cy={y}
            r="5"
            fill="white"
            stroke="var(--primary)"
            strokeWidth="2.5"
          />
        );
      })}
      {axes.map((a) => {
        const lr = r + 28;
        const x = cx + Math.cos(a.angle) * lr;
        const y = cy + Math.sin(a.angle) * lr;
        return (
          <g key={`label-${a.label}`}>
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-display-stack)"
              fontSize="13"
              fontWeight="700"
              fill="var(--ink-900)"
              letterSpacing="-0.01em"
            >
              {a.label}
            </text>
            <text
              x={x}
              y={y + 16}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-mono-stack)"
              fontSize="13"
              fontWeight="700"
              fill="var(--accent-600)"
            >
              {Math.round(a.value * progress)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
