"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
dotenv_1.default.config({ path: ".env.local" });
// Charger les variables d'environnement
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
app.use("/api/auth", auth_1.default);
// Routes produits
app.use("/api/products", products_1.default);
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
