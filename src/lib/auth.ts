import type { Request, Response, NextFunction } from "express";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    adminId?: number;
    adminUsername?: string;
  }
}

const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-cos-secret";

export const sessionMiddleware = session({
  secret: SESSION_SECRET,
  name: "cos.sid",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session.adminId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}
