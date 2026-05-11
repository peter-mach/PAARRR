"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import type { AnalysisErrorResponse, RepoAnalysis } from "@/types";

type AnalysisError = AnalysisErrorResponse["error"];

type LoadingStateProps = {
  url: string;
  promise: Promise<RepoAnalysis>;
  onDone: (analysis: RepoAnalysis) => void;
  onError: (error: AnalysisError) => void;
};

const STAGES = [
  { label: "Reading GitHub", sub: "Fetching repository metadata" },
  { label: "Collecting PRs", sub: "Pulling merged pull requests and diffs" },
  { label: "Scoring with AI", sub: "Applying the PR scoring rubric" },
  { label: "Building report", sub: "Preparing the dashboard data" },
] as const;

const FINAL_MESSAGES = [
  { label: "Scoring pull requests", sub: "AI is grading Impact, AI-Leverage, and Quality" },
  { label: "Checking weighted totals", sub: "Recomputing scores from the rubric" },
  { label: "Ranking authors", sub: "Grouping contributors and sorting the PR leaderboard" },
  { label: "Drafting recommendations", sub: "Turning score patterns into concrete next steps" },
  { label: "Preparing dashboard", sub: "Assembling the report for the results view" },
] as const;

// Stage timings derived from the same curve the bar's CSS animation uses,
// so the four stage indicators advance roughly in step with the bar's fill.
const STAGE_TIMING_MS = [0, 1500, 3500, 7000] as const;
const FINAL_MESSAGE_MS = 4500;
const LAST_STAGE = STAGES.length - 1;

export function LoadingState({ url, promise, onDone, onError }: LoadingStateProps) {
  const [stage, setStage] = useState(0);
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
    setStage(0);

    const tick = (now: number) => {
      const elapsed = now - start;
      let idx = 0;
      for (let i = STAGE_TIMING_MS.length - 1; i >= 0; i -= 1) {
        if (elapsed >= STAGE_TIMING_MS[i]!) {
          idx = i;
          break;
        }
      }
      setStage(idx);
      if (idx === LAST_STAGE) {
        const waitingInLast = elapsed - STAGE_TIMING_MS[LAST_STAGE]!;
        setFinalMessage(Math.floor(waitingInLast / FINAL_MESSAGE_MS) % FINAL_MESSAGES.length);
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
        setStage(LAST_STAGE);
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              filter: "drop-shadow(0 18px 34px rgba(29,37,59,0.16))",
              animation: "float-y 3s ease-in-out infinite",
            }}
          >
            <LogoMark size={76} />
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
          className="loading-bar-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={complete ? "Complete" : "Analyzing"}
        >
          <div className={`loading-bar-fill${complete ? " is-complete" : ""}`} />
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
