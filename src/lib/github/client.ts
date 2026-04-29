import { Octokit } from "@octokit/rest";

let cached: Octokit | undefined;

export function getOctokit(): Octokit {
  if (cached) return cached;
  const auth = process.env.GITHUB_TOKEN;
  cached = new Octokit({
    auth,
    userAgent: "paarrr/0.1.0",
  });
  return cached;
}
