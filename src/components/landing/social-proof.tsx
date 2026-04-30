const LOGOS = [
  "TechCrunch",
  "The Verge",
  "Hacker News",
  "Product Hunt",
  "a16z",
  "Y Combinator",
  "GitHub Blog",
  "Stratechery",
];

export function SocialProof() {
  // Duplicate the list inline so the marquee loop is seamless.
  const reel = [...LOGOS, ...LOGOS];

  return (
    <section style={{ padding: "40px 0 32px", background: "var(--parchment)" }}>
      <div className="container">
        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "var(--ink-600)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          Heard of in the harbor
        </div>
        <div
          style={{
            overflow: "hidden",
            position: "relative",
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 56,
              animation: "marquee 32s linear infinite",
              whiteSpace: "nowrap",
            }}
          >
            {reel.map((label, i) => (
              <div
                key={`${label}-${i}`}
                style={{
                  fontFamily: "var(--font-display-stack)",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "var(--ink-500)",
                  letterSpacing: "-0.02em",
                  flexShrink: 0,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
