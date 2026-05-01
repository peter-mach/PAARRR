import { Logo } from "@/components/logo";

type FooterColumn = {
  h: string;
  l: string[];
};

const COLUMNS: FooterColumn[] = [
  { h: "Product", l: ["How it works", "Scoring model", "Sample report", "Pricing"] },
  { h: "Resources", l: ["Docs", "Changelog", "API", "Status"] },
  { h: "Company", l: ["About", "Blog", "Privacy", "Terms"] },
];

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--ink-900)",
        color: "rgba(255,255,255,0.6)",
        padding: "48px 0 36px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="container footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: 32,
        }}
      >
        <div>
          <Logo color="white" />
          <p style={{ marginTop: 14, fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
            Pull-request Automated Analysis, Reporting, &amp; Review Rig. The fastest way to see
            who&apos;s shipping treasure.
          </p>
        </div>
        {COLUMNS.map((c) => (
          <div key={c.h}>
            <div
              style={{
                fontWeight: 700,
                color: "white",
                marginBottom: 12,
                fontSize: 14,
              }}
            >
              {c.h}
            </div>
            {c.l.map((x) => (
              <a
                key={x}
                href={`#${x.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  display: "block",
                  fontSize: 14,
                  padding: "5px 0",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {x}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div
        className="container"
        style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        <div>© 2026 PAARRR. Charted with care.</div>
        <div style={{ display: "flex", gap: 18 }}>
          <span>v0.4.2</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--green)",
              }}
            />
            All systems sailing
          </span>
        </div>
      </div>
    </footer>
  );
}
