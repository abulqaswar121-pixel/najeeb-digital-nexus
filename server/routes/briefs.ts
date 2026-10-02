import { Router } from "express";
import { optionalAuth, requireAuth, requireRole } from "../auth.js";
import { briefs, type BriefRecord } from "../collections.js";
import type { ServiceDepartment } from "../../src/types/ndh.js";

export const briefsRouter = Router();

// Public: anyone can submit a project brief (this is the "Start Your
// Project" wizard's backing endpoint). optionalAuth so we can record which
// logged-in user submitted it, if any, without requiring login.
briefsRouter.post("/", optionalAuth, (req, res) => {
  const body = req.body as {
    projectName?: string;
    organizationName?: string;
    department?: ServiceDepartment;
    scopeTier?: "starter" | "growth" | "enterprise";
    budgetAmount?: string;
    currency?: string;
    timelineWeeks?: string;
    clientEmail?: string;
    clientPhone?: string;
    briefDetails?: string;
  };

  if (!body.department || !body.scopeTier || !body.clientEmail) {
    res.status(400).json({ error: "department, scopeTier, and clientEmail are required." });
    return;
  }

  const newBrief: BriefRecord = {
    id: `brief-${Date.now()}`,
    projectName: body.projectName || `${body.department} Project`,
    organizationName: body.organizationName || "Client Organization",
    department: body.department,
    scopeTier: body.scopeTier,
    budgetAmount: body.budgetAmount || "",
    currency: body.currency || "USD",
    timelineWeeks: body.timelineWeeks || "",
    clientEmail: body.clientEmail,
    ...(body.clientPhone ? { clientPhone: body.clientPhone } : {}),
    briefDetails: body.briefDetails || "",
    status: "submitted",
    // Previously this was hardcoded to a specific named PM
    // ("Tariq Al-Najeeb") on every single brief regardless of whether any
    // human had actually looked at it -- a client reading "Auto-assigned
    // PM: Tariq Al-Najeeb" had no way to tell that was a fabricated
    // placeholder rather than a real assignment. Briefs now start
    // genuinely unassigned until a PM actually claims one via
    // PATCH /:id/assign below.
    assignedPM: "Unassigned",
    createdAt: new Date().toISOString(),
    ...(req.ndhUser ? { submittedByUserId: req.ndhUser.id } : {}),
  };

  briefs.insert(newBrief);
  res.status(201).json({ brief: newBrief });
});

// Client-facing: a logged-in client can only ever see their OWN submitted
// briefs (matched by the account that submitted it, or by email for briefs
// submitted before the account existed) -- never anyone else's. This is
// what ClientPortal.tsx now reads instead of hardcoded sample project data.
briefsRouter.get("/mine", requireAuth, (req, res) => {
  const me = req.ndhUser!;
  res.json({
    briefs: briefs.filter(
      (b) =>
        b.submittedByUserId === me.id || b.clientEmail.toLowerCase() === me.email.toLowerCase(),
    ),
  });
});

// PM/Admin only: this is the fix for the confirmed finding that real client
// briefs never reached any operational view.
briefsRouter.get("/", requireRole("project_manager", "super_admin"), (_req, res) => {
  res.json({ briefs: briefs.all() });
});

// PM/Admin only: a PM genuinely claiming/assigning themselves (or another
// named PM) to a brief, replacing the old "Unassigned" placeholder with a
// real name tied to an actual action taken by an actual logged-in PM.
briefsRouter.patch("/:id/assign", requireRole("project_manager", "super_admin"), (req, res) => {
  const { id } = req.params;
  const { pmName } = (req.body ?? {}) as { pmName?: string };
  const assignedPM = (pmName && pmName.trim()) || req.ndhUser!.fullName;

  const updated = briefs.update(
    (b) => b.id === id,
    (b) => ({ ...b, assignedPM, status: "pm_assigned" as const }),
  );

  if (!updated) {
    res.status(404).json({ error: "Brief not found." });
    return;
  }
  res.json({ brief: updated });
});
