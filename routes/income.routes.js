import express from "express";
import { calculateIncomeValue } from "../controllers/income.controller.js";

const router = express.Router();

router.post("/valuation/income", calculateIncomeValue);

export default router;
