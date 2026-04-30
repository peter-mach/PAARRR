import type { RepoAnalysis } from "@/types";

const TTL_MS = 20 * 60 * 1000;
const MAX_ENTRIES = 25;

type CacheEntry = {
  analysis: RepoAnalysis;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

export function analysisCacheKey(input: {
  owner: string;
  repo: string;
  latestSha: string | null;
  limit: number;
}): string {
  return `${input.owner}/${input.repo}/${input.latestSha ?? "none"}/${input.limit}`;
}

export function getCachedAnalysis(key: string): RepoAnalysis | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.analysis;
}

export function setCachedAnalysis(key: string, analysis: RepoAnalysis): void {
  cache.set(key, {
    analysis,
    expiresAt: Date.now() + TTL_MS,
  });

  while (cache.size > MAX_ENTRIES) {
    const first = cache.keys().next().value;
    if (!first) break;
    cache.delete(first);
  }
}
