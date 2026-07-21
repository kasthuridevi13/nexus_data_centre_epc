import { useEffect, useState } from "react";
import { SupplyChainAPI } from "../services/api.js";
import TitleBlock from "../components/TitleBlock.jsx";
import { Loader, EmptyState, Panel } from "../components/ui.jsx";
import { RefreshCw } from "lucide-react";

const STATUS_COLOR = {
  manufacturing: "bg-ink-faint",
  in_transit: "bg-signal-cyan",
  customs: "bg-signal-amber",
  delayed: "bg-signal-rose",
  delivered: "bg-signal-green",
};

export default function SupplyChain() {
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => { SupplyChainAPI.list().then(setItems); };
  useEffect(load, []);

  const recompute = async () => {
    setBusy(true);
    try {
      setItems(await SupplyChainAPI.recompute());
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <TitleBlock
        sheet="DWG-03"
        title="Supply Chain Visibility & Risk Agent"
        subtitle="Tracks critical equipment shipments across multi-tier suppliers and flags at-risk deliveries"
        meta={{ label: "Tracked Items", value: items?.length ?? "—" }}
      />

      <div className="mb-6">
        <button
          onClick={recompute}
          disabled={busy}
          className="flex items-center gap-2 bg-signal-cyan/10 border border-signal-cyan text-signal-cyan px-4 py-2 rounded text-sm font-mono hover:bg-signal-cyan/20 disabled:opacity-40 transition-colors"
        >
          <RefreshCw size={16} className={busy ? "animate-spin" : ""} />
          {busy ? "Recomputing..." : "Recompute Delivery Risk"}
        </button>
      </div>

      {!items && <Loader label="Loading supply chain data" />}
      {items && items.length === 0 && <EmptyState message="No equipment tracked yet. Run the backend seed script." />}

      <div className="grid md:grid-cols-2 gap-4">
        {items?.map((it) => (
          <Panel key={it._id} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-ink-primary font-medium">{it.equipment}</p>
              <span className="font-display text-xl text-ink-primary">{it.riskScore}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[it.currentStatus]}`} />
              <span className="text-xs font-mono uppercase text-ink-muted">{it.currentStatus.replace("_", " ")}</span>
              <span className="text-xs text-ink-faint">· {it.vendor}</span>
            </div>
            <p className="text-xs text-ink-muted font-mono mb-2">
              {it.origin?.name} → {it.destination?.name}
            </p>
            <p className="text-xs text-ink-muted mb-2">
              Expected: {it.expectedDelivery ? new Date(it.expectedDelivery).toLocaleDateString() : "—"}
            </p>
            {it.riskFactors?.length > 0 && (
              <ul className="text-[11px] text-signal-amber list-disc list-inside space-y-0.5">
                {it.riskFactors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
            {it.alternateSuppliers?.length > 0 && (
              <p className="text-[11px] text-ink-faint mt-2 font-mono">
                Alternates: {it.alternateSuppliers.join(", ")}
              </p>
            )}
          </Panel>
        ))}
      </div>
    </div>
  );
}
