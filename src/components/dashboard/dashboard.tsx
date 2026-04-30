"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CountUp } from "@/components/charts/count-up";
import { RadarChart } from "@/components/charts/radar-chart";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { AuthorsGrid } from "@/components/dashboard/authors-grid";
import { Stat } from "@/components/dashboard/stat";
import { CompassIcon, TelescopeIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { PRRow } from "@/components/score/pr-row";
import { Toolbar } from "@/components/score/toolbar";
import { fireConfetti } from "@/lib/animations";
import {
  filterAndSort,
  type Filters,
  type SortKey,
  toDashboardPRs,
} from "@/lib/scoring/dashboard-helpers";
import type { RepoAnalysis } from "@/types";

type DashboardProps = {
  analysis: RepoAnalysis;
  onBack: () => void;
};

type TabId = "prs" | "authors";

const CONFETTI_THRESHOLD = 70;

export function Dashboard({ analysis, onBack }: DashboardProps) {
  const [filters, setFilters] = useState<Filters>({ q: "", author: "" });
  const [sort, setSort] = useState<SortKey>("total-desc");
  const [tab, setTab] = useState<TabId>("prs");

  // Fire confetti once per unique analysis, and only when the verdict actually
  // earns the celebration (≥70). Re-renders, tab switches, and back-navigation
  // to the same dashboard never re-trigger it.
  const confettiFiredFor = useRef<string | null>(null);
  useEffect(() => {
    if (analysis.aggregate.total < CONFETTI_THRESHOLD) return;
    if (confettiFiredFor.current === analysis.analyzedAt) return;
    confettiFiredFor.current = analysis.analyzedAt;
    const t = setTimeout(() => fireConfetti(), 600);
    return () => clearTimeout(t);
  }, [analysis.analyzedAt, analysis.aggregate.total]);

  const handleExport = useCallback(() => {
    if (typeof window === "undefined") return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `paarrr-${analysis.owner}-${analysis.repo}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
  }, [analysis]);

  const handleShare = useCallback(() => {
    if (typeof window === "undefined") return;
    void navigator.clipboard?.writeText(window.location.href);
  }, []);

  const dashboardPRs = useMemo(
    () => toDashboardPRs(analysis.pullRequests),
    [analysis.pullRequests],
  );

  const filtered = useMemo(
    () => filterAndSort(dashboardPRs, filters, sort),
    [dashboardPRs, filters, sort],
  );

  const authors = analysis.authors;

  const authorNames = useMemo(
    () => Array.from(new Set(dashboardPRs.map((p) => p.author))),
    [dashboardPRs],
  );

  const accent = "var(--accent)";
  const { aggregate } = analysis;

  const tabs: { id: TabId; label: string }[] = [
    { id: "prs", label: `Pull requests (${filtered.length})` },
    { id: "authors", label: `Crew (${authors.length})` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {/* Sticky header */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid var(--ink-100)",
          padding: "20px 0",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div
          className="container dash-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              aria-label="Back to landing"
            >
              <Logo size={28} />
            </button>
            <div
              style={{
                width: 1,
                height: 24,
                background: "var(--ink-200)",
              }}
            />
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
                Repository
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono-stack)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink-900)",
                }}
              >
                {analysis.url}
              </div>
            </div>
          </div>
          <div className="dash-actions" style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="btn btn-ghost btn-export"
              style={{ height: 38, fontSize: 13 }}
              onClick={handleExport}
              aria-label="Download analysis as JSON"
            >
              Export JSON
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-share"
              style={{ height: 38, fontSize: 13 }}
              onClick={handleShare}
              aria-label="Copy current URL to clipboard"
            >
              Share link
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ height: 38, fontSize: 13 }}
              onClick={onBack}
            >
              New analysis
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 18px 80px" }}>
        {/* Hero metrics */}
        <div
          className="dash-hero"
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 28,
            marginBottom: 32,
          }}
        >
          <div
            className="card fade-in"
            style={{
              padding: 36,
              background: "linear-gradient(135deg, var(--ink-900), var(--ink-800))",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -30,
                top: -30,
                opacity: 0.06,
                color: "white",
              }}
            >
              <CompassIcon size={260} />
            </div>
            <div className="eyebrow" style={{ color: "var(--accent)", position: "relative" }}>
              The verdict
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                marginTop: 14,
                position: "relative",
              }}
            >
              <div
                className="num-display dash-verdict-num"
                style={{ fontSize: 140, color: "white", lineHeight: 1 }}
              >
                <CountUp value={aggregate.total} duration={1600} />
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-display-stack)",
                  fontWeight: 600,
                }}
              >
                /100
              </div>
            </div>
            <div
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.85)",
                fontWeight: 500,
                marginTop: 6,
                position: "relative",
              }}
            >
              Worth its weight in gold ⛵
            </div>
            <div
              className="dash-stats"
              style={{
                display: "flex",
                gap: 16,
                marginTop: 28,
                position: "relative",
              }}
            >
              <Stat label="Merged PRs" value={aggregate.mergedPRs} />
              <Stat label="Authors" value={aggregate.authorsCount} />
              <Stat label="Time analyzed" value={aggregate.analysisSeconds} suffix="s" />
            </div>
          </div>

          <div className="card fade-in" style={{ padding: 28, animationDelay: ".15s" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div className="eyebrow">Score breakdown</div>
                <h3 style={{ marginTop: 6 }}>3-axis radar</h3>
              </div>
              <span className="chip chip-gold">Top quartile</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 12,
              }}
            >
              <RadarChart
                impact={aggregate.impact}
                aiLeverage={aggregate.aiLeverage}
                quality={aggregate.quality}
                size={290}
                delay={400}
              />
            </div>
          </div>
        </div>

        {/* AI insights */}
        <div
          className="card fade-in"
          style={{
            padding: 28,
            marginBottom: 32,
            background: "linear-gradient(135deg, var(--parchment), var(--paper))",
            borderLeft: `4px solid ${accent}`,
            animationDelay: ".25s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "var(--ink-900)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TelescopeIcon size={22} />
            </div>
            <div>
              <div className="eyebrow">From the crow&apos;s nest</div>
              <h3 style={{ marginTop: 4 }}>AI recommendations</h3>
            </div>
          </div>
          <AIInsights insights={analysis.insights} />
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 22,
            borderBottom: "1px solid var(--ink-200)",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                padding: "12px 18px",
                fontSize: 14,
                fontWeight: 600,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: tab === t.id ? "var(--ink-900)" : "var(--ink-500)",
                borderBottom: tab === t.id ? `3px solid ${accent}` : "3px solid transparent",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "prs" && (
          <div className="fade-in">
            <Toolbar
              filters={filters}
              setFilters={setFilters}
              sort={sort}
              setSort={setSort}
              authors={authorNames}
            />
            <div
              className="pr-table-header"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 64px 64px 64px 80px",
                gap: 16,
                padding: "0 20px 10px",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--ink-500)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <div>Pull request</div>
              <div>Impact</div>
              <div style={{ textAlign: "center" }}>Imp.</div>
              <div style={{ textAlign: "center" }}>AI</div>
              <div style={{ textAlign: "center" }}>Qty.</div>
              <div style={{ textAlign: "right" }}>Total</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((pr, i) => (
                <PRRow key={pr.num} pr={pr} index={i} animateIn />
              ))}
              {filtered.length === 0 && (
                <div
                  className="card"
                  style={{
                    padding: 48,
                    textAlign: "center",
                    color: "var(--ink-500)",
                  }}
                >
                  No PRs match your filters. Try clearing them.
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "authors" && (
          <div className="fade-in">
            <AuthorsGrid authors={authors} />
          </div>
        )}
      </div>
    </div>
  );
}
