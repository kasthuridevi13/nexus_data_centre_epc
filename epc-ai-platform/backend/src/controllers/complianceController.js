import { runComplianceCheck, listComplianceChecks } from "../services/complianceService.js";

export async function postComplianceCheck(req, res, next) {
  try {
    const { submittalDocumentId, system } = req.body;
    if (!submittalDocumentId) return res.status(400).json({ error: "submittalDocumentId is required" });
    const check = await runComplianceCheck({ submittalDocumentId, system });
    res.status(201).json(check);
  } catch (err) {
    next(err);
  }
}

export async function getComplianceChecks(req, res, next) {
  try {
    const { verdict } = req.query;
    const filter = verdict ? { verdict } : {};
    res.json(await listComplianceChecks(filter));
  } catch (err) {
    next(err);
  }
}
