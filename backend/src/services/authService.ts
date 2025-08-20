import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";

// Récupération des variables d'environnement (avec défauts utiles)
function getEnv(name: string, fallback?: string) {
  const val = process.env[name] ?? fallback;
  if (!val) throw new Error(`Missing env: ${name}`);
  return val;
}

type ExpiresIn = jwt.SignOptions["expiresIn"];

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
if (!ACCESS_SECRET) throw new Error("Missing env JWT_ACCESS_SECRET");
const ACCESS_TTL = getEnv("JWT_ACCESS_TTL", "15m") as string;

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
if (!REFRESH_SECRET) throw new Error("Missing env JWT_REFRESH_SECRET");
const REFRESH_TTL = getEnv("JWT_REFRESH_TTL", "30d") as string;

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || "localhost";
const SECURE_COOKIES = (process.env.SECURE_COOKIES || "false").toLowerCase() === "true";

type JwtAccessPayload = { sub: number; email: string; role: string };
type JwtRefreshPayload = { sub: number; jti: string };

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Access token court, stateless
export function signAccessToken(payload: JwtAccessPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL } as jwt.SignOptions);
}

// Refresh token long (JWT) contenant un jti unique
function signRefreshToken(payload: JwtRefreshPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL } as jwt.SignOptions);
}

// Convertit "30d"/"15m"/"1h" en millisecondes
function durationToMs(input: string): number {
  const match = String(input)
    .trim()
    .match(/^([0-9]+)\s*([smhd])$/i);
  if (!match) throw new Error(`Invalid duration: ${input}`);
  const num = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const mult = unit === "s" ? 1000 : unit === "m" ? 60_000 : unit === "h" ? 3_600_000 : 86_400_000;
  return num * mult;
}

function computeExpiresAt(): Date {
  return new Date(Date.now() + durationToMs(REFRESH_TTL));
}

export type RequestCtx = {
  userAgent?: string | null;
  ip?: string | null;
};

// Récupère email/role pour construire le payload d'access token
export async function buildAccessPayload(userId: number): Promise<JwtAccessPayload> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });
  if (!user) throw new Error("USER_NOT_FOUND");
  return { sub: user.id, email: user.email, role: user.role || "user" };
}

// Émet un refresh token: génère jti, signe le JWT, hash le token, stocke en base
export async function issueRefreshToken(userId: number, ctx: RequestCtx): Promise<string> {
  const jti = crypto.randomUUID();
  const token = signRefreshToken({ sub: userId, jti });

  const tokenHash = await bcrypt.hash(token, 10);
  const expiresAt = computeExpiresAt();

  await prisma.refreshToken.create({
    data: {
      userId,
      jti,
      tokenHash,
      expiresAt,
      userAgent: ctx.userAgent || undefined,
      ip: ctx.ip || undefined,
    },
  });

  return token;
}

// Rotation: vérifie le JWT, retrouve l'entrée, compare hash, révoque l'ancien, émet un nouveau
export async function rotateRefreshToken(presentedToken: string, ctx: RequestCtx): Promise<{ accessToken: string; refreshToken: string }> {
  let decoded: any;
  try {
    decoded = jwt.verify(presentedToken, REFRESH_SECRET) as jwt.JwtPayload;
  } catch {
    throw new Error("INVALID_REFRESH_TOKEN");
  }
  const jti = decoded?.jti as string | undefined;
  const userId = decoded?.sub as number | undefined;
  if (!jti || !userId) throw new Error("INVALID_REFRESH_TOKEN");

  const record = await prisma.refreshToken.findUnique({ where: { jti } });
  if (!record) throw new Error("REFRESH_NOT_FOUND");
  if (record.revokedAt) throw new Error("REFRESH_REVOKED");
  if (record.expiresAt.getTime() < Date.now()) throw new Error("REFRESH_EXPIRED");

  const match = await bcrypt.compare(presentedToken, record.tokenHash);
  if (!match) throw new Error("REFRESH_MISMATCH");

  // Révoquer l'ancien
  const now = new Date();
  await prisma.refreshToken.update({
    where: { jti },
    data: { revokedAt: now },
  });

  // Émettre un nouveau refresh + access
  const newRefresh = await issueRefreshToken(userId, ctx);
  const accessToken = signAccessToken(await buildAccessPayload(userId));

  // Lier l'ancien -> nouveau (replacedById sur l'ancien)
  const newDecoded = jwt.decode(newRefresh) as jwt.JwtPayload | null;
  const newJti = (newDecoded?.jti as string) || null;
  if (newJti) {
    const newRec = await prisma.refreshToken.findUnique({ where: { jti: newJti } });
    if (newRec) {
      await prisma.refreshToken.update({
        where: { id: record.id },
        data: { replacedById: newRec.id },
      });
    }
  }

  return { accessToken, refreshToken: newRefresh };
}

// Révoque le refresh courant (logout)
export async function revokeRefreshToken(presentedToken: string): Promise<void> {
  let decoded: any;
  try {
    decoded = jwt.verify(presentedToken, REFRESH_SECRET) as jwt.JwtPayload;
  } catch {
    return; // déjà invalide
  }
  const jti = decoded?.jti as string | undefined;
  if (!jti) return;
  await prisma.refreshToken.updateMany({
    where: { jti, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

// Cookie helpers
export function setRefreshCookie(res: Response, token: string): void {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: process.env.SECURE_COOKIES === "true", // HTTPS uniquement
    sameSite: "lax", // Protection CSRF
    domain: process.env.COOKIE_DOMAIN,
    path: "/api/auth",
    maxAge: durationToMs(REFRESH_TTL), // durée de vie
  });
}

export function setAccessCookie(res: Response, token: string): void {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.SECURE_COOKIES === "true", // HTTPS uniquement
    sameSite: "lax", // Protection CSRF
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
    maxAge: durationToMs(ACCESS_TTL), // durée de vie
  });
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.SECURE_COOKIES === "true",
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN,
    path: "/api/auth",
  });
}

export function clearAccessCookie(res: Response): void {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.SECURE_COOKIES === "true",
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
  });
}
