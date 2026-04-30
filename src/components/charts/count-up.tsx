"use client";

import { useEffect, useState } from "react";

type CountUpProps = {
  value: number;
  duration?: number;
  delay?: number;
  suffix?: string;
};

export function CountUp({ value, duration = 1400, delay = 0, suffix = "" }: CountUpProps) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf: number | undefined;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - p) ** 3;
        setN(value * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(t);
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, [value, duration, delay]);

  return (
    <>
      {Math.round(n)}
      {suffix}
    </>
  );
}
