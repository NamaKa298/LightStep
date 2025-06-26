import express from "express";
import cors from "cors";
import productsRouter from "./routes/products";

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

app.use("/api/products", productsRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
