import { useEffect, useState } from "react";
import { ScheduleRiskAPI } from "../services/api.js";
import TitleBlock from "../components/TitleBlock.jsx";
import { RiskBadge, Loader, EmptyState, Panel } from "../components/ui.jsx";
import { RefreshCw, Sparkles } from "lucide-react";

export default function ScheduleRisk() {
  const [risks, setRisks] = useState(null);
  const [busy, setBusy] = useState(false);
  const [mitigatingId, setMitigatingId] = useState(null);

  const load = () => { ScheduleRiskAPI.list().then(setRisks); };
  useEffect(load, []);

  const recompute = async () => {
    setBusy(true);
    try {
      const updated = await ScheduleRiskAPI.recompute();
      setRisks(updated);
    } finally {
      setBusy(false);
    }
  };

  const getMitigations = async (id) => {
    setMitigatingId(id);
    try {
      await ScheduleRiskAPI.mitigations(id);
      load();
    } finally {
      setMitigatingId(null);
    }
  };

  return (
    <div>
      <TitleBlock
        sheet="DWG-02"
        title="Predictive Schedule Risk Engine"
        subtitle="Aggregates live signals from Compliance and Supply Chain agents into per-activity risk scores"
        meta={{ label: "Tracked", value: risks?.length ?? "—" }}
      />

      <div className="mb-6">
        <button
          onClick={recompute}
          disabled={busy}
          className="flex items-center gap-2 bg-signal-cyan/10 border border-signal-cyan text-signal-cyan px-4 py-2 rounded text-sm font-mono hover:bg-signal-cyan/20 disabled:opacity-40 transition-colors"
        >
          <RefreshCw size={16} className={busy ? "animate-spin" : ""} />
          {busy ? "Recomputing..." : "Recompute Risk From Live Signals"}
        </button>
      </div>

      {!risks && <Loader label="Loading schedule risk" />}
      {risks && risks.length === 0 && <EmptyState message="No activities tracked yet. Run the backend seed script." />}

      <div className="space-y-4">
        {risks?.map((r) => (
          <Panel key={r._id} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-ink-primary font-medium">
                  {r.activity} {r.isCriticalPath && <span className="text-signal-rose text-[10px] font-mono ml-2">CRITICAL PATH</span>}
                </p>
                <p className="text-xs text-ink-muted font-mono">{r.system} · forecast delay {r.delayDays}d</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl text-ink-primary">{r.riskScore}</span>
                <RiskBadge level={r.riskLevel} />
              </div>
            </div>

            {r.drivers?.length > 0 && (
              <ul className="text-xs text-ink-muted list-disc list-inside mb-3 space-y-0.5">
                {r.drivers.map((d, i) => (
                  <li key={i}>
                    {d.factor} <span className="text-signal-amber">(+{d.impactDays}d)</span>
                  </li>
                ))}
              </ul>
            )}

            {r.mitigations?.length > 0 ? (
              <div className="border-t border-blueprint-line pt-3 mt-2">
                <p className="text-[10px] uppercase tracking-widest text-ink-faint font-mono mb-1">Suggested Mitigations</p>
                <ul className="text-xs text-signal-cyan list-disc list-inside space-y-0.5">
                  {r.mitigations.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            ) : (
              (r.riskLevel === "high" || r.riskLevel === "critical") && (
                <button
                  onClick={() => getMitigations(r._id)}
                  disabled={mitigatingId === r._id}
                  className="flex items-center gap-1.5 text-xs text-signal-amber font-mono hover:underline disabled:opacity-40"
                >
                  <Sparkles size={13} />
                  {mitigatingId === r._id ? "Thinking..." : "Get AI mitigation suggestions"}
                </button>
              )
            )}
          </Panel>
        ))}
      </div>
    </div>
  );
}
