import { useEffect, useState } from "react";
import { ComplianceAPI, DocumentAPI } from "../services/api.js";
import TitleBlock from "../components/TitleBlock.jsx";
import { RiskBadge, Loader, EmptyState, Panel } from "../components/ui.jsx";
import { PlayCircle, UploadCloud } from "lucide-react";

export default function ComplianceAgent() {
  const [checks, setChecks] = useState(null);
  const [submittals, setSubmittals] = useState([]);
  const [selected, setSelected] = useState("");
  const [running, setRunning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const load = () => {
    ComplianceAPI.list().then(setChecks).catch((e) => setError(e.message));
    DocumentAPI.list({ type: "submittal" }).then(setSubmittals).catch(() => {});
  };

  useEffect(load, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "submittal");
      formData.append("title", file.name);
      formData.append("vendor", "Uploaded Vendor");
      const res = await DocumentAPI.upload(formData);
      await load();
      setSelected(res.document._id);
    } catch (err) {
      setError("Failed to upload document: " + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const runCheck = async () => {
    if (!selected) return;
    setRunning(true);
    setError(null);
    try {
      await ComplianceAPI.run({ submittalDocumentId: selected });
      load();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <TitleBlock
        sheet="DWG-01"
        title="Specification & Quality Compliance Agent"
        subtitle="Checks vendor submittals against retrieved spec clauses from the shared RAG index — flags deviations, auto-drafts RFIs"
        meta={{ label: "Findings", value: checks?.length ?? "—" }}
      />

      <Panel className="p-5 mb-6 flex flex-wrap items-center gap-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="bg-blueprint-panel2 border border-blueprint-line text-sm text-ink-primary px-3 py-2 rounded font-mono flex-1 min-w-[260px]"
        >
          <option value="">Select a submittal to evaluate...</option>
          {submittals.map((s) => (
            <option key={s._id} value={s._id}>
              {s.title} {s.vendor ? `(${s.vendor})` : ""}
            </option>
          ))}
        </select>
        <div className="relative">
          <input 
            type="file" 
            id="submittalUpload" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            disabled={uploading}
            accept=".txt,.pdf"
          />
          <button
            disabled={uploading}
            className="flex items-center gap-2 bg-blueprint-panel2 border border-blueprint-line text-ink-primary px-4 py-2 rounded text-sm font-mono hover:bg-blueprint-line disabled:opacity-40 transition-colors"
          >
            <UploadCloud size={16} />
            {uploading ? "Uploading..." : "Upload Submittal"}
          </button>
        </div>
        <button
          onClick={runCheck}
          disabled={!selected || running}
          className="flex items-center gap-2 bg-signal-cyan/10 border border-signal-cyan text-signal-cyan px-4 py-2 rounded text-sm font-mono hover:bg-signal-cyan/20 disabled:opacity-40 transition-colors"
        >
          <PlayCircle size={16} />
          {running ? "Running Agent..." : "Run Compliance Check"}
        </button>
        {submittals.length === 0 && (
          <span className="text-xs text-ink-muted">No submittals found — run the backend seed script first.</span>
        )}
      </Panel>

      {error && <p className="text-signal-rose text-sm mb-4">{error}</p>}
      {!checks && <Loader label="Loading compliance history" />}
      {checks && checks.length === 0 && <EmptyState message="No compliance checks run yet." />}

      <div className="space-y-4">
        {checks?.map((c) => (
          <Panel key={c._id} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-ink-primary font-medium">{c.submittalDocument?.title}</p>
                <p className="text-xs text-ink-muted font-mono">
                  vs {c.specDocument?.title || "no matching spec found"} · confidence {c.confidence}%
                </p>
              </div>
              <RiskBadge level={c.verdict} />
            </div>
            <p className="text-sm text-ink-muted mb-3">{c.summary}</p>

            {c.findings?.length > 0 && (
              <div className="space-y-2">
                {c.findings.map((f, i) => (
                  <div key={i} className="border border-blueprint-line bg-blueprint-panel2/60 rounded px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-signal-cyan uppercase">{f.clause || "Clause N/A"}</span>
                      <RiskBadge level={f.severity} />
                    </div>
                    <p className="text-xs text-ink-primary mb-1">{f.issue}</p>
                    <p className="text-[11px] text-ink-muted">
                      <span className="text-ink-faint">Spec:</span> {f.specText}
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      <span className="text-ink-faint">Submittal:</span> {f.submittalText}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {c.linkedRFI && (
              <p className="text-xs text-signal-amber mt-3 font-mono">
                → Auto-generated RFI opened for this deviation (see RFI Copilot)
              </p>
            )}
          </Panel>
        ))}
      </div>
    </div>
  );
}
