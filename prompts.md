# Prompts log

The four prompts below produced the cleanest output across the build. None of these were one-shot — every chunk went through plan → tool calls → diff review → iterate. The prompts are reproduced verbatim; the iteration is in the git history.

## 1. Project scaffold

> Setup the project. Repo is `PAARRR` (Pull-request Automated Analysis, Reporting, & Review Rig). Use OpenAI for the scoring backend (key already in `.env`). Stack: Next.js 16 + TS + Tailwind v4 + shadcn/ui + oxlint/oxfmt. Make the scaffold pass typecheck, lint, format check, and `next build` before committing.

What worked: stating the **gate conditions** ("must pass typecheck/lint/format/build before committing") forced the agent to self-verify rather than dump code and stop. Tight stack constraint up front avoided cargo-cult deps.

What got reworked later: shadcn/ui was installed but unused — the design needed CSS-class utilities (`.btn .btn-primary` pattern from the prototype) rather than React component primitives. Removed in the design PR.

## 2. Multi-agent design implementation

After fetching a `claude.ai/design` handoff bundle, I dispatched two parallel research agents (one to extract design tokens from `styles.css`, one to inventory the JSX components), wrote the foundation myself (globals.css, fonts, icons, charts, score primitives), then dispatched two **parallel implementation agents**:

> [LP agent] You are implementing the landing page for a Next.js 16 + React 19 + TypeScript project called PAARRR. The design is a handoff from claude.ai/design — vanilla React + inline JSX prototypes. Your job is to recreate the visual output pixel-perfectly as proper TypeScript components. Source: `/tmp/paarrr-handoff/paarrr/project/components-landing.jsx` and `components-hero.jsx`. **FOUNDATION ALREADY EXISTS** — these files are already written, do NOT recreate them; import from them: `src/app/globals.css` (full design tokens), `src/components/icons.tsx` (18 named exports), `src/components/charts/*`, `src/components/score/*`, `src/lib/mock-data.ts`. Build: hero-illustration (ship variant only), nav, hero, social-proof, how-it-works, scoring, preview, final-cta, footer, index.ts barrel. Use `"use client"` only where state/effects need it. Apply CSS classes mentioned in the prototype (`hero-grid`, `hero-right`, `nav-desktop`, `stack-mobile`, etc.) — they're already styled in globals.css for responsive behavior. Path alias `@/*` → `src/*`. TypeScript strict, no `any`. Run `pnpm typecheck` before finishing.

What worked: a **complete map of what already exists** (file paths, exported names, component prop shapes) so the agent doesn't re-create primitives. Same prompt template for the dashboard agent in parallel — they couldn't conflict because the file boundaries were explicit. Two ~12-minute agent runs replaced what would have been ~90 minutes sequentially.

What needed manual fixing afterward: 2 jsx-a11y `anchor-is-valid` errors (the agents used `<a href="#" onClick>` for pseudo-buttons), and one inline-styles perf warning storm — silenced via `.oxlintrc.json` since inline styles are intentional in this design port.

## 3. Backend + frontend wiring plan

Before writing any backend code, I drove a planning loop with the Plan agent. The key prompt:

> Design the implementation plan for the GitHub PR analysis backend for PAARRR. Existing scaffold: factories only (`getOctokit`, `parseRepoUrl`, `getOpenAI`, `SCORING_WEIGHTS`, `SCORING_SYSTEM_PROMPT`, zod schemas). Frontend hardcodes `SAMPLE_PRS` from mock-data.ts. **No route handler exists yet.** Brief budgets ~60s, requires graceful handling of invalid URL / private repo / no merged PRs / GitHub rate limit. Sample size locked at 5 most-recent merged PRs.
>
> Spec:
>
> 1. New backend modules — file paths, exports, signatures. Pick: one OpenAI call per PR (parallelized, concurrency cap 3) vs. batched. Justify briefly.
> 2. The route handler — synchronous or streaming? Map error → status code matrix. Rate-limit handling needs a runtime token-entry path per the brief.
> 3. Frontend rewiring — which components stop importing mocks and accept props? Keep mock-data.ts as a `?mock=1` dev fallback.
> 4. PR sequence (3–5 PRs, each shippable on its own).
>
> Markdown, structured for direct paste into a plan file. Concrete code-level decisions, not platitudes ("use OpenAI structured outputs with `response_format`" beats "send to LLM and get JSON back"). File paths, function signatures, error codes, HTTP status codes. Skip alternative-comparison sections — pick one path and explain why.

What worked: the **explicit "concrete decisions, not platitudes" instruction** — without it, planning agents default to "consider X, Y, Z" lists. Naming the file paths up front (`src/app/api/analyze/route.ts`, `src/lib/scoring/score-prs.ts`) made the plan paste-able.

What I added during review (which the user surfaced before I exited plan mode): a runtime token-override path so users hitting the 60/h anonymous limit can paste their own PAT and retry without restarting the server. That made it into the spec for `/api/analyze` (`{ url, githubToken? }`).

## 4. Code review (this PR)

> Do a thorough code review against the requirements. Use multiple agents to do it. Show what still needs to be implemented or some of the edge cases or improvements.
>
> [Dispatched 4 parallel agents: brief-compliance audit, backend correctness, frontend/UX, security/robustness. Each agent got the source of truth — file paths to read top-to-bottom, the brief at `zadanie_rekrutacyjne_photoaid.md`, and a strict "no praise, only diagnose" instruction. Output format pre-specified per agent: pass/fail tables, file:line citations, severity tags, top-N prioritized fixes.]

What worked: the four agents came back with **23 findings between them**, of which 2 turned out to be agent hallucinations (claimed Octokit token leak and "non-existent gpt-5-mini model"; both wrong on inspection). Catching those required me to read the contested files myself before propagating findings. Trust but verify.

What this PR ships: the 8 highest-leverage findings from that review (bug fixes, security guards, UX polish, brief-compliance closure). One non-trivial finding deferred — backend SSE streaming for real loading-state progress — would be a 60–90 min refactor and the existing "illusion of progress" already solves the worst version of the UX bug.
