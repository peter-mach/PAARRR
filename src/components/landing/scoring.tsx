import type { ReactNode } from "react";
import { BoltIcon, CheckIcon, RobotIcon, ShieldIcon } from "@/components/icons";

type Dimension = {
  name: string;
  weight: number;
  color: string;
  icon: ReactNode;
  desc: string;
  sigs: string[];
};

const DIMENSIONS: Dimension[] = [
  {
    name: "Impact",
    weight: 40,
    color: "#4d42e0",
    icon: <BoltIcon size={24} />,
    desc: "Functional changes, architectural improvements, performance work, and meaningful product progress score higher than routine churn.",
    sigs: ["Core modules touched", "User-visible value", "Performance or reliability gain"],
  },
  {
    name: "AI-Leverage",
    weight: 35,
    color: "#2fcac3",
    icon: <RobotIcon size={24} />,
    desc: "The rubric rewards candidates who use AI as real leverage: coherent large changes, AI trailers, structured implementation, and strong output pace.",
    sigs: [
      "Co-authored-by evidence",
      "Consistent generated structure",
      "High change volume with focus",
    ],
  },
  {
    name: "Quality",
    weight: 25,
    color: "#0060fa",
    icon: <ShieldIcon size={24} />,
    desc: "A focused PR, clear rationale, tests, and simplification beat broad changes that only add surface area.",
    sigs: ["Single-purpose scope", "Tests or safeguards", "Explains why, not only what"],
  },
];

export function Scoring() {
  return (
    <section id="scoring" className="reference-rich-section">
      <div className="container">
        <div className="reference-rich-inner reveal">
          <h2 style={{ fontSize: 54 }}>
            Welcome to PAARRR: Your Trusted Digital Pull Request Booth
          </h2>
          <p style={{ marginTop: 30, fontSize: 18, lineHeight: 1.7, color: "var(--ink-900)" }}>
            PAARRR turns a public GitHub repository into a scorecard for recruitment, code review,
            and team health. It mirrors the reference flow: pick the document, run an automated
            verification, then receive a result that is easy to trust.
          </p>
          <p style={{ marginTop: 22, fontSize: 18, lineHeight: 1.7, color: "var(--ink-900)" }}>
            <strong>For Every PR:</strong> each merged pull request receives scores for Impact,
            AI-Leverage, and Quality. The total score is weighted toward value delivered, while
            still rewarding AI-native work and clean engineering practice.
          </p>
        </div>

        <div
          className="grid-cols-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginTop: 58,
          }}
        >
          {DIMENSIONS.map((d, i) => (
            <article
              key={d.name}
              className="reveal card"
              style={{
                padding: 26,
                transitionDelay: `${i * 80}ms`,
                background: "var(--paper)",
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  background: "white",
                  color: d.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--ink-100)",
                }}
              >
                {d.icon}
              </div>
              <h3
                style={{
                  marginTop: 24,
                  fontFamily: "var(--font-sans-stack)",
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                {d.name}
              </h3>
              <div
                style={{
                  marginTop: 8,
                  color: d.color,
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                Weight {d.weight}%
              </div>
              <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.65, color: "var(--ink-700)" }}>
                {d.desc}
              </p>
              <div style={{ marginTop: 18, display: "grid", gap: 8 }}>
                {d.sigs.map((s) => (
                  <div
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "var(--ink-900)",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ color: d.color, display: "inline-flex" }}>
                      <CheckIcon size={15} />
                    </span>
                    {s}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
