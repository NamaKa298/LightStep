import { Request, Router } from "express";
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

// ----------------------- Route /register (inscription) -----------------------

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  //1. Verifier l'unicité de l'email
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: "Email déjà utilisé" });
  }

  //2. Hacher le mot de passe
  const passwordHash = await hashPassword(password);

  //3. Determine le rôle
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  const role = adminEmails.includes(email) ? "admin" : "user";

  //4. Crée l'utilisateur
  const user = await prisma.user.create({ data: { email, passwordHash, role } });

  //5. Genere les tokens
  const accessToken = signAccessToken(await buildAccessPayload(user.id));
  const refreshToken = await issueRefreshToken(user.id, getRequestContext(req));

  //6. Définit le cookie et renvoie la réponse
  setRefreshCookie(res, refreshToken);
  res.json({ accessToken, user: { id: user.id, email, role } });
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
  res.json({ accessToken, user: { id: user.id, email, role: user.role } });
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
    res.status(401).json({ message: "Session epxirée" });
  }
});

// ----------------------- Route /logout (Déconnexion) -----------------------
router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    await revokeRefreshToken(refreshToken); // Marque le token comme révoqué en base
  }
  clearRefreshCookie(res); // supprime le cookie
  res.sendStatus(204);
});

// ----------------------- Route /me (Profil Utilisateur) -----------------------
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
