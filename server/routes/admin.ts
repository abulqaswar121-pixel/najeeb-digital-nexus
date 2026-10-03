import { Router } from "../http.js";
import { requireRole, hashPassword, generateTemporaryPassword, toPublicUser } from "../auth.js";
import { users, type UserRecord } from "../collections.js";
import type { UserRole } from "../../src/types/ndh.js";

export const adminRouter = Router();

// Internal staff roles a Super Admin may invite through this endpoint.
// Deliberately excludes "super_admin" itself (granting super-admin access
// should never be a one-click self-service action from inside the product --
// that still has to happen by someone with direct server/database access)
// and excludes client/talent roles (those have their own dedicated
// self-registration / application-approval flows).
const INVITABLE_ROLES: UserRole[] = [
  "project_manager",
  "ops_admin",
  "dept_lead",
  "finance_admin",
  "content_admin",
  "talent_admin",
  "support_admin",
];

const ROLE_TITLES: Record<string, string> = {
  project_manager: "Project Manager",
  ops_admin: "Operations Admin",
  dept_lead: "Department Lead",
  finance_admin: "Finance Admin",
  content_admin: "Content Admin",
  talent_admin: "Talent Admin",
  support_admin: "Support Admin",
};

// Used to look like "Invite PM" fired off a real email and silently flipped
// local UI state to "Sent!" with nothing actually created. This creates a
// real login (bcrypt-hashed, random temporary password) immediately. There
// is no outbound email service wired up in this build, so the temporary
// password is returned once in this response -- the admin is expected to
// relay it to the new staff member directly, the same way a one-time IAM
// access key is shown once and then never again.
adminRouter.post("/invite-staff", requireRole("super_admin"), async (req, res) => {
  const { fullName, email, role } = req.body as {
    fullName?: string;
    email?: string;
    role?: UserRole;
  };

  if (!fullName || !email) {
    res.status(400).json({ error: "Full name and email are required." });
    return;
  }

  const targetRole = role || "project_manager";
  if (!INVITABLE_ROLES.includes(targetRole)) {
    res.status(400).json({
      error: `Cannot invite role "${targetRole}" through this endpoint.`,
    });
    return;
  }

  if (users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    res.status(409).json({ error: "An account with that email already exists." });
    return;
  }

  const temporaryPassword = generateTemporaryPassword();
  const newUser: UserRecord = {
    id: `user-staff-${Date.now()}`,
    fullName,
    email: email.trim(),
    passwordHash: await hashPassword(temporaryPassword),
    role: targetRole,
    roleTitle: ROLE_TITLES[targetRole] || targetRole,
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    country: "Nigeria",
  };

  users.insert(newUser, "end");

  res.status(201).json({ user: toPublicUser(newUser), temporaryPassword });
});
