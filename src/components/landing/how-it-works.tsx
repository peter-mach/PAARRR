import type { ReactNode } from "react";
import { GithubIcon, RobotIcon, TrendIcon } from "@/components/icons";

type Step = {
  title: string;
  desc: string;
  icon: ReactNode;
};

const STEPS: Step[] = [
  {
    title: "Paste a repo URL",
    desc: "Use any public GitHub repository. PAARRR reads the merged pull requests and normalizes the metadata.",
    icon: <GithubIcon size={58} />,
  },
  {
    title: "Get PRs verified",
    desc: "The analysis combines diff stats, PR descriptions, authorship signals, and an AI rubric for the three scoring axes.",
    icon: <RobotIcon size={66} />,
  },
  {
    title: "Submit your report",
    desc: "Open a dashboard with repo totals, author breakdowns, filters, sorting, and concrete recommendations.",
    icon: <TrendIcon size={70} />,
  },
];

export function HowItWorks() {
  return (
    <section id="how" style={{ background: "var(--paper)", paddingTop: 82, paddingBottom: 100 }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", margin: "0 auto 70px" }}>
          <h2 style={{ fontSize: 42 }}>How Does Our PR-Score Maker Work?</h2>
        </div>
        <div
          className="grid-cols-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 58,
          }}
        >
          {STEPS.map((s, i) => (
            <article key={s.title} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="how-icon">{s.icon}</div>
              <h3
                style={{
                  marginTop: 24,
                  fontFamily: "var(--font-sans-stack)",
                  fontSize: 30,
                  lineHeight: 1.15,
                  fontWeight: 800,
                  color: "var(--ink-900)",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  marginTop: 20,
                  fontSize: 18,
                  lineHeight: 1.5,
                  color: "var(--ink-900)",
                }}
              >
                {s.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
