import mongoose from "mongoose";

const supplyChainItemSchema = new mongoose.Schema(
  {
    equipment: { type: String, required: true }, // e.g. "UPS Module 2N - Block C"
    category: {
      type: String,
      enum: ["UPS", "Generator", "Cooling Tower", "Switchgear", "CRAH", "Transformer", "Other"],
    },
    vendor: { type: String },
    tier: { type: String, enum: ["Tier 1", "Tier 2", "Tier 3"], default: "Tier 1" }, // supplier tier, not facility tier
    poNumber: { type: String },
    origin: {
      name: String,
      lat: Number,
      lng: Number,
    },
    destination: {
      name: String,
      lat: Number,
      lng: Number,
    },
    expectedDelivery: Date,
    currentStatus: {
      type: String,
      enum: ["manufacturing", "in_transit", "customs", "delivered", "delayed"],
      default: "manufacturing",
    },
    riskScore: { type: Number, default: 0 }, // 0-100
    riskFactors: [String],
    alternateSuppliers: [String],
  },
  { timestamps: true }
);

export default mongoose.model("SupplyChainItem", supplyChainItemSchema);
