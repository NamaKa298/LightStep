"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const products_1 = __importDefault(require("./routes/products"));
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
app.use("/api/products", products_1.default);
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
