import User from "../models/User.model.js";

export const seedAdmin = async () => {
  try {
    const adminEmail = "Judevide6@gmail.com";
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      // Create admin user with a strong password (owner can change later)
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        password: "Admin1234!", // Owner should change after first login
        company: "ImmoInvent GmbH",
        phone: "+49 123 456789",
        subscription: "premium",
        role: "admin",
      });
      console.log("✅ Admin user created.");
    } else {
      console.log("ℹ️ Admin user already exists.");
      // Ensure role is admin
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
        console.log("✅ Existing user updated to admin.");
      }
    }
  } catch (error) {
    console.error("❌ Failed to seed admin user:", error.message);
  }
};