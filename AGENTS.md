# Agent rules for PAARRR

## Workflow: every feature ships as a pull request merged into `main`

This is a hard rule for this repo. Default branch is `main`. No direct commits to `main`.

For every change — feature, bugfix, refactor, even copy tweaks:

1. Branch off `main` with a descriptive name: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`, `docs/<short-name>`.
2. Commit on that branch. Multiple small commits are encouraged — do not squash, do not amend, do not rebase to "tidy" history. The commit log is graded as part of the recruitment task.
3. Open a pull request to `main`. Title is short; body has 1–2 sentences ("what" and "why"). Use the GitHub CLI: `gh pr create --base main`.
4. Merge into `main` via the PR (web UI or `gh pr merge --merge`). Do not fast-forward locally; the PR is the artifact.
5. Tag AI-assisted commits with `[ai]` or `[cc]` in the subject line, and keep the `Co-authored-by: Claude <noreply@anthropic.com>` trailer when relevant.

If the user asks you to "just commit it to main" they are overriding this rule for that one change — confirm, then proceed. Otherwise refuse to bypass.

A non-trivial logical chunk (e.g. "LP hero section", "backend — GitHub API", "dashboard — filtering") is its own PR. Don't bundle unrelated work.

## Quality gates before opening a PR

Run `pnpm check` (typecheck + oxlint + oxfmt --check). It must be green. Build green is also expected (`pnpm build`) for any change that touches runtime code.

## Lint + format

`oxlint` and `oxfmt` (oxc toolchain). Do not reintroduce ESLint or Prettier.

<!-- BEGIN:nextjs-agent-rules -->

## Next.js (do not skip this)

This is Next.js 16 — APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code that touches Next.js APIs. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
