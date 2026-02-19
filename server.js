import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { seedAdmin } from "./scripts/seedAdmin.js"; // changed
import { createIndexes } from "./config/indexes.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    await createIndexes();
    await seedAdmin(); // now seeds the owner as admin
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });