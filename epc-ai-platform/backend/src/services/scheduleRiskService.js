import ScheduleRisk from "../models/ScheduleRisk.js";
import ComplianceCheck from "../models/ComplianceCheck.js";
import SupplyChainItem from "../models/SupplyChainItem.js";
import { askLLM } from "./aiClient.js";
import { logAgentAction } from "./auditService.js";

/**
 * Recomputes risk scores for all tracked activities by pulling live signals from
 * the Compliance Agent (deviations = rework risk) and Supply Chain Agent (delayed
 * equipment = install risk) - this is the "multi-agent system" the brief asks for,
 * implemented as cross-agent signal aggregation rather than isolated dashboards.
 */
export async function recomputeScheduleRisk() {
  const activities = await ScheduleRisk.find();
  const openDeviations = await ComplianceCheck.find({ verdict: "deviation" });
  const delayedEquipment = await SupplyChainItem.find({
    currentStatus: { $in: ["delayed", "customs"] },
  });

  for (const activity of activities) {
    const drivers = [];

    const relatedDeviation = openDeviations.find(
      (c) => c.system && activity.system && c.system.toLowerCase() === activity.system.toLowerCase()
    );
    if (relatedDeviation) {
      drivers.push({
        factor: `Unresolved compliance deviation: ${relatedDeviation.summary?.slice(0, 80) || "spec mismatch"}`,
        impactDays: 5,
        sourceType: "compliance",
        sourceRef: relatedDeviation._id,
      });
    }

    const relatedDelay = delayedEquipment.find(
      (e) => e.category && activity.activity.toLowerCase().includes(e.category.toLowerCase())
    );
    if (relatedDelay) {
      drivers.push({
        factor: `${relatedDelay.equipment} delayed (${relatedDelay.currentStatus})`,
        impactDays: 7,
        sourceType: "procurement",
        sourceRef: relatedDelay._id,
      });
    }

    const totalImpact = drivers.reduce((s, d) => s + d.impactDays, 0);
    const riskScore = Math.min(100, totalImpact * 8 + (activity.isCriticalPath ? 20 : 0));
    const riskLevel = riskScore >= 70 ? "critical" : riskScore >= 45 ? "high" : riskScore >= 20 ? "medium" : "low";

    activity.drivers = drivers;
    activity.riskScore = riskScore;
    activity.riskLevel = riskLevel;
    activity.delayDays = totalImpact;
    await activity.save();

    if (riskLevel === "high" || riskLevel === "critical") {
      await logAgentAction({
        agent: "schedule_risk_engine",
        action: "risk_recalculated",
        entityType: "ScheduleRisk",
        entityId: activity._id,
        evidence: drivers.map((d) => d.factor),
        reasoning: `Aggregated ${drivers.length} cross-agent signals into a ${riskScore}/100 score.`,
        outcome: riskLevel,
      });
    }
  }

  return ScheduleRisk.find().sort({ riskScore: -1 });
}

export async function getMitigationSuggestions(scheduleRiskId) {
  const activity = await ScheduleRisk.findById(scheduleRiskId);
  if (!activity) throw new Error("Activity not found");

  const prompt = `Activity: ${activity.activity} (system: ${activity.system})
Risk score: ${activity.riskScore}/100 (${activity.riskLevel})
Delay drivers: ${activity.drivers.map((d) => `${d.factor} (+${d.impactDays}d)`).join("; ") || "none"}
Critical path: ${activity.isCriticalPath}

Suggest 3 concise, concrete mitigation options a project manager could action this week.
Return a plain JSON array of 3 short strings, nothing else.`;

  const raw = await askLLM({
    system: "You are a data centre construction scheduling expert. Be concrete and specific.",
    prompt,
    maxTokens: 400,
  });

  let mitigations;
  try {
    mitigations = JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    mitigations = raw.split("\n").filter(Boolean).slice(0, 3);
  }

  activity.mitigations = mitigations;
  await activity.save();
  return activity;
}

export async function listScheduleRisks() {
  return ScheduleRisk.find().sort({ riskScore: -1 });
}
