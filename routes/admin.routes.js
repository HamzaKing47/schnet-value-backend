import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { admin } from "../middlewares/admin.middleware.js";
import {
  getAllUsers,
  updateUserRole,
  toggleUserActive,
  deleteUser,
  getAllValuations,
  deleteValuation,
  getStats,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All routes require authentication + admin role
router.use(protect, admin);

// User management
router.get("/users", getAllUsers);
router.put("/users/:userId/role", updateUserRole);
router.put("/users/:userId/toggle-active", toggleUserActive);
router.delete("/users/:userId", deleteUser);

// Valuation management
router.get("/valuations", getAllValuations);
router.delete("/valuations/:id", deleteValuation);

// Stats
router.get("/stats", getStats);

export default router;