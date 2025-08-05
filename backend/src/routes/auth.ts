import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db/db";

const router = express.Router();
const JWT_SECRET = "lightstep_secret_key_2025"; // Changez ça en production !

// Inscription d'un nouvel utilisateur
router.post("/register", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Déterminer le rôle (admin si c'est votre email)
    const adminEmails = ["admin@lightstep.com", "votre@email.com"]; // Ajoutez votre email ici !
    const role = adminEmails.includes(email) ? "admin" : "client";

    // Créer l'utilisateur
    const { rows } = await pool.query(
      `INSERT INTO users (email, password, role) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, role, created_at`,
      [email, hashedPassword, role]
    );

    const user = rows[0];

    // Créer le token JWT
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      message: "Inscription réussie !",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

// Connexion
router.post("/login", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const user = rows[0];

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Créer le token JWT
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      message: "Connexion réussie !",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

// Middleware pour vérifier le token
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Token d'accès requis" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }
    req.user = user;
    next();
  });
};

// Middleware pour vérifier les droits admin
export const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Droits administrateur requis" });
  }
  next();
};

export default router;
