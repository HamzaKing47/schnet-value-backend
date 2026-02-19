import Valuation from "../models/Valuation.model.js";

export const saveValuation = async (req, res) => {
  const { propertyType, address, data, result } = req.body;
  const userId = req.user.id;

  try {
    const valuation = await Valuation.create({
      userId,
      propertyType,
      address: address || "Unbekannte Adresse",
      data,
      result,
      summary: {
        address: address || "Unbekannte Adresse",
        marketValue: result.marketValue,
        propertyType,
        calculatedAt: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      valuation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getValuations = async (req, res) => {
  const userId = req.user.id;

  try {
    const valuations = await Valuation.find({ userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      valuations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getValuationById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const valuation = await Valuation.findOne({ _id: id, userId });
    if (!valuation) {
      return res.status(404).json({ error: "Valuation not found" });
    }
    res.json({
      success: true,
      valuation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteValuation = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const valuation = await Valuation.findOneAndDelete({ _id: id, userId });
    if (!valuation) {
      return res.status(404).json({ error: "Valuation not found" });
    }
    res.json({
      success: true,
      message: "Valuation deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};