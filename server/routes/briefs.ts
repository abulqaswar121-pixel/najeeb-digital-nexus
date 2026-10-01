import { Router } from "express";
import { optionalAuth, requireRole } from "../auth.js";
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
    assignedPM: "Tariq Al-Najeeb (Principal PM)",
    createdAt: new Date().toISOString(),
    ...(req.ndhUser ? { submittedByUserId: req.ndhUser.id } : {}),
  };

  briefs.insert(newBrief);
  res.status(201).json({ brief: newBrief });
});

// PM/Admin only: this is the fix for the confirmed finding that real client
// briefs never reached any operational view.
briefsRouter.get("/", requireRole("project_manager", "super_admin"), (_req, res) => {
  res.json({ briefs: briefs.all() });
});
