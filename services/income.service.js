export function calculateIncomeValue(input) {
  const {
    plotArea,
    landValueRate,
    livingArea,
    rentPerSqm,
    operatingCosts = {},
    capitalizationRate,
    remainingUsefulLife,
    marketAdjustmentFactor = 1.0,
    bogAdjustment = 0,
  } = input;

  // ---------- Validierung ----------
  if (plotArea <= 0 || landValueRate <= 0) {
    throw new Error("Grundstücksfläche und Bodenrichtwert müssen > 0 sein.");
  }
  if (livingArea <= 0 || rentPerSqm <= 0) {
    throw new Error("Wohnfläche und Miete pro m² müssen > 0 sein.");
  }
  if (capitalizationRate <= 0 || capitalizationRate >= 1) {
    throw new Error("Liegenschaftszins muss zwischen 0 und 1 liegen.");
  }
  if (remainingUsefulLife <= 0 || !Number.isInteger(remainingUsefulLife)) {
    throw new Error("Restnutzungsdauer muss eine positive ganze Zahl sein.");
  }

  const {
    administration = 300,
    maintenancePerSqm = 10,
    vacancyRate = 0.03,
  } = operatingCosts;

  if (vacancyRate < 0 || vacancyRate > 0.2) {
    throw new Error("Mietausfallwagnis muss zwischen 0% und 20% liegen.");
  }

  // ---------- 1. Bodenwert ----------
  const landValue = plotArea * landValueRate;

  // ---------- 2. Rohertrag ----------
  const annualRent = livingArea * rentPerSqm * 12;

  // ---------- 3. Bewirtschaftungskosten ----------
  const maintenanceCost = maintenancePerSqm * livingArea;
  const vacancyLoss = annualRent * vacancyRate;
  const totalOperatingCosts = administration + maintenanceCost + vacancyLoss;

  // ---------- 4. Reinertrag ----------
  const netIncome = annualRent - totalOperatingCosts;
  if (netIncome <= 0) {
    throw new Error("Reinertrag muss positiv sein.");
  }

  // ---------- 5. Bodenwertverzinsung ----------
  const landDeduction = landValue * capitalizationRate;

  // ---------- 6. Gebäudereinertrag ----------
  const buildingNetIncome = netIncome - landDeduction;
  if (buildingNetIncome <= 0) {
    throw new Error("Gebäudereinertrag negativ – Bodenwertverzinsung zu hoch.");
  }

  // ---------- 7. Barwertfaktor (Vervielfältiger) ----------
  const q = 1 + capitalizationRate;
  const n = remainingUsefulLife;
  const multiplier = (Math.pow(q, n) - 1) / (Math.pow(q, n) * (q - 1));

  // ---------- 8. Gebäudeertragswert ----------
  const buildingValue = buildingNetIncome * multiplier;

  // ---------- 9. Vorläufiger Ertragswert ----------
  let preliminaryValue = landValue + buildingValue;

  // ---------- 10. Marktanpassung & boG ----------
  const marketAdjustedValue = preliminaryValue * marketAdjustmentFactor;
  const finalValue = marketAdjustedValue + bogAdjustment;

  return {
    value: Math.round(finalValue),
    details: {
      landValue: Math.round(landValue),
      annualRent: Math.round(annualRent),
      operatingCosts: {
        administration,
        maintenanceCost: Math.round(maintenanceCost),
        vacancyLoss: Math.round(vacancyLoss),
        total: Math.round(totalOperatingCosts),
      },
      netIncome: Math.round(netIncome),
      landDeduction: Math.round(landDeduction),
      buildingNetIncome: Math.round(buildingNetIncome),
      multiplier: multiplier.toFixed(4),
      buildingValue: Math.round(buildingValue),
      preliminaryValue: Math.round(preliminaryValue),
      marketAdjustmentFactor,
      bogAdjustment,
    },
  };
}