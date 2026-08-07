import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[640px] overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          src="/hero.png"
          alt="Purity Peptides research vial with laboratory glassware"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-bg via-sky-bg/75 to-sky-bg/10" />
      </div>

      {/* Decorative animated chains, layered subtly over the photo */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply" aria-hidden="true">
        <svg viewBox="0 0 900 640" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          {/* Chain 1 */}
          <g className="animate-sway-a" style={{ transformOrigin: "560px 160px" }}>
            <g stroke="#7FAEDD" strokeWidth="1.8" fill="none">
              <path d="M420,420 L500,340" />
              <path d="M500,340 L480,230" />
              <path d="M480,230 L560,160" />
              <path d="M560,160 L640,220" />
              <path d="M640,220 L700,160" />
              <path d="M560,160 L590,280" />
              <path d="M590,280 L680,340" />
            </g>
            <g className="chain-node float-a"><circle cx="420" cy="420" r="16" fill="#EAF3FC" stroke="#4A90D9" strokeWidth="2.5" /></g>
            <g className="chain-node float-b"><circle cx="500" cy="340" r="11" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" /></g>
            <g className="chain-node float-c"><circle cx="480" cy="230" r="14" fill="#EAF3FC" stroke="#4A90D9" strokeWidth="2.5" /></g>
            <g className="chain-node float-a"><circle cx="560" cy="160" r="19" fill="#111111" /></g>
            <g className="chain-node float-b"><circle cx="640" cy="220" r="12" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="2.5" /></g>
            <g className="chain-node float-c"><circle cx="700" cy="160" r="10" fill="#EAF3FC" stroke="#111111" strokeWidth="2.5" /></g>
            <g className="chain-node float-b"><circle cx="590" cy="280" r="13" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="2.5" /></g>
            <g className="chain-node float-a"><circle cx="680" cy="340" r="15" fill="#EAF3FC" stroke="#111111" strokeWidth="2.5" /></g>
          </g>

          {/* Chain 2, offset lower-left, swaying independently */}
          <g className="animate-sway-b" style={{ transformOrigin: "230px 400px" }}>
            <g transform="translate(30, 220) scale(0.7)">
              <g stroke="#7FAEDD" strokeWidth="1.8" fill="none">
                <path d="M60,340 L140,260" />
                <path d="M140,260 L120,150" />
                <path d="M120,150 L220,110" />
                <path d="M220,110 L300,170" />
                <path d="M300,170 L360,110" />
                <path d="M220,110 L250,220" />
                <path d="M250,220 L340,270" />
              </g>
              <g className="chain-node float-c"><circle cx="60" cy="340" r="16" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" /></g>
              <g className="chain-node float-a"><circle cx="140" cy="260" r="11" fill="#EAF3FC" stroke="#4A90D9" strokeWidth="2.5" /></g>
              <g className="chain-node float-b"><circle cx="120" cy="150" r="14" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="2.5" /></g>
              <g className="chain-node float-c"><circle cx="220" cy="110" r="19" fill="#4A90D9" /></g>
              <g className="chain-node float-a"><circle cx="300" cy="170" r="12" fill="#EAF3FC" stroke="#111111" strokeWidth="2.5" /></g>
              <g className="chain-node float-b"><circle cx="360" cy="110" r="10" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="2.5" /></g>
              <g className="chain-node float-a"><circle cx="250" cy="220" r="13" fill="#EAF3FC" stroke="#111111" strokeWidth="2.5" /></g>
              <g className="chain-node float-c"><circle cx="340" cy="270" r="15" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="2.5" /></g>
            </g>
          </g>
        </svg>
      </div>

      {/* Text content */}
      <div className="relative mx-auto flex min-h-[640px] max-w-6xl items-center px-6">
        <div className="max-w-lg">
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sky">
            <span className="h-1.5 w-1.5 rounded-full bg-sky" />
            Research &amp; wellness peptides
          </div>
          <h1 className="mb-6 font-display text-5xl font-medium leading-[1.08] text-ink md:text-6xl">
            Peptides you can <span className="italic text-sky">verify</span>, not just trust.
          </h1>
          <p className="mb-8 max-w-md text-lg text-gray-600">
            Every batch we list ships with a certificate of analysis, cold-chain handling, and documentation you can
            check before it reaches your door.
          </p>
          <div className="mb-10 flex flex-wrap gap-4">
            <Link href="/shop" className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:bg-sky">
              Shop the catalog
            </Link>
            <Link
              href="/learn"
              className="rounded-full border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold text-ink hover:border-sky hover:text-sky"
            >
              How we verify quality
            </Link>
          </div>
          <div className="flex gap-8 text-xs text-gray-500">
            <div><div className="font-heading text-xl text-ink">500+</div>Batches verified</div>
            <div><div className="font-heading text-xl text-ink">12</div>Countries served</div>
            <div><div className="font-heading text-xl text-ink">24hr</div>Order dispatch</div>
          </div>
        </div>
      </div>
    </section>
  );
}