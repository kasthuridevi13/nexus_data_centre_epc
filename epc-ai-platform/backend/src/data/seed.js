import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Document from "../models/Document.js";
import ScheduleRisk from "../models/ScheduleRisk.js";
import SupplyChainItem from "../models/SupplyChainItem.js";
import CommissioningChecklist from "../models/CommissioningChecklist.js";
import User from "../models/User.js";
import { ingestDocument } from "../services/rag/ragService.js";

const SPEC_UPS = `SECTION 26.30 - UNINTERRUPTIBLE POWER SUPPLY SYSTEMS
Clause 3.1 Redundancy: The UPS system shall be configured as 2N redundant, with each UPS module rated for 100% of critical IT load independently.
Clause 3.2 Runtime: Battery autonomy shall provide a minimum of 12 minutes at full rated load before generator transfer.
Clause 3.4 Efficiency: UPS modules shall achieve a minimum operating efficiency of 96% at 40-100% load, tested per Uptime Institute Tier III requirements.
Clause 3.6 Environmental: UPS battery rooms shall maintain ambient temperature between 20C and 25C with dedicated precision cooling, independent of general room HVAC.
Clause 4.1 Testing: Each UPS module shall undergo full load bank testing at 25%, 50%, 75%, and 100% of rated capacity prior to site acceptance.`;

const SUBMITTAL_UPS = `VENDOR SUBMITTAL - UPS MODULES, PROJECT BLOCK C
Manufacturer: PowerGuard Systems, Model PG-800E
Configuration: N+1 redundant array, each module rated for 100% of critical load.
Battery Runtime: 10 minutes at full rated load before generator transfer per manufacturer datasheet.
Efficiency: 95.2% typical operating efficiency at 40-100% load per independent lab test attached.
Battery Room Environmental: Cooled via shared mechanical room HVAC system, setpoint 22C.
Testing Plan: Load bank testing proposed at 50% and 100% of rated capacity only, to reduce commissioning schedule.`;

const SPEC_COOLING = `SECTION 23.10 - COOLING TOWER AND CHILLED WATER SYSTEMS
Clause 2.1 Redundancy: Cooling towers shall be configured N+1 minimum across all mechanical blocks.
Clause 2.3 Water Treatment: Automated chemical dosing and conductivity monitoring shall be provided for Legionella control per ASHRAE 188.
Clause 2.5 Approach Temperature: Cooling towers shall achieve a design approach temperature of 5F (2.8C) at peak wet bulb conditions.`;

export async function seedData(shouldDisconnect = false) {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
  console.log("[seed] clearing existing demo collections...");
  await Promise.all([
    Document.deleteMany({}),
    ScheduleRisk.deleteMany({}),
    SupplyChainItem.deleteMany({}),
    CommissioningChecklist.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log("[seed] creating demo users...");
  await User.create([
    { email: "admin@nexus.com", password: "password123", role: "admin", tenantId: "tenant_demo" },
    { email: "vendor@nexus.com", password: "password123", role: "vendor", tenantId: "tenant_demo" }
  ]);

  console.log("[seed] creating and indexing documents...");
  const specUPS = await Document.create({
    title: "Section 26.30 - UPS Specification Rev C",
    type: "specification",
    system: "Power",
    tier: "Tier III",
    rawText: SPEC_UPS,
  });
  await ingestDocument(specUPS._id);

  const submittalUPS = await Document.create({
    title: "PowerGuard PG-800E UPS Submittal",
    type: "submittal",
    system: "Power",
    vendor: "PowerGuard Systems",
    rawText: SUBMITTAL_UPS,
  });
  await ingestDocument(submittalUPS._id);

  const specCooling = await Document.create({
    title: "Section 23.10 - Cooling Tower Specification",
    type: "specification",
    system: "Cooling",
    tier: "Tier III",
    rawText: SPEC_COOLING,
  });
  await ingestDocument(specCooling._id);

  console.log("[seed] creating schedule risk activities...");
  await ScheduleRisk.insertMany([
    {
      activity: "UPS Install & Energization - Block C",
      system: "Power",
      plannedStart: new Date("2026-08-01"),
      plannedFinish: new Date("2026-08-20"),
      forecastFinish: new Date("2026-08-20"),
      isCriticalPath: true,
    },
    {
      activity: "Cooling Tower Set - Mechanical Yard B",
      system: "Cooling",
      plannedStart: new Date("2026-08-05"),
      plannedFinish: new Date("2026-08-18"),
      forecastFinish: new Date("2026-08-18"),
      isCriticalPath: true,
    },
    {
      activity: "Switchgear Termination - Block A",
      system: "Power",
      plannedStart: new Date("2026-07-20"),
      plannedFinish: new Date("2026-08-02"),
      forecastFinish: new Date("2026-08-02"),
      isCriticalPath: false,
    },
  ]);

  console.log("[seed] creating supply chain items...");
  await SupplyChainItem.insertMany([
    {
      equipment: "UPS Module 2N - Block C",
      category: "UPS",
      vendor: "PowerGuard Systems",
      tier: "Tier 1",
      poNumber: "PO-2026-0441",
      origin: { name: "Chennai, IN", lat: 13.0827, lng: 80.2707 },
      destination: { name: "Data Centre Site, Pune", lat: 18.5204, lng: 73.8567 },
      expectedDelivery: new Date("2026-07-25"),
      currentStatus: "customs",
      alternateSuppliers: ["Vertiv", "Schneider Electric"],
    },
    {
      equipment: "Cooling Tower Cell 3 - Mechanical Yard B",
      category: "Cooling Tower",
      vendor: "ThermoFlow Industries",
      tier: "Tier 1",
      poNumber: "PO-2026-0398",
      origin: { name: "Gujarat, IN", lat: 23.0225, lng: 72.5714 },
      destination: { name: "Data Centre Site, Pune", lat: 18.5204, lng: 73.8567 },
      expectedDelivery: new Date("2026-08-10"),
      currentStatus: "in_transit",
    },
    {
      equipment: "Medium Voltage Switchgear - Block A",
      category: "Switchgear",
      vendor: "GridTech Corp",
      tier: "Tier 2",
      poNumber: "PO-2026-0355",
      origin: { name: "Bengaluru, IN", lat: 12.9716, lng: 77.5946 },
      destination: { name: "Data Centre Site, Pune", lat: 18.5204, lng: 73.8567 },
      expectedDelivery: new Date("2026-06-30"),
      currentStatus: "delayed",
    },
  ]);

  console.log("[seed] creating commissioning checklists...");
  await CommissioningChecklist.insertMany([
    {
      system: "Electrical - UPS Block C",
      phase: "Level 4 - System",
      targetTier: "Tier III",
      items: [
        { testId: "E-401", description: "UPS load bank test at 100%", standard: "TIA-942 Level 4", status: "passed" },
        { testId: "E-402", description: "Battery runtime verification", standard: "Uptime Tier III", status: "pending" },
        { testId: "E-403", description: "Transfer switch failover timing", standard: "TIA-942 Level 4", status: "pending" },
      ],
    },
    {
      system: "Mechanical - Cooling Yard B",
      phase: "Level 3 - Subsystem",
      targetTier: "Tier III",
      items: [
        { testId: "M-301", description: "Cooling tower approach temp verification", standard: "ASHRAE 188 / Tier III", status: "in_progress" },
        { testId: "M-302", description: "Water treatment dosing system check", standard: "ASHRAE 188", status: "pending" },
      ],
    },
  ]);

  console.log("[seed] done.");
  if (shouldDisconnect) {
    await mongoose.disconnect();
  }
}

if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  seedData(true).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

