import { Router } from "express";
import { getSupplyChainItems, postRecomputeSupplyChain } from "../controllers/supplyChainController.js";

const router = Router();
router.get("/", getSupplyChainItems);
router.post("/recompute", postRecomputeSupplyChain);

export default router;
