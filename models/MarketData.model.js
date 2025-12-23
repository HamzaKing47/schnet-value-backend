import mongoose from "mongoose";

const MarketDataSchema = new mongoose.Schema({
  landValueRate: Number,
  capitalizationRate: Number,
  costValueFactor: Number,
  constructionIndex: Number,
});

export default mongoose.model("MarketData", MarketDataSchema);
