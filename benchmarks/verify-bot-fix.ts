// Verify extractAISignals's authorIsKnownAIBot logic. Run via tsx so the
// TypeScript source compiles on the fly:
//   pnpm dlx tsx benchmarks/verify-bot-fix.mjs

import { extractAISignals } from "../src/lib/scoring/ai-signals.ts";

const cases = [
  // [authorLogin, expectedAuthorIsKnownAIBot, label]
  ["dependabot[bot]", false, "dependabot - non-AI dep bot"],
  ["renovate[bot]", false, "renovate - non-AI dep bot"],
  ["astrobot-houston", false, "Changesets release bot"],
  ["github-actions[bot]", false, "generic GH Actions bot"],
  ["claude", true, "Claude (bare)"],
  ["openai-codex[bot]", true, "Codex agent bot"],
  ["copilot-swe-agent[bot]", true, "Copilot SWE agent"],
  ["Copilot", true, "Copilot author"],
  ["devin-ai-integration[bot]", true, "Devin"],
  ["google-labs-jules[bot]", true, "Jules"],
  ["peter-mach", false, "regular human"],
];

let pass = 0;
let fail = 0;

for (const [login, expected, label] of cases) {
  const result = extractAISignals({
    title: "test",
    body: null,
    authorLogin: login,
    commitMessages: [],
  });
  const got = result.authorIsKnownAIBot;
  const ok = got === expected;
  console.log(`${ok ? "PASS" : "FAIL"}  ${login.padEnd(30)} -> ${got}  (${label})`);
  if (ok) pass += 1;
  else fail += 1;
}

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail === 0 ? 0 : 1);
