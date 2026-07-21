import CommissioningChecklist from "../models/CommissioningChecklist.js";
import { askLLM } from "./aiClient.js";
import { logAgentAction } from "./auditService.js";

export async function listChecklists() {
  return CommissioningChecklist.find().sort({ createdAt: -1 });
}

export async function updateTestItem({ checklistId, testId, status, result }) {
  const checklist = await CommissioningChecklist.findById(checklistId);
  if (!checklist) throw new Error("Checklist not found");

  const item = checklist.items.find((i) => i.testId === testId);
  if (!item) throw new Error("Test item not found");

  item.status = status;
  item.result = result;

  // Auto-flag against acceptance criteria using the target tier standard.
  if (status === "failed") {
    const narrative = await askLLM({
      system: `You are a commissioning QA copilot for data centre ${checklist.targetTier} facilities, referencing TIA-942 and Uptime Institute standards. Be terse.`,
      prompt: `Test "${item.description}" (${item.standard}) failed with result: "${result}". In 1-2 sentences, state the likely acceptance-criteria clause violated and the recommended next action.`,
      maxTokens: 200,
    });
    item.flaggedIssue = narrative;

    await logAgentAction({
      agent: "commissioning_copilot",
      action: "test_flagged",
      entityType: "CommissioningChecklist",
      entityId: checklist._id,
      evidence: [`${item.testId}: ${item.description}`, item.standard],
      reasoning: narrative,
      outcome: "flagged",
    });
  }

  const total = checklist.items.length;
  const done = checklist.items.filter((i) => i.status === "passed").length;
  checklist.completionPct = total ? Math.round((done / total) * 100) : 0;
  checklist.asCommissionedPackageReady = checklist.completionPct === 100;

  await checklist.save();
  return checklist;
}
