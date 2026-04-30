import { z } from "zod";

export const AISignalsSchema = z.object({
  coAuthoredByAI: z.boolean(),
  detectedAgents: z.array(z.string()),
  aiTagInTitle: z.boolean(),
  aiTaggedCommitCount: z.number().int().min(0),
  aiTrailerCommitRatio: z.number().min(0).max(1),
  authorIsKnownAIBot: z.boolean(),
  bodyHasAIAttribution: z.boolean(),
  commitCount: z.number().int().min(0),
});

export type AISignals = z.infer<typeof AISignalsSchema>;

type AgentPattern = { name: string; regex: RegExp };

// Agent-agnostic detection. Adding a new coding agent = appending one entry.
const AGENT_PATTERNS: AgentPattern[] = [
  { name: "Claude", regex: /\bclaude(?:[-\s]?code)?\b|@anthropic\.com/i },
  { name: "Codex", regex: /\b(?:openai-)?codex\b|codex.*@openai\.com/i },
  { name: "Copilot", regex: /\b(?:github[-\s])?copilot(?:[-\s]?(?:swe[-\s]?agent|workspace))?\b/i },
  { name: "Cursor", regex: /\bcursor(?:[-\s]?agent|\[bot\])?\b/i },
  { name: "Devin", regex: /\bdevin(?:[-\s]?ai)?\b/i },
  { name: "Jules", regex: /\b(?:google[-\s]?labs[-\s]?)?jules\b/i },
  { name: "Aider", regex: /\baider\b/i },
  { name: "Sweep", regex: /\bsweep(?:[-\s]?ai)?\b/i },
];

const TAG_TO_AGENT: Record<string, string> = {
  ai: "AI",
  cc: "Claude",
  claude: "Claude",
  codex: "Codex",
  copilot: "Copilot",
  cursor: "Cursor",
  devin: "Devin",
};

const AI_TAG_REGEX = /\[(ai|cc|claude|codex|copilot|cursor|devin|ai-generated)\]/i;
const COAUTHOR_TRAILER_REGEX = /^co-authored-by:\s*.+$/gim;
const ATTRIBUTION_PHRASE_REGEX =
  /generated with \[?(claude(?:\s*code)?|codex|copilot|cursor|devin)/i;

export type SignalInput = {
  title: string;
  body: string | null;
  authorLogin: string;
  commitMessages: string[];
};

export function extractAISignals(input: SignalInput): AISignals {
  const detected = new Set<string>();

  const titleTagMatch = input.title.match(AI_TAG_REGEX);
  const aiTagInTitle = Boolean(titleTagMatch);
  if (titleTagMatch) {
    const mapped = TAG_TO_AGENT[titleTagMatch[1]!.toLowerCase()];
    if (mapped) detected.add(mapped);
  }

  // Match the login against AI-agent names only. A bare "[bot]" suffix isn't
  // enough — dependabot[bot] / renovate[bot] / changesets release bots all
  // hit that suffix and would otherwise inflate AI-Leverage on dep-bump
  // and release-cut PRs.
  const authorIsKnownAIBot = addAgentsFromText(input.authorLogin, detected);

  const bodyText = input.body ?? "";
  const bodyHasAIAttribution =
    ATTRIBUTION_PHRASE_REGEX.test(bodyText) || addAgentsFromText(bodyText, detected);

  let aiTaggedCommitCount = 0;
  let trailerCommitCount = 0;

  for (const message of input.commitMessages) {
    if (AI_TAG_REGEX.test(message)) aiTaggedCommitCount += 1;

    const trailers = message.match(COAUTHOR_TRAILER_REGEX);
    if (trailers && trailers.some((line) => addAgentsFromText(line, detected))) {
      trailerCommitCount += 1;
    }

    if (ATTRIBUTION_PHRASE_REGEX.test(message)) addAgentsFromText(message, detected);
  }

  const commitCount = input.commitMessages.length;
  const aiTrailerCommitRatio = commitCount > 0 ? trailerCommitCount / commitCount : 0;

  return {
    coAuthoredByAI: trailerCommitCount > 0,
    detectedAgents: Array.from(detected),
    aiTagInTitle,
    aiTaggedCommitCount,
    aiTrailerCommitRatio,
    authorIsKnownAIBot,
    bodyHasAIAttribution,
    commitCount,
  };
}

function addAgentsFromText(text: string, sink: Set<string>): boolean {
  let any = false;
  for (const { name, regex } of AGENT_PATTERNS) {
    if (regex.test(text)) {
      sink.add(name);
      any = true;
    }
  }
  return any;
}
