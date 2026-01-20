export const calculateMarketValue = (req, res) => {
  const {
    propertyType,
    comparative,
    income,
    cost,
    spf = 0,
    weights,
  } = req.body;

  const comparativeValue = comparative?.value ?? null;
  const incomeValue = income?.incomeValue ?? null;
  const costValue = cost?.value ?? null;

  const w = weights || defaultWeights(propertyType);

  let weightedSum = 0;
  let weightTotal = 0;

  if (comparativeValue) {
    weightedSum += comparativeValue * w.comparative;
    weightTotal += w.comparative;
  }

  if (incomeValue) {
    weightedSum += incomeValue * w.income;
    weightTotal += w.income;
  }

  if (costValue) {
    weightedSum += costValue * w.cost;
    weightTotal += w.cost;
  }

  const marketValue =
    weightTotal > 0
      ? Math.round(weightedSum / weightTotal + spf)
      : null;

  res.json({
    method: "Market Value (ImmoWertV)",
    marketValue,
    breakdown: {
      comparativeValue,
      incomeValue,
      costValue,
      weights: w,
      spf,
    },
  });
};

function defaultWeights(type) {
  switch (type) {
    case "SingleFamilyHome":
      return { comparative: 0.5, income: 0, cost: 0.5 };
    case "MultiFamilyBuilding":
      return { comparative: 0, income: 0.6, cost: 0.4 };
    default:
      return { comparative: 0.4, income: 0.4, cost: 0.2 };
  }
}
