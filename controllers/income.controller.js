export const calculateIncomeValue = (req, res) => {
  const {
    plotArea,
    landValueRate,
    livingArea,
    rentPerSqm,
    operatingCosts,
    capitalizationRate,
    remainingUsefulLife,
    marketAdjustmentFactor
  } = req.body;

  // 1. Land Value
  const landValue = plotArea * landValueRate;

  // 2. Gross Income
  const grossIncome = livingArea * rentPerSqm * 12;

  // 3. Operating Costs
  const maintenance = livingArea * operatingCosts.maintenancePerSqm;
  const vacancyLoss = grossIncome * operatingCosts.vacancyRate;
  const totalOperatingCosts =
    operatingCosts.administration + maintenance + vacancyLoss;

  // 4. Net Income
  const netIncome = grossIncome - totalOperatingCosts;

  // 5. Land Value Interest
  const landValueInterest = landValue * capitalizationRate;

  // 6. Building Net Income
  const buildingNetIncome = netIncome - landValueInterest;

  // 7. Present Value Factor
  const q = 1 + capitalizationRate;
  const presentValueFactor =
    (Math.pow(q, remainingUsefulLife) - 1) /
    (Math.pow(q, remainingUsefulLife) * (q - 1));

  // 8. Building Income Value
  const buildingIncomeValue =
    buildingNetIncome * presentValueFactor;

  // 9. Final Income Value
  const preliminaryValue = landValue + buildingIncomeValue;
  const incomeValue =
    preliminaryValue * marketAdjustmentFactor;

  res.status(200).json({
    method: "Income Capitalization Method",
    incomeValue: Math.round(incomeValue),
    breakdown: {
      landValue,
      grossIncome,
      netIncome,
      buildingIncomeValue,
      capitalizationRate,
      presentValueFactor
    }
  });
};
