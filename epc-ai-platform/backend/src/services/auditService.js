import AuditLog from "../models/AuditLog.js";

export async function logAgentAction({ agent, action, entityType, entityId, evidence = [], reasoning, outcome }) {
  return AuditLog.create({ agent, action, entityType, entityId, evidence, reasoning, outcome });
}
