import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
dotenv.config({ path: ".env.local" });

// Charger les variables d'environnement
dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "https://lightstep.vercel.app",
      "http://localhost:5173", // Pour le dev local
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
