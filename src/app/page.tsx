export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Scaffold ready
      </span>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">PAARRR</h1>
      <p className="text-balance text-base text-muted-foreground sm:text-lg">
        Pull-request Automated Analysis, Reporting, & Review Rig. The landing page, scoring backend,
        and dashboard ship in the next PRs.
      </p>
    </main>
  );
}
