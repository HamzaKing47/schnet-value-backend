export const costValue = (data) => {
  if (!data) throw new Error("Cost data missing");

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
    marketAdjustmentFactor = 1,
  } = data;

  // STRICT validation (correct way)
  const requiredFields = [
    plotArea,
    landValueRate,
    grossFloorArea,
    standardConstructionCost,
    constructionIndexCurrent,
    constructionIndexBase,
    age,
    totalUsefulLife,
  ];

  if (requiredFields.some(v => v === undefined || v === null)) {
    throw new Error("Missing required cost valuation fields");
  }

  // 1. Land value
  const landValue = plotArea * landValueRate;

  // 2. Indexed construction cost
  const indexedCost =
    standardConstructionCost *
    (constructionIndexCurrent / constructionIndexBase);

  const buildingCost = grossFloorArea * indexedCost;

  // 3. Depreciation
  const depreciationRate = age / totalUsefulLife;
  const depreciatedBuildingValue =
    buildingCost * (1 - depreciationRate);

  // 4. External facilities
  const externalFacilities =
    depreciatedBuildingValue * externalFacilitiesRate;

  // 5. Total value
  const totalValue =
    landValue +
    depreciatedBuildingValue +
    externalFacilities;

  return Math.round(totalValue * marketAdjustmentFactor);
};
