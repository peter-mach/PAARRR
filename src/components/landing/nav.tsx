"use client";

import { useState, type CSSProperties } from "react";
import { Logo } from "@/components/logo";
import { ArrowIcon } from "@/components/icons";

type NavProps = {
  onAnalyze: () => void;
};

const navLink: CSSProperties = {
  fontSize: 16,
  fontWeight: 500,
  color: "var(--ink-900)",
  letterSpacing: 0,
  // Lighthouse target-size requires 24x24 minimum for tap targets — pad
  // the link's hit area without changing visual height.
  padding: "8px 0",
  display: "inline-block",
};

const handleHomeClick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export function Nav({ onAnalyze }: NavProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(243, 249, 251, 0.92)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 100,
        }}
      >
        <button
          type="button"
          onClick={handleHomeClick}
          aria-label="PAARRR — back to top"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <Logo />
        </button>
        <div className="nav-desktop" style={{ gap: 34, alignItems: "center" }}>
          <a href="#scoring" style={navLink}>
            Resources
          </a>
          <a href="#scoring" style={navLink}>
            Popular Repos
          </a>
          <a href="#how" style={navLink}>
            How it Works
          </a>
          <a href="#preview" style={navLink}>
            About
          </a>
          <button
            type="button"
            className="btn btn-primary"
            style={{ height: 42, padding: "0 22px", fontSize: 14 }}
            onClick={onAnalyze}
          >
            Analyze a repo <ArrowIcon size={16} />
          </button>
        </div>
        <button
          type="button"
          className="nav-mobile"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            background: open ? "var(--primary-100)" : "transparent",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden
          >
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M6 18L18 6" />
              </>
            ) : (
              <>
                <path d="M3 7h18" />
                <path d="M3 12h18" />
                <path d="M3 17h18" />
              </>
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div
          className="nav-mobile"
          style={{
            flexDirection: "column",
            padding: "8px 18px 18px",
            borderTop: "1px solid var(--ink-100)",
            gap: 4,
            background: "var(--paper)",
          }}
        >
          <a
            href="#how"
            onClick={() => setOpen(false)}
            style={{ ...navLink, padding: "14px 4px", fontSize: 16 }}
          >
            How it Works
          </a>
          <a
            href="#scoring"
            onClick={() => setOpen(false)}
            style={{ ...navLink, padding: "14px 4px", fontSize: 16 }}
          >
            Popular Repos
          </a>
          <a
            href="#preview"
            onClick={() => setOpen(false)}
            style={{ ...navLink, padding: "14px 4px", fontSize: 16 }}
          >
            About
          </a>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: 10, width: "100%" }}
            onClick={() => {
              setOpen(false);
              onAnalyze();
            }}
          >
            Analyze a repo <ArrowIcon size={16} />
          </button>
        </div>
      )}
    </nav>
  );
}
