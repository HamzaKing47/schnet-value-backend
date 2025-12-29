import express from "express";
import cors from "cors";
import swaggerSetup from "./config/swagger.js";
import valuationRoutes from "./routes/valuation.routes.js";
import healthRoutes from "./routes/health.routes.js";
import incomeRoutes from "./routes/income.routes.js";
import costRoutes from "./routes/cost.routes.js";
import marketValueRoutes from "./routes/marketValue.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

swaggerSetup(app);

app.use("/api", valuationRoutes);
app.use("/api", healthRoutes);
app.use("/api", incomeRoutes);
app.use("/api", costRoutes);
app.use("/api", marketValueRoutes);


export default app;
