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
    externalFacilitiesRate,
    marketAdjustmentFactor
  } = req.body;

  // Step 1: Land Value
  const landValue = plotArea * landValueRate;

  // Step 2: Construction Costs (Index adjusted)
  const baseConstructionCost =
    grossFloorArea * standardConstructionCost;

  const adjustedConstructionCost =
    baseConstructionCost *
    (constructionIndexCurrent / constructionIndexBase);

  // Step 3: Depreciation (Linear)
  const depreciation = age / totalUsefulLife;
  const buildingResidualValue =
    adjustedConstructionCost * (1 - depreciation);

  // Step 4: External Facilities
  const externalFacilities =
    buildingResidualValue * externalFacilitiesRate;

  // Step 5: Preliminary Cost Value
  const preliminaryCostValue =
    landValue + buildingResidualValue + externalFacilities;

  // Step 6: Market Adjustment
  const finalCostValue =
    preliminaryCostValue * marketAdjustmentFactor;

  res.json({
    method: "Cost Approach Method",
    value: Math.round(finalCostValue)
  });
};
