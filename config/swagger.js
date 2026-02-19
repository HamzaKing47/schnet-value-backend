import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // ADD THIS IMPORT

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, "../docs/swagger.yaml");
console.log("Swagger YAML path:", swaggerPath);

// Check if file exists
if (!fs.existsSync(swaggerPath)) {
  console.error("Swagger YAML file not found at:", swaggerPath);
  // Instead of exiting, create a basic swagger document
  console.log("Creating basic Swagger documentation...");
}

let swaggerDocument;
try {
  swaggerDocument = YAML.load(swaggerPath);
  console.log("Swagger YAML loaded successfully");
} catch (error) {
  console.error("Failed to load swagger.yaml, using fallback:", error);
  // Create a basic fallback document
  swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "SchNet Value API",
      description: "Backend API for German property valuation",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
    paths: {
      "/api/health": {
        get: {
          summary: "Health check",
          responses: {
            "200": {
              description: "Server is running",
            },
          },
        },
      },
    },
  };
}

const swaggerSetup = (app) => {
  console.log("Setting up Swagger UI at /api-docs");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("Swagger UI available at /api-docs");
};

export default swaggerSetup;