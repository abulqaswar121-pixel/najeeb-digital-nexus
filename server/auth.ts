import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "./env.js";
import type { UserRole } from "../src/types/ndh.js";
import { users, type UserRecord, toPublicUser } from "./collections.js";

export const SESSION_COOKIE = "ndh_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Generates a real, cryptographically random one-time password for accounts
// created by an admin action (staff invite, talent-application approval)
// rather than by self-registration. There is no outbound email service wired
// up in this build, so the caller is expected to display this value to the
// admin exactly once so they can relay it to the new accountholder directly
// -- that is the honest alternative to silently claiming "an invite email
// was sent" when no such email infrastructure exists.
export function generateTemporaryPassword(): string {
  return crypto.randomBytes(9).toString("base64url"); // 12 URL-safe characters
}

export function signSession(userId: string): string {
  return jwt.sign({ sub: userId }, env.SESSION_SECRET, { expiresIn: SESSION_TTL_SECONDS });
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true, // never readable/writable from client-side JS
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

function getUserFromRequest(req: Request): UserRecord | null {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.SESSION_SECRET) as { sub: string };
    const user = users.find((u) => u.id === payload.sub);
    return user || null;
  } catch {
    return null; // expired/invalid/forged token -- never trust it
  }
}

// Extend Express's Request type with the authenticated user, populated by
// requireAuth below.
declare module "express-serve-static-core" {
  interface Request {
    ndhUser?: UserRecord;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  req.ndhUser = user;
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const user = getUserFromRequest(req);
  if (user) req.ndhUser = user;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.ndhUser ?? getUserFromRequest(req);
    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    req.ndhUser = user;
    if (!roles.includes(user.role)) {
      res.status(403).json({ error: "You do not have permission to perform this action." });
      return;
    }
    next();
  };
}

export { toPublicUser };
