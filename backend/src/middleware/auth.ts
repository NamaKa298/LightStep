import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// --------------------  MIDDLEWARE requireAuth --------------------

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // 1. Récupérer le token depuis l'en-tête
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "token manquant" });
  }

  // 2. Vérifier et décoder le token
  jwt.verify(token, process.env.JWT_ACCESS_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide ou expiré" });
    }

    // 3. Peupler req.user
    req.user = decoded as { id: number; email: string; role: string };
    next(); // Passe au middleware suivant
  });
}

// --------------------  MIDDLEWARE requireRole --------------------

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Vérifier que requireAuth a bien peuplé req.user
    if (!req.user) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    // 2. Vérifier le rôle
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Permissions insuffisantes" });
    }

    next(); // Autorise l'accès
  };
}
