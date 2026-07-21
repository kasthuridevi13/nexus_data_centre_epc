import { recomputeSupplyChainRisk, listSupplyChainItems } from "../services/supplyChainService.js";

export async function getSupplyChainItems(req, res, next) {
  try {
    res.json(await listSupplyChainItems());
  } catch (err) {
    next(err);
  }
}

export async function postRecomputeSupplyChain(req, res, next) {
  try {
    res.json(await recomputeSupplyChainRisk());
  } catch (err) {
    next(err);
  }
}
