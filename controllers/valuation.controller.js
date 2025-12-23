export const testAPI = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Valuation API is working"
  });
};

export const calculateComparativeValue = (req, res) => {
  const { comparables } = req.body;

  if (!comparables || !comparables.length) {
    return res.status(400).json({ error: "Comparables required" });
  }

  const total = comparables.reduce((sum, item) => {
    const af =
      item.afLocation *
      item.afSize *
      item.afCondition *
      item.afEquipment *
      item.afTime;

    return sum + item.purchasePrice * af;
  }, 0);

  const value = Math.round(total / comparables.length);

  res.json({
    method: "Comparative Value Method",
    value
  });
};
