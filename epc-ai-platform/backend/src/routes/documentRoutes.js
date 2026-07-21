import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { listDocuments, uploadDocument, createTextDocument } from "../controllers/documentController.js";

const router = Router();
router.get("/", listDocuments);
router.post("/upload", upload.single("file"), uploadDocument);
router.post("/text", createTextDocument);

export default router;
