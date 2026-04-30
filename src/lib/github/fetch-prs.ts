import { getOctokit } from "@/lib/github/client";
import type { RepoCoords } from "@/lib/github/parse-url";
import type { PullRequestSummary } from "@/types";

const DEFAULT_LIMIT = 5;
const LIST_PAGE_SIZE = 30;
const MAX_LIST_PAGES = 3;

export type GithubFetchErrorCode =
  | "repo_not_found"
  | "repo_private"
  | "invalid_github_token"
  | "rate_limit"
  | "internal";

export class GithubFetchError extends Error {
  constructor(
    public code: GithubFetchErrorCode,
    public hint?: string,
    public retryAfter?: number,
  ) {
    super(code);
  }
}

export type FetchedPRs = {
  pullRequests: PullRequestSummary[];
  latestSha: string | null;
};

export async function fetchMergedPRs(
  coords: RepoCoords,
  options: { limit?: number; token?: string } = {},
): Promise<FetchedPRs> {
  const limit = Math.max(1, Math.min(options.limit ?? DEFAULT_LIMIT, 10));
  const octokit = getOctokit(options.token);

  try {
    const candidates: Array<{ number: number }> = [];
    const pages = await Promise.all(
      Array.from({ length: MAX_LIST_PAGES }, (_, index) => index + 1).map((page) =>
        octokit.rest.pulls.list({
          owner: coords.owner,
          repo: coords.repo,
          state: "closed",
          sort: "updated",
          direction: "desc",
          per_page: LIST_PAGE_SIZE,
          page,
        }),
      ),
    );

    for (const response of pages) {
      if (!response.data.length || candidates.length >= limit) break;
      for (const pr of response.data) {
        if (pr.merged_at) candidates.push({ number: pr.number });
        if (candidates.length >= limit) break;
      }
    }

    const detailed = await Promise.all(
      candidates.slice(0, limit).map(async (pr) => {
        const response = await octokit.rest.pulls.get({
          owner: coords.owner,
          repo: coords.repo,
          pull_number: pr.number,
        });
        return toSummary(response.data);
      }),
    );

    return {
      pullRequests: detailed,
      latestSha: detailed[0]?.mergeCommitSha ?? null,
    };
  } catch (error) {
    throw mapGithubError(error);
  }
}

function toSummary(
  pr: Awaited<ReturnType<ReturnType<typeof getOctokit>["rest"]["pulls"]["get"]>>["data"],
): PullRequestSummary {
  return {
    number: pr.number,
    title: pr.title,
    body: pr.body ?? null,
    author: pr.user?.login ?? "unknown",
    url: pr.html_url,
    diffUrl: `${pr.html_url}/files`,
    mergedAt: pr.merged_at ?? pr.closed_at ?? pr.updated_at,
    mergeCommitSha: pr.merge_commit_sha ?? null,
    changedFiles: pr.changed_files,
    additions: pr.additions,
    deletions: pr.deletions,
  };
}

function mapGithubError(error: unknown): GithubFetchError {
  if (!isGithubError(error)) {
    return new GithubFetchError("internal", "GitHub returned an unexpected response.");
  }

  if (error.status === 401) {
    return new GithubFetchError(
      "invalid_github_token",
      "The token was rejected by GitHub. Paste a valid classic or fine-grained token and retry.",
    );
  }

  if (error.status === 404) {
    return new GithubFetchError(
      "repo_not_found",
      "GitHub could not find that public repository. Check the owner/repo spelling.",
    );
  }

  if (error.status === 403 && isRateLimited(error)) {
    return new GithubFetchError(
      "rate_limit",
      "GitHub's anonymous limit is 60 requests/hour. Paste a token to continue this analysis.",
      retryAfterSeconds(error),
    );
  }

  if (error.status === 403) {
    return new GithubFetchError(
      "repo_private",
      "GitHub blocked access to this repository. It may be private or unavailable to this token.",
    );
  }

  return new GithubFetchError("internal", error.message || "GitHub request failed.");
}

type GithubErrorShape = {
  status: number;
  message?: string;
  response?: {
    headers?: Record<string, string | number | undefined>;
  };
};

function isGithubError(error: unknown): error is GithubErrorShape {
  return typeof error === "object" && error !== null && "status" in error;
}

function isRateLimited(error: GithubErrorShape): boolean {
  return String(error.response?.headers?.["x-ratelimit-remaining"] ?? "") === "0";
}

function retryAfterSeconds(error: GithubErrorShape): number | undefined {
  const retryAfter = Number(error.response?.headers?.["retry-after"]);
  if (Number.isFinite(retryAfter) && retryAfter > 0) return Math.round(retryAfter);

  const resetEpochSeconds = Number(error.response?.headers?.["x-ratelimit-reset"]);
  if (!Number.isFinite(resetEpochSeconds) || resetEpochSeconds <= 0) return undefined;

  const seconds = Math.ceil(resetEpochSeconds - Date.now() / 1000);
  return seconds > 0 ? seconds : undefined;
}
