"use client";

import { ArrowIcon, CompassIcon } from "@/components/icons";

type FinalCTAProps = {
  onAnalyze: () => void;
};

export function FinalCTA({ onAnalyze }: FinalCTAProps) {
  return (
    <section
      style={{
        padding: "80px 0",
        background: "var(--ink-900)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle decorative wave at the top */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          opacity: 0.1,
        }}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 50 Q360 10 720 50 T1440 50 L1440 0 L0 0 Z" fill="white" />
      </svg>
      <div
        className="container stack-mobile"
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 40,
          alignItems: "center",
          position: "relative",
        }}
      >
        <div className="final-cta-text">
          <div className="eyebrow" style={{ color: "var(--gold)" }}>
            All hands on deck
          </div>
          <h2
            style={{
              color: "white",
              marginTop: 12,
              fontSize: 44,
              letterSpacing: "-0.03em",
            }}
          >
            Find out who&apos;s shipping treasure on your team.
          </h2>
          <p
            style={{
              marginTop: 18,
              fontSize: 18,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 520,
            }}
          >
            Free for public repos. Drops a full report in under 60 seconds. No card, no installs.
          </p>
          <button
            type="button"
            className="btn btn-accent"
            style={{ marginTop: 28 }}
            onClick={onAnalyze}
          >
            Analyze a repo <ArrowIcon />
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="final-cta-compass"
            style={{
              width: 200,
              height: 200,
              color: "var(--accent)",
              animation: "float-y 4s ease-in-out infinite",
            }}
          >
            <CompassIcon size={200} />
          </div>
        </div>
      </div>
    </section>
  );
}
