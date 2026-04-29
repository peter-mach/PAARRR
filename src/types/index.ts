import { z } from "zod";

export const ScoreDimensionSchema = z.number().int().min(0).max(100);

export const PullRequestScoreSchema = z.object({
  impact: ScoreDimensionSchema,
  aiLeverage: ScoreDimensionSchema,
  quality: ScoreDimensionSchema,
  total: ScoreDimensionSchema,
  rationale: z.object({
    impact: z.string(),
    aiLeverage: z.string(),
    quality: z.string(),
  }),
});

export type PullRequestScore = z.infer<typeof PullRequestScoreSchema>;

export const PullRequestSummarySchema = z.object({
  number: z.number().int(),
  title: z.string(),
  body: z.string().nullable(),
  author: z.string(),
  url: z.string().url(),
  mergedAt: z.string(),
  changedFiles: z.number().int(),
  additions: z.number().int(),
  deletions: z.number().int(),
});

export type PullRequestSummary = z.infer<typeof PullRequestSummarySchema>;

export type ScoredPullRequest = PullRequestSummary & {
  score: PullRequestScore;
};

export type RepoAnalysis = {
  owner: string;
  repo: string;
  url: string;
  analyzedAt: string;
  pullRequests: ScoredPullRequest[];
  aggregate: PullRequestScore;
  recommendations?: string[];
};
