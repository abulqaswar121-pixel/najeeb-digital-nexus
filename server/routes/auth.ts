import { Router } from "express";
import {
  hashPassword,
  verifyPassword,
  signSession,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  toPublicUser,
} from "../auth.js";
import { users, type UserRecord } from "../collections.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const account = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!account) {
    res.status(401).json({
      error:
        "No account found with that email. Try one of the demo accounts below, or create a new client account.",
    });
    return;
  }

  const passwordOk = await verifyPassword(password, account.passwordHash);
  if (!passwordOk) {
    res.status(401).json({ error: "Incorrect password for this account." });
    return;
  }

  const token = signSession(account.id);
  setSessionCookie(res, token);
  res.json({ user: toPublicUser(account) });
});

authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: toPublicUser(req.ndhUser as UserRecord) });
});

authRouter.post("/register", async (req, res) => {
  const { fullName, email, password, organizationName, phone, country, referralCodeUsed } =
    req.body as {
      fullName?: string;
      email?: string;
      password?: string;
      organizationName?: string;
      phone?: string;
      country?: string;
      referralCodeUsed?: string;
    };

  if (!fullName || !email || !organizationName) {
    res.status(400).json({ error: "Full name, email, and organization name are required." });
    return;
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    res.status(409).json({ error: "An account with that email already exists." });
    return;
  }

  const newUser: UserRecord = {
    id: `usr-client-${Date.now()}`,
    fullName,
    email: email.trim(),
    passwordHash: await hashPassword(password || Math.random().toString(36)),
    role: "client_owner",
    roleTitle: "Client Organization Owner",
    organizationId: `org-${Date.now()}`,
    organizationName,
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    ...(phone ? { phone } : {}),
    country: country || "Nigeria",
    loyaltyTier: "Bronze Pioneer",
    referralCode: `${fullName.slice(0, 4).toUpperCase()}-NDH-${Math.floor(100 + Math.random() * 900)}`,
    referralCredits: 0,
    welcomeCreditBalanceNGN: 50000,
    welcomeCreditBalanceUSD: 50,
    welcomeCreditUsedNGN: 0,
    welcomeCreditUsedUSD: 0,
    activeProjectsCount: 0,
  };

  users.insert(newUser, "end");

  // Referral linkage is recorded by the caller (see routes/data.ts
  // referrals endpoint) since it needs the referrer's record too; this
  // route only creates the account itself.
  void referralCodeUsed;

  const token = signSession(newUser.id);
  setSessionCookie(res, token);
  res.status(201).json({ user: toPublicUser(newUser) });
});
