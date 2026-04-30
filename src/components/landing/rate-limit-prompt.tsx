"use client";

import { useState, type FormEvent } from "react";
import { GithubIcon } from "@/components/icons";

type RateLimitPromptProps = {
  onSubmit: (token: string) => void;
  onCancel: () => void;
};

export function RateLimitPrompt({ onSubmit, onCancel }: RateLimitPromptProps) {
  const [token, setToken] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = token.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <form onSubmit={submit} style={{ marginTop: 24 }}>
      <label
        htmlFor="github-token"
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--ink-700)",
          marginBottom: 8,
        }}
      >
        GitHub token
      </label>
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 6,
          background: "white",
          borderRadius: 999,
          border: "1.5px solid var(--ink-200)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            color: "var(--ink-400)",
          }}
        >
          <GithubIcon size={18} />
        </div>
        <input
          id="github-token"
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="github_pat_..."
          autoComplete="off"
          style={{
            border: 0,
            outline: "none",
            height: 42,
            padding: "0 8px",
            flex: 1,
            fontSize: 14,
            minWidth: 0,
          }}
        />
        <button type="submit" className="btn btn-accent" style={{ height: 42, fontSize: 14 }}>
          Retry
        </button>
      </div>
      <p className="muted" style={{ marginTop: 10, fontSize: 12, lineHeight: 1.5 }}>
        Used once for this analysis session. It is never stored on the server or returned in a
        response.
      </p>
      <button
        type="button"
        onClick={onCancel}
        style={{
          marginTop: 12,
          background: "transparent",
          border: 0,
          color: "var(--ink-500)",
          fontSize: 13,
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Back to landing
      </button>
    </form>
  );
}
