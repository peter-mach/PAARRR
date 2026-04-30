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
  diffUrl: z.string().url(),
  mergedAt: z.string(),
  mergeCommitSha: z.string().nullable(),
  changedFiles: z.number().int(),
  additions: z.number().int(),
  deletions: z.number().int(),
});

export type PullRequestSummary = z.infer<typeof PullRequestSummarySchema>;

export type ScoredPullRequest = PullRequestSummary & {
  score: PullRequestScore;
};

export const RepoAggregateSchema = z.object({
  url: z.string(),
  mergedPRs: z.number().int(),
  authorsCount: z.number().int(),
  analysisSeconds: z.number().int(),
  total: ScoreDimensionSchema,
  impact: ScoreDimensionSchema,
  aiLeverage: ScoreDimensionSchema,
  quality: ScoreDimensionSchema,
});

export type RepoAggregate = z.infer<typeof RepoAggregateSchema>;

export const AIInsightSchema = z.object({
  tag: z.enum(["Quality", "Impact", "AI"]),
  body: z.string(),
});

export type AIInsight = z.infer<typeof AIInsightSchema>;

export const AuthorAggregateSchema = z.object({
  name: z.string(),
  avatar: z.string(),
  count: z.number().int(),
  impact: ScoreDimensionSchema,
  ai: ScoreDimensionSchema,
  quality: ScoreDimensionSchema,
  total: ScoreDimensionSchema,
});

export type AuthorAggregate = z.infer<typeof AuthorAggregateSchema>;

export const ScoredPullRequestSchema = PullRequestSummarySchema.extend({
  score: PullRequestScoreSchema,
});

export const RepoAnalysisSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  url: z.string(),
  analyzedAt: z.string(),
  pullRequests: z.array(ScoredPullRequestSchema),
  aggregate: RepoAggregateSchema,
  authors: z.array(AuthorAggregateSchema),
  insights: z.array(AIInsightSchema),
});

export type RepoAnalysis = z.infer<typeof RepoAnalysisSchema>;

export const AnalysisErrorCodeSchema = z.enum([
  "invalid_url",
  "invalid_github_token",
  "repo_not_found",
  "repo_private",
  "no_merged_prs",
  "rate_limit",
  "missing_openai_key",
  "scoring_failed",
  "internal",
]);

export type AnalysisErrorCode = z.infer<typeof AnalysisErrorCodeSchema>;

export type AnalysisErrorResponse = {
  error: {
    code: AnalysisErrorCode;
    message: string;
    hint?: string;
    retryAfter?: number;
    canRetryWithToken?: boolean;
  };
};

export type AnalyzeRequest = {
  url: string;
  githubToken?: string;
};

export type AnalyzeResponse = RepoAnalysis | AnalysisErrorResponse;

export type LegacyRepoAnalysis = {
  owner: string;
  repo: string;
  url: string;
  analyzedAt: string;
  pullRequests: ScoredPullRequest[];
  aggregate: PullRequestScore;
  recommendations?: string[];
};
