import { Router } from "express";
import { postRFIQuestion, getRFIs } from "../controllers/rfiController.js";

const router = Router();
router.get("/", getRFIs);
router.post("/ask", postRFIQuestion);

export default router;
