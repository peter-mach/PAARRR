"use client";

import { useState, type FormEvent } from "react";
import { GithubIcon, StarIcon } from "@/components/icons";
import { HeroIllustration } from "@/components/landing/hero-illustration";
import { parseRepoUrl } from "@/lib/github/parse-url";

type HeroProps = {
  onSubmit: (url: string) => void;
};

const PLACEHOLDER = "github.com/vercel/next.js";

export function Hero({ onSubmit }: HeroProps) {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const candidate = url.trim() || PLACEHOLDER;
    if (!parseRepoUrl(candidate)) {
      setValidationError(
        "That does not look like a GitHub repo. Use github.com/owner/repo or owner/repo.",
      );
      return;
    }
    setValidationError(null);
    onSubmit(candidate);
  };

  return (
    <section
      style={{
        paddingTop: 88,
        paddingBottom: 54,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="container hero-grid stack-mobile"
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 58,
          alignItems: "center",
        }}
      >
        <div className="hero-left">
          <h1 style={{ maxWidth: 520 }}>
            Analyze Pull
            <br />
            Requests
          </h1>
          <p
            style={{
              marginTop: 24,
              fontSize: 24,
              lineHeight: 1.18,
              fontWeight: 600,
              color: "var(--ink-900)",
              maxWidth: 520,
            }}
          >
            Create a clear PR quality report with acceptance-grade scoring, checked by AI and ready
            for human review.
          </p>

          <form onSubmit={submit} className="fade-in" style={{ marginTop: 42, maxWidth: 520 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 190px",
                gap: 10,
              }}
              className="hero-form-grid"
            >
              <label style={{ position: "relative", display: "block" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 17,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--ink-400)",
                    display: "inline-flex",
                  }}
                >
                  <GithubIcon size={19} />
                </span>
                <input
                  id="hero-repo-url"
                  className="input"
                  style={{ paddingLeft: 48 }}
                  type="text"
                  inputMode="url"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder={PLACEHOLDER}
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  aria-label="GitHub repository URL"
                  aria-invalid={validationError ? "true" : undefined}
                  aria-describedby={validationError ? "hero-repo-url-error" : undefined}
                />
              </label>
              <button type="submit" className="btn btn-primary" style={{ padding: 0 }}>
                Analyze repo
              </button>
            </div>
            {validationError && (
              <div
                id="hero-repo-url-error"
                role="alert"
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  color: "var(--red)",
                }}
              >
                {validationError}
              </div>
            )}
          </form>

          <TrustpilotLine />
        </div>

        <div
          className="hero-right fade-in"
          style={{ animationDelay: ".16s", position: "relative" }}
        >
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

function TrustpilotLine() {
  return (
    <div
      className="fade-in trustpilot-line"
      style={{
        marginTop: 44,
        display: "flex",
        gap: 13,
        alignItems: "center",
        flexWrap: "wrap",
        fontSize: 16,
        color: "var(--ink-900)",
        fontWeight: 600,
        animationDelay: ".24s",
      }}
    >
      <span>Excellent</span>
      <span className="trustpilot-stars" aria-label="5 out of 5 stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="trustpilot-star">
            <StarIcon size={14} />
          </span>
        ))}
      </span>
      <span>
        18546 reviews on{" "}
        <span style={{ color: "var(--green)", display: "inline-flex", verticalAlign: "-3px" }}>
          <StarIcon size={22} />
        </span>{" "}
        Trustpilot
      </span>
    </div>
  );
}
