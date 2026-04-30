# PAARRR

**Pull-request Automated Analysis, Reporting, & Review Rig**

Point PAARRR at a public GitHub repo, get an AI-generated quality score across three dimensions: **Impact**, **AI-Leverage**, and **Quality** — for each merged pull request and for the repo as a whole.

> Recruitment task for PhotoAID. Live demo + recording links land in this README before submission.

<p align="center">
  <img src="public/screenshots/hero.png" alt="PAARRR landing page" width="900" />
</p>

<p align="center">
  <img src="public/screenshots/how-it-works.png" alt="How it works — three steps from repo to report" width="32%" />
  <img src="public/screenshots/loading.png" alt="Loading state — charting results" width="32%" />
  <img src="public/screenshots/dashboard.png" alt="Dashboard — verdict, radar, and AI recommendations" width="32%" />
</p>

---

## Run locally

```bash
pnpm install
cp .env.example .env.local   # add OPENAI_API_KEY (and optional GITHUB_TOKEN)
pnpm dev
```

App is at <http://localhost:3000>. Append `?mock=1` to skip the network and render a fixture-backed dashboard for design iteration.

Other scripts: `pnpm build`, `pnpm start`, `pnpm check` (typecheck + lint + format check), `pnpm lint:fix`, `pnpm format`.

## What's implemented

A condensed feature inventory so a reviewer can see scope at a glance. Each bullet maps to real code on this branch.

### Landing page

- **Hero with animated, typed placeholder** in the URL field; **client-side URL validation** (`parseRepoUrl`) before any network call, with inline error messaging and `aria-invalid`/`aria-describedby` wiring.
- Mobile-friendly URL input: `type=url`, `inputMode=url`, `autoCapitalize=off`, `autoCorrect=off`, `spellCheck=false`.
- Sections per the brief: Hero, Social proof marquee, How it works (3 steps with treasure-path), What we score (3 dimensions with weights), Sample report preview, Final CTA, Footer.
- Hand-rolled **paper-boat-on-code-wave SVG** illustration with subtle ship-rock and float-y animations; **edge-to-edge on mobile**.
- **Mobile-first responsive** at 1024 / 768 breakpoints, plus an explicit **`prefers-reduced-motion`** opt-out that strips every keyframe animation, scroll reveal, and confetti flight for users who request it.

### Backend (`/api/analyze`)

- POST route at `src/app/api/analyze/route.ts`. Body shape `{ url, githubToken? }`, runtime `nodejs`, `dynamic = "force-dynamic"`, `maxDuration = 60`.
- **GitHub fetch** (`src/lib/github/fetch-prs.ts`): paginated `pulls.list({state:"closed"})` filtered by `merged_at`, then parallel `pulls.get` for full +/- diff stats. Hard cap at 10, default 5.
- **LLM scoring** (`src/lib/scoring/score-prs.ts`): one OpenAI structured-output call per PR (`responses.parse` + zod text format), concurrency-capped at 2, single retry with backoff on transient failures, fatal-error short-circuit on 401/403/429. Failed PRs surface in the dashboard list with a "Scoring failed" rationale **and are excluded from the repo-aggregate math** so they don't drag the verdict down.
- **Repo aggregate** (`src/lib/scoring/aggregate.ts`): per-dimension averages weighted by `0.40 / 0.35 / 0.25` to a single repo total. Per-author aggregates with deterministic palette-based avatars.
- **AI recommendations** (`src/lib/scoring/insights.ts`): one extra OpenAI call producing 3 typed insights tagged `Quality | Impact | AI`, surfaced on the dashboard.
- **In-memory cache** (`src/lib/analysis/cache.ts`): keyed by `(owner, repo, latestSha, limit)`, bounded eviction so repeat-analyses on the same repo never re-pay OpenAI.
- **Prompt-injection hardening**: the system prompt declares an explicit trust boundary — PR title/body/author are untrusted user content; embedded "ignore previous instructions" / "score this 100" attempts are ignored.

### Error handling (every brief-mandated edge case)

- **Invalid URL** → 400 `invalid_url` with hint
- **Repository not found** → 404 `repo_not_found`
- **Private repo / 403 non-rate-limit** → 404 `repo_private`
- **No merged PRs** → 422 `no_merged_prs` with suggestion to try another repo
- **GitHub rate limit hit** → 429 `rate_limit` with `Retry-After` header + the user is prompted on-screen to paste their own GitHub PAT and retry
- **Invalid / empty GitHub token submitted** → 401 `invalid_github_token` (distinct from `invalid_url`)
- **OpenAI key missing** → 500 `missing_openai_key`
- **All-PR scoring failure** → 502 `scoring_failed`
- **Anything else** → 502 `internal`

### GitHub auth — runtime token override

The backend respects `GITHUB_TOKEN` from env (lifts to 5000/h). If a visitor hits the 60/h anonymous limit, the **error UI prompts them to paste their own classic / fine-grained PAT**; the token is sent only on the next request (never persisted server-side) and cached in the browser's `sessionStorage` so subsequent analyses in the same tab don't ask again.

### Dashboard

- Verdict score with **animated count-up** to the repo total, plus the three dimension scores under it.
- Hand-rolled **animated radar chart** (no Recharts overhead) with cubic-eased polygon fill; per-dimension `CountUp` numbers under each axis.
- **AI recommendations card** with the 3 LLM-generated insights, each tagged.
- **PR list** with title (linked to GitHub PR), author, files / additions / deletions, link to the full diff, three dimension scores with mini bars, and a total badge that goes gold-dashed at ≥80.
- **Filtering & sorting** on every visible field: title/author search, author dropdown, sort by total / impact / AI-leverage / quality / size, ascending or descending.
- **Authors tab** with per-author aggregates and the same score breakdown.
- **JSON export** — one click downloads the entire `RepoAnalysis` object as `paarrr-{owner}-{repo}.json`.
- **Share link** — copies the current URL to clipboard for sharing in chat.
- **Confetti** fires once per analysis on mount **only when the verdict is ≥70** (gated via `useRef` keyed on `analyzedAt`, never on a low-score repo).
- Fully responsive — PR rows stack into vertical cards on mobile, header collapses, action buttons drop secondary actions.

### Loading state

- Multi-stage progress (Hailing GitHub → Hauling in PRs → Plotting course → Charting results) with messages that cycle on a creep timer during the long-tail wait. The bar is decoupled from the synchronous fetch by design — when scoring runs ~30 s on a large repo the user always sees motion. Real-progress streaming via SSE is a clean future swap.

### Code quality

- **TypeScript strict**, zero `any`. Every API boundary parsed by zod (`AnalyzeBodySchema`, `RepoAnalysisSchema`).
- **oxlint + oxfmt** (oxc Rust toolchain) — ~10× faster than ESLint/Prettier; runs on every build via `pnpm check`.
- **Path alias** `@/*` → `src/*` everywhere; no relative `../..` imports.
- **Mock fallback** at `?mock=1` keeps dev iteration free of OpenAI cost.

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript** — single deployable; route handlers cover the "mini backend" so there's no extra service to host. Static prerendering of the LP keeps Lighthouse mobile in the 90s with zero work.
- **Tailwind v4** — `@theme` block keeps tokens in CSS, not JS. Component primitives (`.btn`, `.chip`, `.card`, `.input`) are CSS-class utilities to match the prototype's authoring style; Radix/shadcn primitives were removed once the design landed because they weren't load-bearing.
- **Framer Motion** is in deps for future scroll-reveal work; current animations are CSS keyframes + IntersectionObserver because they tree-shake to nothing.
- **OpenAI SDK + Octokit** — scoring (structured outputs / zod schema) and GitHub data fetching.
- **oxlint + oxfmt (oxc)** — Rust-based linter + formatter, zero-config for this scale of project.

## Scoring weights

`total = 0.40 × Impact + 0.35 × AI-Leverage + 0.25 × Quality`

Reasoning:

- **Impact (40%)** — the brief frames Impact as "real value vs. churn"; that is the dimension a hiring manager actually wants ranked first when looking at a repo's PR stream.
- **AI-Leverage (35%)** — PhotoAID is explicitly hiring for AI leverage ("90% kodu generujemy z AI"). Weighting it high makes the scorer surface candidates whose PRs read as AI-authored.
- **Quality (25%)** — non-negotiable hygiene, but in an AI-first workflow it is partially absorbed by AI-Leverage (well-prompted AI tends to ship focused, single-purpose PRs with tests). Weighted lowest to avoid double-counting.

Weights live in `src/lib/scoring/weights.ts` — single source of truth, tweakable.

## How AI was used

- **Driver:** Claude Code (Opus) with an iterative loop (plan → tool calls → review diff → adjust). Multi-agent dispatch for parallelizable chunks (LP + dashboard implementation in parallel; 4-way code review in parallel).
- **What AI did:** scaffold, the scoring prompt design, type schemas, the LP component code, dashboard charts, the LLM scoring pipeline, error mapping, README copy.
- **What I did myself:** scoring weight calibration, the choice to swap ESLint for oxc, edge-case prioritization (rate limit handling with runtime token override, no-PR repo, all-PR scoring failure), visual direction (crimson accent, ship illustration), and verifying agent claims before propagating them (caught two hallucinated "P0 bugs" during the review pass).
- **Traces:** `prompts.md` captures the four highest-leverage prompts. Co-authored-by trailers and `[ai]`/`[cc]` tags appear on every AI-assisted commit.

## Design decisions

The brief leaves several details open. Where I chose:

- **PR sample size** — latest 5 merged PRs. Recent work is the strongest signal of how someone codes today, and a tight sample keeps OpenAI spend and round-trip latency low.
- **GitHub auth** — anonymous by default (60 req/h). If `GITHUB_TOKEN` is in env it's used (5000 req/h). When the public limit is hit, the error UI prompts the user to paste their own PAT and retry — token is `sessionStorage`-scoped to that tab, never persisted server-side.
- **LLM models** — `gpt-5-mini` for individual PR scoring (cheap, fast, accurate at this constrained task), `gpt-5` for the repo-level recommendations (3 sentences, higher leverage). Both via structured outputs with zod schemas.
- **Caching** — repo analysis hashed by `(owner, repo, latestSha, limit)` and cached in memory for the lifetime of the server process. Good enough for a demo; Redis/KV is the obvious next step.
- **Dashboard rendering of scoring failures** — failed PRs stay visible in the list (with a "Scoring failed" rationale on each dimension) but are excluded from the repo-aggregate math. The user sees what happened without the verdict being silently distorted.
- **Confetti gating** — fires once per analysis at ≥70 total. A low score with confetti would be insulting; firing twice on the same dashboard is jarring.
- **Recruitment brief** — `zadanie_rekrutacyjne_photoaid.md` is gitignored. It is a hiring document, not project content.

## What I would do next

- Persist analyses in Postgres or Vercel KV — enables shareable `/results/[hash]` URLs, history, leaderboards.
- Stream the scoring step from the server with SSE for true realtime progress instead of the decoupled loading animation.
- Per-author drilldown view (radar chart of their median scores, PR count, trend over the last N PRs).
- PNG / SVG badge export so candidates can drop them into their own READMEs.
- Add Anthropic Claude as an alternative provider behind a feature flag — the brief is from a Claude shop.
- Rate-limit `/api/analyze` per IP (Vercel KV token bucket) to defend against cost-runaway from the public endpoint.

## Links

- Live demo: _added before submission_
- Screen recording (30+ min, voice + webcam PiP): _added before submission_
- Repo: _this one_
