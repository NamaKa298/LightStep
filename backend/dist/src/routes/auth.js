"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticateToken = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
const router = express_1.default.Router();
const JWT_SECRET = "lightstep_secret_key_2025"; // Changez ça en production !
// Inscription d'un nouvel utilisateur
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await db_1.pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }
        // Hasher le mot de passe
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Déterminer le rôle (admin si c'est votre email)
        const adminEmails = ["admin@lightstep.com", "votre@email.com"]; // Ajoutez votre email ici !
        const role = adminEmails.includes(email) ? "admin" : "client";
        // Créer l'utilisateur
        const { rows } = await db_1.pool.query(`INSERT INTO users (email, password, role) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, role, created_at`, [email, hashedPassword, role]);
        const user = rows[0];
        // Créer le token JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
        res.json({
            message: "Inscription réussie !",
            token,
            user: { id: user.id, email: user.email, role: user.role },
        });
    }
    catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
});
// Connexion
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Trouver l'utilisateur
        const { rows } = await db_1.pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }
        const user = rows[0];
        // Vérifier le mot de passe
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }
        // Créer le token JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
        res.json({
            message: "Connexion réussie !",
            token,
            user: { id: user.id, email: user.email, role: user.role },
        });
    }
    catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ error: "Erreur lors de la connexion" });
    }
});
// Middleware pour vérifier le token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ error: "Token d'accès requis" });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token invalide" });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
// Middleware pour vérifier les droits admin
const requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Droits administrateur requis" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
exports.default = router;
