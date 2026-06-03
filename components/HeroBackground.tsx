// Decorative hero background: soft color-mesh + concentric "reset" rings + grain.
// Pure SVG/CSS — on-brand, fast, no stock imagery.
export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* soft color mesh (brand palette, low opacity) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(38% 55% at 12% 18%, rgba(15,118,110,0.16), transparent 70%)," +
            "radial-gradient(42% 52% at 88% 12%, rgba(180,83,9,0.14), transparent 70%)," +
            "radial-gradient(48% 58% at 72% 95%, rgba(67,56,202,0.12), transparent 72%)",
        }}
      />

      {/* concentric rings — focus / reset motif */}
      <svg
        className="absolute -right-[12%] -top-[28%] h-[150%] w-auto text-foreground"
        viewBox="0 0 600 600"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {[60, 130, 200, 270, 340].map((r, i) => (
          <circle
            key={r}
            cx="300"
            cy="300"
            r={r}
            stroke="currentColor"
            strokeWidth={1}
            style={{ opacity: 0.07 - i * 0.008 }}
          />
        ))}
        <circle cx="300" cy="300" r="6" fill="currentColor" style={{ opacity: 0.12 }} />
      </svg>

      {/* fine grain texture for depth */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-multiply dark:mix-blend-screen">
        <filter id="heroGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#heroGrain)" />
      </svg>
    </div>
  );
}
