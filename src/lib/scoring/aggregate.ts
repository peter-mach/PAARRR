import { weightedTotal } from "@/lib/scoring/weights";
import type { AuthorAggregate, RepoAggregate, ScoredPullRequest } from "@/types";

const AVATAR_COLORS = ["#ee6c3d", "#2563d9", "#c89c3a", "#2c9c6a", "#7d93b8", "#8b5cf6"];

/**
 * Build a repo-level aggregate.
 *
 * `successful` is the set of PRs whose scores came back from the LLM cleanly;
 * its score values feed the dimension averages. `totalAnalyzed` is how many
 * PRs we *attempted* to score (≥ successful.length when some failed) — the
 * dashboard renders this as "Pull requests analyzed" and the failing PRs
 * are still shown in the list with a "Scoring failed" rationale, but their
 * zero-scores no longer drag the repo total down.
 */
export function aggregateRepo(
  successful: ScoredPullRequest[],
  totalAnalyzed: number,
  analysisSeconds: number,
  url: string,
): RepoAggregate {
  const impact = average(successful.map((pr) => pr.score.impact));
  const aiLeverage = average(successful.map((pr) => pr.score.aiLeverage));
  const quality = average(successful.map((pr) => pr.score.quality));

  return {
    url,
    mergedPRs: totalAnalyzed,
    authorsCount: new Set(successful.map((pr) => pr.author)).size,
    analysisSeconds,
    total: weightedTotal({ impact, aiLeverage, quality }),
    impact,
    aiLeverage,
    quality,
  };
}

export function aggregateAuthors(scored: ScoredPullRequest[]): AuthorAggregate[] {
  const byAuthor = new Map<string, ScoredPullRequest[]>();
  for (const pr of scored) {
    const existing = byAuthor.get(pr.author);
    if (existing) {
      existing.push(pr);
    } else {
      byAuthor.set(pr.author, [pr]);
    }
  }

  return Array.from(byAuthor.entries())
    .map(([name, prs]) => {
      const impact = average(prs.map((pr) => pr.score.impact));
      const ai = average(prs.map((pr) => pr.score.aiLeverage));
      const quality = average(prs.map((pr) => pr.score.quality));

      return {
        name,
        avatar: colorForAuthor(name),
        count: prs.length,
        impact,
        ai,
        quality,
        total: weightedTotal({ impact, aiLeverage: ai, quality }),
      };
    })
    .sort((a, b) => b.total - a.total);
}

export function colorForAuthor(author: string): string {
  let hash = 0;
  for (let i = 0; i < author.length; i += 1) {
    hash = (hash * 31 + author.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length] ?? AVATAR_COLORS[0];
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
