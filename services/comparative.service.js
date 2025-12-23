export const calculateComparativeValue = (comparables, timeIndexRatio = 1) => {
  if (!comparables || comparables.length === 0) {
    throw new Error("No comparable properties provided");
  }

  let total = 0;

  comparables.forEach((item) => {
    const {
      purchasePrice,
      afLocation = 1,
      afSize = 1,
      afCondition = 1,
      afEquipment = 1,
      afTime = timeIndexRatio,
    } = item;

    const adjustmentFactor =
      afLocation * afSize * afCondition * afEquipment * afTime;

    total += purchasePrice * adjustmentFactor;
  });

  return total / comparables.length;
};
