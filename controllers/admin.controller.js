import User from "../models/User.model.js";
import Valuation from "../models/Valuation.model.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Ungültige Rolle" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle user active status (disable/enable)
export const toggleUserActive = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user (and optionally their valuations)
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Delete user's valuations first
    await Valuation.deleteMany({ userId });
    // Delete user
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: "Benutzer gelöscht" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all valuations (with user details)
export const getAllValuations = async (req, res) => {
  try {
    const valuations = await Valuation.find({})
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });
    res.json({ success: true, valuations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete any valuation
export const deleteValuation = async (req, res) => {
  const { id } = req.params;

  try {
    const valuation = await Valuation.findByIdAndDelete(id);
    if (!valuation) {
      return res.status(404).json({ error: "Bewertung nicht gefunden" });
    }
    res.json({ success: true, message: "Bewertung gelöscht" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard stats
export const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const valuationCount = await Valuation.countDocuments();
    const totalValue = await Valuation.aggregate([
      { $group: { _id: null, total: { $sum: "$result.marketValue" } } },
    ]);
    res.json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalValuations: valuationCount,
        totalValue: totalValue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};