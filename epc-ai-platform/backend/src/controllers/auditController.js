import AuditLog from "../models/AuditLog.js";

export async function getAuditLogs(req, res, next) {
  try {
    const { agent } = req.query;
    const filter = agent ? { agent } : {};
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(logs);
  } catch (err) {
    next(err);
  }
}
