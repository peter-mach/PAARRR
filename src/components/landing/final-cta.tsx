"use client";

import { ArrowIcon, CheckIcon } from "@/components/icons";

type FinalCTAProps = {
  onAnalyze: () => void;
};

export function FinalCTA({ onAnalyze }: FinalCTAProps) {
  return (
    <section
      style={{
        padding: "78px 0",
        background: "var(--ink-900)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
          <h2
            style={{
              color: "white",
              fontSize: 48,
              letterSpacing: 0,
            }}
          >
            Get Started in Minutes
          </h2>
          <p
            style={{
              marginTop: 18,
              fontSize: 18,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 520,
            }}
          >
            Paste a repository URL and receive a scored PR dashboard in about a minute. Public repos
            work without setup.
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
        <div style={{ display: "grid", gap: 14, justifyContent: "center" }}>
          <div
            style={{
              width: 220,
              borderRadius: 8,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              padding: 18,
              color: "white",
              animation: "float-y 4s ease-in-out infinite",
            }}
          >
            {["Impact verified", "AI leverage scored", "Quality reviewed"].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "9px 0",
                  fontWeight: 700,
                }}
              >
                <span style={{ color: "var(--green)", display: "inline-flex" }}>
                  <CheckIcon size={16} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
