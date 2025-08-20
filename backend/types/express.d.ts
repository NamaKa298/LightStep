import "express";
declare module "express-serve-static-core" {
  interface Request {
    ip?: string;
    user?: { id: number; email: string; role: string };
  }
}
