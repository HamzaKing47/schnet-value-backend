import express from "express";
import cors from "cors";
import swaggerSetup from "./config/swagger.js";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes
import valuationRoutes from "./routes/valuation.routes.js";
import authRoutes from "./routes/auth.routes.js";
import valuationStorageRoutes from "./routes/valuationStorage.routes.js";
import userRoutes from "./routes/user.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// ✅ CORS configuration – allow both localhost and your Netlify domain
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://schnet-value.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Zu viele Anfragen, bitte versuchen Sie es später erneut.' },
});
app.use('/api', limiter);

// Debug middleware (optional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Swagger documentation
swaggerSetup(app);

// Routes
app.use("/api", pdfRoutes);
app.use("/api", valuationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", valuationStorageRoutes);
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api/admin", adminRoutes);  // mount admin routes with /admin prefix

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "SchNet Value Backend is running!",
    endpoints: {
      docs: "GET /api-docs",
      health: "GET /api/health",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
      },
      valuation: {
        marketValue: "POST /api/valuation",
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

export default app;