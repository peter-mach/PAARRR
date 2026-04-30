import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { getOpenAI } from "@/lib/openai/client";
import type { AIInsight, ScoredPullRequest } from "@/types";
import { AIInsightSchema } from "@/types";

const INSIGHTS_MODEL = process.env.OPENAI_INSIGHTS_MODEL ?? "gpt-5.5";

const InsightsSchema = z.object({
  insights: z.array(AIInsightSchema).length(3),
});

export async function generateInsights(scored: ScoredPullRequest[]): Promise<AIInsight[]> {
  try {
    const client = getOpenAI();
    const response = await client.responses.parse({
      model: INSIGHTS_MODEL,
      instructions:
        "You are a senior engineering manager. Return three concise, concrete repository recommendations grounded only in the PR scores provided.",
      reasoning: { effort: "low" },
      input: JSON.stringify(
        scored.map((pr) => ({
          number: pr.number,
          title: pr.title,
          author: pr.author,
          changedFiles: pr.changedFiles,
          additions: pr.additions,
          deletions: pr.deletions,
          score: pr.score,
        })),
      ),
      text: {
        format: zodTextFormat(InsightsSchema, "repo_insights"),
      },
      max_output_tokens: 1_000,
      store: false,
    });

    return response.output_parsed?.insights ?? [];
  } catch (error) {
    console.warn("[PAARRR] Insight generation failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
