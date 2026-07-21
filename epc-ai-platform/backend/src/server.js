import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import documentRoutes from "./routes/documentRoutes.js";
import complianceRoutes from "./routes/complianceRoutes.js";
import scheduleRiskRoutes from "./routes/scheduleRiskRoutes.js";
import supplyChainRoutes from "./routes/supplyChainRoutes.js";
import commissioningRoutes from "./routes/commissioningRoutes.js";
import rfiRoutes from "./routes/rfiRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

app.use(helmet());
app.use(cors()); // Allow all origins for seamless frontend connection
app.use(express.json({ limit: "5mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
});
app.use("/api/", apiLimiter);

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "epc-ai-platform-backend" }));

// Public Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/documents", verifyToken, documentRoutes);
app.use("/api/compliance", verifyToken, complianceRoutes);
app.use("/api/schedule-risk", verifyToken, scheduleRiskRoutes);
app.use("/api/supply-chain", verifyToken, supplyChainRoutes);
app.use("/api/commissioning", verifyToken, commissioningRoutes);
app.use("/api/rfi", verifyToken, rfiRoutes);
app.use("/api/audit", verifyToken, auditRoutes);
app.use("/api/dashboard", verifyToken, dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`[server] listening on port ${PORT}`));
});
