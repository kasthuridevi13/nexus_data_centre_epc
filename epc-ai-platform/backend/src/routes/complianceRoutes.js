import { Router } from "express";
import { postComplianceCheck, getComplianceChecks } from "../controllers/complianceController.js";
import { requireRole } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", getComplianceChecks);
router.post("/run", requireRole(["admin"]), postComplianceCheck);

export default router;
