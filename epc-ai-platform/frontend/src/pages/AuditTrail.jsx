import { useEffect, useState } from "react";
import { AuditAPI } from "../services/api.js";
import TitleBlock from "../components/TitleBlock.jsx";
import { Loader, EmptyState, Panel } from "../components/ui.jsx";

const AGENTS = [
  "compliance_agent",
  "schedule_risk_engine",
  "supply_chain_agent",
  "commissioning_copilot",
  "rfi_intelligence_agent",
];

export default function AuditTrail() {
  const [logs, setLogs] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    AuditAPI.list(filter ? { agent: filter } : {}).then(setLogs);
  }, [filter]);

  return (
    <div>
      <TitleBlock
        sheet="DWG-06"
        title="Audit Trail"
        subtitle="Every AI decision, with the evidence it used — the record a Tier III/IV commissioning sign-off would require"
        meta={{ label: "Entries", value: logs?.length ?? "—" }}
      />

      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("")}
          className={`text-xs font-mono px-3 py-1.5 rounded border ${
            filter === "" ? "border-signal-cyan text-signal-cyan bg-signal-cyan/10" : "border-blueprint-line text-ink-muted"
          }`}
        >
          All Agents
        </button>
        {AGENTS.map((a) => (
          <button
            key={a}
            onClick={() => setFilter(a)}
            className={`text-xs font-mono px-3 py-1.5 rounded border ${
              filter === a ? "border-signal-cyan text-signal-cyan bg-signal-cyan/10" : "border-blueprint-line text-ink-muted"
            }`}
          >
            {a.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {!logs && <Loader label="Loading audit log" />}
      {logs && logs.length === 0 && <EmptyState message="No agent actions logged yet." />}

      <Panel>
        {logs?.map((log, i) => (
          <div key={log._id} className={`px-5 py-4 ${i !== logs.length - 1 ? "border-b border-blueprint-line" : ""}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-signal-cyan uppercase tracking-wider">
                {log.agent.replace(/_/g, " ")} · {log.action.replace(/_/g, " ")}
              </span>
              <span className="text-[10px] font-mono text-ink-faint">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
            {log.reasoning && <p className="text-sm text-ink-primary mb-1">{log.reasoning}</p>}
            {log.evidence?.length > 0 && (
              <p className="text-[11px] text-ink-muted font-mono">Evidence: {log.evidence.join(" · ")}</p>
            )}
            {log.outcome && (
              <span className="inline-block mt-1 text-[10px] font-mono text-ink-faint">Outcome: {log.outcome}</span>
            )}
          </div>
        ))}
      </Panel>
    </div>
  );
}
