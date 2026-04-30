#!/usr/bin/env node
// Benchmark runner — hits POST /api/analyze for each test repo, saves the
// raw JSON response to benchmarks/results/<iteration>/<owner-repo>.json,
// and prints a one-line summary per repo.
//
// Usage:
//   node benchmarks/run.mjs <iteration-name> [repo1,repo2,...]
//
// Examples:
//   node benchmarks/run.mjs 03-after-recalibration
//   node benchmarks/run.mjs 04-prompt-tweak chalk/chalk,vercel/swr
//
// Reads GITHUB_TOKEN from env and forwards it (so we don't burn the 60/h
// anonymous limit). Server must be running at $PAARRR_URL (default
// http://localhost:3000).

import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPOS = [
  "chalk/chalk",
  "expressjs/express",
  "vercel/swr",
  "withastro/astro",
  "anthropics/claude-code",
  "peter-mach/PAARRR",
  "gastownhall/gastown",
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_ROOT = join(__dirname, "results");
const BASE = process.env.PAARRR_URL ?? "http://localhost:3000";
const TOKEN = process.env.GITHUB_TOKEN;

const [, , iteration, repoList] = process.argv;
if (!iteration) {
  console.error("Usage: node benchmarks/run.mjs <iteration-name> [repo1,repo2,...]");
  process.exit(1);
}

const repos = repoList ? repoList.split(",") : REPOS;
const outDir = join(RESULTS_ROOT, iteration);
mkdirSync(outDir, { recursive: true });

console.log(`# Iteration: ${iteration}`);
console.log(`# Server: ${BASE}`);
console.log(`# Token: ${TOKEN ? "yes" : "no (anonymous — risk of rate limit)"}`);
console.log(`# Repos: ${repos.length}`);
console.log("");

const summary = [];

for (const slug of repos) {
  const url = `https://github.com/${slug}`;
  process.stdout.write(`${slug.padEnd(28)} `);
  const t0 = Date.now();
  try {
    const res = await fetch(`${BASE}/api/analyze`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url, githubToken: TOKEN }),
    });
    const elapsed = Math.round((Date.now() - t0) / 1000);
    const json = await res.json();
    const safeSlug = slug.replaceAll("/", "-");
    writeFileSync(join(outDir, `${safeSlug}.json`), JSON.stringify(json, null, 2));
    if (!res.ok) {
      console.log(`ERROR ${res.status} ${json?.error?.code ?? "?"} (${elapsed}s)`);
      summary.push({ slug, ok: false, status: res.status, code: json?.error?.code });
      continue;
    }
    const a = json.aggregate;
    const sigCounts = json.pullRequests.reduce(
      (acc, pr) => {
        if (pr.aiSignals?.coAuthoredByAI) acc.trailer += 1;
        if (pr.aiSignals?.aiTagInTitle) acc.tag += 1;
        if (pr.aiSignals?.authorIsKnownAIBot) acc.bot += 1;
        return acc;
      },
      { trailer: 0, tag: 0, bot: 0 },
    );
    console.log(
      `total=${String(a.total).padStart(2)} ` +
        `imp=${String(a.impact).padStart(2)} ` +
        `ai=${String(a.aiLeverage).padStart(2)} ` +
        `q=${String(a.quality).padStart(2)} ` +
        `[trailer:${sigCounts.trailer}/${json.pullRequests.length} ` +
        `tag:${sigCounts.tag} bot:${sigCounts.bot}] ` +
        `(${elapsed}s)`,
    );
    summary.push({
      slug,
      ok: true,
      total: a.total,
      impact: a.impact,
      aiLeverage: a.aiLeverage,
      quality: a.quality,
      signals: sigCounts,
      elapsed,
    });
  } catch (error) {
    console.log(`FAIL: ${error.message}`);
    summary.push({ slug, ok: false, error: error.message });
  }
}

writeFileSync(join(outDir, "_summary.json"), JSON.stringify(summary, null, 2));
console.log(`\nSaved to ${outDir}`);
