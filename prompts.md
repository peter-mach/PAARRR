# Prompts log

Notable prompts that produced good output during the build. Not exhaustive — just the ones I would reuse.

## 1. Scaffold (this PR)

> Setup the project. Repo is `PAARRR` (Pull-request Automated Analysis, Reporting, & Review Rig). Use OpenAI for the scoring backend (key already in `.env`). Stack: Next.js 16 + TS + Tailwind v4 + shadcn/ui + oxlint/oxfmt. Make the scaffold pass typecheck, lint, format check, and `next build` before committing.

Decision points the agent surfaced and I confirmed:

- Use `pnpm` (already installed locally)
- Swap ESLint → oxc tooling once I asked for it mid-task
- Gitignore the recruitment brief (it's a hiring doc, not project content)

## 2. _placeholder — landing page hero_

To be filled when the LP PR lands.

## 3. _placeholder — scoring prompt design_

To be filled when the backend PR lands.

## 4. _placeholder — dashboard charts_

To be filled when the dashboard PR lands.
