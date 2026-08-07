export default function PageLoader() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5">
      <svg width="64" height="64" viewBox="0 0 64 64" className="animate-spin-slow">
        <circle cx="14" cy="50" r="6" fill="#F6FAFD" stroke="#4A90D9" strokeWidth="2" />
        <circle cx="50" cy="14" r="6" fill="#111111" />
        <line x1="19" y1="45" x2="45" y2="19" stroke="#B9D3EC" strokeWidth="2" />
      </svg>
      <div className="font-mono text-xs uppercase tracking-widest text-gray-400">Loading</div>
    </div>
  );
}
