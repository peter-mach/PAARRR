"use client";

import { ArrowIcon } from "@/components/icons";
import { RadarChart } from "@/components/charts/radar-chart";
import { CountUp } from "@/components/charts/count-up";
import { SAMPLE_AGGREGATE } from "@/lib/mock-data";

type PreviewProps = {
  onAnalyze: () => void;
};

export function Preview({ onAnalyze }: PreviewProps) {
  return (
    <section id="preview" style={{ background: "var(--paper)" }}>
      <div className="container">
        <div
          className="reveal"
          style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}
        >
          <div className="eyebrow">Sample report</div>
          <h2 style={{ marginTop: 12 }}>This is what the manifest looks like.</h2>
          <p className="muted" style={{ marginTop: 14, fontSize: 18 }}>
            Live from a real repo. Scores animate in, cards fan out, and high totals get a little
            fanfare.
          </p>
        </div>
        <div
          className="reveal card"
          style={{
            padding: 32,
            background: "linear-gradient(180deg, white, var(--ink-50))",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 48,
              flexWrap: "wrap",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                className="num-display"
                style={{
                  fontSize: 128,
                  color: "var(--accent)",
                  lineHeight: 0.95,
                }}
              >
                <CountUp value={SAMPLE_AGGREGATE.total} duration={1400} />
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-500)",
                }}
              >
                Sample report · {SAMPLE_AGGREGATE.url}
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <RadarChart
                impact={SAMPLE_AGGREGATE.impact}
                aiLeverage={SAMPLE_AGGREGATE.aiLeverage}
                quality={SAMPLE_AGGREGATE.quality}
                size={260}
                animated
                delay={200}
              />
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button type="button" className="btn btn-primary" onClick={onAnalyze}>
            Open the full dashboard <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
