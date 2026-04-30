import type { AIInsight } from "@/types";

type AIInsightsProps = {
  insights: AIInsight[];
};

const TAG_COLORS: Record<AIInsight["tag"], string> = {
  Quality: "var(--gold)",
  Impact: "var(--accent)",
  AI: "var(--primary)",
};

export function AIInsights({ insights }: AIInsightsProps) {
  if (!insights.length) return null;

  return (
    <div
      className="ai-insights"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
      }}
    >
      {insights.map((insight, index) => {
        const color = TAG_COLORS[insight.tag];
        return (
          <div
            key={`${insight.tag}-${index}`}
            style={{
              padding: 16,
              background: "white",
              borderRadius: 14,
              border: "1px solid var(--ink-100)",
            }}
          >
            <div className="chip" style={{ background: `${color}1f`, color }}>
              {insight.tag}
            </div>
            <p
              style={{
                marginTop: 10,
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--ink-700)",
              }}
            >
              {insight.body}
            </p>
          </div>
        );
      })}
    </div>
  );
}
