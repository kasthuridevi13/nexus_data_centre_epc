import { Router } from "express";
import { getScheduleRisks, postRecomputeRisk, postMitigations } from "../controllers/scheduleRiskController.js";

const router = Router();
router.get("/", getScheduleRisks);
router.post("/recompute", postRecomputeRisk);
router.post("/:id/mitigations", postMitigations);

export default router;
