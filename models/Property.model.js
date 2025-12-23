import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
  plotArea: Number,
  livingArea: Number,
  yearBuilt: Number,
  propertyType: String,
  equipmentStandard: String,
  rentPerSqm: Number,
  purchasePrices: [Number],
});

export default mongoose.model("Property", PropertySchema);
