export const incomeValue = (data) => {
  const landValue = data.plotArea * data.landValueRate;

  const grossIncome =
    data.livingArea * data.rentPerSqm * 12;

  const operatingCosts =
    data.operatingCosts.administration +
    data.livingArea * data.operatingCosts.maintenancePerSqm +
    grossIncome * data.operatingCosts.vacancyRate;

  const netIncome = grossIncome - operatingCosts;

  const landInterest =
    landValue * data.capitalizationRate;

  const buildingIncome =
    netIncome - landInterest;

  const q = 1 + data.capitalizationRate;
  const v =
    (Math.pow(q, data.remainingUsefulLife) - 1) /
    (Math.pow(q, data.remainingUsefulLife) * (q - 1));

  return (landValue + buildingIncome * v) *
    data.marketAdjustmentFactor;
};
