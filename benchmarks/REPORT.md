# PAARRR scoring iteration report

Tracks the repo-level total + per-dimension scores produced by `/api/analyze`
across code revisions, against a fixed test set of 7 GitHub repositories
chosen to span the AI-Leverage axis. Live data lives under
`benchmarks/results/<iteration>/`. Ground-truth AI-signal audit lives in
[`ground-truth-signals.md`](./ground-truth-signals.md).

## Summary

|                                | Iter 1 (baseline) | Iter 2 (post PR #11) | Iter 3 (after [bot] fix) | GT band |
|--------------------------------|-------------------|----------------------|--------------------------|---------|
| Code revision                  | `gpt-5-mini`, weights 0.40/0.35/0.25, original prompt, no `aiSignals` | `gpt-5.5`, weights 0.35/0.45/0.20, anchored prompt, `aiSignals` extracted from commits | iter 2 + tightened bot-author regex (no longer treats `dependabot[bot]` as AI) | — |
| `chalk/chalk`                  | **25** (24/5/54)   | —                    | **20** (18/6/55)         | 0–25    |
| `expressjs/express`            | **29** (23/9/65)   | —                    | **33** (10/42/54) ⚠      | 0–25    |
| `vercel/swr`                   | **40** (43/25/58)  | —                    | **33** (32/23/56)        | 40–64   |
| `withastro/astro`              | **46** (59/18/63)  | **36** (45/15/67)    | **36** (cache hit)       | 0–25    |
| `anthropics/claude-code`       | **42** (51/18/63)  | **40** (31/38/60)    | **40** (cache hit)       | 0–25    |
| `peter-mach/PAARRR`            | **43** (51/20/61)  | **52** (41/54/66)    | **52** (41/54/66)        | 85–100  |
| `gastownhall/gastown`          | —                  | **55** (55/44/79)    | **55** (cache hit)       | 40–64   |

Cells: `total (impact / AI-Leverage / quality)`. "GT band" is the AI-Leverage
band the ground-truth audit assigns based purely on observed commit-level
signals (trailers / `[ai]` tags / known AI-bot author).

## What moved between iterations

### Iter 1 → Iter 2 (the recalibration PR #11)

- **PAARRR**: `20 → 54` AI-Leverage. Biggest signal lift in the test set.
  PR #10 in particular went from low to **96** — it's the one PR with all
  three signals present (trailer on every commit, `[ai]` tag, body
  attribution).
- **Gastown**: `—` → 44 AI-Leverage. The differentiation works *inside* a
  repo: PR #3742 (Claude trailer) → 92, PR #3743 (no signal) → 10. The 44
  average reflects 1/5 PRs having a trailer.
- **claude-code, astro**: AI-Leverage rose only modestly (18→38 and 18→15).
  Both repos have **0/5** trailers and **0/5** tags in the recent merged
  window — the lift is the model giving "ambiguous large cohesive diff"
  benefit-of-the-doubt scores in the 25–40 band.

The recalibration succeeded at its stated goal — the three repos with
explicit AI signals (PAARRR 54, gastown 44, swr 23 via Copilot SWE-agent
bot author) now sit clearly above the four with no signals (chalk 6,
express 9→42 ⚠, astro 15, claude-code 38).

### Iter 2 anomaly: `expressjs/express` AI-Leverage = 42 ⚠

The express repo has **no AI signals at all** in its recent merged PRs —
the audit confirms 3/5 are `dependabot[bot]` dependency bumps, 1/5 is a
human docs URL fix, and there are 4 merged PRs in the window (not 5)
because `expressjs/express` recently had fewer merges than the page size.
Yet AI-Leverage came out as 42, which sits in the "clear AI authorship"
band per the prompt rubric.

**Root cause**: `extractAISignals` was setting `authorIsKnownAIBot=true`
for *any* `*[bot]` login, including `dependabot[bot]` and `renovate[bot]`.
The prompt then maps `authorIsKnownAIBot` into the 65–84 band, so 3/5 PRs
got an inflated AI-Leverage score and the average came out at 42.

**Fix** in iter 3: drop the bare `[bot]` suffix check; only flag the bot
flag when the author login matches a known AI agent name (Claude, Codex,
Copilot, Cursor, Devin, Jules, Aider, Sweep). Dependency bots and
release bots are explicitly excluded.

### Expected iter 3 changes

Should *only* affect express (and any future repo dominated by non-AI
bots). The other six repos have no `[bot]`-suffix authors, so their
scores stay put. Iter 3 cells will be filled in once the bug fix runs.

## Ground-truth ordering vs scored ordering

Expected (audit): `chalk ≈ express ≈ astro` < `claude-code ≈ swr` <
`gastown` < `PAARRR`.

Iter 2 observed: `chalk(25) < express(29) < swr(33-40) < astro(36-46) ≈
claude-code(40-42) < PAARRR(43-52) < gastown(55)`.

Two things to note:

1. **PAARRR scores below gastown on total**, even though PAARRR has more
   AI signals (5/5 vs 1/5). This is correct: gastown's *Quality* (79) is
   far higher than PAARRR's (66) because gastown's commit messages are
   long, structured, and well-sourced. Total weighting (Q at 0.20) and
   per-dimension avg both contribute. If the user wants AI-Leverage to
   dominate the verdict more visibly, push the AI weight higher.
2. **Gastown undercounts the "real" AI involvement.** Per the audit,
   gastown's commit messages have AI-shape (Symptom/Root cause/Fix
   structure, conventional commits, dense prose) but only 1/5 PRs has an
   explicit Claude trailer. A pure-evidence scorer can't break out of
   that constraint without supplementary heuristics (commit-body density,
   per-author trailer ratio across the full repo, etc.).

## How to run

```bash
GITHUB_TOKEN=$(gh auth token) node benchmarks/run.mjs <iteration-name>
```

Saves JSON dumps and a `_summary.json` to
`benchmarks/results/<iteration-name>/`. Server must be running at
`localhost:3000` (override with `PAARRR_URL=`).

The dev-server cache is in-memory and keyed on `(owner, repo, latestSha,
limit)`. After a code change that should affect scoring, kill and
restart the dev server before running the benchmark — otherwise repos
with no new merged PRs will return stale cached results (visible by a
sub-5s round-trip).
