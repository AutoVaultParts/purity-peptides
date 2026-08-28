export default function SectionChainDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.35] mix-blend-screen" aria-hidden="true">
      <svg viewBox="0 0 1200 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g className="animate-sway-a" style={{ transformOrigin: "300px 150px" }}>
          <g stroke="#7FAEDD" strokeWidth="1.8" fill="none">
            <path d="M160,220 L260,160" />
            <path d="M260,160 L240,90" />
            <path d="M240,90 L340,60" />
            <path d="M340,60 L430,110" />
            <path d="M430,110 L500,60" />
            <path d="M340,60 L370,150" />
            <path d="M370,150 L470,200" />
          </g>
          <g className="chain-node float-a"><circle cx="160" cy="220" r="13" fill="#EAF3FC" stroke="#4A90D9" strokeWidth="2.2" /></g>
          <g className="chain-node float-b"><circle cx="260" cy="160" r="9" fill="#FFFFFF" stroke="#111111" strokeWidth="2.2" /></g>
          <g className="chain-node float-c"><circle cx="240" cy="90" r="11" fill="#EAF3FC" stroke="#4A90D9" strokeWidth="2.2" /></g>
          <g className="chain-node float-a"><circle cx="340" cy="60" r="15" fill="#111111" /></g>
          <g className="chain-node float-b"><circle cx="430" cy="110" r="10" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="2.2" /></g>
          <g className="chain-node float-c"><circle cx="500" cy="60" r="8" fill="#EAF3FC" stroke="#111111" strokeWidth="2.2" /></g>
          <g className="chain-node float-b"><circle cx="370" cy="150" r="10" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="2.2" /></g>
          <g className="chain-node float-a"><circle cx="470" cy="200" r="12" fill="#EAF3FC" stroke="#111111" strokeWidth="2.2" /></g>
        </g>

        <g className="animate-sway-b" style={{ transformOrigin: "800px 150px" }}>
          <g stroke="#7FAEDD" strokeWidth="1.8" fill="none">
            <path d="M700,240 L780,180" />
            <path d="M780,180 L760,110" />
            <path d="M760,110 L860,80" />
            <path d="M860,80 L940,130" />
            <path d="M940,130 L1010,80" />
            <path d="M860,80 L890,170" />
            <path d="M890,170 L990,220" />
          </g>
          <g className="chain-node float-c"><circle cx="700" cy="240" r="13" fill="#FFFFFF" stroke="#111111" strokeWidth="2.2" /></g>
          <g className="chain-node float-a"><circle cx="780" cy="180" r="9" fill="#EAF3FC" stroke="#4A90D9" strokeWidth="2.2" /></g>
          <g className="chain-node float-b"><circle cx="760" cy="110" r="11" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="2.2" /></g>
          <g className="chain-node float-c"><circle cx="860" cy="80" r="15" fill="#4A90D9" /></g>
          <g className="chain-node float-a"><circle cx="940" cy="130" r="10" fill="#EAF3FC" stroke="#111111" strokeWidth="2.2" /></g>
          <g className="chain-node float-b"><circle cx="1010" cy="80" r="8" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="2.2" /></g>
          <g className="chain-node float-a"><circle cx="890" cy="170" r="10" fill="#EAF3FC" stroke="#111111" strokeWidth="2.2" /></g>
          <g className="chain-node float-c"><circle cx="990" cy="220" r="12" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="2.2" /></g>
        </g>
      </svg>
    </div>
  );
}
