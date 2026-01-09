import { calculateComparativeValue } from "../services/comparative.service.js";
import { incomeValue } from "../services/income.service.js";
import { costValue } from "../services/cost.service.js";

export const calculateMarketValue = (req, res) => {
  try {
    const { propertyType, comparative, income, cost, spf = 0 } = req.body;

    const comparativeVal = calculateComparativeValue(
      comparative?.comparables
    );

    const incomeVal = income ? incomeValue(income) : null;
    const costVal = cost ? costValue(cost) : null;

    let marketValue = null;

    // 🏠 ImmoWertV-based logic
    if (propertyType === "MultiFamilyBuilding") {
      if (incomeVal && costVal) {
        marketValue = 0.7 * incomeVal + 0.3 * costVal;
      }
    }

    if (propertyType === "Condominium") {
      if (comparativeVal && incomeVal) {
        marketValue = 0.8 * comparativeVal + 0.2 * incomeVal;
      }
    }

    if (propertyType === "SingleFamilyHome") {
      if (comparativeVal && costVal) {
        marketValue = 0.6 * comparativeVal + 0.4 * costVal;
      }
    }

    if (marketValue === null) {
      return res.status(400).json({
        error: "Insufficient data for market value calculation",
        breakdown: {
          comparativeValue: comparativeVal,
          incomeValue: incomeVal,
          costValue: costVal,
        },
      });
    }

    marketValue += spf;

    res.json({
      method: "Market Value (ImmoWertV)",
      marketValue: Math.round(marketValue),
      breakdown: {
        comparativeValue: comparativeVal,
        incomeValue: incomeVal,
        costValue: costVal,
        spf,
      },
    });
  } catch (err) {
    console.error("MARKET VALUE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
