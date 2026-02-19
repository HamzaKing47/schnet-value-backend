import mongoose from "mongoose";

const ValuationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      trim: true,
    },
    // Store the complete input data
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    // Store the calculated result
    result: {
      marketValue: Number,
      breakdown: {
        comparativeValue: Number,
        incomeValue: Number,
        costValue: Number,
      },
      method: String,
      spf: Number,
      weights: {
        comparative: Number,
        income: Number,
        cost: Number,
      },
    },
    // For quick access and display
    summary: {
      address: String,
      marketValue: Number,
      propertyType: String,
      calculatedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Valuation", ValuationSchema);