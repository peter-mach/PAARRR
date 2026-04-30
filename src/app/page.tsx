"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FinalCTA,
  Footer,
  Hero,
  HowItWorks,
  Nav,
  Preview,
  Scoring,
  SocialProof,
} from "@/components/landing";
import { Dashboard, LoadingState } from "@/components/dashboard";

type Route = "landing" | "loading" | "dashboard";

const DEFAULT_URL = "github.com/vercel/next.js";

export default function Home() {
  const [route, setRoute] = useState<Route>("landing");
  const [url, setUrl] = useState(DEFAULT_URL);

  const handleAnalyze = useCallback((u: string) => {
    setUrl(u || DEFAULT_URL);
    setRoute("loading");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0 });
    }
  }, []);

  const handleBack = useCallback(() => {
    setRoute("landing");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0 });
    }
  }, []);

  const handleLoadingDone = useCallback(() => {
    setRoute("dashboard");
  }, []);

  useEffect(() => {
    if (route !== "landing") return;
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("in");
        }
      },
      { threshold: 0.15 },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [route]);

  if (route === "loading") {
    return <LoadingState url={url} onDone={handleLoadingDone} />;
  }
  if (route === "dashboard") {
    return <Dashboard url={url} onBack={handleBack} />;
  }
  return (
    <>
      <Nav onAnalyze={() => handleAnalyze("")} />
      <Hero onSubmit={handleAnalyze} />
      <SocialProof />
      <HowItWorks />
      <Scoring />
      <Preview onAnalyze={() => handleAnalyze("")} />
      <FinalCTA onAnalyze={() => handleAnalyze("")} />
      <Footer />
    </>
  );
}
