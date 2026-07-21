export function RiskBadge({ level }) {
  const map = {
    low: "text-signal-green border-signal-green/40 bg-signal-green/10 shadow-[0_0_10px_rgba(204,255,0,0.2)]",
    medium: "text-signal-amber border-signal-amber/40 bg-signal-amber/10 shadow-[0_0_10px_rgba(255,77,0,0.2)]",
    high: "text-signal-amber border-signal-amber/50 bg-signal-amber/20 shadow-[0_0_15px_rgba(255,77,0,0.4)]",
    critical: "text-white border-signal-rose bg-signal-rose/30 shadow-[0_0_20px_rgba(255,0,85,0.6)] animate-pulse",
    compliant: "text-signal-green border-signal-green/40 bg-signal-green/10 shadow-[0_0_10px_rgba(204,255,0,0.2)]",
    deviation: "text-white border-signal-rose bg-signal-rose/30 shadow-[0_0_20px_rgba(255,0,85,0.6)]",
    needs_review: "text-signal-amber border-signal-amber/40 bg-signal-amber/10 shadow-[0_0_10px_rgba(255,77,0,0.2)]",
  };
  const cls = map[level] || "text-ink-muted border-blueprint-line bg-blueprint-panel2";
  return (
    <span className={`inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-widest border rounded-full backdrop-blur-sm ${cls}`}>
      {level?.replace("_", " ")}
    </span>
  );
}

export function StatCard({ label, value, accent = "cyan", suffix }) {
  const accentMap = {
    cyan: "text-signal-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]",
    amber: "text-signal-amber drop-shadow-[0_0_10px_rgba(255,77,0,0.6)]",
    rose: "text-signal-rose drop-shadow-[0_0_10px_rgba(255,0,85,0.6)]",
    green: "text-signal-green drop-shadow-[0_0_10px_rgba(204,255,0,0.6)]",
  };
  return (
    <div className="group relative border border-blueprint-line bg-blueprint-panel shadow-sm rounded-xl px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] hover:border-signal-cyan/30 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blueprint-grid to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="text-[10px] uppercase tracking-widest text-ink-muted font-mono mb-3 relative z-10">{label}</div>
      <div className={`font-display text-4xl font-700 relative z-10 ${accentMap[accent]}`}>
        {value}
        {suffix && <span className="text-lg text-ink-muted ml-1 drop-shadow-none">{suffix}</span>}
      </div>
    </div>
  );
}

export function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-2 text-ink-muted text-sm font-mono py-8">
      <span className="w-2 h-2 rounded-full bg-signal-cyan animate-pulse" />
      {label}...
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="border border-dashed border-blueprint-line rounded px-6 py-10 text-center text-ink-muted text-sm">
      {message}
    </div>
  );
}

export function Panel({ children, className = "" }) {
  return (
    <div className={`border border-blueprint-line bg-blueprint-panel/60 backdrop-blur-xl rounded-xl shadow-lg transition-all duration-300 hover:border-signal-cyan/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] ${className}`}>
      {children}
    </div>
  );
}
