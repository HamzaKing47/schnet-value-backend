export function calculateMarketValue(input) {
  const {
    propertyType,
    values = {},
    spf = 0,
  } = input;

  const { comparative, income, cost } = values;

  // ---- Step 1: Which methods have valid values? ----
  const available = {
    comparative: typeof comparative === "number" && comparative > 0,
    income: typeof income === "number" && income > 0,
    cost: typeof cost === "number" && cost > 0,
  };

  const activeMethods = Object.entries(available)
    .filter(([, avail]) => avail)
    .map(([key]) => key);

  if (activeMethods.length === 0) {
    throw new Error("Mindestens ein Bewertungsverfahren muss Werte liefern.");
  }

  // ---- Step 2: Define base weights per property type (ImmoWertV) ----
  let baseWeights = {
    comparative: 0,
    income: 0,
    cost: 0,
  };

  switch (propertyType) {
    case "Condominium":
      baseWeights = { comparative: 0.8, income: 0.2, cost: 0 };
      break;
    case "SingleFamilyHome":
      baseWeights = { comparative: 0.6, income: 0, cost: 0.4 };
      break;
    case "MultiFamilyBuilding":
      baseWeights = { comparative: 0, income: 0.7, cost: 0.3 };
      break;
    case "Land":
      baseWeights = { comparative: 1.0, income: 0, cost: 0 };
      break;
    default:
      // Fallback: equal distribution among ALL available methods
      const equal = 1 / activeMethods.length;
      baseWeights = {
        comparative: available.comparative ? equal : 0,
        income: available.income ? equal : 0,
        cost: available.cost ? equal : 0,
      };
      break;
  }

  // ---- Step 3: Determine eligible methods (base weight > 0 AND available) ----
  const eligible = {
    comparative: baseWeights.comparative > 0 && available.comparative,
    income: baseWeights.income > 0 && available.income,
    cost: baseWeights.cost > 0 && available.cost,
  };

  const eligibleMethods = Object.entries(eligible)
    .filter(([, isEligible]) => isEligible)
    .map(([key]) => key);

  let normalizedWeights = { comparative: 0, income: 0, cost: 0 };

  if (eligibleMethods.length === 0) {
    // ---- FALLBACK: no method with base weight > 0 is available – equal distribution among all available methods ----
    const equal = 1 / activeMethods.length;
    activeMethods.forEach((method) => {
      normalizedWeights[method] = equal;
    });
  } else {
    // ---- Normalize eligible weights to sum = 1 ----
    let total = 0;
    eligibleMethods.forEach((method) => {
      total += baseWeights[method];
    });
    eligibleMethods.forEach((method) => {
      normalizedWeights[method] = baseWeights[method] / total;
    });
  }

  // ---- Step 4: Calculate market value ----
  let marketValue = 0;
  activeMethods.forEach((method) => {
    marketValue += values[method] * normalizedWeights[method];
  });

  // ---- Step 5: Add boG / SPF ----
  marketValue += spf;

  if (!Number.isFinite(marketValue) || marketValue <= 0) {
    throw new Error("Berechneter Marktwert ist ungültig.");
  }

  return {
    value: Math.round(marketValue),
    details: {
      inputValues: values,
      baseWeights,
      normalizedWeights,
      usedMethods: activeMethods,
      eligibleMethods,
      spfApplied: spf,
    },
  };
}