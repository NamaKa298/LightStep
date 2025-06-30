import express from "express";
import cors from "cors";
import productsRouter from "./routes/products";
import authRouter, {
  authenticateToken,
  requireAdmin as authRequireAdmin,
} from "./routes/auth";

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

// Routes produits avec protection appropriée
const router = express.Router();

// GET : public (tout le monde peut voir les produits)
router.get("/", productsRouter);
router.get("/:id", productsRouter);

// POST, PUT, DELETE : nécessitent authentification admin
router.use(authenticateToken);
router.use(authRequireAdmin);
router.post("/", productsRouter);
router.put("/:id", productsRouter);
router.delete("/:id", productsRouter);

app.use("/api/products", router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
