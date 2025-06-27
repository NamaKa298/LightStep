import express from "express";
import cors from "cors";
import productsRouter from "./routes/products";

const app = express();
app.use(cors());
app.use(express.json());

// 🔒 Middleware de sécurité pour les modifications
const requireAdmin = (req: any, res: any, next: any) => {
  // Pour les routes de lecture (GET), tout le monde peut accéder
  if (req.method === 'GET') {
    return next();
  }
  
  // Pour les modifications (POST, PUT, DELETE), vérifier l'origine
  const allowedOrigins = ['localhost', '127.0.0.1'];
  const origin = req.get('host') || '';
  
  if (!allowedOrigins.some(allowed => origin.includes(allowed))) {
    return res.status(403).json({
      error: "❌ Accès interdit - Modifications réservées à l'administrateur",
      message: "Seules les consultations sont autorisées"
    });
  }
  next();
};

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

app.use("/api/products", requireAdmin, productsRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
