import { calculateComparativeValue } from "../services/comparative.service.js";
import { incomeValue } from "../services/income.service.js";
import { costValue } from "../services/cost.service.js";

export const calculateMarketValue = (req, res) => {
  const { propertyType, comparative, income, cost, spf } = req.body;

  let value1 = null;
  let value2 = null;
  let value3 = null;
  let marketValue = 0;

  if (comparative)
    value2 = calculateComparativeValue(comparative.comparables);

  if (income)
    value1 = incomeValue(income);

  if (cost)
    value3 = costValue(cost);

  if (propertyType === "MultiFamilyBuilding") {
    marketValue = 0.7 * value1 + 0.3 * value3;
  } else if (propertyType === "Condominium") {
    marketValue = 0.8 * value2 + 0.2 * value1;
  } else if (propertyType === "SingleFamilyHome") {
    marketValue = 0.6 * value2 + 0.4 * value3;
  }

  if (spf) marketValue += spf;

  res.json({
    method: "Market Value (ImmoWertV)",
    marketValue: Math.round(marketValue),
    breakdown: {
      incomeValue: value1,
      comparativeValue: value2,
      costValue: value3,
      spf: spf || 0,
    },
  });
};
