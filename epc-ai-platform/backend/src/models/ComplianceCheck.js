import mongoose from "mongoose";

const complianceCheckSchema = new mongoose.Schema(
  {
    submittalDocument: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    specDocument: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    system: { type: String },
    verdict: {
      type: String,
      enum: ["compliant", "deviation", "needs_review"],
      default: "needs_review",
    },
    confidence: { type: Number, default: 0 }, // 0-100
    findings: [
      {
        clause: String,
        specText: String,
        submittalText: String,
        issue: String,
        severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
      },
    ],
    summary: { type: String },
    linkedRFI: { type: mongoose.Schema.Types.ObjectId, ref: "RFI" },
    reviewedBy: { type: String, default: "AI Compliance Agent" },
  },
  { timestamps: true }
);

export default mongoose.model("ComplianceCheck", complianceCheckSchema);
