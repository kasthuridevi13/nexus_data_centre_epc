import { useEffect, useState } from "react";
import { DashboardAPI } from "../services/api.js";
import TitleBlock from "../components/TitleBlock.jsx";
import { StatCard, Loader, Panel } from "../components/ui.jsx";
import { AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    DashboardAPI.summary().then(setSummary).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <TitleBlock
        sheet="DWG-00"
        title="Command Deck"
        subtitle="Unified view across every agent, drawn from one shared project intelligence layer"
        meta={{ label: "Status", value: "LIVE" }}
      />

      {error && <p className="text-signal-rose text-sm mb-4">Could not reach backend: {error}. Is it running on :5000?</p>}
      {!summary && !error && <Loader label="Pulling live project signals" />}

      {summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard label="Documents Indexed" value={summary.documentsCount} accent="cyan" />
            <StatCard label="Open Deviations" value={summary.deviationsOpen} accent="rose" />
            <StatCard label="High/Critical Risk Activities" value={summary.criticalRisks} accent="amber" />
            <StatCard label="Supply Items At Risk" value={summary.supplyChainAtRisk} accent="amber" />
            <StatCard label="Manual Hours Saved" value={summary.coordinationHoursSaved} accent="green" suffix="hrs" />
            <StatCard label="Prediction Lead Time" value={summary.avgLeadTimePrediction} accent="amber" suffix="days" />
            <StatCard label="Open RFIs" value={summary.openRFIs} accent="cyan" />
          </div>

          <Panel className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-signal-amber" />
              <h2 className="font-display text-sm uppercase tracking-widest text-ink-primary">Recent Agent Activity</h2>
            </div>
            {summary.recentAudit.length === 0 ? (
              <p className="text-ink-muted text-sm">No agent actions logged yet. Run the seed script, then trigger a compliance check.</p>
            ) : (
              <div className="space-y-3">
                {summary.recentAudit.map((log) => (
                  <div key={log._id} className="flex items-start gap-3 border-b border-blueprint-line pb-3 last:border-0">
                    <span className="text-[10px] font-mono text-signal-cyan uppercase tracking-wider mt-0.5 w-40 shrink-0">
                      {log.agent.replace(/_/g, " ")}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-ink-primary">{log.action.replace(/_/g, " ")}</p>
                      {log.reasoning && <p className="text-xs text-ink-muted mt-0.5">{log.reasoning}</p>}
                    </div>
                    <span className="text-[10px] font-mono text-ink-faint shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
