import type { ReactNode } from "react";
import { BoltIcon, CheckIcon, RobotIcon, ShieldIcon } from "@/components/icons";

type Dimension = {
  name: string;
  weight: number;
  color: string;
  bg: string;
  icon: ReactNode;
  tagline: string;
  desc: string;
  sigs: string[];
};

const DIMENSIONS: Dimension[] = [
  {
    name: "Impact",
    weight: 40,
    color: "var(--accent)",
    bg: "var(--accent-100)",
    icon: <BoltIcon size={22} />,
    tagline: "Does this PR move the boat?",
    desc: "We weight architectural shifts, performance wins, and net-new features above renames or dep bumps. Size ≠ significance.",
    sigs: ["Touches core modules", "Net new functionality", "Performance gains"],
  },
  {
    name: "AI-Leverage",
    weight: 35,
    color: "var(--primary)",
    bg: "var(--primary-100)",
    icon: <RobotIcon size={22} />,
    tagline: "Are you crewed up with AI?",
    desc: "We look for the fingerprints of generative tooling: scope, consistency, co-authored-by tags, prompt-driven structure. High = good — that is the modern crew.",
    sigs: ["Co-authored-by", "Consistent generated structure", "High output / description ratio"],
  },
  {
    name: "Quality",
    weight: 25,
    color: "var(--gold)",
    bg: "var(--gold-100)",
    icon: <ShieldIcon size={22} />,
    tagline: "Is the code shipshape?",
    desc: "Focused scope, descriptive PR copy explaining why, presence of tests, refactoring vs naive bolt-ons.",
    sigs: ["Single-purpose PR", "Tests included", "Refactor over bolt-on"],
  },
];

export function Scoring() {
  return (
    <section id="scoring" style={{ background: "var(--parchment)" }}>
      <div className="container">
        <div
          className="reveal"
          style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 56px" }}
        >
          <div className="eyebrow">What we score</div>
          <h2 style={{ marginTop: 12 }}>Three dimensions. One total. Zero guesswork.</h2>
          <p className="muted" style={{ marginTop: 14, fontSize: 18 }}>
            Each merged PR gets scored 0–100 on three axes. The repo total is a weighted average —
            calibrated for AI-native teams.
          </p>
        </div>
        <div
          className="grid-cols-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {DIMENSIONS.map((d, i) => (
            <div
              key={d.name}
              className="reveal card"
              style={{ padding: 30, transitionDelay: `${i * 100}ms` }}
            >
              <div
                className="score-card-head"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: d.bg,
                    color: d.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {d.icon}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono-stack)",
                    fontWeight: 700,
                    fontSize: 12,
                    color: d.color,
                    background: d.bg,
                    padding: "6px 12px",
                    borderRadius: 999,
                  }}
                >
                  WEIGHT {d.weight}%
                </div>
              </div>
              <h3 style={{ marginTop: 22 }}>{d.name}</h3>
              <div
                style={{
                  fontSize: 14,
                  fontStyle: "italic",
                  color: d.color,
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                &ldquo;{d.tagline}&rdquo;
              </div>
              <p className="muted" style={{ marginTop: 14, fontSize: 14.5, lineHeight: 1.6 }}>
                {d.desc}
              </p>
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 18,
                  borderTop: "1px dashed var(--ink-200)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--ink-500)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 10,
                  }}
                >
                  Signals we look for
                </div>
                {d.sigs.map((s) => (
                  <div
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--ink-700)",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ color: d.color, display: "inline-flex" }}>
                      <CheckIcon size={14} />
                    </span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
