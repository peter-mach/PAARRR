# Ground-truth AI signals — 5 most-recently-merged PRs per repo

Audited 2026-04-30. expressjs/express returned only 4 merged PRs in the recent window; anthropics/claude-code returned only 3. Counts use that real denominator.

## Summary table

| Repo                   | PRs with trailer    | PRs with `[ai]`/`[cc]` tag | AI-bot author count | Detected agents                                         |
| ---------------------- | ------------------- | -------------------------- | ------------------- | ------------------------------------------------------- |
| chalk/chalk            | 0/5                 | 0/5                        | 0                   | —                                                       |
| expressjs/express      | 0/4                 | 0/4                        | 0                   | dependabot (dep bot, not AI)                            |
| vercel/swr             | 0/5                 | 0/5                        | 1                   | Copilot (PR author `Copilot`, "Initial plan" pattern)   |
| withastro/astro        | 0/5                 | 0/5                        | 0                   | astrobot-houston is release bot (excluded)              |
| anthropics/claude-code | 0/3                 | 0/3                        | 0                   | "Orbis Security AI" attribution phrase in 1 commit body |
| peter-mach/PAARRR      | 1/5 (12/16 commits) | 5/5                        | 0                   | Claude (trailers on all of PR #10's 12 commits)         |
| gastownhall/gastown    | 1/5                 | 0/5                        | 0                   | Claude (trailer on PR #3742)                            |

## Per-PR detail

### chalk/chalk

| PR   | Author      | Trailer? | Tag? | Notes                                   |
| ---- | ----------- | -------- | ---- | --------------------------------------- |
| #664 | mdhamed238  | no       | no   | docs spacing fix                        |
| #653 | rhodes-b    | no       | no   | terminal capability                     |
| #642 | hyperupcall | no       | no   | bug fix, references upstream commit URL |
| #629 | r4h33q      | no       | no   | readme number bump                      |
| #623 | Richienb    | no       | no   | example tweak, 2 commits                |

### expressjs/express

| PR    | Author          | Trailer? | Tag? | Notes                 |
| ----- | --------------- | -------- | ---- | --------------------- |
| #7150 | dependabot[bot] | no       | no   | dep bump (non-AI bot) |
| #7149 | dependabot[bot] | no       | no   | dep bump              |
| #7148 | dependabot[bot] | no       | no   | dep bump              |
| #7159 | Vansh1811       | no       | no   | docs URL fix          |

### vercel/swr

| PR    | Author        | Trailer? | Tag? | Notes                                                                                                        |
| ----- | ------------- | -------- | ---- | ------------------------------------------------------------------------------------------------------------ |
| #4243 | lukesandberg  | no       | no   | axios sec bump                                                                                               |
| #4223 | promer94      | no       | no   | normal fix                                                                                                   |
| #4216 | RyanCavanaugh | no       | no   | tsconfig cleanup                                                                                             |
| #4212 | promer94      | no       | no   | useSES rerender fix                                                                                          |
| #4213 | Copilot       | no       | no   | author = Copilot SWE agent; "Initial plan" + agent-style commit pattern; co-author is human reviewer shuding |

### withastro/astro

| PR     | Author           | Trailer? | Tag?              | Notes                           |
| ------ | ---------------- | -------- | ----------------- | ------------------------------- |
| #16539 | matthewp         | no       | no                | workflow fix                    |
| #16533 | astrobot-houston | no       | `[ci]` not `[ai]` | Changesets release bot (not AI) |
| #16537 | matthewp         | no       | no                | workflow automation             |
| #16460 | astrobot-houston | no       | `[ci]` not `[ai]` | release bot                     |
| #16534 | matthewp         | no       | no                | zod compat fix                  |

### anthropics/claude-code

| PR     | Author           | Trailer? | Tag? | Notes                                                                                                            |
| ------ | ---------------- | -------- | ---- | ---------------------------------------------------------------------------------------------------------------- |
| #1     | bcherny          | no       | no   | SECURITY.md, oldest PR                                                                                           |
| #43824 | orbisai0security | no       | no   | "Automated security fix generated by Orbis Security AI" attribution phrase in body; vendor not in our agent list |
| #52239 | dhollman         | no       | no   | normal human fix                                                                                                 |

### peter-mach/PAARRR

| PR  | Author     | Trailer?            | Tag? | Notes                                              |
| --- | ---------- | ------------------- | ---- | -------------------------------------------------- |
| #10 | peter-mach | yes (12/12 commits) | yes  | every commit has `Co-authored-by: Claude` + `[ai]` |
| #6  | peter-mach | no (squashed)       | yes  | single squash commit with `[ai]` subject           |
| #9  | peter-mach | no (squashed)       | yes  | single squash commit with `[ai]` subject           |
| #8  | peter-mach | no (squashed)       | yes  | single squash commit with `[ai]` subject           |
| #7  | peter-mach | no (squashed)       | yes  | single squash commit with `[ai]` subject           |

### gastownhall/gastown

| PR    | Author     | Trailer? | Tag? | Notes                                                         |
| ----- | ---------- | -------- | ---- | ------------------------------------------------------------- |
| #3754 | mmlac      | no       | no   | Dolt timeout fix, conventional-style                          |
| #3753 | mmlac      | no       | no   | atomic settings.json write                                    |
| #3743 | certivpaul | no       | no   | sling deferred dispatch                                       |
| #3742 | certivpaul | yes      | no   | `Co-Authored-By: Claude <noreply@anthropic.com>` trailer      |
| #3739 | certivpaul | no       | no   | witness zombie-scan, no trailer despite similar prose density |

## Calibration interpretation

If our scorer counted only the explicit signals listed above:

- **chalk/chalk** → **0–25** (no signals)
- **expressjs/express** → **0–25** (no AI signals; dependabot is a non-AI dependency bot and should not lift the band)
- **vercel/swr** → **40–64** (one PR is bot-authored by Copilot SWE-agent — single-PR signal)
- **withastro/astro** → **0–25** (astrobot-houston is a Changesets release bot per user instructions, not AI; `[ci]` tags should not match `[ai]` regex)
- **anthropics/claude-code** → **0–25** on strict regex; **40–64** if a "generated by ... AI" phrase scanner picks up #43824 ("Orbis Security AI")
- **peter-mach/PAARRR** → **85–100** (5/5 PRs tagged `[ai]`; PR #10's 12 commits all carry the Claude trailer; the squash-merged PRs lose the trailer post-merge but retain the tag, which is the explicit local convention)
- **gastownhall/gastown** → **40–64** (1/5 PRs has a trailer; none tagged) — undercounts the truth, since prose density and recurring fix patterns suggest broader AI involvement, but per the strict-evidence rule only #3742 counts.

Expected ordering was chalk < express < swr < astro < claude-code < PAARRR < gastown. Observed-evidence ordering is chalk ≈ express ≈ astro < claude-code (depending on phrase scan) ≈ swr < gastown < PAARRR. PAARRR overshoots gastown on observed signals because its commit-message convention is explicit; gastown's authors leave the trailer off most commits, so a regex-only scorer will underestimate it relative to PAARRR.
