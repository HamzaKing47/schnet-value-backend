import User from "../models/User.model.js";

export const seedDemoUser = async () => {
  try {
    const demoEmail = "demo@immobilienbewertung.de";
    const existing = await User.findOne({ email: demoEmail });
    if (!existing) {
      await User.create({
        firstName: "Demo",
        lastName: "User",
        email: demoEmail,
        password: "demo1234", // 8 chars ✅
        company: "Demo AG",
        phone: "+49 123 456789",
        subscription: "professional",
        role: "admin",
      });
      console.log("✅ Demo user created.");
    } else {
      console.log("ℹ️ Demo user already exists.");
    }
  } catch (error) {
    console.error("❌ Failed to seed demo user:", error.message);
  }
};