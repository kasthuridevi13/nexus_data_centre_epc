import { Link } from "react-router-dom";
import { ShieldCheck, MessageSquareText, GaugeCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-blueprint-bg">
      {/* Animated SVG Machine Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          {/* Main Gear Left */}
          <g className="origin-[10%] origin-[20%] animate-spin-slow text-signal-amber drop-shadow-[0_0_10px_rgba(255,77,0,0.8)]">
            <circle cx="10%" cy="20%" r="200" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="20 10"/>
            <circle cx="10%" cy="20%" r="150" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="10%" cy="20%" r="40" fill="none" stroke="currentColor" strokeWidth="12"/>
            <path d="M 10% 0 L 10% 40% M -10% 20% L 30% 20%" stroke="currentColor" strokeWidth="4" className="opacity-50"/>
          </g>
          {/* Main Gear Right */}
          <g className="origin-[85%] origin-[70%] animate-spin-slow-reverse text-signal-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
            <circle cx="85%" cy="70%" r="300" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="40 20"/>
            <circle cx="85%" cy="70%" r="240" fill="none" stroke="currentColor" strokeWidth="4"/>
            <circle cx="85%" cy="70%" r="80" fill="none" stroke="currentColor" strokeWidth="20"/>
            <path d="M 85% 10% L 85% 130% M 40% 70% L 130% 70%" stroke="currentColor" strokeWidth="6" className="opacity-50"/>
          </g>
          {/* Connecting Conveyor / Data Line */}
          <path d="M 10% 20% Q 50% 20% 85% 70%" fill="none" stroke="currentColor" strokeWidth="6" className="text-signal-purple animate-dash drop-shadow-[0_0_8px_rgba(138,43,226,0.8)]" strokeDasharray="15 15"/>
          <path d="M 10% 20% Q 30% 80% 85% 70%" fill="none" stroke="currentColor" strokeWidth="3" className="text-signal-rose animate-dash drop-shadow-[0_0_8px_rgba(255,0,85,0.8)]" strokeDasharray="30 10" style={{ animationDirection: "reverse", animationDuration: "5s" }}/>
        </svg>
      </div>

      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="font-display font-700 text-2xl tracking-tight text-ink-primary drop-shadow-sm">NEXUS</div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-signal-cyan px-3 py-1 rounded-full border border-signal-cyan/40 bg-signal-cyan/10">
            EPC Project Intelligence
          </div>
        </div>
        <Link 
          to="/login"
          className="group flex items-center gap-2 text-sm font-mono text-ink-primary px-6 py-2.5 rounded-full bg-blueprint-panel/60 border border-blueprint-line shadow-[0_0_15px_rgba(0,255,255,0.1)] backdrop-blur-md hover:bg-blueprint-panel2 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all"
        >
          Enter Command Deck
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 mt-12 mb-24">
        <div className="text-center max-w-4xl animate-float">
          <h1 className="font-display font-700 text-5xl md:text-7xl text-ink-primary mb-6 drop-shadow-sm leading-tight">
            The AI Nervous System for Mission-Critical EPC
          </h1>
          <p className="text-lg md:text-xl text-ink-muted font-body font-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Unify your supply chain, automatically catch specification deviations, and predict critical-path schedule delays with real-time generative intelligence.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/login"
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-signal-cyan to-signal-amber text-black font-display font-800 uppercase tracking-widest text-sm px-8 py-4 rounded-full shadow-[0_0_30px_rgba(0,255,255,0.5)] hover:shadow-[0_0_50px_rgba(255,77,0,0.7)] hover:-translate-y-1 transition-all duration-300"
            >
              Launch Platform
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>

      {/* Feature Cards Showcase */}
      <section className="px-8 pb-24 relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="group relative border border-blueprint-line bg-blueprint-panel/60 backdrop-blur-xl shadow-lg rounded-2xl p-8 hover:-translate-y-2 hover:border-signal-cyan/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-signal-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ShieldCheck size={40} strokeWidth={1.5} className="text-signal-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] mb-6" />
            <h3 className="font-display font-700 text-xl text-ink-primary mb-3">Compliance Agent</h3>
            <p className="text-sm text-ink-muted leading-relaxed relative z-10">
              Automatically compares vendor submittals against extracted specification clauses to instantly flag tier deviations and non-compliant equipment.
            </p>
          </div>

          <div className="group relative border border-blueprint-line bg-blueprint-panel/60 backdrop-blur-xl shadow-lg rounded-2xl p-8 hover:-translate-y-2 hover:border-signal-amber/50 hover:shadow-[0_0_30px_rgba(255,77,0,0.15)] transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-signal-amber/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <GaugeCircle size={40} strokeWidth={1.5} className="text-signal-amber drop-shadow-[0_0_10px_rgba(255,77,0,0.8)] mb-6" />
            <h3 className="font-display font-700 text-xl text-ink-primary mb-3">Schedule Risk Engine</h3>
            <p className="text-sm text-ink-muted leading-relaxed relative z-10">
              Aggregates live signals from procurement and field commissioning to predict critical-path delays before they impact your milestone handovers.
            </p>
          </div>

          <div className="group relative border border-blueprint-line bg-blueprint-panel/60 backdrop-blur-xl shadow-lg rounded-2xl p-8 hover:-translate-y-2 hover:border-signal-purple/50 hover:shadow-[0_0_30px_rgba(138,43,226,0.15)] transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-signal-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <MessageSquareText size={40} strokeWidth={1.5} className="text-signal-purple drop-shadow-[0_0_10px_rgba(138,43,226,0.8)] mb-6" />
            <h3 className="font-display font-700 text-xl text-ink-primary mb-3">RFI Copilot</h3>
            <p className="text-sm text-ink-muted leading-relaxed relative z-10">
              Stop answering the same questions twice. AI instantly cross-references past RFIs and specs to draft highly technical, perfectly cited responses.
            </p>
          </div>

        </div>
      </section>

      <footer className="border-t border-ink-faint/20 py-6 text-center">
        <p className="text-[10px] font-mono uppercase text-ink-faint tracking-[0.2em]">
          NEXUS © 2026 · Mission-Critical Intelligence
        </p>
      </footer>
    </div>
  );
}
