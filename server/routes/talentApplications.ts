import { Router } from "express";
import { requireRole } from "../auth.js";
import { talentApplications, type TalentApplicationRecord } from "../collections.js";
import type { ServiceDepartment } from "../../src/types/ndh.js";

export const talentApplicationsRouter = Router();

talentApplicationsRouter.post("/", (req, res) => {
  const body = req.body as Omit<TalentApplicationRecord, "id" | "status" | "submittedAt"> & {
    primaryDepartment?: ServiceDepartment;
  };

  if (!body.fullName || !body.email || !body.primaryDepartment) {
    res.status(400).json({ error: "fullName, email, and primaryDepartment are required." });
    return;
  }

  const record: TalentApplicationRecord = {
    ...body,
    primaryDepartment: body.primaryDepartment,
    id: `app-${Date.now()}`,
    status: "pending_review",
    submittedAt: new Date().toISOString(),
  } as TalentApplicationRecord;

  talentApplications.insert(record);
  res.status(201).json({ talentApplication: record });
});

talentApplicationsRouter.get("/", requireRole("super_admin"), (_req, res) => {
  res.json({ talentApplications: talentApplications.all() });
});
