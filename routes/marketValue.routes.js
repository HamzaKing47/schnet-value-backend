import express from "express";
import { calculateMarketValue } from "../controllers/marketValue.controller.js";

const router = express.Router();

router.post("/valuation/market-value", calculateMarketValue);

export default router;
