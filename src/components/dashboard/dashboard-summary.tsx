import { CountUp } from "@/components/charts/count-up";
import { RadarChart } from "@/components/charts/radar-chart";
import { ScoreBar } from "@/components/charts/score-bar";
import { GithubIcon } from "@/components/icons";
import { SAMPLE_AGGREGATE, type RepoAggregate } from "@/lib/mock-data";

type DashboardSummaryProps = {
  mini?: boolean;
  aggregate?: RepoAggregate;
};

export function DashboardSummary({
  mini = false,
  aggregate = SAMPLE_AGGREGATE,
}: DashboardSummaryProps) {
  const repoLabel = aggregate.url.replace(/^https?:\/\//, "").replace(/^github\.com\//, "");

  return (
    <div
      className="dash-summary stack-mobile"
      style={{
        display: "grid",
        gridTemplateColumns: mini ? "1fr 1fr" : "1.1fr 1fr",
        gap: mini ? 24 : 32,
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <span className="chip chip-ink">
            <GithubIcon size={12} /> {repoLabel}
          </span>
          <span className="chip chip-green">Public</span>
          <span className="chip chip-primary">{aggregate.mergedPRs} PRs analyzed</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <div
            className="num-display"
            style={{
              fontSize: mini ? 72 : 96,
              color: "var(--ink-900)",
              lineHeight: 1,
            }}
          >
            <CountUp value={aggregate.total} duration={1500} />
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent-600)",
              }}
            >
              Repo total
            </div>
            <div
              style={{
                fontSize: 16,
                color: "var(--ink-700)",
                fontWeight: 500,
                marginTop: 4,
              }}
            >
              Worth its weight in gold
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 18,
            flexWrap: "wrap",
          }}
        >
          <span className="chip chip-gold">⛵ Captain&apos;s pick</span>
          <span className="chip chip-accent">Top-quartile AI usage</span>
        </div>
        <div
          style={{
            marginTop: 28,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <ScoreBar value={aggregate.impact} label="Impact" color="var(--accent)" delay={300} />
          <ScoreBar
            value={aggregate.aiLeverage}
            label="AI-Leverage"
            color="var(--primary)"
            delay={500}
          />
          <ScoreBar value={aggregate.quality} label="Quality" color="var(--gold)" delay={700} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <RadarChart
          impact={aggregate.impact}
          aiLeverage={aggregate.aiLeverage}
          quality={aggregate.quality}
          size={mini ? 240 : 320}
        />
      </div>
    </div>
  );
}
