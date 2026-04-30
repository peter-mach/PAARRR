"use client";

import type { CSSProperties } from "react";
import { SearchIcon, SortIcon } from "@/components/icons";
import type { Filters, SortKey } from "@/lib/mock-data";

type ToolbarProps = {
  filters: Filters;
  setFilters: (f: Filters) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  authors: string[];
};

const selectStyle: CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 999,
  border: "1.5px solid var(--ink-200)",
  background: "white",
  fontSize: 14,
  fontFamily: "inherit",
  color: "var(--ink-800)",
  cursor: "pointer",
};

export function Toolbar({ filters, setFilters, sort, setSort, authors }: ToolbarProps) {
  return (
    <div
      className="pr-toolbar"
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: "white",
          padding: "6px 6px 6px 14px",
          borderRadius: 999,
          border: "1.5px solid var(--ink-200)",
        }}
      >
        <SearchIcon size={16} />
        <input
          placeholder="Search PRs..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          style={{
            border: 0,
            outline: "none",
            fontSize: 14,
            padding: "8px 4px",
            background: "transparent",
            minWidth: 200,
          }}
        />
      </div>
      <select
        value={filters.author}
        onChange={(e) => setFilters({ ...filters, author: e.target.value })}
        style={selectStyle}
      >
        <option value="">All authors</option>
        {authors.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          fontSize: 13,
          color: "var(--ink-500)",
        }}
      >
        <SortIcon size={14} /> Sort
      </div>
      <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} style={selectStyle}>
        <option value="total-desc">Total ↓</option>
        <option value="total-asc">Total ↑</option>
        <option value="impact-desc">Impact ↓</option>
        <option value="ai-desc">AI-Leverage ↓</option>
        <option value="quality-desc">Quality ↓</option>
        <option value="size-desc">Size ↓</option>
      </select>
    </div>
  );
}
