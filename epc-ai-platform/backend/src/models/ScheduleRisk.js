import mongoose from "mongoose";

const scheduleRiskSchema = new mongoose.Schema(
  {
    activity: { type: String, required: true }, // e.g. "Generator Install - Building A"
    system: { type: String },
    plannedStart: Date,
    plannedFinish: Date,
    forecastFinish: Date,
    delayDays: { type: Number, default: 0 },
    riskScore: { type: Number, default: 0 }, // 0-100
    riskLevel: { type: String, enum: ["low", "medium", "high", "critical"], default: "low" },
    drivers: [
      {
        factor: String, // e.g. "Switchgear lead time slip", "Vendor submittal deviation"
        impactDays: Number,
        sourceType: { type: String, enum: ["procurement", "compliance", "labor", "weather", "dependency"] },
        sourceRef: { type: mongoose.Schema.Types.ObjectId }, // e.g. link to ComplianceCheck or SupplyChainItem
      },
    ],
    mitigations: [String],
    isCriticalPath: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("ScheduleRisk", scheduleRiskSchema);
