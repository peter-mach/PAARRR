import { zodTextFormat } from "openai/helpers/zod";
import { getOpenAI } from "@/lib/openai/client";
import { SCORING_SYSTEM_PROMPT } from "@/lib/scoring/prompt";
import { weightedTotal } from "@/lib/scoring/weights";
import type { PullRequestScore, PullRequestSummary, ScoredPullRequest } from "@/types";
import { PullRequestScoreSchema } from "@/types";

const SCORE_MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";
const SCORE_CONCURRENCY = 3;

export async function scorePR(pr: PullRequestSummary): Promise<PullRequestScore> {
  const client = getOpenAI();
  const response = await client.responses.parse({
    model: SCORE_MODEL,
    instructions: SCORING_SYSTEM_PROMPT,
    input: prPrompt(pr),
    text: {
      format: zodTextFormat(PullRequestScoreSchema, "pull_request_score"),
    },
    max_output_tokens: 900,
    store: false,
    temperature: 0.2,
  });

  const parsed = response.output_parsed;
  if (!parsed) throw new Error("OpenAI returned an empty score payload.");

  return {
    ...parsed,
    total: weightedTotal({
      impact: parsed.impact,
      aiLeverage: parsed.aiLeverage,
      quality: parsed.quality,
    }),
  };
}

export async function scorePRs(prs: PullRequestSummary[]): Promise<ScoredPullRequest[]> {
  return runWithConcurrency(prs, SCORE_CONCURRENCY, async (pr) => ({
    ...pr,
    score: await scoreWithFallback(pr),
  }));
}

async function scoreWithFallback(pr: PullRequestSummary): Promise<PullRequestScore> {
  try {
    return await scorePR(pr);
  } catch (error) {
    if (isFatalScoringError(error)) throw error;
    return {
      impact: 0,
      aiLeverage: 0,
      quality: 0,
      total: 0,
      rationale: {
        impact: "Scoring failed for this PR, so it was excluded from positive impact credit.",
        aiLeverage: "Scoring failed for this PR, so AI-leverage could not be evaluated.",
        quality: "Scoring failed for this PR, so engineering quality could not be evaluated.",
      },
    };
  }
}

function isFatalScoringError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("status" in error)) return false;
  const status = Number((error as { status?: unknown }).status);
  return status === 401 || status === 403 || status === 429;
}

function prPrompt(pr: PullRequestSummary): string {
  return JSON.stringify(
    {
      number: pr.number,
      title: pr.title,
      body: trimForPrompt(pr.body, 2_000),
      author: pr.author,
      url: pr.url,
      mergedAt: pr.mergedAt,
      changedFiles: pr.changedFiles,
      additions: pr.additions,
      deletions: pr.deletions,
    },
    null,
    2,
  );
}

function trimForPrompt(value: string | null, max: number): string | null {
  if (!value) return value;
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
}

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  results.length = items.length;
  let next = 0;

  async function runWorker(): Promise<void> {
    const index = next;
    next += 1;
    if (index >= items.length) return;

    const item = items[index];
    if (item !== undefined) {
      results[index] = await worker(item);
    }
    await runWorker();
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker()));
  return results;
}
