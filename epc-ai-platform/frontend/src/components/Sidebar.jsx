import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ShieldCheck,
  GaugeCircle,
  Truck,
  ClipboardCheck,
  MessageSquareText,
  History,
  LogOut,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Command Deck", sheet: "DWG-00", icon: LayoutGrid },
  { to: "/compliance", label: "Compliance Agent", sheet: "DWG-01", icon: ShieldCheck },
  { to: "/schedule-risk", label: "Schedule Risk Engine", sheet: "DWG-02", icon: GaugeCircle },
  { to: "/supply-chain", label: "Supply Chain Visibility", sheet: "DWG-03", icon: Truck },
  { to: "/commissioning", label: "Commissioning QA", sheet: "DWG-04", icon: ClipboardCheck },
  { to: "/rfi-copilot", label: "RFI Copilot", sheet: "DWG-05", icon: MessageSquareText },
  { to: "/audit-trail", label: "Audit Trail", sheet: "DWG-06", icon: History },
];

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("nexus_token");
    localStorage.removeItem("nexus_user");
    window.location.reload();
  };

  return (
    <aside className="w-64 shrink-0 border-r border-blueprint-line bg-[#0A0A0A]/90 backdrop-blur-xl flex flex-col z-20 shadow-2xl">
      <div className="px-5 py-6 border-b border-blueprint-line flex flex-col items-center justify-center">
        <div className="font-display font-700 text-lg tracking-tight text-ink-primary">NEXUS</div>
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-signal-cyan">EPC Project Intelligence</div>
      </div>
      <nav className="flex-1 py-3">
        {NAV.map(({ to, label, sheet, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 border-l-2 text-sm transition-all duration-300 ${
                isActive
                  ? "border-signal-cyan bg-signal-cyan/5 text-white shadow-[inset_0_0_20px_rgba(0,255,255,0.05)] drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                  : "border-transparent text-ink-muted hover:text-white hover:bg-white/5 hover:translate-x-1"
              }`
            }
          >
            <Icon size={16} strokeWidth={1.75} className={({ isActive }) => isActive ? "text-signal-cyan" : ""} />
            <span className="flex-1">{label}</span>
            <span className="text-[10px] font-mono text-ink-faint">{sheet}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-6 border-t border-blueprint-line text-center flex flex-col items-center">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full text-[11px] font-mono tracking-widest text-signal-rose/80 hover:text-signal-rose hover:bg-signal-rose/10 border border-transparent hover:border-signal-rose/30 px-3 py-2 rounded transition-all mb-4"
        >
          <LogOut size={14} />
          TERMINATE SESSION
        </button>
        <div className="text-[10px] font-mono text-ink-faint leading-relaxed">
          REV C · TIER III/IV COMPLIANT
          <br />
          SINGLE PROJECT INTELLIGENCE LAYER
        </div>
      </div>
    </aside>
  );
}
