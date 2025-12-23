import express from "express";
import { calculateCostValue } from "../controllers/cost.controller.js";

const router = express.Router();

// POST /api/valuation/cost
router.post("/valuation/cost", calculateCostValue);

export default router;
