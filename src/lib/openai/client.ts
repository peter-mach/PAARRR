import OpenAI from "openai";

let cached: OpenAI | undefined;

export function getOpenAI(): OpenAI {
  if (cached) return cached;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env.local before running PR analysis.");
  }
  cached = new OpenAI({ apiKey });
  return cached;
}
