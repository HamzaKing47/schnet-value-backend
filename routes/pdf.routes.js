import express from "express";
import { generateValuationPDF } from "../controllers/pdf.controller.js";

const router = express.Router();

router.post("/pdf/valuation", generateValuationPDF);

export default router;
 