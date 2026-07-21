import { listChecklists, updateTestItem } from "../services/commissioningService.js";

export async function getChecklists(req, res, next) {
  try {
    res.json(await listChecklists());
  } catch (err) {
    next(err);
  }
}

export async function patchTestItem(req, res, next) {
  try {
    const { checklistId, testId } = req.params;
    const { status, result } = req.body;
    const checklist = await updateTestItem({ checklistId, testId, status, result });
    res.json(checklist);
  } catch (err) {
    next(err);
  }
}
