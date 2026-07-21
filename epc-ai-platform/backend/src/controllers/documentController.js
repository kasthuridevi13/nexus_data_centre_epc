import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Document from "../models/Document.js";
import { ingestDocument } from "../services/rag/ragService.js";

export async function listDocuments(req, res, next) {
  try {
    const { type, system } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (system) filter.system = system;
    const docs = await Document.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    next(err);
  }
}

export async function uploadDocument(req, res, next) {
  try {
    const { title, type, system, tier, vendor } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let rawText = "";
    if (req.file.mimetype === "application/pdf") {
      const parsed = await pdfParse(req.file.buffer);
      rawText = parsed.text;
    } else {
      rawText = req.file.buffer.toString("utf-8");
    }

    const doc = await Document.create({
      title: title || req.file.originalname,
      type: type || "other",
      system: system || "General",
      tier: tier || "N/A",
      vendor,
      rawText,
    });

    const indexResult = await ingestDocument(doc._id);
    res.status(201).json({ document: doc, ...indexResult });
  } catch (err) {
    next(err);
  }
}

/** For demo/seed use: create + index a document from plain text instead of a file upload. */
export async function createTextDocument(req, res, next) {
  try {
    const { title, type, system, tier, vendor, rawText } = req.body;
    const doc = await Document.create({ title, type, system, tier, vendor, rawText });
    const indexResult = await ingestDocument(doc._id);
    res.status(201).json({ document: doc, ...indexResult });
  } catch (err) {
    next(err);
  }
}
