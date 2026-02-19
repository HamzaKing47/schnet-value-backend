import express from "express";
import { calculateValuation } from "../controllers/valuation.controller.js";

const router = express.Router();

router.post("/valuation", calculateValuation);

export default router;
