import mongoose from "mongoose";

const commissioningItemSchema = new mongoose.Schema({
  testId: String,
  description: String,
  standard: String, // e.g. "TIA-942 Level 3", "Uptime Institute Tier III"
  status: {
    type: String,
    enum: ["pending", "in_progress", "passed", "failed", "flagged"],
    default: "pending",
  },
  result: String,
  flaggedIssue: String,
  evidenceDocs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
});

const commissioningChecklistSchema = new mongoose.Schema(
  {
    system: { type: String, required: true }, // e.g. "Electrical - Level 5 IST"
    phase: {
      type: String,
      enum: ["Level 1 - Factory", "Level 2 - Component", "Level 3 - Subsystem", "Level 4 - System", "Level 5 - Integrated"],
    },
    targetTier: { type: String, enum: ["Tier I", "Tier II", "Tier III", "Tier IV"], default: "Tier III" },
    items: [commissioningItemSchema],
    completionPct: { type: Number, default: 0 },
    asCommissionedPackageReady: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("CommissioningChecklist", commissioningChecklistSchema);
