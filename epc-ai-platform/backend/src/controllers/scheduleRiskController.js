import {
  recomputeScheduleRisk,
  getMitigationSuggestions,
  listScheduleRisks,
} from "../services/scheduleRiskService.js";

export async function getScheduleRisks(req, res, next) {
  try {
    res.json(await listScheduleRisks());
  } catch (err) {
    next(err);
  }
}

export async function postRecomputeRisk(req, res, next) {
  try {
    res.json(await recomputeScheduleRisk());
  } catch (err) {
    next(err);
  }
}

export async function postMitigations(req, res, next) {
  try {
    const activity = await getMitigationSuggestions(req.params.id);
    res.json(activity);
  } catch (err) {
    next(err);
  }
}
