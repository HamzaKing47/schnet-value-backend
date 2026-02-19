import { calculateComparativeValue } from "../services/comparative.service.js";
import { calculateIncomeValue } from "../services/income.service.js";
import { calculateCostValue } from "../services/cost.service.js";
import { calculateMarketValue } from "../services/marketValue.service.js";

export async function calculateValuation(req, res) {
  try {
    const { comparables, incomeData, costData, propertyType, spf = 0 } = req.body;

    // ---- VALIDATION ----
    if (!comparables && !incomeData && !costData) {
      return res.status(400).json({
        error: "Mindestens ein Bewertungsverfahren muss ausgefüllt sein.",
      });
    }

    const values = {};
    const breakdown = {};

    // ---- COMPARATIVE ----
    if (comparables) {
      const comparativeResult = calculateComparativeValue(comparables);
      values.comparative = comparativeResult.value;
      breakdown.comparativeValue = comparativeResult.value;
      breakdown.comparativeDetails = comparativeResult.details;
    }

    // ---- INCOME ----
    if (incomeData) {
      const incomeResult = calculateIncomeValue(incomeData);
      values.income = incomeResult.value;
      breakdown.incomeValue = incomeResult.value;
      breakdown.incomeDetails = incomeResult.details;
    }

    // ---- COST ----
    if (costData) {
      const costResult = calculateCostValue(costData);
      values.cost = costResult.value;
      breakdown.costValue = costResult.value;
      breakdown.costDetails = costResult.details;
    }

    // ---- MARKET VALUE (with property type and spf) ----
    const marketResult = calculateMarketValue({
      propertyType,
      values,
      spf,
    });

    return res.json({
      marketValue: marketResult.value,
      breakdown,
      weights: marketResult.details.normalizedWeights,
      methods: {
        comparative: !!values.comparative,
        income: !!values.income,
        cost: !!values.cost,
      },
      details: marketResult.details,
    });
  } catch (err) {
    console.error("Valuation error:", err.message);
    return res.status(400).json({
      error: err.message,
    });
  }
}