"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FinalCTA,
  Footer,
  Hero,
  HowItWorks,
  Nav,
  Preview,
  RateLimitPrompt,
  Scoring,
  SocialProof,
} from "@/components/landing";
import { Dashboard, LoadingState } from "@/components/dashboard";
import { MOCK_ANALYSIS } from "@/lib/mock-data";
import type { AnalysisErrorResponse, AnalyzeResponse, RepoAnalysis } from "@/types";

type Route = "landing" | "loading" | "dashboard" | "error";
type ApiError = AnalysisErrorResponse["error"];

const DEFAULT_URL = "github.com/vercel/next.js";
const TOKEN_SESSION_KEY = "paarrr.githubToken";

export default function Home() {
  const [route, setRoute] = useState<Route>("landing");
  const [url, setUrl] = useState(DEFAULT_URL);
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [pendingAnalysis, setPendingAnalysis] = useState<Promise<RepoAnalysis> | null>(null);
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = window.sessionStorage.getItem(TOKEN_SESSION_KEY);
    if (token) setGithubToken(token);
  }, []);

  const handleAnalyze = useCallback(
    (u: string, tokenOverride?: string) => {
      const nextUrl = u || DEFAULT_URL;
      setUrl(nextUrl);
      setError(null);
      setAnalysis(null);
      setRoute("loading");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0 });
      }

      if (
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("mock") === "1"
      ) {
        setPendingAnalysis(Promise.resolve(MOCK_ANALYSIS));
        return;
      }

      setPendingAnalysis(requestAnalysis(nextUrl, tokenOverride ?? githubToken));
    },
    [githubToken],
  );

  const handleBack = useCallback(() => {
    setError(null);
    setPendingAnalysis(null);
    setRoute("landing");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0 });
    }
  }, []);

  const handleLoadingDone = useCallback((result: RepoAnalysis) => {
    setAnalysis(result);
    setPendingAnalysis(null);
    setRoute("dashboard");
  }, []);

  const handleLoadingError = useCallback((nextError: ApiError) => {
    setError(nextError);
    setPendingAnalysis(null);
    setRoute("error");
  }, []);

  const handleTokenRetry = useCallback(
    (token: string) => {
      setGithubToken(token);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(TOKEN_SESSION_KEY, token);
      }
      handleAnalyze(url, token);
    },
    [handleAnalyze, url],
  );

  useEffect(() => {
    if (route !== "landing") return;
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("in");
        }
      },
      { threshold: 0.15 },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [route]);

  if (route === "loading") {
    if (!pendingAnalysis) return null;
    return (
      <LoadingState
        url={url}
        promise={pendingAnalysis}
        onDone={handleLoadingDone}
        onError={handleLoadingError}
      />
    );
  }
  if (route === "dashboard") {
    if (!analysis) return null;
    return <Dashboard analysis={analysis} onBack={handleBack} />;
  }
  if (route === "error" && error) {
    return (
      <ErrorState
        url={url}
        error={error}
        onBack={handleBack}
        onRetry={() => handleAnalyze(url)}
        onTokenSubmit={handleTokenRetry}
      />
    );
  }
  return (
    <>
      <Nav onAnalyze={() => handleAnalyze("")} />
      <Hero onSubmit={handleAnalyze} />
      <SocialProof />
      <HowItWorks />
      <Scoring />
      <Preview onAnalyze={() => handleAnalyze("")} />
      <FinalCTA onAnalyze={() => handleAnalyze("")} />
      <Footer />
    </>
  );
}

async function requestAnalysis(repoUrl: string, githubToken: string | null): Promise<RepoAnalysis> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: repoUrl,
      githubToken: githubToken || undefined,
    }),
  });
  const payload = (await response.json()) as AnalyzeResponse;
  if (!response.ok || "error" in payload) {
    throw "error" in payload
      ? payload.error
      : {
          code: "internal",
          message: "The analysis could not be completed.",
        };
  }
  return payload;
}

function ErrorState({
  url,
  error,
  onBack,
  onRetry,
  onTokenSubmit,
}: {
  url: string;
  error: ApiError;
  onBack: () => void;
  onRetry: () => void;
  onTokenSubmit: (token: string) => void;
}) {
  const canUseToken = error.canRetryWithToken || error.code === "invalid_github_token";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--paper)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <section className="card" style={{ maxWidth: 620, width: "100%", padding: 36 }}>
        <div className="eyebrow">Analysis stopped</div>
        <h1 style={{ marginTop: 10, fontSize: 38 }}>{error.message}</h1>
        <div
          style={{
            marginTop: 12,
            fontFamily: "var(--font-mono-stack)",
            fontSize: 13,
            color: "var(--ink-500)",
          }}
        >
          {url}
        </div>
        {error.hint && (
          <p className="muted" style={{ marginTop: 18, fontSize: 16, lineHeight: 1.6 }}>
            {error.hint}
          </p>
        )}
        {canUseToken ? (
          <RateLimitPrompt onSubmit={onTokenSubmit} onCancel={onBack} />
        ) : (
          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <button type="button" className="btn btn-accent" onClick={onRetry}>
              Retry analysis
            </button>
            <button type="button" className="btn btn-ghost" onClick={onBack}>
              Back to landing
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
