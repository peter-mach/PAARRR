"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowIcon, CheckIcon, GithubIcon, SparkIcon, StarIcon } from "@/components/icons";
import { HeroIllustration } from "@/components/landing/hero-illustration";

type HeroProps = {
  onSubmit: (url: string) => void;
};

const PLACEHOLDER = "github.com/vercel/next.js";
const AVATAR_COLORS = ["#ee6c3d", "#2563d9", "#c89c3a", "#2c9c6a"];

export function Hero({ onSubmit }: HeroProps) {
  const [url, setUrl] = useState("");
  const [typed, setTyped] = useState("");

  // Typed-placeholder animation — 60ms per char, matches prototype.
  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(PLACEHOLDER.slice(0, i));
      if (i >= PLACEHOLDER.length) {
        window.clearInterval(id);
      }
    }, 60);
    return () => window.clearInterval(id);
  }, []);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(url || PLACEHOLDER);
  };

  const accent = "var(--accent)";

  return (
    <section
      style={{
        paddingTop: 64,
        paddingBottom: 96,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative wave bottom */}
      <svg
        style={{ position: "absolute", bottom: -1, left: 0, width: "100%" }}
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 30 Q360 0 720 30 T1440 30 L1440 60 L0 60 Z"
          fill="var(--parchment)"
          opacity="0.5"
        />
      </svg>

      <div
        className="container hero-grid stack-mobile"
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div className="hero-left">
          <div className="chip chip-accent fade-in" style={{ animationDelay: ".1s" }}>
            <SparkIcon size={12} /> Set sail in 30 seconds
          </div>
          <h1 className="fade-in" style={{ marginTop: 18, animationDelay: ".2s" }}>
            Score your team&apos;s pull requests like a{" "}
            <span style={{ position: "relative", whiteSpace: "nowrap" }}>
              <span style={{ color: accent, position: "relative", zIndex: 1 }}>
                seasoned captain.
              </span>
              <svg
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -8,
                  width: "100%",
                  height: 14,
                }}
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 8 Q75 2 150 8 T298 8"
                  stroke={accent}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            </span>
          </h1>
          <p
            className="fade-in"
            style={{
              marginTop: 22,
              fontSize: 19,
              lineHeight: 1.55,
              color: "var(--ink-600)",
              maxWidth: 540,
              animationDelay: ".3s",
            }}
          >
            PAARRR analyzes every merged PR for{" "}
            <strong style={{ color: "var(--ink-900)" }}>Impact</strong>,{" "}
            <strong style={{ color: "var(--ink-900)" }}>AI-Leverage</strong>, and{" "}
            <strong style={{ color: "var(--ink-900)" }}>Quality</strong> — so you know who&apos;s
            shipping treasure and who&apos;s bumping deps.
          </p>

          <form
            onSubmit={submit}
            className="fade-in"
            style={{ marginTop: 32, animationDelay: ".4s", maxWidth: 560 }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: 6,
                background: "white",
                borderRadius: 999,
                boxShadow: "0 4px 16px rgba(11,24,48,0.06), 0 1px 3px rgba(11,24,48,0.04)",
                border: "1.5px solid var(--ink-200)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 14,
                  color: "var(--ink-400)",
                }}
              >
                <GithubIcon size={18} />
              </div>
              <input
                className="input"
                style={{
                  border: 0,
                  boxShadow: "none",
                  height: 44,
                  padding: "0 8px",
                  flex: 1,
                }}
                placeholder={typed || PLACEHOLDER}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                aria-label="GitHub repository URL"
              />
              <button type="submit" className="btn btn-accent" style={{ height: 44, fontSize: 15 }}>
                Analyze repo <ArrowIcon size={16} />
              </button>
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 14,
                color: "var(--ink-500)",
                fontSize: 13,
                flexWrap: "wrap",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <CheckIcon size={14} /> No login
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <CheckIcon size={14} /> Public repos
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <CheckIcon size={14} /> Free preview
              </span>
            </div>
          </form>

          <div
            className="fade-in"
            style={{
              marginTop: 32,
              display: "flex",
              gap: 14,
              alignItems: "center",
              animationDelay: ".55s",
            }}
          >
            <div style={{ display: "flex" }}>
              {AVATAR_COLORS.map((c, i) => (
                <div
                  key={c}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: c,
                    border: "2px solid var(--paper)",
                    marginLeft: i ? -10 : 0,
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-600)" }}>
              <div style={{ display: "flex", gap: 2, color: "var(--gold)" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} size={14} />
                ))}
              </div>
              <div style={{ marginTop: 2 }}>
                <strong style={{ color: "var(--ink-900)" }}>4.9</strong> from 2,400+ engineering
                teams
              </div>
            </div>
          </div>
        </div>

        <div className="hero-right fade-in" style={{ animationDelay: ".4s", position: "relative" }}>
          <HeroIllustration accent={accent} />
          {/* floating score card */}
          <div
            className="hero-float-card"
            style={{
              position: "absolute",
              bottom: 20,
              left: -30,
              background: "white",
              padding: "14px 18px",
              borderRadius: 18,
              boxShadow: "var(--sh-lg)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              animation: "float-y 4s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "var(--gold-100)",
                color: "var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display-stack)",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: "-0.04em",
                border: "2px dashed var(--gold)",
              }}
            >
              87
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ink-500)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                }}
              >
                Repo score
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--ink-900)",
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                Worth its weight in gold
              </div>
            </div>
          </div>
          <div
            className="hero-float-stats"
            style={{
              position: "absolute",
              top: 30,
              right: -10,
              background: "white",
              padding: "10px 14px",
              borderRadius: 14,
              boxShadow: "var(--sh-md)",
              fontSize: 12,
              fontFamily: "var(--font-mono-stack)",
              fontWeight: 600,
              color: "var(--ink-700)",
              animation: "float-y 3.5s ease-in-out infinite .5s",
              border: "1px solid var(--ink-100)",
            }}
          >
            <span style={{ color: "var(--green)" }}>+1,247</span>{" "}
            <span style={{ color: "var(--red)" }}>-318</span>
          </div>
        </div>
      </div>
    </section>
  );
}
