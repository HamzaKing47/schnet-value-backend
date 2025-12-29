export const costValue = (data) => {
  const landValue =
    data.plotArea * data.landValueRate;

  const constructionCost =
    data.grossFloorArea *
    data.standardConstructionCost *
    (data.constructionIndexCurrent /
      data.constructionIndexBase);

  const depreciation =
    data.age / data.totalUsefulLife;

  const buildingValue =
    constructionCost * (1 - depreciation);

  const externalFacilities =
    buildingValue * data.externalFacilitiesRate;

  return (
    (landValue +
      buildingValue +
      externalFacilities) *
    data.marketAdjustmentFactor
  );
};
