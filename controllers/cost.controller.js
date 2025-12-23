export const calculateCostValue = (req, res) => {
  const {
    plotArea,
    landValueRate,
    grossFloorArea,
    standardConstructionCost,
    constructionIndexCurrent,
    constructionIndexBase,
    age,
    totalUsefulLife,
    externalFacilities,
    marketAdjustmentFactor
  } = req.body;

  // 1. Land Value
  const landValue = plotArea * landValueRate;

  // 2. Construction Costs (NHK 2010 adjusted)
  const baseConstructionCost =
    grossFloorArea * standardConstructionCost;

  const adjustedConstructionCost =
    baseConstructionCost *
    (constructionIndexCurrent / constructionIndexBase);

  // 3. Depreciation (Linear)
  const depreciationRate = age / totalUsefulLife;
  const buildingResidualValue =
    adjustedConstructionCost * (1 - depreciationRate);

  // 4. Preliminary Cost Value
  const preliminaryCostValue =
    landValue + buildingResidualValue + externalFacilities;

  // 5. Market Adjustment
  const costValue =
    preliminaryCostValue * marketAdjustmentFactor;

  res.status(200).json({
    method: "Cost Approach Method",
    costValue: Math.round(costValue),
    breakdown: {
      landValue,
      adjustedConstructionCost,
      buildingResidualValue,
      depreciationRate,
      externalFacilities,
      marketAdjustmentFactor
    }
  });
};
