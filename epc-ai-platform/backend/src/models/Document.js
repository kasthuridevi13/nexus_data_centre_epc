import mongoose from "mongoose";

// Every spec, submittal, RFI, drawing, or change order is ingested here first.
// This is the single "layer" the platform brief calls for - all 5 agents read from it.
const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["specification", "submittal", "drawing", "rfi", "change_order", "test_procedure", "other"],
      required: true,
    },
    system: {
      // e.g. Power, Cooling, IT Infrastructure, Fire/Life Safety
      type: String,
      default: "General",
    },
    tier: { type: String, enum: ["Tier I", "Tier II", "Tier III", "Tier IV", "N/A"], default: "N/A" },
    vendor: { type: String },
    version: { type: String, default: "1.0" },
    rawText: { type: String }, // extracted full text
    status: {
      type: String,
      enum: ["ingested", "processing", "indexed", "failed"],
      default: "ingested",
    },
    uploadedBy: { type: String, default: "system" },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
