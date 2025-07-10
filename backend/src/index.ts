import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRouter from "./routes/products";
import authRouter, {
  authenticateToken,
  requireAdmin as authRequireAdmin,
} from "./routes/auth";

// Charger les variables d'environnement
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route de base pour tester si l'API fonctionne
app.get("/", (req, res) => {
  res.json({
    message: "🚀 LightStep API is running!",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      auth: "/api/auth",
      health: "/health",
    },
  });
});

// Route de santé
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: "Connected",
  });
});

// Routes d'authentification
app.use("/api/auth", authRouter);

// Routes produits
app.use("/api/products", productsRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
