"use client";

import { ArrowIcon } from "@/components/icons";
import { RadarChart } from "@/components/charts/radar-chart";
import { CountUp } from "@/components/charts/count-up";
import { SAMPLE_AGGREGATE, SAMPLE_PRS, totalScore } from "@/lib/mock-data";

type PreviewProps = {
  onAnalyze: () => void;
};

export function Preview({ onAnalyze }: PreviewProps) {
  return (
    <section id="preview" style={{ background: "var(--paper)" }}>
      <div className="container">
        <div className="reference-rich-inner reveal" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 50 }}>Sample PR Result</h2>
          <p style={{ marginTop: 18, fontSize: 18, lineHeight: 1.65, color: "var(--ink-900)" }}>
            A static preview of the report users receive after analysis: total score, three-axis
            breakdown, and sortable pull requests.
          </p>
        </div>

        <div className="preview-shell reveal" style={{ marginTop: 54 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: 28,
              padding: 30,
              alignItems: "center",
              background: "white",
            }}
            className="preview-grid"
          >
            <div style={{ textAlign: "center" }}>
              <div
                className="num-display"
                style={{
                  fontSize: 118,
                  color: "var(--primary)",
                  lineHeight: 0.9,
                }}
              >
                <CountUp value={SAMPLE_AGGREGATE.total} duration={1400} />
              </div>
              <div
                style={{
                  marginTop: 12,
                  color: "var(--ink-500)",
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {SAMPLE_AGGREGATE.url}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
              <RadarChart
                impact={SAMPLE_AGGREGATE.impact}
                aiLeverage={SAMPLE_AGGREGATE.aiLeverage}
                quality={SAMPLE_AGGREGATE.quality}
                size={230}
                animated
                delay={200}
              />
              <div style={{ display: "grid", gap: 12 }}>
                {SAMPLE_PRS.slice(0, 4).map((pr) => (
                  <div
                    key={pr.num}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "42px 1fr 52px",
                      gap: 12,
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid var(--ink-100)",
                    }}
                  >
                    <span style={{ color: "var(--ink-500)", fontWeight: 800 }}>#{pr.num}</span>
                    <span style={{ color: "var(--ink-900)", fontWeight: 700 }}>{pr.title}</span>
                    <span
                      style={{
                        height: 34,
                        borderRadius: 8,
                        display: "grid",
                        placeItems: "center",
                        background: "var(--primary-100)",
                        color: "var(--primary)",
                        fontWeight: 900,
                      }}
                    >
                      {totalScore(pr)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 42 }}>
          <button type="button" className="btn btn-primary" onClick={onAnalyze}>
            Open the full dashboard <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
