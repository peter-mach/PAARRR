const LOGOS = [
  { label: "Bloomberg", kind: "serif" },
  { label: "The New York Times", kind: "serif" },
  { label: "Forbes", kind: "serif" },
  { label: "Business Insider", kind: "sans" },
  { label: "USA Today Travel", kind: "sans" },
  { label: "Inc.", kind: "serif" },
  { label: "HuffPost", kind: "sans" },
  { label: "CNN", kind: "sans" },
] as const;

export function SocialProof() {
  return (
    <section style={{ padding: "32px 0 0", background: "var(--paper)" }}>
      <div className="container">
        <div className="reference-logo-shell">
          <div className="reference-logo-label">As seen in</div>
          <div className="reference-logo-row">
            {LOGOS.map((logo) => (
              <div
                key={logo.label}
                className={logo.kind === "serif" ? "media-logo" : "media-logo media-logo-sans"}
              >
                {logo.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
