"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CompassIcon } from "@/components/icons";
import type { AnalysisErrorResponse, RepoAnalysis } from "@/types";

type AnalysisError = AnalysisErrorResponse["error"];

type LoadingStateProps = {
  url: string;
  promise: Promise<RepoAnalysis>;
  onDone: (analysis: RepoAnalysis) => void;
  onError: (error: AnalysisError) => void;
};

const STAGES = [
  { label: "Hailing GitHub", sub: "Fetching repository metadata" },
  { label: "Hauling in PRs", sub: "Pulling merged pull requests + diffs" },
  { label: "Plotting course", sub: "Sending to AI with the scoring rubric" },
  { label: "Charting results", sub: "Compiling the manifest" },
] as const;

const FINAL_MESSAGES = [
  { label: "Scoring pull requests", sub: "AI is grading Impact, AI-Leverage, and Quality" },
  { label: "Checking the math", sub: "Recomputing weighted totals from the rubric" },
  { label: "Ranking the crew", sub: "Grouping authors and sorting the PR leaderboard" },
  { label: "Drafting recommendations", sub: "Turning score patterns into concrete next steps" },
  { label: "Preparing dashboard", sub: "Packing the report for the results view" },
] as const;

const INITIAL_PROGRESS_MS = 2500;
// The long-tail creep approaches LONG_WAIT_CAP asymptotically (1 - e^(-t/τ))
// instead of plateauing at a fixed time — so the bar keeps advancing visibly
// throughout a 30–90s scoring run and never reads as "stopped".
const LONG_WAIT_TAU_MS = 22000;
const LONG_WAIT_CAP = 0.17;
const FINAL_MESSAGE_MS = 4500;

export function LoadingState({ url, promise, onDone, onError }: LoadingStateProps) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [finalMessage, setFinalMessage] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    let settled = false;
    let cancelled = false;
    setComplete(false);
    setFinalMessage(0);

    const tick = (now: number) => {
      const elapsed = now - start;
      const initial = Math.min(1, elapsed / INITIAL_PROGRESS_MS);
      const waiting = Math.max(0, elapsed - INITIAL_PROGRESS_MS);
      // Asymptotic creep: starts moving immediately past the initial sweep,
      // approaches LONG_WAIT_CAP without ever hitting it, so the bar never
      // visually plateaus during long analyses.
      const finalCreep = LONG_WAIT_CAP * (1 - Math.exp(-waiting / LONG_WAIT_TAU_MS));
      const p = initial < 1 ? initial * 0.82 : 0.82 + finalCreep;
      setProgress(p);
      const idx = Math.min(STAGES.length - 1, Math.max(0, Math.floor(p * STAGES.length)));
      setStage(idx);
      if (idx === STAGES.length - 1) {
        setFinalMessage(Math.floor(waiting / FINAL_MESSAGE_MS) % FINAL_MESSAGES.length);
      }
      if (!settled) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);

    promise
      .then((analysis) => {
        if (cancelled) return undefined;
        settled = true;
        cancelAnimationFrame(raf);
        setProgress(1);
        setStage(STAGES.length - 1);
        setComplete(true);
        doneTimer = setTimeout(() => onDone(analysis), 200);
        return undefined;
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        settled = true;
        cancelAnimationFrame(raf);
        onError(normalizeError(error));
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [onDone, onError, promise]);

  const safeStage = STAGES[stage] ?? STAGES[STAGES.length - 1];
  const displayStage =
    stage === STAGES.length - 1 && !complete
      ? (FINAL_MESSAGES[finalMessage] ?? FINAL_MESSAGES[0])
      : safeStage;

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
        <h2 style={{ marginBottom: 12 }}>{displayStage.label}…</h2>
        <p className="muted" style={{ fontSize: 16, marginBottom: 28 }}>
          {displayStage.sub}
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
                {(i < stage || (complete && i === stage)) && <CheckIcon size={10} />}
                {i === stage && !complete && (
                  <span
                    aria-hidden
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.45)",
                      borderTopColor: "white",
                      animation: "loading-dot-spin .8s linear infinite",
                    }}
                  />
                )}
              </span>
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function normalizeError(error: unknown): AnalysisError {
  if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
    return error as AnalysisError;
  }

  return {
    code: "internal",
    message: "The analysis could not be completed.",
    hint: "Retry in a moment, or try a different public repository.",
  };
}
