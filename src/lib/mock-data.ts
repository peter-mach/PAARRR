import { SCORING_WEIGHTS } from "@/lib/scoring/weights";
import type { RepoAnalysis } from "@/types";

export type MockPR = {
  num: number;
  title: string;
  author: string;
  avatar: string;
  files: number;
  add: number;
  del: number;
  impact: number;
  ai: number;
  quality: number;
  merged: string;
};

export const SAMPLE_PRS: MockPR[] = [
  {
    num: 142,
    title: "Add streaming responses to chat endpoint",
    author: "kit-mahaney",
    avatar: "#ee6c3d",
    files: 12,
    add: 487,
    del: 92,
    impact: 92,
    ai: 88,
    quality: 84,
    merged: "2d ago",
  },
  {
    num: 138,
    title: "Refactor auth middleware to use JWT rotation",
    author: "kit-mahaney",
    avatar: "#ee6c3d",
    files: 8,
    add: 256,
    del: 318,
    impact: 78,
    ai: 62,
    quality: 91,
    merged: "3d ago",
  },
  {
    num: 135,
    title: "Migrate Postgres connection pool to Drizzle",
    author: "sam-rios",
    avatar: "#2563d9",
    files: 18,
    add: 612,
    del: 540,
    impact: 86,
    ai: 91,
    quality: 79,
    merged: "5d ago",
  },
  {
    num: 131,
    title: "Implement vector search for documents",
    author: "maya-chen",
    avatar: "#c89c3a",
    files: 22,
    add: 1280,
    del: 34,
    impact: 94,
    ai: 95,
    quality: 88,
    merged: "6d ago",
  },
  {
    num: 128,
    title: "Bump dependencies (minor)",
    author: "dependabot",
    avatar: "#7d93b8",
    files: 1,
    add: 42,
    del: 42,
    impact: 12,
    ai: 8,
    quality: 65,
    merged: "1w ago",
  },
  {
    num: 126,
    title: "Fix race condition in queue worker",
    author: "sam-rios",
    avatar: "#2563d9",
    files: 3,
    add: 84,
    del: 38,
    impact: 71,
    ai: 45,
    quality: 88,
    merged: "1w ago",
  },
  {
    num: 122,
    title: "Add e2e tests for billing flow",
    author: "maya-chen",
    avatar: "#c89c3a",
    files: 9,
    add: 412,
    del: 12,
    impact: 64,
    ai: 72,
    quality: 93,
    merged: "2w ago",
  },
  {
    num: 119,
    title: "Rename customer → account across schema",
    author: "kit-mahaney",
    avatar: "#ee6c3d",
    files: 31,
    add: 188,
    del: 192,
    impact: 38,
    ai: 32,
    quality: 78,
    merged: "2w ago",
  },
  {
    num: 115,
    title: "Add rate-limit per organization",
    author: "maya-chen",
    avatar: "#c89c3a",
    files: 6,
    add: 198,
    del: 24,
    impact: 82,
    ai: 78,
    quality: 86,
    merged: "3w ago",
  },
  {
    num: 110,
    title: "Optimize image pipeline (sharp → squoosh)",
    author: "sam-rios",
    avatar: "#2563d9",
    files: 4,
    add: 124,
    del: 168,
    impact: 74,
    ai: 56,
    quality: 81,
    merged: "3w ago",
  },
];

export function totalScore(pr: Pick<MockPR, "impact" | "ai" | "quality">): number {
  return Math.round(
    pr.impact * SCORING_WEIGHTS.impact +
      pr.ai * SCORING_WEIGHTS.aiLeverage +
      pr.quality * SCORING_WEIGHTS.quality,
  );
}

export type RepoAggregate = {
  url: string;
  mergedPRs: number;
  authorsCount: number;
  analysisSeconds: number;
  total: number;
  impact: number;
  aiLeverage: number;
  quality: number;
};

export const SAMPLE_AGGREGATE: RepoAggregate = {
  url: "github.com/vercel/next.js",
  mergedPRs: 142,
  authorsCount: 8,
  analysisSeconds: 47,
  total: 78,
  impact: 82,
  aiLeverage: 86,
  quality: 71,
};

export type AIInsight = {
  tag: "Quality" | "Impact" | "AI";
  body: string;
};

export const SAMPLE_INSIGHTS: AIInsight[] = [
  {
    tag: "Quality",
    body: "Six PRs lacked test coverage. Consider adding a CI check that flags merged PRs below the project's coverage threshold.",
  },
  {
    tag: "Impact",
    body: "Schema renames (#119, #97, #84) inflated diff sizes without functional impact. Splitting renames from feature work would lift Impact scores.",
  },
  {
    tag: "AI",
    body: "kit-mahaney shows highest AI-leverage. Pair them with sam-rios on a follow-up sprint to spread the workflow knowledge.",
  },
];

export type AuthorAggregate = {
  name: string;
  avatar: string;
  count: number;
  impact: number;
  ai: number;
  quality: number;
  total: number;
};

export function aggregateAuthors(prs: MockPR[]): AuthorAggregate[] {
  const byAuthor = new Map<string, { author: string; avatar: string; prs: MockPR[] }>();
  for (const pr of prs) {
    const existing = byAuthor.get(pr.author);
    if (existing) {
      existing.prs.push(pr);
    } else {
      byAuthor.set(pr.author, { author: pr.author, avatar: pr.avatar, prs: [pr] });
    }
  }
  return Array.from(byAuthor.values())
    .map(({ author, avatar, prs: list }) => {
      const avg = (key: "impact" | "ai" | "quality") =>
        Math.round(list.reduce((sum, p) => sum + p[key], 0) / list.length);
      const impact = avg("impact");
      const ai = avg("ai");
      const quality = avg("quality");
      return {
        name: author,
        avatar,
        count: list.length,
        impact,
        ai,
        quality,
        total: totalScore({ impact, ai, quality }),
      };
    })
    .sort((a, b) => b.total - a.total);
}

export type SortKey =
  | "total-desc"
  | "total-asc"
  | "impact-desc"
  | "ai-desc"
  | "quality-desc"
  | "size-desc";

export type Filters = { q: string; author: string };

export function filterAndSort(prs: MockPR[], filters: Filters, sort: SortKey): MockPR[] {
  const q = filters.q.trim().toLowerCase();
  const filtered = prs.filter((pr) => {
    if (filters.author && pr.author !== filters.author) return false;
    if (q && !pr.title.toLowerCase().includes(q) && !pr.author.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });
  const withTotal = filtered.map((pr) => ({ pr, total: totalScore(pr) }));
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

const MOCK_NOW = Date.now();

export const MOCK_ANALYSIS: RepoAnalysis = {
  owner: "vercel",
  repo: "next.js",
  url: "https://github.com/vercel/next.js",
  analyzedAt: new Date(MOCK_NOW).toISOString(),
  pullRequests: SAMPLE_PRS.slice(0, 5).map((pr, index) => ({
    number: pr.num,
    title: pr.title,
    body: `Mock pull request used for local dashboard iteration. ${pr.title}`,
    author: pr.author,
    url: `https://github.com/vercel/next.js/pull/${pr.num}`,
    diffUrl: `https://github.com/vercel/next.js/pull/${pr.num}/files`,
    mergedAt: new Date(MOCK_NOW - (index + 2) * 24 * 60 * 60 * 1000).toISOString(),
    mergeCommitSha: `mock-merge-${pr.num}`,
    changedFiles: pr.files,
    additions: pr.add,
    deletions: pr.del,
    score: {
      impact: pr.impact,
      aiLeverage: pr.ai,
      quality: pr.quality,
      total: totalScore(pr),
      rationale: {
        impact: "Mock impact rationale for the landing preview dataset.",
        aiLeverage: "Mock AI-leverage rationale for the landing preview dataset.",
        quality: "Mock quality rationale for the landing preview dataset.",
      },
    },
  })),
  aggregate: SAMPLE_AGGREGATE,
  authors: aggregateAuthors(SAMPLE_PRS.slice(0, 5)),
  insights: SAMPLE_INSIGHTS,
};
