import type { ReactNode } from "react";
import { GithubIcon, MapIcon, RobotIcon } from "@/components/icons";

type Step = {
  n: number;
  title: string;
  desc: string;
  icon: ReactNode;
  color: string;
  bg: string;
};

const STEPS: Step[] = [
  {
    n: 1,
    title: "Drop a repo URL",
    desc: "Paste any public GitHub repository. No installs, no permissions.",
    icon: <GithubIcon size={28} />,
    color: "var(--ink-900)",
    bg: "white",
  },
  {
    n: 2,
    title: "AI charts the course",
    desc: "We pull merged PRs, diffs and metadata, then send them to a frontier model with a structured rubric.",
    icon: <RobotIcon size={28} />,
    color: "var(--primary)",
    bg: "var(--primary-100)",
  },
  {
    n: 3,
    title: "Read the manifest",
    desc: "Get scored breakdowns, author trends, and AI recommendations within a minute.",
    icon: <MapIcon size={28} />,
    color: "var(--accent)",
    bg: "var(--accent-100)",
  },
];

export function HowItWorks() {
  return (
    <section id="how" style={{ background: "var(--paper)" }}>
      <div className="container">
        <div
          className="reveal"
          style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 64px" }}
        >
          <div className="eyebrow">How it works</div>
          <h2 style={{ marginTop: 12 }}>Three steps from repo to report</h2>
          <p className="muted" style={{ marginTop: 14, fontSize: 18 }}>
            Built for tech leads, founders, and anyone who wants to know which PRs are actually
            moving the boat.
          </p>
        </div>
        <div
          className="grid-cols-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            position: "relative",
          }}
        >
          {/* Dotted treasure path running behind the cards */}
          <svg
            style={{
              position: "absolute",
              top: 60,
              left: "16%",
              width: "68%",
              height: 40,
              pointerEvents: "none",
            }}
            viewBox="0 0 800 40"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M10 20 Q200 -10 400 20 T790 20"
              stroke="var(--ink-300)"
              strokeWidth="2.5"
              strokeDasharray="2 8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          {STEPS.map((s, i) => (
            <div key={s.n} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="card" style={{ padding: 28, height: "100%", position: "relative" }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    background: s.bg,
                    color: s.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    border: i === 0 ? "1.5px solid var(--ink-200)" : "none",
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono-stack)",
                    fontSize: 12,
                    color: "var(--accent-600)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  STEP {String(s.n).padStart(2, "0")}
                </div>
                <h3 style={{ marginTop: 6 }}>{s.title}</h3>
                <p className="muted" style={{ marginTop: 10, fontSize: 15, lineHeight: 1.55 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
