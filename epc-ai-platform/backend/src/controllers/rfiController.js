import { askProjectQuestion, listRFIs } from "../services/rfiService.js";

export async function postRFIQuestion(req, res, next) {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "question is required" });
    const result = await askProjectQuestion(question);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getRFIs(req, res, next) {
  try {
    res.json(await listRFIs());
  } catch (err) {
    next(err);
  }
}
