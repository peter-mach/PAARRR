export type RepoCoords = { owner: string; repo: string };

const SLUG = /^[A-Za-z0-9](?:[A-Za-z0-9._-]{0,38}[A-Za-z0-9])?$/;

export function parseRepoUrl(input: string): RepoCoords | null {
  if (!input) return null;
  const trimmed = input.trim();
  let url: URL;
  try {
    url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    const parts = trimmed.split("/").filter(Boolean);
    if (parts.length !== 2) return null;
    return validate(parts[0], parts[1]);
  }
  if (!/(^|\.)github\.com$/i.test(url.hostname)) return null;
  const [owner, repo] = url.pathname.replace(/^\//, "").split("/");
  return validate(owner, repo);
}

function validate(owner?: string, repo?: string): RepoCoords | null {
  if (!owner || !repo) return null;
  const cleanRepo = repo.replace(/\.git$/, "");
  if (!SLUG.test(owner) || !SLUG.test(cleanRepo)) return null;
  return { owner, repo: cleanRepo };
}
