import { Router } from "express";
import { getChecklists, patchTestItem } from "../controllers/commissioningController.js";

const router = Router();
router.get("/", getChecklists);
router.patch("/:checklistId/items/:testId", patchTestItem);

export default router;
