"use client";

import { useEffect, useState } from "react";
import { ScoreBar } from "@/components/charts/score-bar";
import { ScoreCell } from "@/components/score/score-cell";
import { TotalBadge } from "@/components/score/total-badge";
import type { MockPR } from "@/lib/mock-data";
import { totalScore } from "@/lib/mock-data";

type PRRowProps = {
  pr: MockPR;
  index: number;
  animateIn: boolean;
};

export function PRRow({ pr, index, animateIn }: PRRowProps) {
  const [show, setShow] = useState(!animateIn);

  useEffect(() => {
    if (!animateIn) return;
    const t = setTimeout(() => setShow(true), 150 + index * 90);
    return () => clearTimeout(t);
  }, [animateIn, index]);

  const t = totalScore(pr);

  return (
    <div
      className="card pr-row"
      style={{
        padding: "18px 20px",
        display: "grid",
        gridTemplateColumns: "1fr 140px 64px 64px 64px 80px",
        gap: 16,
        alignItems: "center",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(12px)",
        transition: "opacity .5s ease, transform .5s ease",
        borderRadius: 16,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <span
            className="num-mono"
            style={{
              fontSize: 12,
              color: "var(--ink-500)",
              fontWeight: 600,
            }}
          >
            #{pr.num}
          </span>
          <span className="num-mono" style={{ fontSize: 11, color: "var(--ink-400)" }}>
            {pr.merged}
          </span>
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--ink-900)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: "-0.01em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {pr.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--ink-500)",
            marginTop: 6,
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: pr.avatar,
                display: "inline-block",
              }}
            />
            {pr.author}
          </span>
          <span className="num-mono">{pr.files} files</span>
          <span className="num-mono" style={{ color: "var(--green)" }}>
            +{pr.add}
          </span>
          <span className="num-mono" style={{ color: "var(--red)" }}>
            −{pr.del}
          </span>
        </div>
      </div>
      <div className="pr-impact-bar">
        <ScoreBar value={pr.impact} color="var(--accent)" delay={index * 90} />
      </div>
      <div className="pr-row-scores" style={{ display: "contents" }}>
        <ScoreCell
          value={pr.impact}
          delay={index * 90 + 100}
          color="var(--accent)"
          label="Impact"
        />
        <ScoreCell value={pr.ai} delay={index * 90 + 200} color="var(--primary)" label="AI" />
        <ScoreCell
          value={pr.quality}
          delay={index * 90 + 300}
          color="var(--gold)"
          label="Quality"
        />
        <TotalBadge value={t} delay={index * 90 + 400} />
      </div>
    </div>
  );
}
