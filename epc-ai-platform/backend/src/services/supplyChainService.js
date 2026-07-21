import SupplyChainItem from "../models/SupplyChainItem.js";
import { logAgentAction } from "./auditService.js";

const STATUS_BASE_RISK = {
  manufacturing: 15,
  in_transit: 25,
  customs: 55,
  delayed: 85,
  delivered: 0,
};

/** Recomputes risk for every tracked item based on status + days-to-deadline pressure. */
export async function recomputeSupplyChainRisk() {
  const items = await SupplyChainItem.find();
  const now = Date.now();

  for (const item of items) {
    let score = STATUS_BASE_RISK[item.currentStatus] ?? 20;
    const factors = [];

    if (item.expectedDelivery) {
      const daysLeft = Math.ceil((new Date(item.expectedDelivery).getTime() - now) / (1000 * 60 * 60 * 24));
      if (daysLeft < 0 && item.currentStatus !== "delivered") {
        score = Math.min(100, score + 30);
        factors.push(`Past expected delivery date by ${Math.abs(daysLeft)} day(s)`);
      } else if (daysLeft <= 7 && item.currentStatus !== "delivered") {
        score = Math.min(100, score + 15);
        factors.push(`Only ${daysLeft} day(s) of schedule float remaining`);
      }
    }

    if (item.currentStatus === "customs") factors.push("Held in customs clearance");
    if (item.currentStatus === "delayed") factors.push("Vendor-confirmed delay");
    if (item.tier === "Tier 3") factors.push("Sub-tier supplier - limited direct visibility");

    item.riskScore = score;
    item.riskFactors = factors;
    await item.save();

    if (score >= 70) {
      await logAgentAction({
        agent: "supply_chain_agent",
        action: "high_risk_flagged",
        entityType: "SupplyChainItem",
        entityId: item._id,
        evidence: factors,
        reasoning: `${item.equipment} scored ${score}/100 based on status "${item.currentStatus}" and delivery timeline.`,
        outcome: "at_risk",
      });
    }
  }

  return SupplyChainItem.find().sort({ riskScore: -1 });
}

export async function listSupplyChainItems() {
  return SupplyChainItem.find().sort({ riskScore: -1 });
}
