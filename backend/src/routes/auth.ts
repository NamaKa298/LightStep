import { Request, Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { requireAuth } from "../middleware/auth";
import { buildAccessPayload, clearRefreshCookie, hashPassword, issueRefreshToken, revokeRefreshToken, rotateRefreshToken, setRefreshCookie, signAccessToken, verifyPassword } from "../services/authService";

const router = Router();

// Helper pour extraire l'IP et le userAgent
function getRequestContext(req: Request) {
  return {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  };
}

// schéma Register
const registerSchema = z.object({
  email: z.email("E-mail invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
  firstname: z.string().min(2, "Prénom requis"),
  lastname: z.string().min(2, "Nom requis"),
});

// ----------------------- Route /register (inscription) -----------------------
router.post("/register", async (req, res) => {
  try {
    // 0. Validation Zod
    const { email, password, firstname, lastname } = registerSchema.parse(req.body);

    // 1. Vérifier l'unicité de l'email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    // 2. Hacher le mot de passe
    const passwordHash = await hashPassword(password);

    // 3. Déterminer le rôle
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    const role = adminEmails.includes(email) ? "admin" : "user";

    // 4. Créer l'utilisateur
    const user = await prisma.user.create({
      data: { email, passwordHash, role, firstname, lastname },
    });

    // 5. Générer les tokens
    const accessToken = signAccessToken(await buildAccessPayload(user.id));
    const refreshToken = await issueRefreshToken(user.id, getRequestContext(req));

    // 6. Définir le cookie et renvoyer la réponse
    setRefreshCookie(res, refreshToken);
    res.json({
      accessToken,
      user: { id: user.id, email, role, firstname, lastname },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: err.issues });
    }
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ----------------------- Route /login (Connexion) -----------------------

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //1. Trouver l'utilisateur
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }

  //2. Trouver le mot de passe
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }

  //3. Générer les tokens
  const accessToken = signAccessToken(await buildAccessPayload(user.id));
  const refreshToken = await issueRefreshToken(user.id, getRequestContext(req));

  //6. Définit le cookie et renvoie la réponse
  setRefreshCookie(res, refreshToken);
  res.json({ accessToken, user: { id: user.id, email, role: user.role, firstname: user.firstname, lastname: user.lastname } });
});

// ----------------------- Route /refresh (renouvellement du Token) -----------------------
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token manquant" });
  }

  try {
    // 1. Rotation du token (vérifie + invalide l'ancien)
    const { accessToken, refreshToken: newRefreshToken } = await rotateRefreshToken(refreshToken, getRequestContext(req));

    // 2. Définit le nouveau cookie
    setRefreshCookie(res, newRefreshToken);
    res.json({ accessToken });
  } catch (error) {
    clearRefreshCookie(res);
    res.status(401).json({ message: "Session expirée" });
  }
});

// ----------------------- Route /logout (Déconnexion) -----------------------
router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    await revokeRefreshToken(refreshToken); // Marque le token comme révoqué en base
  }
  clearRefreshCookie(res); // supprime le refresh cookie
  res.sendStatus(204);
});

// ----------------------- Route /me (Profil Utilisateur) -----------------------
router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.sub },
    select: { id: true, email: true, role: true, firstname: true, lastname: true },
  });

  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  res.json({ user });
});

export default router;
