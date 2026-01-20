export const incomeValue = (data) => {
  if (!data) return null;

  const {
    plotArea,
    landValueRate,
    livingArea,
    rentPerSqm,
    operatingCosts,
    capitalizationRate,
    remainingUsefulLife,
    marketAdjustmentFactor = 1,
  } = data;

  if (
    !plotArea ||
    !landValueRate ||
    !livingArea ||
    !rentPerSqm ||
    !capitalizationRate
  ) {
    return null;
  }

  const landValue = plotArea * landValueRate;
  const grossIncome = livingArea * rentPerSqm * 12;

  const maintenance =
    (operatingCosts?.maintenancePerSqm || 0) * livingArea;
  const admin = operatingCosts?.administration || 0;
  const vacancyLoss =
    grossIncome * (operatingCosts?.vacancyRate || 0);

  const netIncome = grossIncome - maintenance - admin - vacancyLoss;

  const buildingIncomeValue = netIncome / capitalizationRate;

  return Math.round(
    (landValue + buildingIncomeValue) * marketAdjustmentFactor
  );
};
