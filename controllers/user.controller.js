import User from "../models/User.model.js";

export const getProfile = async (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      company: user.company,
      phone: user.phone,
      subscription: user.subscription,
      trialEnd: user.trialEnd,
      lastLogin: user.lastLogin,
    },
  });
};

export const updateProfile = async (req, res) => {
  const { firstName, lastName, company, phone } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, company, phone },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company,
        phone: user.phone,
        subscription: user.subscription,
        trialEnd: user.trialEnd,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("+password");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};