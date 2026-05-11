"use client";

import { useEffect, useState } from "react";
import { CountUp } from "@/components/charts/count-up";

type TotalBadgeProps = {
  value: number;
  delay: number;
};

export function TotalBadge({ value, delay }: TotalBadgeProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const bg =
    value >= 80 ? "var(--gold-100)" : value >= 60 ? "var(--primary-100)" : "var(--ink-100)";
  const fg = value >= 80 ? "var(--gold)" : value >= 60 ? "var(--primary-700)" : "var(--ink-600)";

  return (
    <div
      className="pr-row-total"
      style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        background: bg,
        color: fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display-stack)",
        fontWeight: 800,
        fontSize: 22,
        letterSpacing: 0,
        transform: show ? "scale(1)" : "scale(0.6)",
        opacity: show ? 1 : 0,
        transition: "transform .6s cubic-bezier(.2,1.6,.4,1), opacity .6s ease",
        marginLeft: "auto",
        border: value >= 80 ? "2px dashed var(--gold)" : "none",
      }}
    >
      <CountUp value={value} duration={1000} delay={delay} />
    </div>
  );
}
