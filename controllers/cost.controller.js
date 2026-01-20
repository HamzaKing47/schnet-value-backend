import { validateRequired } from "../utils/validateRequired.js";

export const calculateCostValue = (req, res) => {
  const error = validateRequired(req.body, [
    "plotArea",
    "landValueRate",
    "grossFloorArea",
    "standardConstructionCost",
    "constructionIndexCurrent",
    "constructionIndexBase",
    "age",
    "totalUsefulLife",
    "marketAdjustmentFactor",
  ]);

  if (error) {
    return res.status(400).json({ error });
  }

  const {
    plotArea,
    landValueRate,
    grossFloorArea,
    standardConstructionCost,
    constructionIndexCurrent,
    constructionIndexBase,
    age,
    totalUsefulLife,
    externalFacilitiesRate = 0,
    marketAdjustmentFactor,
  } = req.body;

  const landValue = plotArea * landValueRate;

  const indexedCost =
    standardConstructionCost *
    (constructionIndexCurrent / constructionIndexBase);

  const buildingCost = grossFloorArea * indexedCost;

  const depreciation = age / totalUsefulLife;
  const residualBuildingValue = buildingCost * (1 - depreciation);

  const externalFacilities =
    residualBuildingValue * externalFacilitiesRate;

  const finalCostValue =
    (landValue + residualBuildingValue + externalFacilities) *
    marketAdjustmentFactor;

  res.json({
    method: "Cost Approach Method",
    value: Math.round(finalCostValue),
    breakdown: {
      landValue,
      buildingCost,
      depreciation,
      externalFacilities,
    },
  });
};
