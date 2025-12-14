export function BackgroundSurface() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Base */}
      <div className="absolute inset-0 bg-surface-950" />

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_30%,rgba(70,130,255,0.10),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_90%_35%,rgba(165,90,255,0.10),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_700px_at_50%_110%,rgba(0,0,0,0.70),transparent_55%)]" />

      {/* Blurry shapes */}
      <div className="absolute -left-24 top-28 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute left-1/2 top-36 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute -right-28 top-20 h-[540px] w-[540px] rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.07] mix-blend-soft-light [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.4%22/%3E%3C/svg%3E')]" />
    </div>
  );
}
