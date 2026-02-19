export function calculateComparativeValue(comparables = []) {
  if (!Array.isArray(comparables) || comparables.length === 0) {
    throw new Error("Mindestens ein Vergleichsobjekt ist erforderlich.");
  }

  const validComparables = comparables.filter(
    (c) => typeof c.purchasePrice === "number" && c.purchasePrice > 0
  );

  if (validComparables.length === 0) {
    throw new Error("Keine gültigen Vergleichsobjekte mit Kaufpreis > 0.");
  }

  const adjustedPrices = validComparables.map((comp, idx) => {
    const {
      purchasePrice,
      afLocation = 1.0,
      afSize = 1.0,
      afCondition = 1.0,
      afEquipment = 1.0,
      afTime = 1.0, // can be a factor, or calculated via index
    } = comp;

    const adjustmentFactor =
      afLocation * afSize * afCondition * afEquipment * afTime;

    if (!isFinite(adjustmentFactor) || adjustmentFactor <= 0) {
      throw new Error(
        `Ungültiger Anpassungsfaktor in Vergleichsobjekt ${idx + 1}.`
      );
    }

    const adjustedPrice = purchasePrice * adjustmentFactor;

    return {
      index: idx + 1,
      purchasePrice,
      adjustmentFactor,
      adjustedPrice: Math.round(adjustedPrice),
    };
  });

  const sum = adjustedPrices.reduce((acc, item) => acc + item.adjustedPrice, 0);
  const comparativeValue = Math.round(sum / adjustedPrices.length);

  return {
    value: comparativeValue,
    details: {
      comparablesUsed: adjustedPrices.length,
      adjustedPrices,
    },
  };
}