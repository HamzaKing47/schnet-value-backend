import express from "express";
import { testAPI, calculateComparativeValue } from "../controllers/valuation.controller.js";

const router = express.Router();

// GET /api/valuation/test
router.get("/valuation/test", testAPI);

// POST /api/valuation/comparative
router.post("/valuation/comparative", calculateComparativeValue);

export default router;
