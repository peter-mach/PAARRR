import { TotalBadge } from "@/components/score/total-badge";
import { aggregateAuthors, SAMPLE_PRS, type AuthorAggregate } from "@/lib/mock-data";

type AuthorsGridProps = {
  authors?: AuthorAggregate[];
};

export function AuthorsGrid({ authors = aggregateAuthors(SAMPLE_PRS) }: AuthorsGridProps) {
  return (
    <div
      className="authors-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 16,
      }}
    >
      {authors.map((a, i) => (
        <div
          key={a.name}
          className="card"
          style={{
            padding: 24,
            display: "flex",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: a.avatar,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontFamily: "var(--font-display-stack)",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {a.name[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "var(--ink-900)",
              }}
            >
              {a.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--ink-500)",
                marginTop: 2,
              }}
            >
              {a.count} merged PRs
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 12,
                fontSize: 12,
                flexWrap: "wrap",
              }}
            >
              <span>
                <span style={{ color: "var(--ink-500)" }}>Impact</span>{" "}
                <strong className="num-mono">{a.impact}</strong>
              </span>
              <span>
                <span style={{ color: "var(--ink-500)" }}>AI</span>{" "}
                <strong className="num-mono">{a.ai}</strong>
              </span>
              <span>
                <span style={{ color: "var(--ink-500)" }}>Quality</span>{" "}
                <strong className="num-mono">{a.quality}</strong>
              </span>
            </div>
          </div>
          <TotalBadge value={a.total} delay={i * 100} />
        </div>
      ))}
    </div>
  );
}
