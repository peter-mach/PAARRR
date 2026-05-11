import type { CSSProperties } from "react";
import { CheckIcon, StarIcon } from "@/components/icons";

export function HeroIllustration() {
  return (
    <div className="hero-product-visual" style={{ position: "relative", width: "100%" }}>
      <div className="hero-before-card" aria-hidden>
        <div
          style={{
            height: 150,
            borderRadius: 8,
            background: "linear-gradient(160deg, #d8e0f3, #f6f7f9)",
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <div className="code-line" style={{ width: "82%", background: "#1d253b" }} />
          <div className="code-line" style={{ width: "62%" }} />
          <div className="code-line" style={{ width: "76%" }} />
        </div>
        <div style={{ marginTop: 13, display: "grid", gap: 8 }}>
          <Metric label="Impact" value="?" muted />
          <Metric label="AI" value="?" muted />
        </div>
      </div>

      <div className="hero-after-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-500)", fontWeight: 700 }}>
              Pull request report
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: "var(--font-display-stack)",
                fontSize: 44,
                lineHeight: 1,
                fontWeight: 700,
                color: "var(--ink-900)",
              }}
            >
              87
            </div>
          </div>
          <div className="metric-pill">
            <span style={{ color: "var(--green)", display: "inline-flex" }}>
              <CheckIcon size={15} />
            </span>
            Ready
          </div>
        </div>

        <div
          style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
        >
          <ScoreBox label="Impact" value={91} color="#4d42e0" />
          <ScoreBox label="AI-Leverage" value={84} color="#2fcac3" />
          <ScoreBox label="Quality" value={86} color="#0060fa" />
        </div>

        <div
          style={{
            marginTop: 22,
            display: "grid",
            gap: 11,
            paddingTop: 20,
            borderTop: "1px solid var(--ink-100)",
          }}
        >
          {[
            ["#142", "Streaming endpoint", "+487", "-92"],
            ["#138", "JWT rotation", "+256", "-318"],
            ["#135", "Connection pool", "+612", "-540"],
          ].map(([num, title, add, del]) => (
            <div
              key={num}
              style={{
                display: "grid",
                gridTemplateColumns: "46px 1fr auto",
                gap: 10,
                alignItems: "center",
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--ink-500)", fontWeight: 700 }}>{num}</span>
              <span style={{ color: "var(--ink-900)", fontWeight: 700 }}>{title}</span>
              <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12 }}>
                <span style={{ color: "var(--green)" }}>{add}</span>{" "}
                <span style={{ color: "var(--red)" }}>{del}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-processing-badge">3s</div>
      <svg className="hero-sketch-arrow" viewBox="0 0 150 76" fill="none" aria-hidden>
        <path
          d="M4 8c17 31 54 44 111 31"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M111 39c-10-1-21 4-30 13M111 39c-9-5-17-12-23-24"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <div className="hero-strip-card" aria-hidden>
        {[91, 84].map((score) => (
          <div
            key={score}
            style={{
              height: 82,
              borderRadius: 6,
              background: "#f6f7f9",
              marginBottom: 8,
              display: "grid",
              placeItems: "center",
              color: "var(--primary)",
              fontWeight: 800,
            }}
          >
            {score}
          </div>
        ))}
      </div>

      <Sparkle style={{ left: "16%", bottom: 112, width: 38 }} />
      <Sparkle style={{ left: "25%", bottom: 74, width: 20, animationDelay: ".35s" }} />
      <Sparkle style={{ right: "10%", bottom: 12, width: 34, animationDelay: ".55s" }} />
    </div>
  );
}

function Metric({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: muted ? "var(--ink-500)" : "var(--ink-900)",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function ScoreBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ borderRadius: 8, background: "var(--primary-50)", padding: 12 }}>
      <div style={{ fontSize: 11, color: "var(--ink-500)", fontWeight: 700 }}>{label}</div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22, lineHeight: 1, color: "var(--ink-900)", fontWeight: 800 }}>
          {value}
        </span>
        <span style={{ color }}>
          <StarIcon size={14} />
        </span>
      </div>
    </div>
  );
}

function Sparkle({ style }: { style: CSSProperties }) {
  return (
    <svg className="handdrawn-sparkle" viewBox="0 0 44 54" style={style} fill="none" aria-hidden>
      <path
        d="M21.5 2c2.7 14.6 7.8 23.1 20 25.2-12.2 3.1-17.3 11.5-20 24.8C18.7 38.7 13.2 30.3 2 27.2 13.2 25.1 18.7 16.6 21.5 2Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
