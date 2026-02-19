// NHK 2010 Richtwerte (€/m² BGF) – vereinfacht
const NHK_2010 = {
  // Einfamilienhaus freistehend
  EFH_einfach: 670,
  EFH_mittel: 870,
  EFH_gehoben: 1150,
  // Doppelhaushälfte / Reihenhaus
  DHH_mittel: 800,
  RH_mittel: 750,
  // Mehrfamilienhaus
  MFH_mittel: 720,
  // Default fallback
  default: 870,
};

// Baukostenindex Basis 2010 = 100
const BASE_YEAR_INDEX = 100;

export function calculateCostValue(input) {
  const {
    plotArea,
    landValueRate,
    grossFloorArea,
    buildingType = "EFH_mittel", // 'EFH_einfach', 'EFH_mittel', 'EFH_gehoben', 'DHH_mittel', 'RH_mittel', 'MFH_mittel'
    constructionIndexCurrent = 160, // Baupreisindex aktuell (z.B. 2025 ~ 160)
    age,
    totalUsefulLife,
    depreciationMethod = "linear", // 'linear' or 'ross'
    externalFacilitiesRate = 0.04, // 4% default
    externalFacilitiesCost = 0,     // absolute value if provided, overrides rate
    marketAdjustmentFactor = 1.0,   // Sachwertfaktor
    bogAdjustment = 0,
  } = input;

  // ---------- Validierung ----------
  if (plotArea <= 0 || landValueRate <= 0) {
    throw new Error("Grundstücksfläche und Bodenrichtwert müssen > 0 sein.");
  }
  if (grossFloorArea <= 0) {
    throw new Error("Brutto-Grundfläche (BGF) muss > 0 sein.");
  }
  if (constructionIndexCurrent <= 0) {
    throw new Error("Baupreisindex aktuell muss > 0 sein.");
  }
  if (age < 0 || totalUsefulLife <= 0) {
    throw new Error("Alter und Gesamtnutzungsdauer müssen positiv sein.");
  }
  if (age > totalUsefulLife) {
    throw new Error("Alter darf Gesamtnutzungsdauer nicht überschreiten.");
  }

  // ---------- 1. Bodenwert ----------
  const landValue = plotArea * landValueRate;

  // ---------- 2. Normalherstellungskosten (NHK 2010) ----------
  let nhk = NHK_2010[buildingType] || NHK_2010.default;

  // ---------- 3. Baupreisindex-Anpassung ----------
  const indexedConstructionCost =
    nhk * (constructionIndexCurrent / BASE_YEAR_INDEX);

  // ---------- 4. Gebäudeherstellungskosten ----------
  const buildingCost = grossFloorArea * indexedConstructionCost;

  // ---------- 5. Alterswertminderung ----------
  let depreciationRate;
  if (depreciationMethod === "ross") {
    // Ross‑Verfahren: AWM = 0.5 * (a/GND + a²/GND²)
    const a = age;
    const gnd = totalUsefulLife;
    depreciationRate = 0.5 * (a / gnd + Math.pow(a / gnd, 2));
  } else {
    // Lineare Methode
    depreciationRate = age / totalUsefulLife;
  }
  depreciationRate = Math.min(depreciationRate, 1); // nicht über 100%

  const residualBuildingValue = buildingCost * (1 - depreciationRate);

  // ---------- 6. Außenanlagen ----------
  let externalValue;
  if (externalFacilitiesCost > 0) {
    externalValue = externalFacilitiesCost;
  } else {
    externalValue = residualBuildingValue * externalFacilitiesRate;
  }

  // ---------- 7. Vorläufiger Sachwert ----------
  const preliminaryValue = landValue + residualBuildingValue + externalValue;

  // ---------- 8. Marktanpassung (Sachwertfaktor) + boG ----------
  const marketAdjustedValue = preliminaryValue * marketAdjustmentFactor;
  const finalValue = marketAdjustedValue + bogAdjustment;

  return {
    value: Math.round(finalValue),
    details: {
      landValue: Math.round(landValue),
      nhk,
      indexedConstructionCost: Math.round(indexedConstructionCost),
      buildingCost: Math.round(buildingCost),
      depreciationMethod,
      depreciationRate: depreciationRate.toFixed(4),
      residualBuildingValue: Math.round(residualBuildingValue),
      externalValue: Math.round(externalValue),
      preliminaryValue: Math.round(preliminaryValue),
      marketAdjustmentFactor,
      bogAdjustment,
    },
  };
}