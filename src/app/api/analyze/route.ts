import { z } from "zod";
import { analysisCacheKey, getCachedAnalysis, setCachedAnalysis } from "@/lib/analysis/cache";
import { fetchMergedPRs, GithubFetchError } from "@/lib/github/fetch-prs";
import { parseRepoUrl } from "@/lib/github/parse-url";
import { aggregateAuthors, aggregateRepo } from "@/lib/scoring/aggregate";
import { generateInsights } from "@/lib/scoring/insights";
import { scorePRs } from "@/lib/scoring/score-prs";
import type { AnalysisErrorCode, AnalysisErrorResponse, RepoAnalysis } from "@/types";
import { RepoAnalysisSchema } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PR_LIMIT = 5;

const AnalyzeBodySchema = z.object({
  url: z.string().trim().min(1),
  githubToken: z.string().trim().min(1).optional(),
});

export async function POST(request: Request): Promise<Response> {
  const startedAt = Date.now();
  let body: z.infer<typeof AnalyzeBodySchema>;

  try {
    body = AnalyzeBodySchema.parse(await request.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      const tokenIssue = error.issues.some((issue) => issue.path[0] === "githubToken");
      if (tokenIssue) {
        return errorResponse(
          "invalid_github_token",
          "GitHub token is empty or malformed.",
          401,
          "Paste a non-empty classic or fine-grained personal access token.",
          undefined,
          true,
        );
      }
    }
    return errorResponse("invalid_url", "Enter a GitHub repository URL.", 400);
  }

  const coords = parseRepoUrl(body.url);
  if (!coords) {
    return errorResponse(
      "invalid_url",
      "That does not look like a GitHub repository URL.",
      400,
      "Use a public repo URL like github.com/vercel/next.js.",
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return errorResponse(
      "missing_openai_key",
      "OpenAI is not configured for this deployment.",
      500,
      "Set OPENAI_API_KEY before running live analysis.",
    );
  }

  try {
    const fetched = await fetchMergedPRs(coords, {
      limit: PR_LIMIT,
      token: body.githubToken,
    });

    if (!fetched.pullRequests.length) {
      return errorResponse(
        "no_merged_prs",
        "No merged pull requests were found.",
        422,
        "Try a repository with recent merged pull requests.",
      );
    }

    const cacheKey = analysisCacheKey({
      owner: coords.owner,
      repo: coords.repo,
      latestSha: fetched.latestSha,
      limit: PR_LIMIT,
    });
    const cached = getCachedAnalysis(cacheKey);
    if (cached) return Response.json(cached);

    const { pullRequests: scored, failedNumbers } = await scorePRs(fetched.pullRequests);
    // Only feed successfully-scored PRs into the aggregate maths; failed ones
    // stay in the displayed list (with a "Scoring failed" rationale) but their
    // zero-scores must not drag the repo total down.
    const successful = scored.filter((pr) => !failedNumbers.has(pr.number));
    const insights = await generateInsights(successful);
    // Time the entire analysis including insights — the LLM round-trip there
    // is the largest single chunk of latency and the user deserves an honest
    // number on the dashboard.
    const analysisSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const url = `https://github.com/${coords.owner}/${coords.repo}`;
    const analysis: RepoAnalysis = RepoAnalysisSchema.parse({
      owner: coords.owner,
      repo: coords.repo,
      url,
      analyzedAt: new Date().toISOString(),
      pullRequests: scored,
      aggregate: aggregateRepo(successful, scored.length, analysisSeconds, url),
      authors: aggregateAuthors(successful),
      insights,
    });

    setCachedAnalysis(cacheKey, analysis);
    return Response.json(analysis);
  } catch (error) {
    if (error instanceof GithubFetchError) {
      return githubErrorResponse(error);
    }

    return errorResponse(
      "scoring_failed",
      "The analysis could not be completed.",
      502,
      "Retry in a moment, or try a smaller public repository.",
    );
  }
}

function githubErrorResponse(error: GithubFetchError): Response {
  switch (error.code) {
    case "invalid_github_token":
      return errorResponse("invalid_github_token", "GitHub rejected that token.", 401, error.hint);
    case "repo_not_found":
      return errorResponse("repo_not_found", "Repository not found.", 404, error.hint);
    case "repo_private":
      return errorResponse(
        "repo_private",
        "Repository is private or inaccessible.",
        404,
        error.hint,
      );
    case "rate_limit":
      return errorResponse(
        "rate_limit",
        "GitHub rate limit reached.",
        429,
        error.hint,
        error.retryAfter,
        true,
      );
    default:
      return errorResponse("internal", "GitHub request failed.", 502, error.hint);
  }
}

function errorResponse(
  code: AnalysisErrorCode,
  message: string,
  status: number,
  hint?: string,
  retryAfter?: number,
  canRetryWithToken = false,
): Response {
  const payload: AnalysisErrorResponse = {
    error: {
      code,
      message,
      hint,
      retryAfter,
      canRetryWithToken,
    },
  };
  const headers = new Headers();
  if (retryAfter) headers.set("Retry-After", String(retryAfter));
  return Response.json(payload, { status, headers });
}
