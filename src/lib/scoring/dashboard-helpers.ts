import { colorForAuthor } from "@/lib/scoring/aggregate";
import { weightedTotal } from "@/lib/scoring/weights";
import type { ScoredPullRequest } from "@/types";

export type DashboardPullRequest = {
  num: number;
  title: string;
  body: string | null;
  author: string;
  avatar: string;
  files: number;
  add: number;
  del: number;
  impact: number;
  ai: number;
  quality: number;
  merged: string;
  url: string;
  diffUrl: string;
};

export type SortKey =
  | "total-desc"
  | "total-asc"
  | "impact-desc"
  | "ai-desc"
  | "quality-desc"
  | "size-desc";

export type Filters = { q: string; author: string };

export function toDashboardPR(pr: ScoredPullRequest): DashboardPullRequest {
  return {
    num: pr.number,
    title: pr.title,
    body: pr.body,
    author: pr.author,
    avatar: colorForAuthor(pr.author),
    files: pr.changedFiles,
    add: pr.additions,
    del: pr.deletions,
    impact: pr.score.impact,
    ai: pr.score.aiLeverage,
    quality: pr.score.quality,
    merged: relativeTime(pr.mergedAt),
    url: pr.url,
    diffUrl: pr.diffUrl,
  };
}

export function toDashboardPRs(prs: ScoredPullRequest[]): DashboardPullRequest[] {
  return prs.map(toDashboardPR);
}

export function totalDashboardScore(
  pr: Pick<DashboardPullRequest, "impact" | "ai" | "quality">,
): number {
  return weightedTotal({
    impact: pr.impact,
    aiLeverage: pr.ai,
    quality: pr.quality,
  });
}

export function filterAndSort(
  prs: DashboardPullRequest[],
  filters: Filters,
  sort: SortKey,
): DashboardPullRequest[] {
  const q = filters.q.trim().toLowerCase();
  const filtered = prs.filter((pr) => {
    if (filters.author && pr.author !== filters.author) return false;
    if (
      q &&
      !pr.title.toLowerCase().includes(q) &&
      !pr.author.toLowerCase().includes(q) &&
      !(pr.body ?? "").toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });
  const withTotal = filtered.map((pr) => ({ pr, total: totalDashboardScore(pr) }));
  withTotal.sort((a, b) => {
    switch (sort) {
      case "total-desc":
        return b.total - a.total;
      case "total-asc":
        return a.total - b.total;
      case "impact-desc":
        return b.pr.impact - a.pr.impact;
      case "ai-desc":
        return b.pr.ai - a.pr.ai;
      case "quality-desc":
        return b.pr.quality - a.pr.quality;
      case "size-desc":
        return b.pr.add + b.pr.del - (a.pr.add + a.pr.del);
      default:
        return 0;
    }
  });
  return withTotal.map((x) => x.pr);
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "recently";

  const seconds = Math.round((then - Date.now()) / 1000);
  const absSeconds = Math.abs(seconds);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, divisor] of units) {
    if (absSeconds >= divisor) {
      return rtf.format(Math.round(seconds / divisor), unit);
    }
  }
  return "just now";
}
