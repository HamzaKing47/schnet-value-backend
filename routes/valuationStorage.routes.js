import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  saveValuation,
  getValuations,
  getValuationById,
  deleteValuation,
} from "../controllers/valuationStorage.controller.js";

const router = express.Router();

router.use(protect); // All routes below require authentication

router.post("/valuations/save", saveValuation);
router.get("/valuations", getValuations);
router.get("/valuations/:id", getValuationById);
router.delete("/valuations/:id", deleteValuation);

export default router;