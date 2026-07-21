import mongoose from "mongoose";

// Every AI decision across all 5 agents writes here with the evidence it used.
// This is what makes the platform audit-ready for Tier III/IV commissioning sign-off.
const auditLogSchema = new mongoose.Schema(
  {
    agent: {
      type: String,
      enum: [
        "compliance_agent",
        "schedule_risk_engine",
        "supply_chain_agent",
        "commissioning_copilot",
        "rfi_intelligence_agent",
      ],
      required: true,
    },
    action: { type: String, required: true }, // e.g. "flagged_deviation", "generated_risk_alert"
    entityType: { type: String }, // e.g. "ComplianceCheck", "ScheduleRisk"
    entityId: { type: mongoose.Schema.Types.ObjectId },
    evidence: [String], // clause refs, chunk excerpts, data points used
    reasoning: { type: String }, // short natural-language justification, stored for audit
    outcome: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
