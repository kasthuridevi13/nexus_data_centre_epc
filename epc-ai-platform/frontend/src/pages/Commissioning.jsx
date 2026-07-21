import { useEffect, useState } from "react";
import { CommissioningAPI } from "../services/api.js";
import TitleBlock from "../components/TitleBlock.jsx";
import { RiskBadge, Loader, EmptyState, Panel } from "../components/ui.jsx";

const STATUS_OPTIONS = ["pending", "in_progress", "passed", "failed"];

export default function Commissioning() {
  const [checklists, setChecklists] = useState(null);
  const [savingKey, setSavingKey] = useState(null);

  const load = () => { CommissioningAPI.list().then(setChecklists); };
  useEffect(load, []);

  const updateStatus = async (checklistId, testId, status) => {
    setSavingKey(testId);
    const result = status === "failed" ? window.prompt("Test result / notes:") || "Failed acceptance criteria" : "Passed";
    try {
      await CommissioningAPI.updateItem(checklistId, testId, { status, result });
      load();
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div>
      <TitleBlock
        sheet="DWG-04"
        title="Commissioning Quality Assurance Copilot"
        subtitle="Guides Level 1–5 integrated systems testing against TIA-942 / Uptime Institute Tier acceptance criteria"
        meta={{ label: "Checklists", value: checklists?.length ?? "—" }}
      />

      {!checklists && <Loader label="Loading commissioning checklists" />}
      {checklists && checklists.length === 0 && <EmptyState message="No checklists yet. Run the backend seed script." />}

      <div className="space-y-6">
        {checklists?.map((cl) => (
          <Panel key={cl._id} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-ink-primary font-medium">{cl.system}</p>
                <p className="text-xs text-ink-muted font-mono">{cl.phase} · Target {cl.targetTier}</p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl text-signal-cyan">{cl.completionPct}%</span>
                {cl.asCommissionedPackageReady && (
                  <p className="text-[10px] font-mono text-signal-green">AS-BUILT PACKAGE READY</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {cl.items.map((item) => (
                <div key={item.testId} className="border border-blueprint-line bg-blueprint-panel2/60 rounded px-3 py-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <span className="text-[10px] font-mono text-signal-cyan">{item.testId}</span>
                      <p className="text-xs text-ink-primary">{item.description}</p>
                      <p className="text-[10px] text-ink-faint font-mono">{item.standard}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiskBadge level={item.status} />
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(cl._id, item.testId, e.target.value)}
                        disabled={savingKey === item.testId}
                        className="bg-blueprint-panel border border-blueprint-line text-xs text-ink-primary px-2 py-1 rounded font-mono"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {item.flaggedIssue && (
                    <p className="text-[11px] text-signal-rose mt-2 border-t border-blueprint-line pt-2">
                      ⚠ {item.flaggedIssue}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
