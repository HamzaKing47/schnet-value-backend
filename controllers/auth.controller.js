import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import crypto from 'crypto';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res) => {
  const { firstName, lastName, email, password, company, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Benutzer existiert bereits." });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      company,
      phone,
    });

    const token = generateToken(user._id);

    res.status(201).json({
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
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    // Send detailed error only in development
    const message = process.env.NODE_ENV === "development" 
      ? error.message 
      : "Registrierung fehlgeschlagen.";
    res.status(500).json({ error: message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten." });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten." });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

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
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Login fehlgeschlagen." });
  }
};

export const verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ valid: false });
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Kein Benutzer mit dieser E-Mail gefunden.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const message = `Sie erhalten diese E-Mail, weil Sie (oder jemand anderes) das Zurücksetzen des Passworts angefordert haben. Bitte klicken Sie auf folgenden Link: \n\n ${resetUrl}`;

    // You need to implement sendEmail utility (see next file)
    const { sendEmail } = await import('../services/email.service.js');
    await sendEmail({
      to: user.email,
      subject: 'Passwort zurücksetzen',
      text: message,
    });

    res.json({ success: true, message: 'E-Mail gesendet' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: 'Ungültiger oder abgelaufener Token' });
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: 'Passwort erfolgreich zurückgesetzt' });
};