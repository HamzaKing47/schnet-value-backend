import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Bitte geben Sie eine gültige E-Mail ein"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Passwort muss mindestens 8 Zeichen lang sein"],
      select: false,
    },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    subscription: {
      type: String,
      enum: ["free_trial", "basic", "professional", "premium"],
      default: "free_trial",
    },
    trialEnd: {
      type: Date,
      default: () => new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true },
);

// ✅ FIXED: async pre‑save hook WITHOUT `next`
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);
