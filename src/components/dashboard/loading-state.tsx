"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CompassIcon } from "@/components/icons";

type LoadingStateProps = {
  url: string;
  onDone: () => void;
};

const STAGES = [
  { label: "Hailing GitHub", sub: "Fetching repository metadata" },
  { label: "Hauling in PRs", sub: "Pulling merged pull requests + diffs" },
  { label: "Plotting course", sub: "Sending to AI with the scoring rubric" },
  { label: "Charting results", sub: "Compiling the manifest" },
] as const;

export function LoadingState({ url, onDone }: LoadingStateProps) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const total = 4200;
    let raf = 0;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      setProgress(p);
      const idx = Math.min(STAGES.length - 1, Math.max(0, Math.floor(p * STAGES.length)));
      setStage(idx);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        doneTimer = setTimeout(onDone, 200);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [onDone]);

  const safeStage = STAGES[stage] ?? STAGES[STAGES.length - 1];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--paper)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            position: "relative",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -16,
              borderRadius: "50%",
              background: "var(--primary-100)",
              animation: "pulse-ring 2s ease-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -16,
              borderRadius: "50%",
              background: "var(--primary-100)",
              animation: "pulse-ring 2s ease-out infinite .7s",
            }}
          />
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "var(--ink-900)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              animation: "ship-rock 3s ease-in-out infinite",
            }}
          >
            <CompassIcon size={56} />
          </div>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono-stack)",
            fontSize: 12,
            color: "var(--ink-500)",
            marginBottom: 8,
          }}
        >
          {url}
        </div>
        <h2 style={{ marginBottom: 12 }}>{safeStage.label}…</h2>
        <p className="muted" style={{ fontSize: 16, marginBottom: 28 }}>
          {safeStage.sub}
        </p>
        <div
          style={{
            height: 6,
            background: "var(--ink-100)",
            borderRadius: 999,
            overflow: "hidden",
            maxWidth: 360,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--primary), var(--accent))",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s linear infinite",
              transition: "width .3s ease",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {STAGES.map((s, i) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: i <= stage ? "var(--ink-900)" : "var(--ink-400)",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background:
                    i < stage ? "var(--green)" : i === stage ? "var(--primary)" : "var(--ink-200)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {i < stage && <CheckIcon size={10} />}
              </span>
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
